"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const vector_service_1 = require("../vector/vector.service");
let SearchService = class SearchService {
    prisma;
    vectorService;
    constructor(prisma, vectorService) {
        this.prisma = prisma;
        this.vectorService = vectorService;
    }
    async search(query) {
        const { checkIn, checkOut, guests, minPrice, maxPrice, q } = query;
        let vectorFilter = '';
        let vectorScore = '0 AS score';
        if (q) {
            try {
                const vector = await this.vectorService.getEmbedding(q);
                const vectorStr = `[${vector.join(',')}]`;
                vectorFilter = `ORDER BY h."searchVector" <-> '${vectorStr}'::vector ASC LIMIT 50`;
                vectorScore = `1 - (h."searchVector" <=> '${vectorStr}'::vector) AS score`;
            }
            catch (err) {
            }
        }
        const minPriceFilter = minPrice ? `AND r."basePrice" >= ${minPrice}` : '';
        const maxPriceFilter = maxPrice ? `AND r."basePrice" <= ${maxPrice}` : '';
        const rawSql = `
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
      SELECT h.id as "hotelId", h.name as "hotelName", h.address, h.city, h.country, h."starRating",
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
      GROUP BY h.id, h.name, h.address, h.city, h.country, h."starRating"
      ${vectorFilter}
    `;
        const checkInDate = new Date(checkIn).toISOString();
        const checkOutDate = new Date(checkOut).toISOString();
        const results = await this.prisma.$queryRawUnsafe(rawSql, checkInDate, checkOutDate, guests);
        return results;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vector_service_1.VectorService])
], SearchService);
//# sourceMappingURL=search.service.js.map