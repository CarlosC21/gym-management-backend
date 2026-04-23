import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const now = new Date();

    // THE JIT EXPIRY CHECK
    if (
      user.role === 'MEMBER' &&
      user.status === 'PAID' &&
      user.nextDueDate &&
      new Date(user.nextDueDate) < now
    ) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { status: 'UNPAID' },
      });

      throw new ForbiddenException({
        code: 'ERR_ACCOUNT_UNPAID',
        message: 'Membership expired.',
      });
    }

    if (user.status === 'UNPAID' && user.role !== 'ADMIN') {
      throw new ForbiddenException({
        code: 'ERR_ACCOUNT_UNPAID',
        message: 'Account inactive.',
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      // Pass the security flag to the frontend
      mustChangePassword: user.mustChangePassword,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
  // Add this below the login() method in src/auth/auth.service.ts
  async updatePassword(userId: string, newPassword: string) {
    // 1. Hash the new private password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. Save it and turn off the "First Access" flag
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    return { success: true, message: 'Password updated successfully' };
  }
}
