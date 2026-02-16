import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { ProcessTreeDto } from './dto/process-tree.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Process } from '@prisma/client';

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

  async findAll() {
    return this.prisma.process.findMany();
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
