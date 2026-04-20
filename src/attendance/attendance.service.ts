import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(userId: string, wodId: string) {
    // 1. Verify the WOD exists
    const wod = await this.prisma.workout.findUnique({
      where: { id: wodId },
    });

    if (!wod) throw new NotFoundException('Workout not found');

    // 2. Create attendance using the 'connect' syntax
    try {
      return await this.prisma.attendance.create({
        data: {
          user: {
            connect: { id: userId },
          },
          wodId: wodId,
        },
      });
    } catch (error: any) {
      // P2002 is Prisma's Unique Constraint error
      if (error.code === 'P2002') {
        throw new ConflictException(
          'You have already checked into this workout.',
        );
      }
      throw error;
    }
  }

  async getMyAttendance(userId: string) {
    return this.prisma.attendance.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Verification Logic: Checks if a specific user/wod pair exists
  async getCheckInStatus(userId: string, wodId: string): Promise<boolean> {
    const record = await this.prisma.attendance.findUnique({
      where: {
        userId_wodId: { userId, wodId },
      },
    });
    return !!record;
  }
}
