import {
  Controller,
  Post,
  Get,
  Delete,
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
   * Join or Swap Class: Replaces 'check-in'.
   * Allows members to join a slot or swap to a different one seamlessly.
   */
  @Post()
  async joinClass(
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
   * Leave Class: Cancels the reservation.
   */
  @Delete(':wodId/:classId')
  async leaveClass(
    @Req() req: any,
    @Param('wodId') wodId: string,
    @Param('classId') classId: string,
  ) {
    const userId = req.user.id || req.user.userId || req.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User identity could not be verified.');
    }

    return await this.attendanceService.leaveClass(userId, wodId, classId);
  }

  /**
   * Status Check: Used for the UI 'Double-Fetch'.
   * Returns the current record so the frontend knows WHICH slot is active.
   */
  @Get('status/:wodId')
  async getStatus(@Req() req: any, @Param('wodId') wodId: string) {
    const userId = req.user.id || req.user.userId || req.user.sub;

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
