// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Roles del sistema
  const roles = ['GERENTE', 'SUPERVISOR', 'EMPLEADO_INTERNO', 'MANTENIMIENTO'];

  await prisma.role.createMany({
    data: roles.map(nombreRol => ({ nombreRol })),
    skipDuplicates: true,  // evita error si ya existen
  });

  console.log('Seed de roles completado');

  // Categorías de insumo
  await prisma.categoriaInsumo.createMany({
    data: [
      { nombre: 'Plomeria' },
      { nombre: 'Electricidad' },
      { nombre: 'Limpieza' },
      { nombre: 'Otros' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed de categorías de insumo completado');

  // Seed de unidades de medida
  const unidades = [
    'Unidad',
    'Gramo',
    'Kilogramo',
    'Litro',
    'Mililitro',
    'Metro',
    'Centimetro',
  ];

  for (const descripcion of unidades) {
    await prisma.unidades.upsert({
      where: { descripcion },
      update: {},
      create: { descripcion },
    });
  }

  console.log('Seed de unidades completado');

  // Seed de categorías de novedad
  const categoriasNovedad = [
    'Urgente',
    'Arribos',
    'Mantenimiento',
    'Housekeeping',
    'Cocina y Bar',
    'Recepcion',
    'Olvidos',
    'RRHH',
  ];

  for (const nombre of categoriasNovedad) {
    await prisma.categoriaNovedad.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  console.log('Seed de categorías de novedad completado');
}

main()
  .catch(e => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
