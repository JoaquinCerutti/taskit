import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear insumo
export const createInsumo = async (req, res) => {
  try {
    const { nombre, cantidad, precioUnitario, idUnidad, idCategoria } = req.body;

    const nuevoInsumo = await prisma.insumo.create({
      data: {
        nombre,
        cantidad,
        precioUnitario,
        unidad: {
          connect: { idUnidad },
        },
        categoria: {
          connect: { idCategoria },
        },
      },
    });

    res.status(201).json(nuevoInsumo);
  } catch (error) {
    console.error('Error al crear insumo:', error);
    res.status(500).json({ error: 'Error al crear insumo' });
  }
};

// Obtener todos los insumos
export const getInsumos = async (req, res) => {
  try {
    const insumos = await prisma.insumo.findMany({
      include: {
        unidad: true,
        categoria: true,
      },
    });
    res.json(insumos);
  } catch (error) {
    console.error('Error al obtener insumos:', error);
    res.status(500).json({ error: 'Error al obtener insumos' });
  }
};

// Obtener insumo por ID (para editar)
export const getInsumoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const insumo = await prisma.insumo.findUnique({
      where: { idInsumo: id },
      include: {
        unidad: true,
        categoria: true,
      },
    });

    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }

    res.json(insumo);
  } catch (error) {
    console.error('Error al obtener insumo:', error);
    res.status(500).json({ error: 'Error al obtener insumo' });
  }
};

// Actualizar insumo
export const updateInsumo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, cantidad, precioUnitario, descripcion, idUnidad, idCategoria } = req.body;

    if (!idUnidad || !idCategoria) {
      return res.status(400).json({ error: 'Unidad y Categoría son obligatorias' });
    }

    const insumoActualizado = await prisma.insumo.update({
      where: { idInsumo: id },
      data: {
        nombre,
        cantidad,
        precioUnitario,
        descripcion,
        unidad: {
          connect: { idUnidad },
        },
        categoria: {
          connect: { idCategoria },
        },
      },
    });

    res.json(insumoActualizado);
  } catch (error) {
    console.error('Error al actualizar insumo:', error);
    res.status(500).json({ error: 'Error al actualizar insumo' });
  }
};

// Eliminar insumo (opcional o para dar de baja)
export const deleteInsumo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.insumo.delete({
      where: { idInsumo: id },
    });
    res.json({ mensaje: 'Insumo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar insumo:', error);
    res.status(500).json({ error: 'Error al eliminar insumo' });
  }
};
