/*
  Warnings:

  - Added the required column `id_categoria` to the `insumos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "insumos" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "id_categoria" INTEGER NOT NULL,
ADD COLUMN     "precio_unitario" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "categorias_insumo" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categorias_insumo_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_insumo_nombre_key" ON "categorias_insumo"("nombre");

-- AddForeignKey
ALTER TABLE "insumos" ADD CONSTRAINT "insumos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_insumo"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;
