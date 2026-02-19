import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessType, ProcessStatus, ProcessPriority } from '@prisma/client';

export class ProcessResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the process',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the process',
    example: 'Recruitment Flow',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the process',
    example: 'Handles the entire recruitment lifecycle',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Identifier of the associated area',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  areaId: string;

  @ApiPropertyOptional({
    description: 'Parent process ID (for hierarchy)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  parentId: string | null;

  @ApiProperty({
    enum: ProcessType,
    description: 'Type of the process',
    example: 'MANUAL',
  })
  type: ProcessType;

  @ApiProperty({
    enum: ProcessPriority,
    description: 'Priority of the process',
    example: 'MEDIA',
  })
  priority: ProcessPriority;

  @ApiProperty({
    enum: ProcessStatus,
    description: 'Status of the process',
    example: 'ACTIVE',
  })
  status: ProcessStatus;

  @ApiProperty({
    description: 'List of responsible people',
    type: [String],
    example: [
      'Ângela Oliveira',
      'Anderson Félix',
      'Miguel Couto',
      'Rafael Leal',
    ],
  })
  responsibles: string[];

  @ApiProperty({
    description: 'List of tools used in this process',
    type: [String],
    example: ['SAP', 'Excel'],
  })
  tools: string[];

  @ApiProperty({
    description: 'List of documentation links',
    type: [String],
    example: ['https://docs.example.com/process1'],
  })
  documentations: string[];

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-02-16T18:34:30.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-02-16T18:34:30.000Z',
  })
  updatedAt: Date;
}
