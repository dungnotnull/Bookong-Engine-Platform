import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto, UpdateAmenityDto } from './dto/amenity.dto';
export declare class AmenitiesController {
    private readonly amenitiesService;
    constructor(amenitiesService: AmenitiesService);
    create(createAmenityDto: CreateAmenityDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        icon: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        icon: string | null;
    }[]>;
    update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        icon: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        icon: string | null;
    }>;
}
