const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const coupons = await prisma.coupon.findMany();
  console.log('--- COUPONS ---');
  console.log(JSON.stringify(coupons, null, 2));
}
main().finally(() => prisma.$disconnect());
