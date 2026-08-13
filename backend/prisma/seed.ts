import { PrismaClient, Role, HotelStatus, BookingStatus, DiscountType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning up existing data...');
  await prisma.booking.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.cancellationPolicy.deleteMany();
  await prisma.roomAmenity.deleteMany();
  await prisma.hotelAmenity.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const hosts: any[] = [];
  for (let i = 0; i < 5; i++) {
    hosts.push(
      await prisma.user.create({
        data: {
          email: faker.internet.email(),
          passwordHash: 'dummy_hash', // In a real app, use bcrypt
          fullName: faker.person.fullName(),
          role: Role.HOST,
        },
      })
    );
  }

  const users: any[] = [];
  for (let i = 0; i < 10; i++) {
    users.push(
      await prisma.user.create({
        data: {
          email: faker.internet.email(),
          passwordHash: 'dummy_hash',
          fullName: faker.person.fullName(),
          role: Role.USER,
        },
      })
    );
  }

  console.log('Seeding Amenities...');
  const amenityNames = [
    { name: 'Free WiFi', icon: 'wifi' },
    { name: 'Swimming Pool', icon: 'pool' },
    { name: 'Air Conditioning', icon: 'ac' },
    { name: 'Free Parking', icon: 'parking' },
    { name: 'Gym', icon: 'gym' },
    { name: 'Breakfast Included', icon: 'restaurant' },
  ];
  const amenities: any[] = [];
  for (const a of amenityNames) {
    amenities.push(
      await prisma.amenity.create({
        data: { name: a.name, icon: a.icon },
      })
    );
  }

  const hotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-c6a4d14c4fe3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c0d5bf8f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80',
  ];

  const roomImages = [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522771731478-446370425e3f?auto=format&fit=crop&w=800&q=80',
  ];

  console.log('Seeding Hotels (50 records)...');
  const hotels: any[] = [];
  for (let i = 0; i < 50; i++) {
    const host = hosts[Math.floor(Math.random() * hosts.length)];
    
    // Select 3 random amenities
    const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
    const selectedAmenities = shuffledAmenities.slice(0, 3);

    const hotel = await prisma.hotel.create({
      data: {
        name: faker.company.name() + ' Hotel',
        description: faker.lorem.paragraphs(2),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        starRating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
        status: HotelStatus.APPROVED,
        hostId: host.id,
        coverImage: hotelImages[Math.floor(Math.random() * hotelImages.length)],
        images: [...hotelImages].sort(() => 0.5 - Math.random()).slice(0, 4),
        hotelAmenities: {
          create: selectedAmenities.map((a) => ({
            amenityId: a.id,
          })),
        },
      },
    });
    hotels.push(hotel);
  }

  console.log('Seeding Rooms and related entities...');
  const rooms: any[] = [];
  for (const hotel of hotels) {
    const roomTypes = ['Standard', 'Deluxe', 'Suite'];
    
    for (let i = 0; i < faker.number.int({ min: 2, max: 4 }); i++) {
      const room = await prisma.room.create({
        data: {
          hotelId: hotel.id,
          name: `${roomTypes[i % roomTypes.length]} Room`,
          type: roomTypes[i % roomTypes.length],
          basePrice: faker.number.float({ min: 50, max: 500, fractionDigits: 0 }),
          capacity: faker.number.int({ min: 1, max: 4 }),
          quantity: faker.number.int({ min: 5, max: 20 }),
          imageUrl: roomImages[Math.floor(Math.random() * roomImages.length)],
        },
      });
      rooms.push(room);
    }

    // Add a Cancellation Policy
    await prisma.cancellationPolicy.create({
      data: {
        hotelId: hotel.id,
        daysBeforeCheckIn: 3,
        penaltyPercentage: 50,
      }
    });

    // Add a Coupon
    await prisma.coupon.create({
      data: {
        code: `DISCOUNT_${hotel.name.substring(0, 3).toUpperCase()}_${faker.string.alphanumeric(4).toUpperCase()}`,
        discountType: DiscountType.PERCENTAGE,
        amount: 10,
        hostId: hotel.hostId,
        expiryDate: faker.date.future(),
        quantity: 100,
      }
    });

    // Add a Pricing Rule
    await prisma.pricingRule.create({
      data: {
        hotelId: hotel.id,
        name: 'Cuối tuần',
        multiplier: 1.2, // Tăng 20%
        dayOfWeek: 6, // Thứ 7
      }
    });
  }

  console.log('Seeding Bookings (50 records)...');
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const checkIn = faker.date.soon({ days: 10 });
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + faker.number.int({ min: 1, max: 5 }));

    await prisma.booking.create({
      data: {
        userId: user.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: faker.number.int({ min: 1, max: room.capacity }),
        totalPrice: room.basePrice * ((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)),
        status: BookingStatus.CONFIRMED,
      }
    });
  }

  console.log('Seeding Wishlists...');
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const hotel = hotels[Math.floor(Math.random() * hotels.length)];
    
    // ignore if already exists
    try {
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          hotelId: hotel.id
        }
      });
    } catch(e) {}
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
