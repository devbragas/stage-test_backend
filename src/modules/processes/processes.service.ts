import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { PrismaService } from '../../prisma/prisma.service';

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

    const processes = await this.prisma.process.findMany({
      where: { areaId },
    });

    return this.buildProcessTree(processes);
  }

  private buildProcessTree(processes: any[]): any[] {
    const processMap = new Map<string, any>();

    // Criar mapa de todos os processos
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

    const rootProcesses: any[] = [];

    // Construir a árvore
    processes.forEach((process) => {
      const node = processMap.get(process.id);

      if (process.parentId && processMap.has(process.parentId)) {
        // Se tem pai, adiciona como filho
        processMap.get(process.parentId).children.push(node);
      } else {
        // Se não tem pai, é um processo raiz
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
    await this.findOne(id);

    if (dto.areaId) {
      const area = await this.prisma.area.findUnique({
        where: { id: dto.areaId },
      });

      if (!area) throw new NotFoundException('Area not found');
    }

    if (dto.parentId) {
      const parent = await this.prisma.process.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) throw new NotFoundException('Parent process not found');
    }

    return this.prisma.process.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Verificar se o processo tem filhos
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
