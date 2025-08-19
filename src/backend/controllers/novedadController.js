import prisma from '../prisma/client.js';

// Convierte BigInt a string en todo el objeto
function replacerBigInt(obj) {
  if (Array.isArray(obj)) {
    return obj.map(replacerBigInt);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : replacerBigInt(v)])
    );
  }
  return obj;
}

// Obtener todas las novedades
export const getNovedades = async (req, res) => {
  try {
    const novedades = await prisma.novedad.findMany({
      include: {
        creador: true,
        modificador: true,
        mensajes: true,
        archivos: true,
        categorias: {
          include: { categoriaNovedad: true }
        },
        destinatarios: {
          include: { rol: true }
        }
      },
    });
    res.json(replacerBigInt(novedades));
  } catch (error) {
    console.error('Error en getNovedades:', error);
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
        mensajes: true,
        archivos: true,
        categorias: {
          include: { categoriaNovedad: true }
        },
        destinatarios: {
          include: { rol: true }
        }
      },
    });
    if (!novedad) return res.status(404).json({ error: 'Novedad no encontrada' });
    res.json(replacerBigInt(novedad));
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
      categoriasIds,
      destinatariosIds
    } = req.body;

    const nuevaNovedad = await prisma.novedad.create({
      data: {
        titulo,
        descripcion,
        creador: { connect: { idUsuario: idUsuarioCreador } },
        categorias: {
          create: categoriasIds?.map(id => ({
            categoriaNovedad: { connect: { idCategoriaNovedad: id } }
          }))
        },
        destinatarios: {
          create: destinatariosIds?.map(id => ({
            rol: { connect: { idRol: id } }
          }))
        }
      },
      include: {
        categorias: { include: { categoriaNovedad: true } },
        destinatarios: { include: { rol: true } }
      }
    });
    res.status(201).json(nuevaNovedad);
  } catch (error) {
    console.error('Error al crear novedad:', error);
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
      categoriasIds,
      destinatariosIds
    } = req.body;

    // Primero, elimina las relaciones actuales
    await prisma.categoriaNovedadXnovedad.deleteMany({
      where: { novedadId: Number(id) }
    });
    await prisma.novedadDestinatarioRol.deleteMany({
      where: { novedadId: Number(id) }
    });

    const novedadActualizada = await prisma.novedad.update({
      where: { idNovedad: Number(id) },
      data: {
        titulo,
        descripcion,
        idUsuarioModificacion,
        fecModificacion: new Date(),
        categorias: {
          create: categoriasIds?.map(cid => ({
            categoriaNovedad: { connect: { idCategoriaNovedad: cid } }
          }))
        },
        destinatarios: {
          create: destinatariosIds?.map(rid => ({
            rol: { connect: { idRol: rid } }
          }))
        }
      },
      include: {
        categorias: { include: { categoriaNovedad: true } },
        destinatarios: { include: { rol: true } }
      }
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

// Obtener todas las categorías de novedad
export const getCategoriasNovedad = async (req, res) => {
  try {
    const categorias = await prisma.categoriaNovedad.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías de novedad' });
  }
};

