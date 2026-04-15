import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import the PrismaModule

@Module({
  imports: [PrismaModule], // This "unlocks" PrismaService for this module
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
