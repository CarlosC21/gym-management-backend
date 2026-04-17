import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const userPayload = request.user;

    if (!userPayload) {
      throw new UnauthorizedException('No user found in request');
    }

    // THE FIX: We now look for 'userId' based on your terminal logs
    const idToUse = userPayload.userId || userPayload.sub || userPayload.id;

    if (!idToUse) {
      console.error(
        '--- GUARD ERROR: No ID found in Token Payload ---',
        userPayload,
      );
      throw new UnauthorizedException('Invalid token payload: Missing ID');
    }

    if (userPayload.role === 'ADMIN') return true;

    const user = await this.prisma.user.findUnique({
      where: { id: idToUse }, // Using the mapped ID
      select: { status: true, role: true },
    });

    if (!user || user.status === 'UNPAID') {
      throw new ForbiddenException({
        message: 'Access Denied: Your membership is currently inactive.',
        error_code: 'ERR_ACCOUNT_UNPAID',
      });
    }

    // 3. STANDARD ROLE CHECK
    return requiredRoles.includes(user.role as Role);
  }
}
