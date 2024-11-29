-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
