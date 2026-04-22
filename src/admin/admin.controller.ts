import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('roster')
  @Roles(Role.ADMIN)
  async getRoster(@Query('search') search: string) {
    return this.adminService.getRoster(search);
  }

  @Patch('pay/:id')
  @Roles(Role.ADMIN)
  async markUserAsPaid(@Param('id') userId: string) {
    return this.adminService.markAsPaid(userId);
  }

  @Delete('member/:id')
  @Roles(Role.ADMIN)
  async deleteMember(@Param('id') userId: string) {
    return this.adminService.hardDeleteMember(userId);
  }

  @Get('revenue-pulse')
  @Roles(Role.ADMIN)
  async getRevenuePulse() {
    return this.adminService.getRevenuePulse();
  }
}