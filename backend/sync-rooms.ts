import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const rooms = await prisma.room.findMany({
    include: { roomAmenities: { include: { amenity: true } } }
  });

  console.log(`Found ${rooms.length} rooms to sync.`);

  for (const room of rooms) {
    const amenityNames = room.roomAmenities.map(ha => ha.amenity.name).join(', ');
    const textToEmbed = `${room.name} (${room.type}) - Sức chứa ${room.capacity} người - Tiện nghi: ${amenityNames}`.trim();
    
    if (!textToEmbed) continue;

    try {
      const res = await fetch('http://localhost:8000/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToEmbed })
      });
      if (!res.ok) throw new Error(`Vector service failed with status: ${res.status}`);
      const data = await res.json();
      const vectorStr = `[${data.vector.join(',')}]`;

      await prisma.$executeRawUnsafe(`UPDATE "Room" SET "searchVector" = '${vectorStr}'::vector WHERE id = '${room.id}'`);
      console.log(`Synced ${room.id} (${room.name})`);
    } catch (err) {
      console.error(`Failed to sync ${room.id}:`, err);
    }
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
