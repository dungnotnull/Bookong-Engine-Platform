const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { AdminService } = require('./src/admin/admin.service');
// Wait, AdminService needs PrismaService which extends PrismaClient
// Better yet, just call prisma directly the same way AdminService does.

async function test() {
  const status = 'PENDING';
  const where = status ? { status } : undefined;

  const [data, total] = await Promise.all([
    prisma.hotel.findMany({
      where,
      include: {
        host: { select: { email: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
    }),
    prisma.hotel.count({ where })
  ]);
  console.log("PENDING:", JSON.stringify(data, null, 2));

  const whereAll = undefined;
  const [dataAll, totalAll] = await Promise.all([
    prisma.hotel.findMany({
      where: whereAll,
      include: {
        host: { select: { email: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
    }),
    prisma.hotel.count({ where: whereAll })
  ]);
  console.log("ALL:", JSON.stringify(dataAll, null, 2));
}

test().finally(() => prisma.$disconnect());
