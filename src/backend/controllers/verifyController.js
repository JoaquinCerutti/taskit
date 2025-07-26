import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verificar email
// Este endpoint verifica el email del usuario usando un token de verificación
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Se requiere un token de verificación' });
  }

  try {
    // 1️ Buscamos al usuario por verificationToken y que no haya expirado
    const usuario = await prisma.usuario.findFirst({
      where: {
        verificationToken: String(token),
        verificationTokenExpires: { gt: new Date() }
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Token inválido o expirado' });
    }

    // 2️ Actualizamos isVerified y limpiamos los campos de token
    await prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    return res.json({ message: 'Email verificado correctamente' });
  } catch (error) {
    console.error('Error al verificar email:', error);
    return res.status(500).json({ error: 'Error al verificar email' });
  }
};
