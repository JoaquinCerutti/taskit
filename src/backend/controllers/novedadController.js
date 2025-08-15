import prisma from '../prisma/client.js';

// Obtener todas las novedades
export const getNovedades = async (req, res) => {
  try {
    const novedades = await prisma.novedad.findMany({
      include: {
        creador: true,
        modificador: true,
        sector: true,
        categoria: true,
        mensajes: true,
        archivos: true,
      },
    });
    res.json(novedades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener novedades' });
  }
};

// Obtener una novedad por ID
export const getNovedadById = async (req, res) => {
  const { id } = req.params;
  try {
    const novedad = await prisma.novedad.findUnique({
      where: { idNovedad: Number(id) },
      include: {
        creador: true,
        modificador: true,
        sector: true,
        categoria: true,
        mensajes: true,
        archivos: true,
      },
    });
    if (!novedad) return res.status(404).json({ error: 'Novedad no encontrada' });
    res.json(novedad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la novedad' });
  }
};

// Crear una novedad
export const createNovedad = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      idUsuarioCreador,
      idSectorDestino,
      idCategoriaNovedad,
    } = req.body;
    const nuevaNovedad = await prisma.novedad.create({
      data: {
        titulo,
        descripcion,
        idUsuarioCreador,
        idSectorDestino,
        idCategoriaNovedad,
      },
    });
    res.status(201).json(nuevaNovedad);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la novedad' });
  }
};

// Actualizar una novedad
export const updateNovedad = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      titulo,
      descripcion,
      idUsuarioModificacion,
      idSectorDestino,
      idCategoriaNovedad,
    } = req.body;
    const novedadActualizada = await prisma.novedad.update({
      where: { idNovedad: Number(id) },
      data: {
        titulo,
        descripcion,
        idUsuarioModificacion,
        idSectorDestino,
        idCategoriaNovedad,
        fecModificacion: new Date(),
      },
    });
    res.json(novedadActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la novedad' });
  }
};

// Eliminar una novedad
export const deleteNovedad = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.novedad.delete({
      where: { idNovedad: Number(id) },
    });
    res.json({ message: 'Novedad eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la novedad' });
  }
};
