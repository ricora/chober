/*
  Warnings:

  - Added the required column `image` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_Products" ("price", "product_id", "product_name", "stock") SELECT "price", "product_id", "product_name", "stock" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_product_name_key" ON "Products"("product_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
