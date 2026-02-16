import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AreaResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the area',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the organizational area',
    example: 'Human Resources',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the area',
    example: 'Responsible for employee management and recruitment',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Color code for the area (hex format)',
    example: '#FF5733',
  })
  color?: string;

  @ApiProperty({
    description: 'Whether the area is active',
    example: true,
  })
  active: boolean;

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
