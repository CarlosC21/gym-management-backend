// gym-backend: src/members/members.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply security to all routes in this controller
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // Action: Create a new athlete (Onboarding Engine)
  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateMemberDto) {
    return await this.membersService.create(dto);
  }

  // Get the full athlete list for the Roster
  @Get('roster')
  @Roles('ADMIN')
  async getRoster() {
    return await this.membersService.getAdminRoster();
  }

  // Action: Mark athlete as paid
  @Patch(':id/pay')
  @Roles('ADMIN')
  async updatePaymentStatus(@Param('id') id: string) {
    return await this.membersService.markAsPaid(id);
  }

  // Action: Hard Delete (Phase 11 Protocol)
  @Delete(':id')
  @Roles('ADMIN')
  async removeMember(@Param('id') id: string) {
    return await this.membersService.deleteMember(id);
  }
}
