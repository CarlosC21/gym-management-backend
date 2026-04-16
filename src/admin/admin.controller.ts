import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect the entire controller
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('pay/:id')
  @Roles(Role.ADMIN) // ONLY the boss can mark someone as paid
  async markUserAsPaid(@Param('id') userId: string) {
    return this.adminService.markAsPaid(userId);
  }
}
