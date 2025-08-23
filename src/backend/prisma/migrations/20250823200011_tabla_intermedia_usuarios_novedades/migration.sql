-- CreateTable
CREATE TABLE "novedad_lectura_usuario" (
    "id" SERIAL NOT NULL,
    "id_novedad" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_lectura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "novedad_lectura_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "novedad_lectura_usuario_id_novedad_id_usuario_key" ON "novedad_lectura_usuario"("id_novedad", "id_usuario");

-- AddForeignKey
ALTER TABLE "novedad_lectura_usuario" ADD CONSTRAINT "novedad_lectura_usuario_id_novedad_fkey" FOREIGN KEY ("id_novedad") REFERENCES "novedades"("id_novedad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedad_lectura_usuario" ADD CONSTRAINT "novedad_lectura_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
