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

    // 1. THE UNPAID GATE: Login Check
    // Using 'status' to match your Prisma schema
    if (user.status !== 'PAID' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Account inactive: Please contact Admin.');
    }

    // 2. JWT PAYLOAD
    // We include 'status' here so the RolesGuard can see it without a DB hit
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
