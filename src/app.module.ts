import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { MobilityModule } from './mobility/mobility.module';

@Module({
  imports: [PrismaModule, AuthModule, WorkoutsModule, EnrollmentsModule, MobilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
