import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, classId: string, dateStr: string) {
    const now = new Date();
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC

    // 1. RULE: No booking in the past
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (targetDate < today)
      throw new BadRequestException('Cannot book in the past.');

    // 2. THE 8:00 PM RULE: Booking for tomorrow opens at 8 PM today
    const isTomorrow = targetDate.getTime() === today.getTime() + 86400000;
    if (isTomorrow && now.getHours() < 20) {
      throw new ForbiddenException(
        'Booking for tomorrow opens at 8:00 PM today.',
      );
    }

    // 3. ONE-CLASS LIMIT: Upsert logic
    // Because of @@unique([userId, date]), this will overwrite any previous
    // signup for this specific day, effectively "switching" their class.
    return this.prisma.enrollment.upsert({
      where: {
        userId_date: { userId, date: targetDate },
      },
      update: { classId },
      create: {
        userId,
        classId,
        date: targetDate,
      },
    });
  }

  async getRoster(classId: string, dateStr: string) {
    const startOfDay = new Date(dateStr);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(dateStr);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return this.prisma.enrollment.findMany({
      where: {
        classId: classId,
        date: {
          gte: startOfDay, // Greater than or equal to start of day
          lte: endOfDay, // Less than or equal to end of day
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
