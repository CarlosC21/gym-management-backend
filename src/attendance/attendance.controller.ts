import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Req() req: any, @Body('wodId') wodId: string) {
    // Robust ID extraction from JWT
    const userId = req.user.id || req.user.userId || req.user.sub;

    if (!userId) {
      throw new Error('User ID not found in JWT.');
    }

    return await this.attendanceService.checkIn(userId, wodId);
  }

  // New Route: Used by Frontend to sync UI state on page refresh
  @Get('status/:wodId')
  async getStatus(@Req() req: any, @Param('wodId') wodId: string) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    const checkedIn = await this.attendanceService.getCheckInStatus(
      userId,
      wodId,
    );
    return { checkedIn };
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    return await this.attendanceService.getMyAttendance(userId);
  }
}
