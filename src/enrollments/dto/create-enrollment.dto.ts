// src/enrollments/dto/create-enrollment.dto.ts
import { IsUUID, IsDateString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  classId: string;

  @IsDateString()
  date: string;
}
