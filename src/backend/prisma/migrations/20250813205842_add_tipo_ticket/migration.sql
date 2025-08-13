-- CreateTable
CREATE TABLE "tipos_ticket" (
    "id_tipo_ticket" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "tipos_ticket_pkey" PRIMARY KEY ("id_tipo_ticket")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipos_ticket_nombre_key" ON "tipos_ticket"("nombre");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_tipo_ticket_fkey" FOREIGN KEY ("id_tipo_ticket") REFERENCES "tipos_ticket"("id_tipo_ticket") ON DELETE SET NULL ON UPDATE CASCADE;
