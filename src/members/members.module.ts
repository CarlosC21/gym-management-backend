import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembersController], // <--- Must be here
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
