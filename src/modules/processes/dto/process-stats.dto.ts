import { ApiProperty } from '@nestjs/swagger';

export class ProcessStatsDto {
  @ApiProperty()
  totalProcesses: number;

  @ApiProperty()
  activeProcesses: number;

  @ApiProperty()
  manualProcesses: number;

  @ApiProperty()
  automatedProcesses: number;

  @ApiProperty({ description: '@ApiProperty()' })
  maxDepth: number;
}
