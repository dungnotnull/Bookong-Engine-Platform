const { PrismaClient, HotelStatus } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany({ take: 10 });
  for (let i = 0; i < hotels.length; i++) {
    let status = HotelStatus.APPROVED;
    if (i < 3) status = HotelStatus.PENDING;
    else if (i < 5) status = HotelStatus.REJECTED;

    await prisma.hotel.update({
      where: { id: hotels[i].id },
      data: { status }
    });
  }
  console.log('Updated 5 hotels to PENDING/REJECTED');
}

main().finally(() => prisma.$disconnect());
