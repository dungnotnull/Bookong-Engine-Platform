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
exports.HotelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const vector_service_1 = require("../vector/vector.service");
let HotelsService = class HotelsService {
    prisma;
    vectorService;
    constructor(prisma, vectorService) {
        this.prisma = prisma;
        this.vectorService = vectorService;
    }
    async create(hostId, data) {
        const { amenities, ...hotelData } = data;
        const hotel = await this.prisma.hotel.create({
            data: {
                ...hotelData,
                hostId,
                hotelAmenities: amenities ? {
                    create: amenities.map(id => ({ amenityId: id }))
                } : undefined
            },
            include: { hotelAmenities: { include: { amenity: true } } }
        });
        await this.syncVector(hotel.id);
        return hotel;
    }
    async findAll() {
        return this.prisma.hotel.findMany();
    }
    async findMyHotels(hostId) {
        return this.prisma.hotel.findMany({ where: { hostId } });
    }
    async findOne(id) {
        const hotel = await this.prisma.hotel.findUnique({
            where: { id },
            include: { hotelAmenities: { include: { amenity: true } } }
        });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        return hotel;
    }
    async update(id, hostId, role, data) {
        const hotel = await this.findOne(id);
        if (role !== 'ADMIN' && hotel.hostId !== hostId) {
            throw new common_1.ForbiddenException('You can only update your own hotel');
        }
        const { amenities, ...hotelData } = data;
        const updatedHotel = await this.prisma.hotel.update({
            where: { id },
            data: {
                ...hotelData,
                hotelAmenities: amenities ? {
                    deleteMany: {},
                    create: amenities.map(amId => ({ amenityId: amId }))
                } : undefined
            },
            include: { hotelAmenities: { include: { amenity: true } } }
        });
        await this.syncVector(updatedHotel.id);
        return updatedHotel;
    }
    async remove(id, hostId, role) {
        const hotel = await this.findOne(id);
        if (role !== 'ADMIN' && hotel.hostId !== hostId) {
            throw new common_1.ForbiddenException('You can only delete your own hotel');
        }
        return this.prisma.hotel.delete({ where: { id } });
    }
    async syncVector(hotelId) {
        const hotel = await this.prisma.hotel.findUnique({
            where: { id: hotelId },
            include: { hotelAmenities: { include: { amenity: true } } }
        });
        if (!hotel)
            return;
        const amenityNames = hotel.hotelAmenities.map(ha => ha.amenity.name).join(' ');
        const textToEmbed = `${hotel.name} ${hotel.description || ''} ${amenityNames}`.trim();
        if (!textToEmbed)
            return;
        const vector = await this.vectorService.getEmbedding(textToEmbed);
        const vectorStr = `[${vector.join(',')}]`;
        await this.prisma.$executeRaw `UPDATE "Hotel" SET "searchVector" = ${vectorStr}::vector WHERE id = ${hotel.id}`;
    }
};
exports.HotelsService = HotelsService;
exports.HotelsService = HotelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vector_service_1.VectorService])
], HotelsService);
//# sourceMappingURL=hotels.service.js.map