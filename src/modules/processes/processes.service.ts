import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { ProcessTreeDto } from './dto/process-tree.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Process } from '@prisma/client';
import { QueryProcessesDto } from './dto/query-processes.dto';
import { DEFAULT_PAGE_SIZE } from './utils/constants';

@Injectable()
export class ProcessesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProcessDto) {
    const area = await this.prisma.area.findUnique({
      where: { id: dto.areaId },
    });

    if (!area) throw new NotFoundException('Area not found');

    if (dto.parentId) {
      const parent = await this.prisma.process.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) throw new NotFoundException('Parent process not found');

      if (parent.areaId !== dto.areaId) {
        throw new ConflictException(
          'Parent process must belong to the same area.',
        );
      }
    }

    return this.prisma.process.create({
      data: dto,
    });
  }

  async findAll(query: QueryProcessesDto) {
    const { search, areaId, skip = 0, limit = DEFAULT_PAGE_SIZE } = query;

    const where: Prisma.ProcessWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (areaId) {
      where.areaId = areaId;
    }

    const [data, total] = await Promise.all([
      this.prisma.process.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          area: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              children: true,
            },
          },
        },
      }),
      this.prisma.process.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        skip,
        limit,
        hasMore: skip + data.length < total,
        page: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByArea(areaId: string) {
    const area = await this.prisma.area.findUnique({
      where: { id: areaId },
    });

    if (!area) throw new NotFoundException('Area not found');

    return this.prisma.process.findMany({
      where: { areaId },
    });
  }

  async findByAreaTree(areaId: string) {
    const area = await this.prisma.area.findUnique({
      where: { id: areaId },
    });

    if (!area) throw new NotFoundException('Area not found');

    const processes = await this.prisma.process.findMany({
      where: { areaId },
    });

    return this.buildProcessTree(processes);
  }

  private buildProcessTree(processes: Process[]): ProcessTreeDto[] {
    const processMap = new Map<string, ProcessTreeDto>();

    processes.forEach((process) => {
      processMap.set(process.id, {
        id: process.id,
        name: process.name,
        priority: process.priority,
        description: process.description,
        type: process.type,
        status: process.status,
        responsibles: process.responsibles,
        tools: process.tools,
        documentations: process.documentations,
        children: [],
      });
    });

    const rootProcesses: ProcessTreeDto[] = [];

    processes.forEach((process) => {
      const node = processMap.get(process.id)!;

      if (process.parentId && processMap.has(process.parentId)) {
        processMap.get(process.parentId)!.children.push(node);
      } else {
        rootProcesses.push(node);
      }
    });

    return rootProcesses;
  }

  private calculateMaxDepth(processes: any[]): number {
    const map = new Map<string, any>();

    processes.forEach((p) => {
      map.set(p.id, { ...p, children: [] });
    });

    const roots: any[] = [];

    processes.forEach((p) => {
      const node = map.get(p.id);
      if (p.parentId && map.has(p.parentId)) {
        map.get(p.parentId).children.push(node);
      } else {
        roots.push(node);
      }
    });

    const getDepth = (node: any): number => {
      if (!node.children.length) return 1;
      return 1 + Math.max(...node.children.map(getDepth));
    };

    return roots.length ? Math.max(...roots.map(getDepth)) : 0;
  }

  async getAreaStats(areaId: string) {
    const area = await this.prisma.area.findUnique({
      where: { id: areaId },
    });

    if (!area) throw new NotFoundException('Area not found');

    const processes = await this.prisma.process.findMany({
      where: { areaId },
    });

    const totalProcesses = processes.length;

    const activeProcesses = processes.filter(
      (p) => p.status === 'ACTIVE',
    ).length;

    const manualProcesses = processes.filter((p) => p.type === 'MANUAL').length;

    const automatedProcesses = processes.filter(
      (p) => p.type === 'SISTEMIC',
    ).length;

    const maxDepth = this.calculateMaxDepth(processes);

    return {
      totalProcesses,
      activeProcesses,
      manualProcesses,
      automatedProcesses,
      maxDepth,
    };
  }

  async findOne(id: string) {
    const process = await this.prisma.process.findUnique({ where: { id } });

    if (!process) throw new NotFoundException('Process not found');

    return process;
  }

  async update(id: string, dto: UpdateProcessDto) {
    const currentProcess = await this.findOne(id);

    if (dto.parentId === id) {
      throw new ConflictException('A process cannot be its own parent.');
    }

    if (dto.areaId) {
      const area = await this.prisma.area.findUnique({
        where: { id: dto.areaId },
      });

      if (!area) throw new NotFoundException('Area not found');

      if (dto.areaId !== currentProcess.areaId) {
        const childrenCount = await this.prisma.process.count({
          where: { parentId: id },
        });

        if (childrenCount > 0) {
          throw new ConflictException(
            'Cannot change area of a process that has child processes.',
          );
        }
      }
    }

    if (dto.parentId) {
      const parent = await this.prisma.process.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) throw new NotFoundException('Parent process not found');

      const targetAreaId = dto.areaId || currentProcess.areaId;
      if (parent.areaId !== targetAreaId) {
        throw new ConflictException(
          'Parent process must belong to the same area.',
        );
      }
    }

    return this.prisma.process.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const childrenCount = await this.prisma.process.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new ConflictException(
        `Cannot delete process: it has ${childrenCount} child process(es). Delete children first.`,
      );
    }

    return this.prisma.process.delete({
      where: { id },
    });
  }
}
