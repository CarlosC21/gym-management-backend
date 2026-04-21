import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * The Sync Engine: Replaces 'check-in'.
   * Allows members to join a slot or swap to a different one seamlessly.
   */
  @Post('sync')
  async syncAttendance(
    @Req() req: any,
    @Body() body: { wodId: string; classId: string },
  ) {
    const userId = req.user.id || req.user.userId || req.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User identity could not be verified.');
    }

    return await this.attendanceService.syncAttendance(
      userId,
      body.wodId,
      body.classId,
    );
  }

  /**
   * Status Check: Used for the UI 'Double-Fetch'.
   * Returns the current record so the frontend knows WHICH slot is active.
   */
  @Get('status/:wodId')
  async getStatus(@Req() req: any, @Param('wodId') wodId: string) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    
    // We now return the full record (including classId) instead of just a boolean
    const attendanceRecord = await this.attendanceService.getCheckInStatus(
      userId,
      wodId,
    );
    
    return {
      isCheckedIn: !!attendanceRecord,
      activeClassId: attendanceRecord?.classId || null,
    };
  }

  /**
   * Personal Attendance History
   */
  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    return await this.attendanceService.getMyAttendance(userId);
  }
}