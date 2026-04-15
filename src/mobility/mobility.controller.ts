import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MobilityService } from './mobility.service';

@Controller('mobility')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MobilityController {
  constructor(private readonly mobilityService: MobilityService) {}

  @Post('generate')
  @Roles('MEMBER', 'ADMIN')
  async generate(
    @Req() req: any, 
    @Body() body: { focus: string; duration: number; equipment: string }
  ) {
    return this.mobilityService.generatePlan(req.user.userId, body);
  }

  @Get('my-plans')
  @Roles('MEMBER', 'ADMIN')
  async getMyPlans(@Req() req: any) {
    return this.mobilityService.getUserPlans(req.user.userId);
  }
}