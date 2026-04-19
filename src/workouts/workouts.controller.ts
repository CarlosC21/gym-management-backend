import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
    // FIX: We now pass the entire flattened DTO to the service
    // The Service handles the date parsing and JSON extraction
    return this.workoutsService.createWorkout(createWorkoutDto);
  }

  @Get(':date')
  @Roles(Role.ADMIN, Role.MEMBER)
  async getWorkout(@Param('date') date: string, @Req() req: any) {
    // The service uses the role to enforce the "8:00 PM Sneak Peek" rule
    return this.workoutsService.getWorkoutByDate(date, req.user.role);
  }
}
