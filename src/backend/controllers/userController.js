import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../utils/mailer.js';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        verificationToken
      }
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'Usuario creado. Revisá tu email para confirmar tu cuenta.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};
