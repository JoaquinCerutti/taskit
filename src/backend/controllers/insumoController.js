import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear insumo
export const createInsumo = async (req, res) => {
  try {
    const { nombre, cantidad, precioUnitario, idUnidad, idCategoria, stockMinimo } = req.body;


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
        stockMinimo: parseInt(stockMinimo) || 0,

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
    const { nombre, cantidad, precioUnitario, descripcion, idUnidad, idCategoria, stockMinimo } = req.body;


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
        stockMinimo: parseInt(stockMinimo) || 0,

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

// Dar de baja (marcar como inactivo) un insumo
export const darDeBajaInsumo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const insumo = await prisma.insumo.update({
      where: { idInsumo: id },
      data: { activo: false },
    });

    res.json({ mensaje: 'Insumo dado de baja correctamente', insumo });
  } catch (error) {
    console.error('Error al dar de baja insumo:', error);
    res.status(500).json({ error: 'Error al dar de baja el insumo' });
  }
};

export const darDeAltaInsumo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const insumo = await prisma.insumo.update({
      where: { idInsumo: id },
      data: { activo: true },
    });

    res.json({ mensaje: 'Insumo dado de alta correctamente', insumo });
  } catch (error) {
    console.error('Error al dar de alta insumo:', error);
    res.status(500).json({ error: 'Error al dar de alta el insumo' });
  }
};

export const actualizarStockMasivo = async (req, res) => {
 console.log('Body recibido:', JSON.stringify(req.body, null, 2));
  const { cambios } = req.body;
 
  // Validación básica del contenedor
  if (!Array.isArray(cambios) || cambios.length === 0) {
    return res.status(400).json({ error: 'El body debe ser { cambios: [{ idInsumo, cantidad }, ...] } y no puede estar vacío.' });
  }

  // Normalizamos y validamos cada ítem
  const normalizados = cambios.map((c, idx) => {
    const id = Number(c?.idInsumo);
    const qty = Number(c?.cantidad);
    return { idx, idInsumo: id, cantidad: qty };
  });

  const invalidos = normalizados.filter(x =>
    !Number.isInteger(x.idInsumo) || !Number.isFinite(x.cantidad) || x.cantidad <= 0
  );

  if (invalidos.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos en uno o más elementos.',
      detalle: invalidos.map(x => ({
        index: x.idx,
        idInsumo: x.idInsumo,
        cantidad: x.cantidad,
        motivo: 'idInsumo debe ser entero y cantidad debe ser > 0'
      }))
    });
  }

  try {
    // Verificamos existencia/activo de todos los insumos primero
    const ids = normalizados.map(x => x.idInsumo);
    const existentes = await prisma.insumo.findMany({
      where: { idInsumo: { in: ids } },
      select: { idInsumo: true, activo: true }
    });

    const mapa = new Map(existentes.map(i => [i.idInsumo, i]));
    const faltantes = normalizados.filter(x => !mapa.has(x.idInsumo));
    const inactivos = normalizados.filter(x => mapa.get(x.idInsumo) && !mapa.get(x.idInsumo).activo);

    if (faltantes.length || inactivos.length) {
      return res.status(400).json({
        error: 'Algunos insumos no existen o están inactivos.',
        faltantes: faltantes.map(f => f.idInsumo),
        inactivos: inactivos.map(i => i.idInsumo),
      });
    }

    // Actualizamos en transacción usando increment
    const operaciones = normalizados.map(x =>
      prisma.insumo.update({
        where: { idInsumo: x.idInsumo },
        data: { cantidad: { increment: x.cantidad } }
      })
    );

    const resultados = await prisma.$transaction(operaciones);

    return res.status(200).json({ mensaje: 'Stock actualizado', resultados });
  } catch (error) {
    console.error('Error al actualizar stock masivo:', error);
    return res.status(500).json({ error: 'Error al procesar la actualización masiva' });
  }
};
