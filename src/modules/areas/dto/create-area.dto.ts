import {
  IsBoolean,
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaDto {
  @ApiProperty({
    description: 'Name of the Area',
    example: 'Human Resources',
    maxLength: 30,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the area responsibilities',
    example:
      'Responsible for recruitment, performance evaluation and employee management.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Hexadecimal color code used for UI visualization',
    example: '#1E90FF',
  })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({
    description: 'Indicates whether the area is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
