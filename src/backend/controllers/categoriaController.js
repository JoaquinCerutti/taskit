import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener todas las categorías
export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoriaInsumo.findMany({
      orderBy: { nombre: 'asc' }
    });
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};
