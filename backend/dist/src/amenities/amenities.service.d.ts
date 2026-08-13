import { PrismaService } from '../prisma/prisma.service';
import { CreateAmenityDto, UpdateAmenityDto } from './dto/amenity.dto';
export declare class AmenitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAmenityDto): Promise<{
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
    update(id: string, data: UpdateAmenityDto): Promise<{
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
