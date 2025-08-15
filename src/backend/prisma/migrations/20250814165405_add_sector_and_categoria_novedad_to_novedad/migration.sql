/*
  Warnings:

  - Added the required column `id_categoria_novedad` to the `novedades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_sector_destino` to the `novedades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "novedades" ADD COLUMN     "id_categoria_novedad" INTEGER NOT NULL,
ADD COLUMN     "id_sector_destino" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "sectores" (
    "id_sector" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "sectores_pkey" PRIMARY KEY ("id_sector")
);

-- CreateTable
CREATE TABLE "categorias_novedad" (
    "id_categoria_novedad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categorias_novedad_pkey" PRIMARY KEY ("id_categoria_novedad")
);

-- CreateIndex
CREATE UNIQUE INDEX "sectores_nombre_key" ON "sectores"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_novedad_nombre_key" ON "categorias_novedad"("nombre");

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_id_sector_destino_fkey" FOREIGN KEY ("id_sector_destino") REFERENCES "sectores"("id_sector") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_id_categoria_novedad_fkey" FOREIGN KEY ("id_categoria_novedad") REFERENCES "categorias_novedad"("id_categoria_novedad") ON DELETE RESTRICT ON UPDATE CASCADE;
