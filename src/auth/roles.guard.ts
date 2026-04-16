import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // console.log('--- GUARD DEBUG: THE BOUNCER IS CHECKING THE ID ---');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    // console.log('User Status found in Token:', user?.status);

    // 1. THE ADMIN BYPASS
    if (user.role === 'ADMIN') return true;

    // 2. THE UNPAID GATE
    // Matches Prisma field 'status'
    if (user.status === 'UNPAID') {
      throw new ForbiddenException({
        message: 'Access Denied: Your membership is currently inactive.',
        error_code: 'ERR_ACCOUNT_UNPAID',
      });
    }

    // 3. STANDARD ROLE CHECK
    return requiredRoles.includes(user.role);
  }
}
