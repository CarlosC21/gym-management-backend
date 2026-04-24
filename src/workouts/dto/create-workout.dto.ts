import {
  IsDateString,
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { WodType } from '@prisma/client';

export class CreateWorkoutDto {
  @IsDateString({}, { message: 'Date must be a valid ISO string (YYYY-MM-DD)' })
  date: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(WodType)
  type?: WodType;
}
