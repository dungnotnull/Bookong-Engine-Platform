import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(hotelId: string, req: any, createRoomDto: CreateRoomDto): Promise<{
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
    update(id: string, req: any, updateRoomDto: UpdateRoomDto): Promise<{
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
    remove(id: string, req: any): Promise<{
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
}
