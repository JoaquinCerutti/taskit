import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(404).json({ error: 'Token inválido o expirado' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    res.json({ message: 'Email verificado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar email' });
  }
};
