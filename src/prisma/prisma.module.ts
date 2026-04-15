import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // If you have @Global(), you technically don't need the import above, but it's safer
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // CRITICAL: This makes it available to others
})
export class PrismaModule {}
