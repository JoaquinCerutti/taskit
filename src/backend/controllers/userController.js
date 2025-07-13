import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ id: newUser.id, email, username });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};
