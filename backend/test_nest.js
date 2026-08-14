const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { AdminService } = require('./dist/admin/admin.service');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminService = app.get(AdminService);
  
  const all = await adminService.getHotels({ page: 1, limit: 10 });
  console.log('ALL:', JSON.stringify(all, null, 2));

  const pending = await adminService.getHotels({ page: 1, limit: 10, status: 'PENDING' });
  console.log('PENDING:', JSON.stringify(pending, null, 2));

  const approved = await adminService.getHotels({ page: 1, limit: 10, status: 'APPROVED' });
  console.log('APPROVED:', JSON.stringify(approved, null, 2));

  await app.close();
}
bootstrap();
