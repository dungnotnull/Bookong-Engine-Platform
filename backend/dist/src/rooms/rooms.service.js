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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const vector_service_1 = require("../vector/vector.service");
let RoomsService = class RoomsService {
    prisma;
    vectorService;
    constructor(prisma, vectorService) {
        this.prisma = prisma;
        this.vectorService = vectorService;
    }
    async create(hotelId, hostId, role, data) {
        const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel)
            throw new common_1.NotFoundException('Hotel not found');
        if (role !== 'ADMIN' && hotel.hostId !== hostId) {
            throw new common_1.ForbiddenException('You can only add rooms to your own hotel');
        }
        const { amenities, ...roomData } = data;
        const room = await this.prisma.room.create({
            data: {
                ...roomData,
                hotelId,
                roomAmenities: amenities ? {
                    create: amenities.map(id => ({ amenityId: id }))
                } : undefined
            },
            include: { roomAmenities: { include: { amenity: true } } }
        });
        await this.syncVector(room.id);
        return room;
    }
    async findAllInHotel(hotelId) {
        return this.prisma.room.findMany({ where: { hotelId } });
    }
    async findOne(id) {
        const room = await this.prisma.room.findUnique({
            where: { id },
            include: { roomAmenities: { include: { amenity: true } } }
        });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
    async update(id, hostId, role, data) {
        const room = await this.findOne(id);
        const hotel = await this.prisma.hotel.findUnique({ where: { id: room.hotelId } });
        if (role !== 'ADMIN' && hotel?.hostId !== hostId) {
            throw new common_1.ForbiddenException('You can only update rooms in your own hotel');
        }
        const { amenities, ...roomData } = data;
        const updatedRoom = await this.prisma.room.update({
            where: { id },
            data: {
                ...roomData,
                roomAmenities: amenities ? {
                    deleteMany: {},
                    create: amenities.map(amId => ({ amenityId: amId }))
                } : undefined
            },
            include: { roomAmenities: { include: { amenity: true } } }
        });
        await this.syncVector(updatedRoom.id);
        return updatedRoom;
    }
    async remove(id, hostId, role) {
        const room = await this.findOne(id);
        const hotel = await this.prisma.hotel.findUnique({ where: { id: room.hotelId } });
        if (role !== 'ADMIN' && hotel?.hostId !== hostId) {
            throw new common_1.ForbiddenException('You can only delete rooms in your own hotel');
        }
        return this.prisma.room.delete({ where: { id } });
    }
    async syncVector(roomId) {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: { roomAmenities: { include: { amenity: true } } }
        });
        if (!room)
            return;
        const amenityNames = room.roomAmenities.map(ha => ha.amenity.name).join(' ');
        const textToEmbed = `${room.name} ${room.type} ${amenityNames}`.trim();
        if (!textToEmbed)
            return;
        const vector = await this.vectorService.getEmbedding(textToEmbed);
        const vectorStr = `[${vector.join(',')}]`;
        await this.prisma.$executeRaw `UPDATE "Room" SET "searchVector" = ${vectorStr}::vector WHERE id = ${room.id}`;
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vector_service_1.VectorService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map