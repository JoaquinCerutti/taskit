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

// Crear nueva categoría
export const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    const nuevaCategoria = await prisma.categoriaInsumo.create({
      data: { nombre: nombre.trim() }
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};


