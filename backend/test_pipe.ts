import { ValidationPipe } from '@nestjs/common';
import { GetHotelsQueryDto } from './src/admin/dto/admin.dto';

async function test() {
  const pipe = new ValidationPipe({ transform: true, whitelist: true });
  
  const value = { page: '1', limit: '10', status: 'PENDING' };
  try {
    const result = await pipe.transform(value, {
      type: 'query',
      metatype: GetHotelsQueryDto,
    });
    console.log('Result:', result);
  } catch(e) {
    console.log('Error:', e.response);
  }
}
test();
