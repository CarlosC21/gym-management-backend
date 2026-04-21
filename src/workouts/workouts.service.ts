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

  /**
   * Helper: Robust time sorting that handles slashes like "9:30/11:00 am"
   */
  private timeToMinutes(timeStr: string): number {
    const lowerTime = timeStr.toLowerCase();
    const isPm = lowerTime.includes('pm');

    // Extract only the first pair of numbers (e.g., "9:30" from "9:30/11:00 am")
    const timeMatch = lowerTime.match(/(\d+):(\d+)/);
    if (!timeMatch) return 0;

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);

    // Standard 12-hour to 24-hour conversion
    if (isPm && hours !== 12) hours += 12;
    if (!isPm && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  async createWorkout(dto: CreateWorkoutDto) {
    const parsedDate = new Date(dto.date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('The provided date is invalid.');
    }

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
    const isAfterEight = now.getHours() >= 20;

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

    const rawSlots = await this.prisma.class.findMany({
      include: {
        attendance: {
          where: { wodId: workout.id },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Final Sort: Ensures chronological order from 5:15 am to 7:00/9:00 pm
    const sortedSlots = rawSlots.sort(
      (a, b) =>
        this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime),
    );

    return {
      id: workout.id,
      date: workout.date,
      ...(workout.content as any),
      slots: sortedSlots,
    };
  }
}
