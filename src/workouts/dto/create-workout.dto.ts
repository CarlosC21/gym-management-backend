import {
  IsDateString,
  IsObject,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class WorkoutContentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsObject()
  schema: {
    rounds?: number;
    reps?: string;
    movements: string[];
  };
}

export class CreateWorkoutDto {
  @IsDateString({}, { message: 'Date must be a valid ISO string (YYYY-MM-DD)' })
  date: string;

  @IsObject()
  @ValidateNested()
  @Type(() => WorkoutContentDto)
  content: WorkoutContentDto;
}
