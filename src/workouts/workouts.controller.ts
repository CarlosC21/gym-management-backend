import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @Roles('ADMIN') // Only admins can create
  async create(@Body() body: { date: string; content: any }) {
    console.log('--- WORKOUT DEBUG ---');
    console.log('Body received:', body);
    return this.workoutsService.createWorkout(body.date, body.content);
  }

  @Get(':date')
  @Roles('ADMIN', 'MEMBER') // Both can view, but service filters the date
  async getWorkout(@Param('date') date: string, @Req() req: any) {
    return this.workoutsService.getWorkoutByDate(date, req.user.role);
  }
}
