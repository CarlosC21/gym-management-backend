import { Controller, Post, Get, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles('MEMBER', 'ADMIN')
  async signup(@Body() body: { classId: string; date: string }, @Req() req) {
    // req.user comes from the JwtStrategy we built in the plumbing phase
    return this.enrollmentsService.create(req.user.userId, body.classId, body.date);
  }

  @Get('roster/:classId')
  @Roles('MEMBER', 'ADMIN')
  async getRoster(@Param('classId') classId: string, @Query('date') date: string) {
    return this.enrollmentsService.getRoster(classId, date);
  }
}