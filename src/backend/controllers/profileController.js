import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
