import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


// Obtener roles
export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { nombreRol: 'asc' }
,
    });
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};
