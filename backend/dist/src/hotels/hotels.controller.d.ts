import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';
export declare class HotelsController {
    private readonly hotelsService;
    constructor(hotelsService: HotelsService);
    create(req: any, createHotelDto: CreateHotelDto): Promise<{
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
        hostId: string;
    }>;
    findMyHotels(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        hostId: string;
    }[]>;
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
        hostId: string;
    }>;
    update(id: string, req: any, updateHotelDto: UpdateHotelDto): Promise<{
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
        hostId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        address: string;
        city: string;
        country: string;
        starRating: number;
        hostId: string;
    }>;
}
