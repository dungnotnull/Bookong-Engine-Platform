import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';
export declare class HotelsService {
    private readonly prisma;
    private readonly vectorService;
    constructor(prisma: PrismaService, vectorService: VectorService);
    create(hostId: string, data: CreateHotelDto): Promise<{
        hotelAmenities: ({
            amenity: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                icon: string | null;
            };
        } & {
            amenityId: string;
            hotelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        status: import("@prisma/client").$Enums.HotelStatus;
        hostId: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        status: import("@prisma/client").$Enums.HotelStatus;
        hostId: string;
    }[]>;
    findMyHotels(hostId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        status: import("@prisma/client").$Enums.HotelStatus;
        hostId: string;
    }[]>;
    findOne(id: string): Promise<{
        hotelAmenities: ({
            amenity: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                icon: string | null;
            };
        } & {
            amenityId: string;
            hotelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        status: import("@prisma/client").$Enums.HotelStatus;
        hostId: string;
    }>;
    update(id: string, hostId: string, role: string, data: UpdateHotelDto): Promise<{
        hotelAmenities: ({
            amenity: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                icon: string | null;
            };
        } & {
            amenityId: string;
            hotelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        status: import("@prisma/client").$Enums.HotelStatus;
        hostId: string;
    }>;
    remove(id: string, hostId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        status: import("@prisma/client").$Enums.HotelStatus;
        hostId: string;
    }>;
    syncVector(hotelId: string): Promise<void>;
}
