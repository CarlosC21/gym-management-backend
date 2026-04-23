import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // --- FIRST-ACCESS PASSWORD SETUP ---
  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req, @Body('password') newPassword: string) {
    // Aggressively hunt for the ID based on how the JwtStrategy might map the payload
    const userId = req.user?.sub || req.user?.userId || req.user?.id;

    // Safety Net: Prevent Prisma from crashing if the token is somehow malformed
    if (!userId) {
      throw new BadRequestException(
        'User ID could not be extracted from session token.',
      );
    }

    return this.authService.updatePassword(userId, newPassword);
  }
}
