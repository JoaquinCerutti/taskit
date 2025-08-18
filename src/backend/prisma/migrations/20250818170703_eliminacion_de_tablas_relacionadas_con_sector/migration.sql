/*
  Warnings:

  - You are about to drop the column `id_sector_destino` on the `novedades` table. All the data in the column will be lost.
  - You are about to drop the `sectores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "novedades" DROP CONSTRAINT "novedades_id_sector_destino_fkey";

-- AlterTable
ALTER TABLE "novedades" DROP COLUMN "id_sector_destino";

-- DropTable
DROP TABLE "sectores";
