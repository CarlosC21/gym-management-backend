import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MobilityService {
  constructor(private prisma: PrismaService) {}

  async generatePlan(userId: string, data: { focus: string; duration: number; equipment: string }) {
    // This is where we will later call the AI. 
    // For now, let's create a structured "Mock" response to test the DB save.
    const mockRoutine = [
      { name: `Dynamic ${data.focus} Stretch`, duration: '2 mins', instructions: 'Move through a full range of motion.' },
      { name: `Deep ${data.focus} Hold`, duration: '3 mins', instructions: 'Hold and breathe.' },
      { name: `${data.equipment} Smash`, duration: '5 mins', instructions: 'Apply pressure to tight spots.' }
    ];

    return this.prisma.mobilityPlan.create({
      data: {
        userId,
        name: `${data.focus} Routine (${data.duration}m)`,
        routine: mockRoutine as any,
      },
    });
  }

  async getUserPlans(userId: string) {
    return this.prisma.mobilityPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
