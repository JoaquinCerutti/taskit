import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { sendResetPasswordEmail } from '../utils/mailer.js';

dotenv.config();
const prisma = new PrismaClient();


// Solicitar recuperación de contraseña
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Cambiado a prisma.usuario y búsqueda por emailCorporativo
    const usuario = await prisma.usuario.findUnique({
      where: { emailCorporativo: email }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Email no registrado' });
    }

    // Genera token y expiración
    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    // Actualiza por idUsuario y campos mapeados
    await prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: {
        resetToken,
        resetTokenExpires: expires
      }
    });

    // Envía al emailCorporativo
    await sendResetPasswordEmail(usuario.emailCorporativo, resetToken);

    return res.json({ message: 'Email de recuperación enviado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al solicitar recuperación' });
  }
};


// Actualizar contraseña
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Busca en prisma.usuario usando resetToken y resetTokenExpires
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() }
      }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Hashea la nueva contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Actualiza por idUsuario y limpia los campos de token
    await prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};
