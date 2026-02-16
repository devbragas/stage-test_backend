import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MaxLength,
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
} from 'class-validator';

export enum ProcessType {
  MANUAL = 'MANUAL',
  SISTEMIC = 'SISTEMIC',
}

export enum ProcessStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateProcessDto {
  @ApiProperty({ example: 'Recruitment Flow' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    enum: ProcessType,
    example: ProcessType.MANUAL,
    description: 'Type of the process (MANUAL or SISTEMIC)',
  })
  @IsEnum(ProcessType)
  type: ProcessType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identifier of the associated area',
  })
  @IsUUID()
  areaId: string;

  @ApiProperty({
    required: false,
    description: 'Parent process ID (for hierarchy)',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'List of responsible people',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibles?: string[];

  @ApiPropertyOptional({
    description: 'List of tools used in this process',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @ApiPropertyOptional({
    description: 'List of documentation links',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentations?: string[];
}
