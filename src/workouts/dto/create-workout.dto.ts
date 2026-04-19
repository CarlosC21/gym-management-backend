import { IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateWorkoutDto {
  @IsDateString({}, { message: 'Date must be a valid ISO string (YYYY-MM-DD)' })
  date: string;

  // We flatten the structure to match the Blueprint 5-sections
  @IsString()
  mobility: string;

  @IsString()
  warmUp: string;

  @IsString()
  skillStrength: string;

  @IsString()
  wodMetcon: string;

  @IsString()
  other: string;
}
