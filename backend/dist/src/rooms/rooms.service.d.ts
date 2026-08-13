import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
export declare class RoomsService {
    private readonly prisma;
    private readonly vectorService;
    constructor(prisma: PrismaService, vectorService: VectorService);
    create(hotelId: string, hostId: string, role: string, data: CreateRoomDto): Promise<{
        roomAmenities: ({
            amenity: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                icon: string | null;
            };
        } & {
            amenityId: string;
            roomId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hotelId: string;
        type: string;
        basePrice: number;
        capacity: number;
        quantity: number;
    }>;
    findAllInHotel(hotelId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hotelId: string;
        type: string;
        basePrice: number;
        capacity: number;
        quantity: number;
    }[]>;
    findOne(id: string): Promise<{
        roomAmenities: ({
            amenity: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                icon: string | null;
            };
        } & {
            amenityId: string;
            roomId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hotelId: string;
        type: string;
        basePrice: number;
        capacity: number;
        quantity: number;
    }>;
    update(id: string, hostId: string, role: string, data: UpdateRoomDto): Promise<{
        roomAmenities: ({
            amenity: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                icon: string | null;
            };
        } & {
            amenityId: string;
            roomId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hotelId: string;
        type: string;
        basePrice: number;
        capacity: number;
        quantity: number;
    }>;
    remove(id: string, hostId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hotelId: string;
        type: string;
        basePrice: number;
        capacity: number;
        quantity: number;
    }>;
    syncVector(roomId: string): Promise<void>;
}
