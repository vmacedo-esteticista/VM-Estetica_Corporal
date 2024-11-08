/*
  Warnings:

  - Made the column `createdAt` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date_brith` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `marital_status` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cpf` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `work` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emergency_contact` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "time_service" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "date_brith" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "marital_status" SET NOT NULL,
ALTER COLUMN "cpf" SET NOT NULL,
ALTER COLUMN "work" SET NOT NULL,
ALTER COLUMN "emergency_contact" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);
