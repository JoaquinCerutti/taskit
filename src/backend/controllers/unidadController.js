import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todas las unidades
export const getUnidades = async (req, res) => {
  try {
    const unidades = await prisma.unidades.findMany({
      orderBy: { descripcion: 'asc' },
    });
    res.json(unidades);
  } catch (error) {
    console.error('Error al obtener unidades:', error);
    res.status(500).json({ error: 'Error al obtener unidades' });
  }
};
