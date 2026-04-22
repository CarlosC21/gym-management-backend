import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * PHASE 11: REVENUE PULSE
   * Categorizes the entire athlete base into financial 'buckets' based on nextDueDate.
   * Logic: Red (< Today), Yellow (Next 7 Days), Green (> 7 Days).
   */
  async getRevenuePulse() {
    const today = new Date();
    const alertThreshold = new Date();
    alertThreshold.setDate(today.getDate() + 7); // 7-day lookahead

    // Parallel execution for high-performance dashboarding
    const [overdue, upcoming, healthy] = await Promise.all([
      // 1. THE RED ZONE: Payment is in the past
      this.prisma.user.count({
        where: {
          role: 'MEMBER',
          nextDueDate: { lt: today },
        },
      }),

      // 2. THE YELLOW ZONE: Due within the next 7 days
      this.prisma.user.count({
        where: {
          role: 'MEMBER',
          nextDueDate: {
            gte: today,
            lte: alertThreshold,
          },
        },
      }),

      // 3. THE GREEN ZONE: Paid up and secure
      this.prisma.user.count({
        where: {
          role: 'MEMBER',
          nextDueDate: { gt: alertThreshold },
        },
      }),
    ]);

    return {
      overdue,
      upcoming,
      healthy,
      totalActive: overdue + upcoming + healthy,
    };
  }

  /**
   * Phase 11: Searchable Roster
   * Fetches athletes with high-performance server-side filtering.
   */
  async getRoster(search?: string) {
    return this.prisma.user.findMany({
      where: {
        OR: search
          ? [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        nextDueDate: true,
        status: true,
      },
      orderBy: { firstName: 'asc' },
    });
  }

  /**
   * Phase 11: Hard Deletion
   * Permanently removes an athlete. Cascading deletes handled via Prisma Schema.
   */
  async hardDeleteMember(userId: string) {
    try {
      return await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new NotFoundException(`Member with ID ${userId} not found.`);
    }
  }

  /**
   * Anniversary Billing Logic
   * Advances the due date by 1 month and marks status as PAID.
   */
  async markAsPaid(userId: string) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(nextMonth.getDate() + 1);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'PAID',
        nextDueDate: nextMonth,
        lastPaymentDate: new Date(),
      },
    });
  }

  /**
   * Manual Override
   * Explicit date control for pro-rated memberships or manual corrections.
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
