/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ProcessesService } from './processes.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProcessesService', () => {
  let service: ProcessesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessesService,
        {
          provide: PrismaService,
          useValue: {
            process: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            area: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    service = module.get<ProcessesService>(ProcessesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('Services must be defined when module is loaded and compiled', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create', () => {
    it('should create process with valid data', async () => {
      const dto = {
        name: 'Recruitment',
        areaId: 'area-uuid',
        type: 'MANUAL',
      };
      const mockArea = { id: 'area-uuid' };
      const mockCreatedProcess = {
        id: 'process-uuid',
        ...dto,
      };
      prismaService.area.findUnique = jest.fn().mockResolvedValue(mockArea);
      prismaService.process.create = jest
        .fn()
        .mockResolvedValue(mockCreatedProcess);
      const result = await service.create(dto as any);
      expect(prismaService.area.findUnique).toHaveBeenCalledWith({
        where: { id: dto.areaId },
      });
      expect(prismaService.process.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(mockCreatedProcess);
    });

    it('should throw NotFoundException if area does not exist', async () => {
      const dto = {
        name: 'Recruitment',
        areaId: 'area-uuid',
        type: 'MANUAL',
      };

      await expect(service.create(dto as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.area.findUnique).toHaveBeenCalledWith({
        where: { id: dto.areaId },
      });
    });

    it('should throw ConflictException if parent belongs to another area', async () => {
      const dto = {
        name: 'Recruitment',
        areaId: 'area-uuid',
        type: 'MANUAL',
        parentId: 'parent-uuid',
      };
      const mockArea = { id: 'area-uuid' };
      const mockParentProcess = {
        id: 'parent-uuid',
        areaId: 'other-area-uuid',
      };
      prismaService.area.findUnique = jest.fn().mockResolvedValue(mockArea);
      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValue(mockParentProcess);
      await expect(service.create(dto as any)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.process.findUnique).toHaveBeenCalledWith({
        where: { id: dto.parentId },
      });
    });
    it('should throw NotFoundException if parent does not exist', async () => {
      const dto = {
        name: 'Recruitment',
        areaId: 'area-uuid',
        parentId: 'parent-uuid',
        type: 'MANUAL',
      };

      prismaService.area.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'area-uuid' });

      prismaService.process.findUnique = await expect(
        service.create(dto as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw ConflictException if setting self as parent', async () => {
      const id = 'process-uuid';

      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValue({ id, areaId: 'area-uuid' });

      await expect(service.update(id, { parentId: id } as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if new area does not exist', async () => {
      const id = 'process-uuid';

      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValue({ id, areaId: 'area-uuid' });

      prismaService.area.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.update(id, { areaId: 'invalid-area' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if changing area and process has children', async () => {
      const id = 'process-uuid';

      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValue({ id, areaId: 'area-uuid' });

      prismaService.area.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'new-area-uuid' });

      prismaService.process.count = jest.fn().mockResolvedValue(2);

      await expect(
        service.update(id, { areaId: 'new-area-uuid' } as any),
      ).rejects.toThrow(ConflictException);

      expect(prismaService.process.count).toHaveBeenCalledWith({
        where: { parentId: id },
      });
    });

    it('should throw ConflictException if parent belongs to a different area', async () => {
      const id = 'process-uuid';

      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValueOnce({ id, areaId: 'area-uuid' })
        .mockResolvedValueOnce({
          id: 'parent-uuid',
          areaId: 'other-area-uuid',
        });

      await expect(
        service.update(id, { parentId: 'parent-uuid' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if parent process does not exist', async () => {
      const id = 'process-uuid';

      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValueOnce({ id, areaId: 'area-uuid' })
        .mockResolvedValueOnce(null);

      await expect(
        service.update(id, { parentId: 'ghost-uuid' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update process successfully with valid data', async () => {
      const id = 'process-uuid';
      const dto = { name: 'Updated name' };
      const mockProcess = { id, areaId: 'area-uuid', ...dto };

      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValue({ id, areaId: 'area-uuid' });

      prismaService.process.update = jest.fn().mockResolvedValue(mockProcess);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(mockProcess);
      expect(prismaService.process.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if process does not exist', async () => {
      const processId = 'process-uuid';

      prismaService.process.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.remove(processId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if process has children', async () => {
      const processId = 'process-uuid';

      prismaService.process.findUnique = jest.fn().mockResolvedValue({
        id: processId,
        areaId: 'area-uuid',
      });

      prismaService.process.count = jest.fn().mockResolvedValue(1);

      await expect(service.remove(processId)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaService.process.findUnique).toHaveBeenCalledWith({
        where: { id: processId },
      });
      expect(prismaService.process.count).toHaveBeenCalledWith({
        where: { parentId: processId },
      });
    });

    it('should delete process successfully when no children exist', async () => {
      const processId = 'process-uuid';
      const mockProcess = { id: processId, areaId: 'area-uuid' };

      prismaService.process.findUnique = jest
        .fn()
        .mockResolvedValue(mockProcess);
      prismaService.process.count = jest.fn().mockResolvedValue(0);
      prismaService.process.delete = jest.fn().mockResolvedValue(mockProcess);

      const result = await service.remove(processId);

      expect(result).toEqual(mockProcess);
      expect(prismaService.process.delete).toHaveBeenCalledWith({
        where: { id: processId },
      });
    });
  });
});
