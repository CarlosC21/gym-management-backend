import { PrismaClient, Role, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // 1. The Admin
  await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {},
    create: {
      email: 'admin@gym.com',
      password,
      firstName: 'Lead',
      lastName: 'Admin',
      role: Role.ADMIN,
      status: PaymentStatus.PAID,
    },
  });

  // 2. The Paid Member
  await prisma.user.upsert({
    where: { email: 'paid@member.com' },
    update: {},
    create: {
      email: 'paid@member.com',
      password,
      firstName: 'John',
      lastName: 'Paid',
      role: Role.MEMBER,
      status: PaymentStatus.PAID,
    },
  });

  // 3. The Unpaid Member (The one who should be blocked)
  await prisma.user.upsert({
    where: { email: 'unpaid@member.com' },
    update: {},
    create: {
      email: 'unpaid@member.com',
      password,
      firstName: 'Jane',
      lastName: 'Unpaid',
      role: Role.MEMBER,
      status: PaymentStatus.UNPAID,
    },
  });

  console.log('Seed data created successfully:');
  console.log('- admin@gym.com / password123');
  console.log('- paid@member.com / password123');
  console.log('- unpaid@member.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
