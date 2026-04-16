import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Anniversary Billing Logic:
   * Sets the user to PAID and moves the due date to the same day next month.
   */
  async markAsPaid(userId: string) {
    const nextMonth = new Date();

    // Anniversary logic: JS handles month rollovers automatically
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    nextMonth.setDate(nextMonth.getDate() + 1);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'PAID',
        nextDueDate: nextMonth,
      },
    });
  }

  /**
   * Manual Override:
   * In case an owner needs to set a specific date (e.g., a "pro-rated" month).
   */
  async updateDueDate(userId: string, customDate: Date) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        nextDueDate: customDate,
      },
    });
  }
}
