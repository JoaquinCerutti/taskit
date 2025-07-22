import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../utils/mailer.js';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    // 1️ Recibimos todos los datos de perfil que quieras permitir en el body
    const {
      nombre,
      apellido,
      documento,
      genero,
      direccion,
      telefono,
      emailCorporativo,
      emailPersonal,
      username,
      password
    } = req.body;

    // 2️ Hasheamos la contraseña y generamos token + expiración (24 h)
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    // 3️ Creamos el usuario con prisma.usuario
    const newUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        documento: documento ? BigInt(documento) : null,
        genero,              // Debe ser "HOMBRE" | "MUJER" | "OTRO"
        direccion,
        telefono,
        emailCorporativo,
        emailPersonal,
        username,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires
        // isVerified y activo quedan por defecto (false/true)
      }
    });

    // 4️ Enviamos mail de verificación
    await sendVerificationEmail(emailCorporativo, verificationToken);

    // 5️ Quitamos campos sensibles antes de responder
    const {
      password: _pwd,
      verificationToken: _vt,
      verificationTokenExpires: _vte,
      resetToken,
      resetTokenExpires,
      ...perfil
    } = newUsuario;

    return res.status(201).json({
      message: 'Usuario creado. Revisá tu email corporativo para verificar tu cuenta.',
      user: perfil
    });
  } catch (error) {
    console.error('Error en createUser:', error);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};
