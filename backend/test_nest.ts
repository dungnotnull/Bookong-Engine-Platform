import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AdminService } from './src/admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminService = app.get(AdminService);
  
  const all = await adminService.getHotels({ page: 1, limit: 10 });
  console.log('ALL:', JSON.stringify(all, null, 2));

  const pending = await adminService.getHotels({ page: 1, limit: 10, status: 'PENDING' as any });
  console.log('PENDING:', JSON.stringify(pending, null, 2));

  const approved = await adminService.getHotels({ page: 1, limit: 10, status: 'APPROVED' as any });
  console.log('APPROVED:', JSON.stringify(approved, null, 2));

  await app.close();
}
bootstrap();
