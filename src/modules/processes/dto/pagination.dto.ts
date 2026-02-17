import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  skip: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  limit: number;
}
