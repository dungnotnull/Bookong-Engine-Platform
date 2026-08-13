import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => void;
export declare class RolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
