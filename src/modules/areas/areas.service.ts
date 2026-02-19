import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAreaDto) {
    const existingNamedArea = await this.prisma.area.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });
    if (existingNamedArea) {
      throw new ConflictException('Area name already exits');
    }
    return this.prisma.area.create({ data });
  }

  async findAll(search?: string) {
    return this.prisma.area.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
      include: {
        _count: {
          select: { processes: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const area = await this.prisma.area.findUnique({ where: { id } });

    if (!area) throw new NotFoundException('Area not found.');

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
