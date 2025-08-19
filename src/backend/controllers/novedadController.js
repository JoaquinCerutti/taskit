import prisma from '../prisma/client.js';


// Convierte BigInt a string recursivamente SIN romper Date ni otras clases
function replacerBigInt(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') return obj.toString();

  if (Array.isArray(obj)) {
    return obj.map((x) => replacerBigInt(x));
  }

  if (typeof obj === 'object') {
    // NO tocar Date ni otras instancias (Map, Set, etc.)
    if (obj instanceof Date) return obj;

    // Solo transformar POJOs
    if (obj.constructor === Object) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, replacerBigInt(v)])
      );
    }

    return obj;
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
        categorias: { include: { categoriaNovedad: true } },
        destinatarios: { include: { rol: true } }
      },
      orderBy: { fecCreacion: 'desc' } // 👈 orden inverso
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

    if (!titulo || !descripcion || !idUsuarioCreador) {
      return res.status(400).json({ error: 'titulo, descripcion e idUsuarioCreador son obligatorios.' });
    }

    const catIds = Array.isArray(categoriasIds) ? categoriasIds.map(Number).filter(Number.isFinite) : [];
    const rolIds = Array.isArray(destinatariosIds) ? destinatariosIds.map(Number).filter(Number.isFinite) : [];

    const data = {
      titulo,
      descripcion,
      creador: { connect: { idUsuario: Number(idUsuarioCreador) } },
      ...(catIds.length > 0 && {
        categorias: {
          create: catIds.map(id => ({
            categoriaNovedad: { connect: { idCategoriaNovedad: id } }
          }))
        }
      }),
      ...(rolIds.length > 0 && {
        destinatarios: {
          create: rolIds.map(id => ({
            rol: { connect: { idRol: id } }
          }))
        }
      })
    };

    const nuevaNovedad = await prisma.novedad.create({
      data,
      include: {
        categorias: { include: { categoriaNovedad: true } },
        destinatarios: { include: { rol: true } },
        creador: true
      }
    });
    res.status(201).json(replacerBigInt(nuevaNovedad));
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

    const catIds = Array.isArray(categoriasIds) ? categoriasIds.map(Number).filter(Number.isFinite) : [];
    const rolIds = Array.isArray(destinatariosIds) ? destinatariosIds.map(Number).filter(Number.isFinite) : [];

    // Limpiar pivotes y recrear dentro de una transacción
    const novedadActualizada = await prisma.$transaction(async (tx) => {
      await tx.categoriaNovedadXnovedad.deleteMany({ where: { novedadId: Number(id) } });
      await tx.novedadDestinatarioRol.deleteMany({ where: { novedadId: Number(id) } });

      await tx.novedad.update({
        where: { idNovedad: Number(id) },
        data: {
          ...(titulo !== undefined && { titulo }),
          ...(descripcion !== undefined && { descripcion }),
          ...(idUsuarioModificacion && { modificador: { connect: { idUsuario: Number(idUsuarioModificacion) } } }),
          fecModificacion: new Date()
        }
      });

      if (catIds.length > 0) {
        await tx.categoriaNovedadXnovedad.createMany({
          data: catIds.map(cid => ({ novedadId: Number(id), categoriaNovedadId: cid })),
          skipDuplicates: true
        });
      }

      if (rolIds.length > 0) {
        await tx.novedadDestinatarioRol.createMany({
          data: rolIds.map(rid => ({ novedadId: Number(id), rolId: rid })),
          skipDuplicates: true
        });
      }

      return tx.novedad.findUnique({
        where: { idNovedad: Number(id) },
        include: {
          categorias: { include: { categoriaNovedad: true } },
          destinatarios: { include: { rol: true } },
          creador: true,
          modificador: true
        }
      });
    });

    res.json(replacerBigInt(novedadActualizada));
  } catch (error) {
    console.error('Error al actualizar la novedad:', error);
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

