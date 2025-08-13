import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;


// Loguear usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Al buscar el usuario para login:
    const user = await prisma.usuario.findUnique({
      where: { emailCorporativo: email },
      include: {
        rolUsuario: {
          where: { activo: true },
          include: { rol: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Debes verificar tu correo electrónico antes de iniciar sesión' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Genera el JWT
    const token = jwt.sign(
  { idUsuario: user.idUsuario, email: user.emailCorporativo },
  SECRET_KEY,
  { expiresIn: '2h' }
);


    // Desestructura para eliminar campos sensibles
    const {
      password: _pwd,
      verificationToken,
      verificationTokenExpires,
      resetToken,
      resetTokenExpires,
      ...perfil
    } = user;

    // Convertimos documento a string si es BigInt
    const safeUser = {
      ...perfil,
      documento: perfil.documento ? perfil.documento.toString() : null,
      rol: user.rolUsuario[0]?.rol?.nombreRol || 'Sin rol'
    };

    // Enviar safeUser en la respuesta:
    return res.json({
      token,
      user: safeUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
