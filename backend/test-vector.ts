import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const q = 'tôi muốn nơi có sức chứa nhiều người';
  const res = await fetch('http://localhost:8000/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: q })
  });
  const data = await res.json();
  const vectorStr = `[${data.vector.join(',')}]`;
  
  const rooms: any[] = await prisma.$queryRawUnsafe(`
    SELECT id, name, capacity, 
           1 - ("searchVector" <=> $1::vector) as similarity
    FROM "Room"
    ORDER BY similarity DESC
    LIMIT 5
  `, vectorStr);

  const hotels: any[] = await prisma.$queryRawUnsafe(`
    SELECT id, name, 
           1 - ("searchVector" <=> $1::vector) as similarity
    FROM "Hotel"
    ORDER BY similarity DESC
    LIMIT 5
  `, vectorStr);

  console.log('ROOMS:', rooms.map(r => ({ id: r.id, name: r.name, capacity: r.capacity, similarity: r.similarity })));
  console.log('HOTELS:', hotels.map(h => ({ id: h.id, name: h.name, similarity: h.similarity })));
}

run().finally(() => prisma.$disconnect());
