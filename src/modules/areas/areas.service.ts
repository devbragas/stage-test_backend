import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAreaDto) {
    return this.prisma.area.create({ data });
  }

  async findAll() {
    return this.prisma.area.findMany();
  }

  async findOne(id: string) {
    const area = await this.prisma.area.findUnique({ where: { id } });

    if (!area) throw new NotFoundException('Área não encontrada');

    return area;
  }

  async update(id: string, data: UpdateAreaDto) {
    await this.findOne(id);

    return this.prisma.area.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.area.delete({
      where: { id },
    });
  }
}
