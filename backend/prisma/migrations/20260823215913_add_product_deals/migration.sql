/*
  Warnings:

  - Added the required column `dealExpriresAt` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "dealExpriresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "salePrice" DECIMAL(10,2);
