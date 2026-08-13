-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "imageUrl" TEXT;
