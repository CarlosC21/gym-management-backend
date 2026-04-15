import { Module } from '@nestjs/common';
import { MobilityService } from './mobility.service';
import { MobilityController } from './mobility.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MobilityController],
  providers: [MobilityService],
})
export class MobilityModule {}
