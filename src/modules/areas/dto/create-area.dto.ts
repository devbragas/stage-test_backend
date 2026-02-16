import {
  IsBoolean,
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
