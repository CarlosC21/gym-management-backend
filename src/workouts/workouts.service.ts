import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async createWorkout(date: string, content: any) {
    return this.prisma.workout.upsert({
      where: { date: new Date(date) },
      update: { content },
      create: {
        date: new Date(date),
        content,
      },
    });
  }

  async getWorkoutByDate(dateStr: string, userRole: string) {
    const requestedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    // SECURITY RULE: Members cannot see future workouts
    if (userRole !== 'ADMIN' && requestedDate > today) {
      throw new ForbiddenException('You cannot see future workouts yet!');
    }

    const workout = await this.prisma.workout.findUnique({
      where: { date: requestedDate },
    });

    if (!workout) throw new NotFoundException('No workout found for this date.');
    return workout;
  }
}
