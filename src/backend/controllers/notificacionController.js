import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// Obtener notificaciones del usuario logueado
export const getNotificacionesUsuario = async (req, res) => {
  try {
    const idUsuario = req.user?.idUsuario;
    if (!idUsuario) return res.status(401).json({ error: 'Usuario no autenticado' });

    const notificaciones = await prisma.notificacion.findMany({
      where: { idUsuario },
      orderBy: { fecha: 'desc' },
    });

    res.json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};


// Marcar notificación como leída
export const marcarComoLeida = async (req, res) => {
  try {
    const idNotificacion = parseInt(req.params.id);

    const notificacion = await prisma.notificacion.update({
      where: { idNotificacion },
      data: { leido: true },
    });

    res.json(notificacion);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
};


// Marcar todas como leídas (opcional)
export const marcarTodasComoLeidas = async (req, res) => {
  try {
    const idUsuario = req.user?.idUsuario;
    if (!idUsuario) return res.status(401).json({ error: 'Usuario no autenticado' });

    await prisma.notificacion.updateMany({
      where: {
        idUsuario,
        leido: false,
      },
      data: { leido: true },
    });

    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    res.status(500).json({ error: 'Error al actualizar notificaciones' });
  }
};
