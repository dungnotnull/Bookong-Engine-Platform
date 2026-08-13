-- CreateEnum
CREATE TYPE "HotelStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "status" "HotelStatus" NOT NULL DEFAULT 'PENDING';
