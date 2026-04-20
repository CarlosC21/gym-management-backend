import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async createWorkout(dto: CreateWorkoutDto) {
    const parsedDate = new Date(dto.date);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('The provided date is invalid.');
    }

    // Extract sections to store in the 'content' JSON field
    const { date, ...sections } = dto;

    return this.prisma.workout.upsert({
      where: { date: parsedDate },
      update: { content: sections },
      create: {
        date: parsedDate,
        content: sections,
      },
    });
  }

  async getWorkoutByDate(dateStr: string, userRole: string) {
    const requestedDate = new Date(dateStr);

    if (isNaN(requestedDate.getTime())) {
      throw new BadRequestException('Invalid date format.');
    }

    const now = new Date();
    // The "8:00 PM Rule" Logic
    const isAfterEight = now.getHours() >= 20;

    // Visibility Limit calculation
    const visibilityLimit = new Date();
    if (isAfterEight) {
      visibilityLimit.setDate(visibilityLimit.getDate() + 1);
    }
    visibilityLimit.setHours(23, 59, 59, 999);

    if (userRole !== 'ADMIN' && requestedDate > visibilityLimit) {
      throw new ForbiddenException(
        "Tomorrow's workout is locked until 8:00 PM!",
      );
    }

    const workout = await this.prisma.workout.findUnique({
      where: { date: requestedDate },
    });

    if (!workout)
      throw new NotFoundException('No workout found for this date.');

    // CRITICAL FIX: Include 'id' so the frontend can use it for Check-ins
    return {
      id: workout.id, // The UUID required for the Attendance table
      date: workout.date,
      ...(workout.content as any),
    };
  }
}
