import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { SearchQueryDto } from './dto/search.dto';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { calculateDynamicNightlyPrice } from '../common/utils/pricing.util';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorService: VectorService,
  ) {}

  async search(query: SearchQueryDto) {
    const { checkIn, checkOut, guests, minPrice, maxPrice, starRating, amenities, page = 1, limit = 10 } = query;
    const q = query.q || query.location;
    const offset = (page - 1) * limit;
    let vectorOrderBy = '';
    let vectorScore = '0 AS score';
    let qFilter = '';
    const ci = checkIn ? new Date(checkIn) : new Date(new Date().setHours(14,0,0,0));
    ci.setHours(14, 0, 0, 0);
    const checkInDate = ci.toISOString();

    const co = checkOut ? new Date(checkOut) : new Date(new Date().setDate(new Date().getDate() + 1));
    co.setHours(12, 0, 0, 0);
    const checkOutDate = co.toISOString();

    const params: any[] = [checkInDate, checkOutDate, guests || 1];

    if (q) {
      params.push(`%${q}%`);
      const qIndex = params.length;

      try {
        const vector = await this.vectorService.getEmbedding(q);
        const vectorStr = `[${vector.join(',')}]`;
        
        vectorScore = `MAX(GREATEST(
          COALESCE(1 - (h."searchVector" <=> '${vectorStr}'::vector), 0),
          COALESCE(1 - (ar."searchVector" <=> '${vectorStr}'::vector), 0),
          CASE WHEN h.city ILIKE $${qIndex} OR h.name ILIKE $${qIndex} OR h.address ILIKE $${qIndex} THEN 1.0 ELSE 0.0 END
        )) AS score`;
        
        vectorOrderBy = `ORDER BY score DESC`;
        
        qFilter = `AND (
          h.city ILIKE $${qIndex} 
          OR h.name ILIKE $${qIndex} 
          OR h.address ILIKE $${qIndex}
          OR (1 - (h."searchVector" <=> '${vectorStr}'::vector)) > 0.35
          OR EXISTS (
            SELECT 1 FROM "Room" r 
            WHERE r."hotelId" = h.id 
              AND r."isActive" = true 
              AND (1 - (r."searchVector" <=> '${vectorStr}'::vector)) > 0.35
          )
        )`;
      } catch (err) {
        vectorOrderBy = ``;
        vectorScore = `0 AS score`;
        qFilter = `AND (h.name ILIKE $${qIndex} OR h.city ILIKE $${qIndex} OR h.address ILIKE $${qIndex} OR h.country ILIKE $${qIndex})`;
      }
    }

    const minPriceFilter = minPrice ? `AND r."basePrice" >= ${minPrice}` : '';
    const maxPriceFilter = maxPrice ? `AND r."basePrice" <= ${maxPrice}` : '';

    const now = new Date();
    const defaultCheckIn = new Date(now);
    defaultCheckIn.setHours(14, 0, 0, 0);
    // Date calculation moved up


    const baseSql = `
      WITH AvailableRooms AS (
        SELECT r.id, r."hotelId", r.name, r.type, r."basePrice", r.capacity, r.quantity, r."searchVector",
               (r.quantity - COALESCE(b.booked_count, 0)) AS available_quantity
        FROM "Room" r
        LEFT JOIN (
          SELECT "roomId", COALESCE(SUM("roomQuantity"), 0) as booked_count
          FROM "Booking"
          WHERE status IN ('CONFIRMED', 'PENDING_PAYMENT', 'CHECKED_IN')
            AND "checkIn" < $2::timestamp
            AND "checkOut" > $1::timestamp
          GROUP BY "roomId"
        ) b ON r.id = b."roomId"
        WHERE r.capacity >= $3
          ${minPriceFilter}
          ${maxPriceFilter}
          AND r."isActive" = true
          AND (r.quantity - COALESCE(b.booked_count, 0)) > 0
      )
    `;

    const starRatingFilter = starRating ? `AND h."starRating" >= ${starRating}` : '';
    let amenitiesFilter = '';
    if (amenities) {
      const amenityList = amenities.split(',').map(a => `'${a.trim()}'`).filter(a => a !== "''").join(',');
      if (amenityList) {
        const requiredCount = amenities.split(',').filter(a => a.trim() !== '').length;
        amenitiesFilter = `
          AND h.id IN (
            SELECT hotelId FROM (
              SELECT ha."hotelId" as hotelId, a.name as name
              FROM "HotelAmenity" ha
              INNER JOIN "Amenity" a ON ha."amenityId" = a.id
              WHERE a.name IN (${amenityList})
              
              UNION
              
              SELECT r."hotelId" as hotelId, a.name as name
              FROM "RoomAmenity" ra
              INNER JOIN "Room" r ON ra."roomId" = r.id
              INNER JOIN "Amenity" a ON ra."amenityId" = a.id
              WHERE a.name IN (${amenityList}) AND r."isActive" = true
            ) combined_amenities
            GROUP BY hotelId
            HAVING COUNT(DISTINCT name) >= ${requiredCount}
          )
        `;
      }
    }

    const rawSql = `
      ${baseSql}
      SELECT h.id as "id", h.name as "name", h.address, h.city, h.country, h."starRating",
             ${vectorScore},
             json_agg(
               json_build_object(
                 'id', ar.id,
                 'name', ar.name,
                 'type', ar.type,
                 'basePrice', ar."basePrice",
                 'availableQuantity', ar.available_quantity
               )
             ) as rooms
      FROM "Hotel" h
      INNER JOIN AvailableRooms ar ON h.id = ar."hotelId"
      WHERE h.status = 'APPROVED'
      ${qFilter}
      ${starRatingFilter}
      ${amenitiesFilter}
      GROUP BY h.id, h.name, h.address, h.city, h.country, h."starRating"
      ${vectorOrderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countSql = `
      ${baseSql}
      SELECT COUNT(DISTINCT h.id)::int as total
      FROM "Hotel" h
      INNER JOIN AvailableRooms ar ON h.id = ar."hotelId"
      WHERE h.status = 'APPROVED'
      ${qFilter}
      ${starRatingFilter}
      ${amenitiesFilter}
    `;

    const [results, countResult] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(rawSql, ...params),
      this.prisma.$queryRawUnsafe<any[]>(countSql, ...params)
    ]);

    const total = countResult[0]?.total || 0;
    
    if (results.length > 0) {
      const hotelIds = results.map(r => r.id);
      const pricingRules = await this.prisma.pricingRule.findMany({
        where: { hotelId: { in: hotelIds } }
      });
      
      const checkInParsed = new Date(checkInDate);
      const checkOutParsed = new Date(checkOutDate);

      for (const hotel of results) {
        const rulesForHotel = pricingRules.filter(r => r.hotelId === hotel.id);
        if (rulesForHotel.length > 0 && hotel.rooms && Array.isArray(hotel.rooms)) {
          for (const room of hotel.rooms) {
            if (room.basePrice) {
              room.basePrice = calculateDynamicNightlyPrice(
                room.basePrice,
                rulesForHotel,
                checkInParsed,
                checkOutParsed
              );
            }
          }
        }
      }
    }

    return {
      data: results,
      meta: buildPaginationMeta(total, page, limit)
    };
  }
}
