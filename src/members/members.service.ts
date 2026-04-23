import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMemberDto) {
    // 1. Check for existing email to prevent duplicates
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A member with this email already exists');
    }

    // 2. Business Logic: Anniversary Billing (Start Date + 1 Month + 1 Day)
    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const nextDue = new Date(startDate);
    nextDue.setMonth(startDate.getMonth() + 1);
    nextDue.setDate(nextDue.getDate() + 1);

    const tempPassword = 'GymEngine2026!';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    return this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        mustChangePassword: true,
        image: dto.image, // Lean Base64 string
        nextDueDate: nextDue,
        lastPaymentDate: startDate,
        status: 'PAID',
        role: 'MEMBER', // Default role for new athletes
      },
    });
  }

  async getAdminRoster() {
    return this.prisma.user.findMany({
      where: { role: 'MEMBER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        nextDueDate: true,
        image: true,
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async markAsPaid(memberId: string) {
    const member = await this.prisma.user.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

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

  async deleteMember(id: string) {
    // Hard Deletion: Prisma 'onDelete: Cascade' in schema handles related records
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete: Member with ID ${id} not found`,
      );
    }
  }
}
