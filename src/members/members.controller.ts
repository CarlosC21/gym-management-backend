// gym-backend: src/members/members.controller.ts
import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // Get the full athlete list
  @Get('roster')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRoster() {
    return await this.membersService.getAdminRoster();
  }

  // Action: Mark athlete as paid
  @Patch(':id/pay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updatePaymentStatus(@Param('id') id: string) {
    return await this.membersService.markAsPaid(id);
  }
}
