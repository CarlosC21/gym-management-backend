import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from '@prisma/client';
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'; // We'll build this file next

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. Open to everyone (even unpaid/unlogged users)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 2. Only logged-in, PAID members or Admins can see this
  @Get('workout-feed')
  @UseGuards(JwtAuthGuard)
  getWorkouts() {
    return { 
      message: 'Here is the WOD.', 
      data: 'Metcon: 21-15-9 Burpees and Thrusters' 
    };
  }

  // 3. ONLY Admins can see this
  @Get('admin/revenue')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getRevenue() {
    return { 
      message: 'Access Granted, Lead Partner.', 
      stats: { monthly_recurring: 5000, active_members: 42 } 
    };
  }
}
