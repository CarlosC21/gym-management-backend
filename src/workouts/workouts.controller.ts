import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Verified path
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { Role } from '@prisma/client';

@Controller('workouts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createWorkoutDto: CreateWorkoutDto) {
    // No more manual console logs needed; ValidationPipe handles the 'bad' data check
    return this.workoutsService.createWorkout(
      createWorkoutDto.date,
      createWorkoutDto.content,
    );
  }

  @Get(':date')
  @Roles(Role.ADMIN, Role.MEMBER)
  async getWorkout(@Param('date') date: string, @Req() req: any) {
    return this.workoutsService.getWorkoutByDate(date, req.user.role);
  }
}
