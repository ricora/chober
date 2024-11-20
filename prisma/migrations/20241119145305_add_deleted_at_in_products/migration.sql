/*
  Warnings:

  - A unique constraint covering the columns `[product_name,deleted_at]` on the table `Products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Products_product_name_key";

-- AlterTable
ALTER TABLE "Products" ADD COLUMN "deleted_at" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "Products_product_name_deleted_at_key" ON "Products"("product_name", "deleted_at");
