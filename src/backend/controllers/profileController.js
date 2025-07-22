import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  const { idUsuario } = req.user; // viene desde el token

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const {
      password,
      verificationToken,
      verificationTokenExpires,
      resetToken,
      resetTokenExpires,
      ...perfil
    } = usuario;

    return res.json({ user: perfil });
  } catch (error) {
    console.error('Error en getProfile:', error);
    return res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
