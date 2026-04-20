import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async getAdminRoster() {
    return this.prisma.user.findMany({
      where: {
        role: 'MEMBER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        nextDueDate: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
  }

  async markAsPaid(memberId: string) {
    const member = await this.prisma.user.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    // Business Logic: Same Day Next Month + 1 Day
    const today = new Date();
    const nextMonth = new Date(today);

    nextMonth.setMonth(today.getMonth() + 1);
    nextMonth.setDate(nextMonth.getDate() + 1);

    return this.prisma.user.update({
      where: { id: memberId },
      data: {
        status: 'PAID',
        nextDueDate: nextMonth,
        lastPaymentDate: today,
      },
      select: {
        id: true,
        firstName: true,
        status: true,
        nextDueDate: true,
      },
    });
  }
}
