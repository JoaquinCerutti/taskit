// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roles = ['GERENTE', 'EMPLEADO', 'MANTENIMIENTO'];

  await prisma.role.createMany({
    data: roles.map(nombreRol => ({ nombreRol })),
    skipDuplicates: true  // evita error si ya existen
  });

  console.log('Seed de roles completado');


  await prisma.categoriaInsumo.createMany({
  data: [
    { nombre: 'Plomería' },
    { nombre: 'Electricidad' },
    { nombre: 'Limpieza' },
    { nombre: 'Otros' },
  ],
  skipDuplicates: true,
});

  // Seed de unidades
  const unidades = [
    'Unidad',
    'Gramo',
    'Kilogramo',
    'Litro',
    'Mililitro',
    'Metro',
    'Centímetro',
  ];

  for (const descripcion of unidades) {
    await prisma.unidades.upsert({
      where: { descripcion },
      update: {},
      create: { descripcion },
    });
  }

  console.log('✅ Seed de unidades completado');
}




main()
  .catch(e => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
