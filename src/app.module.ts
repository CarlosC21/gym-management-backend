import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { MobilityModule } from './mobility/mobility.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { ConfigModule } from '@nestjs/config';
import { MembersModule } from './members/members.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  // 1. Only Modules go here
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    WorkoutsModule,
    EnrollmentsModule,
    MobilityModule,
    MembersModule,
    AttendanceModule,
  ],
  controllers: [AppController, AdminController],
  // 2. Services go here
  providers: [AppService, AdminService],
})
export class AppModule {}
