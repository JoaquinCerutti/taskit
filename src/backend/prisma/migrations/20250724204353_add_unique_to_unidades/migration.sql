/*
  Warnings:

  - A unique constraint covering the columns `[descripcion]` on the table `unidades` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "unidades_descripcion_key" ON "unidades"("descripcion");
