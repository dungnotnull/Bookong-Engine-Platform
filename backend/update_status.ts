import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  
  const hotels = await prisma.hotel.findMany({ take: 10 });
  for (let i = 0; i < hotels.length; i++) {
    let status = 'APPROVED';
    if (i < 3) status = 'PENDING';
    else if (i < 5) status = 'REJECTED';

    await prisma.hotel.update({
      where: { id: hotels[i].id },
      data: { status: status as any }
    });
  }
  console.log('Updated 5 hotels to PENDING/REJECTED');
  await app.close();
}
bootstrap();
