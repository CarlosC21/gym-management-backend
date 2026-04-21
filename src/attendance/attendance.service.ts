// src/attendance/attendance.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Sync Attendance: The "WhatsApp Vote" Replacement.
   * Handles both the first check-in and switching time slots.
   */
  async syncAttendance(userId: string, wodId: string, classId: string) {
    // 1. Verify the WOD and the Class Slot exist
    const [wod, targetClass] = await Promise.all([
      this.prisma.workout.findUnique({ where: { id: wodId } }),
      this.prisma.class.findUnique({ where: { id: classId } }),
    ]);

    if (!wod) throw new NotFoundException('Workout not found');
    if (!targetClass) throw new NotFoundException('Class slot not found');

    // 2. Upsert logic: If record exists for [userId + wodId], update the classId.
    // Otherwise, create a new attendance record.
    return this.prisma.attendance.upsert({
      where: {
        userId_wodId: {
          userId: userId,
          wodId: wodId,
        },
      },
      update: {
        classId: classId,
      },
      create: {
        userId: userId,
        wodId: wodId,
        classId: classId,
      },
    });
  }

  async getMyAttendance(userId: string) {
    return this.prisma.attendance.findMany({
      where: { userId },
      include: {
        workout: true,
        class: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns the attendance record so the frontend knows 
   * exactly WHICH classId is currently "checked in".
   */
  async getCheckInStatus(userId: string, wodId: string) {
    return this.prisma.attendance.findUnique({
      where: {
        userId_wodId: { userId, wodId },
      },
      select: {
        id: true,
        classId: true,
      },
    });
  }
}