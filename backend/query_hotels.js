const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true, status: true }
  });
  console.log(hotels);
}
main().finally(() => prisma.$disconnect());
