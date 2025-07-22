-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('HOMBRE', 'MUJER', 'OTRO');

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" BIGINT,
    "genero" "Gender" NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email_corporativo" TEXT NOT NULL,
    "email_personal" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "verification_token_expires" TIMESTAMP(3),
    "reset_token" TEXT,
    "reset_token_expires" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id_sesion" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fec_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fec_fin" TIMESTAMP(3),
    "token" TEXT NOT NULL,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "rol_usuario" (
    "id_rol_usuario" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fec_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fec_fin" TIMESTAMP(3),
    "id_usuario_crea" INTEGER NOT NULL,
    "id_usuario_modif" INTEGER,
    "fec_modif" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rol_usuario_pkey" PRIMARY KEY ("id_rol_usuario")
);

-- CreateTable
CREATE TABLE "prioridades_ticket" (
    "id_prioridad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "prioridades_ticket_pkey" PRIMARY KEY ("id_prioridad")
);

-- CreateTable
CREATE TABLE "estados_ticket" (
    "id_estado_ticket" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estados_ticket_pkey" PRIMARY KEY ("id_estado_ticket")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id_ticket" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_usuario_creador" INTEGER NOT NULL,
    "id_usuario_asignado" INTEGER,
    "id_prioridad" INTEGER NOT NULL,
    "id_tipo_ticket" INTEGER,
    "fec_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario_modificacion" INTEGER,
    "fec_modif" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id_ticket")
);

-- CreateTable
CREATE TABLE "historiales_ticket" (
    "id_historial_ticket" SERIAL NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "id_estado_tk" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "comentario" TEXT,
    "fec_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historiales_ticket_pkey" PRIMARY KEY ("id_historial_ticket")
);

-- CreateTable
CREATE TABLE "mensajes_ticket" (
    "id_mensaje" SERIAL NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "cuerpo_msj" TEXT NOT NULL,
    "id_usuario_crea" INTEGER NOT NULL,
    "fec_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_ticket_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id_unidad" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id_unidad")
);

-- CreateTable
CREATE TABLE "insumos" (
    "id_insumo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_unidad" INTEGER NOT NULL,

    CONSTRAINT "insumos_pkey" PRIMARY KEY ("id_insumo")
);

-- CreateTable
CREATE TABLE "insumos_x_ticket" (
    "id_insumo_x_ticket" SERIAL NOT NULL,
    "id_insumo" INTEGER NOT NULL,
    "id_ticket" INTEGER NOT NULL,
    "id_usuario_modificacion" INTEGER NOT NULL,
    "fec_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insumos_x_ticket_pkey" PRIMARY KEY ("id_insumo_x_ticket")
);

-- CreateTable
CREATE TABLE "novedades" (
    "id_novedad" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_usuario_creador" INTEGER NOT NULL,
    "fec_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario_modificacion" INTEGER,
    "fec_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "novedades_pkey" PRIMARY KEY ("id_novedad")
);

-- CreateTable
CREATE TABLE "mensajes_novedad" (
    "id_mensaje" SERIAL NOT NULL,
    "id_novedad" INTEGER NOT NULL,
    "cuerpo_msj" TEXT NOT NULL,
    "id_sesion_crea" INTEGER NOT NULL,
    "fec_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_novedad_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateTable
CREATE TABLE "tipos_archivo" (
    "id_tipo_archivo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "tipos_archivo_pkey" PRIMARY KEY ("id_tipo_archivo")
);

-- CreateTable
CREATE TABLE "archivos" (
    "id_archivo" SERIAL NOT NULL,
    "id_ticket" INTEGER,
    "id_novedad" INTEGER,
    "nombre" TEXT NOT NULL,
    "ruta" TEXT NOT NULL,
    "descripcion" TEXT,
    "id_tipo_archivo" INTEGER NOT NULL,
    "fec_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id_archivo")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_rol_key" ON "roles"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_corporativo_key" ON "usuarios"("email_corporativo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_token_key" ON "sesiones"("token");

-- CreateIndex
CREATE UNIQUE INDEX "prioridades_ticket_nombre_key" ON "prioridades_ticket"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estados_ticket_nombre_key" ON "estados_ticket"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_archivo_nombre_key" ON "tipos_archivo"("nombre");

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "rol_usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "rol_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "rol_usuario_id_usuario_crea_fkey" FOREIGN KEY ("id_usuario_crea") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "rol_usuario_id_usuario_modif_fkey" FOREIGN KEY ("id_usuario_modif") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_usuario_creador_fkey" FOREIGN KEY ("id_usuario_creador") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_usuario_asignado_fkey" FOREIGN KEY ("id_usuario_asignado") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_usuario_modificacion_fkey" FOREIGN KEY ("id_usuario_modificacion") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_prioridad_fkey" FOREIGN KEY ("id_prioridad") REFERENCES "prioridades_ticket"("id_prioridad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiales_ticket" ADD CONSTRAINT "historiales_ticket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiales_ticket" ADD CONSTRAINT "historiales_ticket_id_estado_tk_fkey" FOREIGN KEY ("id_estado_tk") REFERENCES "estados_ticket"("id_estado_ticket") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiales_ticket" ADD CONSTRAINT "historiales_ticket_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_ticket" ADD CONSTRAINT "mensajes_ticket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_ticket" ADD CONSTRAINT "mensajes_ticket_id_usuario_crea_fkey" FOREIGN KEY ("id_usuario_crea") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insumos" ADD CONSTRAINT "insumos_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades"("id_unidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insumos_x_ticket" ADD CONSTRAINT "insumos_x_ticket_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "insumos"("id_insumo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insumos_x_ticket" ADD CONSTRAINT "insumos_x_ticket_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insumos_x_ticket" ADD CONSTRAINT "insumos_x_ticket_id_usuario_modificacion_fkey" FOREIGN KEY ("id_usuario_modificacion") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_id_usuario_creador_fkey" FOREIGN KEY ("id_usuario_creador") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_id_usuario_modificacion_fkey" FOREIGN KEY ("id_usuario_modificacion") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_novedad" ADD CONSTRAINT "mensajes_novedad_id_novedad_fkey" FOREIGN KEY ("id_novedad") REFERENCES "novedades"("id_novedad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_novedad" ADD CONSTRAINT "mensajes_novedad_id_sesion_crea_fkey" FOREIGN KEY ("id_sesion_crea") REFERENCES "sesiones"("id_sesion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets"("id_ticket") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_id_novedad_fkey" FOREIGN KEY ("id_novedad") REFERENCES "novedades"("id_novedad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_id_tipo_archivo_fkey" FOREIGN KEY ("id_tipo_archivo") REFERENCES "tipos_archivo"("id_tipo_archivo") ON DELETE RESTRICT ON UPDATE CASCADE;
