import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService],
  exports: [], // We can export a UsersService later if other modules need user data
})
export class UsersModule {}
