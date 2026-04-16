import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async createWorkout(dateStr: string, content: any) {
    const parsedDate = new Date(dateStr);

    // Final safety check: Ensure the date is actually valid before Prisma touches it
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('The provided date is invalid.');
    }

    return this.prisma.workout.upsert({
      where: { date: parsedDate },
      update: { content },
      create: {
        date: parsedDate,
        content,
      },
    });
  }

  async getWorkoutByDate(dateStr: string, userRole: string) {
    const requestedDate = new Date(dateStr);

    // Safety check for GET requests
    if (isNaN(requestedDate.getTime())) {
      throw new BadRequestException('Invalid date format.');
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // SECURITY RULE: Members cannot see future workouts
    if (userRole !== 'ADMIN' && requestedDate > today) {
      throw new ForbiddenException('You cannot see future workouts yet!');
    }

    const workout = await this.prisma.workout.findUnique({
      where: { date: requestedDate },
    });

    if (!workout)
      throw new NotFoundException('No workout found for this date.');
    return workout;
  }
}
