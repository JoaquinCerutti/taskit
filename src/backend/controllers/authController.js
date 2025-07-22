import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { emailCorporativo: email }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    if (!usuario.isVerified) {
      return res.status(403).json({ error: 'Debes verificar tu correo electrónico antes de iniciar sesión' });
    }

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Genera el JWT
    const token = jwt.sign(
      { userId: usuario.idUsuario, email: usuario.emailCorporativo },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    // Desestructura para eliminar solo los campos sensibles
    const {
      password: _pwd,
      verificationToken,
      verificationTokenExpires,
      resetToken,
      resetTokenExpires,
      ...perfil
    } = usuario;

    // Devuelve token + todos los datos de perfil
    return res.json({
      token,
      user: perfil
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
