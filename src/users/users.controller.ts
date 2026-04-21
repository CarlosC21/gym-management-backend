import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        status: true,
        nextDueDate: true,
      },
    });
  }

  @Patch('profile-image')
  async updateImage(@Req() req: any, @Body() body: { image: string }) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    if (!userId) throw new UnauthorizedException();

    return this.prisma.user.update({
      where: { id: userId },
      data: { image: body.image },
    });
  }
}
