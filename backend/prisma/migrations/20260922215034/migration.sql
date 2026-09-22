/*
  Warnings:

  - You are about to drop the column `dealExpriresAt` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "dealExpriresAt",
ADD COLUMN     "dealExpiresAt" TIMESTAMP(3);
