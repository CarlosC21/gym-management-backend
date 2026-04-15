import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// The first argument 'roles' must match the 'roles' in your RolesGuard
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
