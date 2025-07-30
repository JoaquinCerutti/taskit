-- DropIndex
DROP INDEX "roles_nombre_rol_key";

-- AlterTable
ALTER TABLE "insumos" ADD COLUMN     "stock_minimo" INTEGER NOT NULL DEFAULT 0;
