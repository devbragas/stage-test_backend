import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessType, ProcessStatus } from '@prisma/client';

export class ProcessTreeDto {
  @ApiProperty({
    description: 'Unique identifier of the process',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the process',
    example: 'Recrutamento e Seleção',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the process',
    example: 'Processo de recrutamento Stage Consulting',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    enum: ProcessType,
    description: 'Type of the process',
  })
  type: ProcessType;

  @ApiProperty({
    enum: ProcessStatus,
    description: 'Status of the process',
  })
  status: ProcessStatus;

  @ApiProperty({
    description: 'List of responsible people',
    example: 'Gestor de RH',
    type: [String],
  })
  responsibles: string[];

  @ApiProperty({
    description: 'List of tools used',
    type: [String],
  })
  tools: string[];

  @ApiProperty({
    description: 'List of documentation links',
    type: [String],
  })
  documentations: string[];

  @ApiProperty({
    description: 'Child processes (subprocesses) - recursive structure',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '2' },
        name: { type: 'string', example: 'Triagem de Currículos' },
        description: { type: 'string', example: 'Avaliação inicial' },
        type: { type: 'string', enum: ['MANUAL', 'SISTEMIC'] },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
        responsibles: { type: 'array', items: { type: 'string' } },
        tools: { type: 'array', items: { type: 'string' } },
        documentations: { type: 'array', items: { type: 'string' } },
        children: { type: 'array', items: { type: 'object' } },
      },
    },
    example: [
      {
        id: '2',
        name: 'Triagem de Currículos',
        description: 'Avaliação inicial',
        type: 'MANUAL',
        status: 'ACTIVE',
        responsibles: ['Analista RH'],
        tools: ['ATS System'],
        documentations: [],
        children: [],
      },
    ],
  })
  children: ProcessTreeDto[];
}
