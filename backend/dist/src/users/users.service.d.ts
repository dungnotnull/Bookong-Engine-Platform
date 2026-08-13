import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/auth.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        fullName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        fullName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: RegisterDto): Promise<{
        fullName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
