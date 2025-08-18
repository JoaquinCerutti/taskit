/*
  Warnings:

  - You are about to drop the column `id_categoria_novedad` on the `novedades` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "novedades" DROP CONSTRAINT "novedades_id_categoria_novedad_fkey";

-- AlterTable
ALTER TABLE "novedades" DROP COLUMN "id_categoria_novedad";

-- CreateTable
CREATE TABLE "categoria_novedad_x_novedad" (
    "id" SERIAL NOT NULL,
    "id_novedad" INTEGER NOT NULL,
    "id_categoria_novedad" INTEGER NOT NULL,

    CONSTRAINT "categoria_novedad_x_novedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "novedad_destinatario_rol" (
    "id" SERIAL NOT NULL,
    "id_novedad" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "novedad_destinatario_rol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoria_novedad_x_novedad_id_novedad_id_categoria_novedad_key" ON "categoria_novedad_x_novedad"("id_novedad", "id_categoria_novedad");

-- CreateIndex
CREATE UNIQUE INDEX "novedad_destinatario_rol_id_novedad_id_rol_key" ON "novedad_destinatario_rol"("id_novedad", "id_rol");

-- AddForeignKey
ALTER TABLE "categoria_novedad_x_novedad" ADD CONSTRAINT "categoria_novedad_x_novedad_id_novedad_fkey" FOREIGN KEY ("id_novedad") REFERENCES "novedades"("id_novedad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria_novedad_x_novedad" ADD CONSTRAINT "categoria_novedad_x_novedad_id_categoria_novedad_fkey" FOREIGN KEY ("id_categoria_novedad") REFERENCES "categorias_novedad"("id_categoria_novedad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedad_destinatario_rol" ADD CONSTRAINT "novedad_destinatario_rol_id_novedad_fkey" FOREIGN KEY ("id_novedad") REFERENCES "novedades"("id_novedad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedad_destinatario_rol" ADD CONSTRAINT "novedad_destinatario_rol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;
