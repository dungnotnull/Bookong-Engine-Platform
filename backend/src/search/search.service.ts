import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { SearchQueryDto } from './dto/search.dto';
import { buildPaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorService: VectorService,
  ) {}

  async search(query: SearchQueryDto) {
    const { checkIn, checkOut, guests, minPrice, maxPrice, q, page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;
    let vectorOrderBy = '';
    let vectorScore = '0 AS score';
    let qFilter = '';
    const checkInDate = (checkIn ? new Date(checkIn) : new Date(new Date().setHours(14,0,0,0))).toISOString();
    const checkOutDate = (checkOut ? new Date(checkOut) : new Date(new Date().setDate(new Date().getDate() + 1))).toISOString();
    const params: any[] = [checkInDate, checkOutDate, guests || 1];

    if (q) {
      try {
        const vector = await this.vectorService.getEmbedding(q);
        const vectorStr = `[${vector.join(',')}]`;
        // Use pgvector cosine distance `<=>` or L2 `<->`
        vectorOrderBy = `ORDER BY h."searchVector" <-> '${vectorStr}'::vector ASC`;
        vectorScore = `1 - (h."searchVector" <=> '${vectorStr}'::vector) AS score`;
      } catch (err) {
        // Fallback if vector service is down
        params.push(`%${q}%`);
        qFilter = `AND (h.name ILIKE $${params.length} OR h.city ILIKE $${params.length} OR h.address ILIKE $${params.length} OR h.country ILIKE $${params.length})`;
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
        SELECT r.id, r."hotelId", r.name, r.type, r."basePrice", r.capacity, r.quantity,
               (r.quantity - COALESCE(b.booked_count, 0)) AS available_quantity
        FROM "Room" r
        LEFT JOIN (
          SELECT "roomId", COUNT(id) as booked_count
          FROM "Booking"
          WHERE status IN ('CONFIRMED', 'PENDING_PAYMENT')
            AND "checkIn" < $2::timestamp
            AND "checkOut" > $1::timestamp
          GROUP BY "roomId"
        ) b ON r.id = b."roomId"
        WHERE r.capacity >= $3
          ${minPriceFilter}
          ${maxPriceFilter}
          AND (r.quantity - COALESCE(b.booked_count, 0)) > 0
      )
    `;

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
    `;

    const [results, countResult] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(rawSql, ...params),
      this.prisma.$queryRawUnsafe<any[]>(countSql, ...params)
    ]);

    const total = countResult[0]?.total || 0;
    
    return {
      data: results,
      meta: buildPaginationMeta(total, page, limit)
    };
  }
}
