import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../utils/mailer.js';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
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
      password,
      rol // <- lo tomamos del frontend
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const newUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        documento: documento ? BigInt(documento) : null,
        genero,
        direccion,
        telefono,
        emailCorporativo,
        emailPersonal,
        username,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
      },
    });

    // 👇 Buscar el rol por nombre y crear en tabla intermedia
    const rolEncontrado = await prisma.role.findUnique({
      where: { nombreRol: rol }
    });

    if (!rolEncontrado) {
      return res.status(400).json({ error: `Rol "${rol}" no existe` });
    }

    await prisma.rolUsuario.create({
      data: {
        idRol: rolEncontrado.idRol,
        idUsuario: newUsuario.idUsuario,
        idUsuarioCrea: newUsuario.idUsuario // se autocreó
      }
    });

    const {
      password: _pwd,
      verificationToken: _vt,
      verificationTokenExpires: _vte,
      resetToken,
      resetTokenExpires,
      ...perfil
    } = newUsuario;

    const safePerfil = {
      ...perfil,
      documento: perfil.documento ? perfil.documento.toString() : null
    };

    return res.status(201).json({
      message: 'Usuario creado. Revisá tu email corporativo para verificar tu cuenta.',
      user: safePerfil
    });
  } catch (error) {
    console.error('Error en createUser:', error);

    if (error.code === 'P2002') {
      const campoDuplicado = error.meta?.target?.[0];
      let mensaje = 'Ya existe un registro con ese valor';
      if (campoDuplicado === 'email_corporativo') mensaje = 'El email corporativo ya está registrado';
      else if (campoDuplicado === 'username') mensaje = 'El nombre de usuario ya existe';

      return res.status(400).json({ errors: [{ param: campoDuplicado, msg: mensaje }] });
    }

    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};


// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        emailCorporativo: true,
        username: true,
        activo: true,
        rolUsuario: {
          select: {
            rol: {
              select: {
                nombreRol: true
              }
            }
          }
        }
      }
    });

    const usuariosFormateados = usuarios.map(user => ({
      id: user.idUsuario,
      nombre: `${user.nombre} ${user.apellido}`,
      email: user.emailCorporativo,
      username: user.username,
      rol: user.rolUsuario[0]?.rol?.nombreRol || 'Sin rol',
      estado: user.activo ? 'ACTIVO' : 'INACTIVO'
    }));

    res.json(usuariosFormateados);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

//Obtener por id

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.usuario.findUnique({
      where: { idUsuario: parseInt(id) },
      include: {
        rolUsuario: {
          include: { rol: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { password, verificationToken, resetToken, ...rest } = user;

    res.json({
      ...rest,
      documento: rest.documento?.toString() || '',
      rol: user.rolUsuario[0]?.rol?.nombreRol || 'Sin rol'
    });
  } catch (err) {
    console.error('Error en getUserById:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const {
    nombre, apellido, emailPersonal, direccion,
    telefono, genero, activo
  } = req.body;

  try {
    const user = await prisma.usuario.update({
      where: { idUsuario: parseInt(id) },
      data: {
        nombre, apellido, emailPersonal, direccion, telefono,
        genero, activo
      }
    });

    // 🔧 Solución directa: transformar BigInt y limpiar
    const {
      password,
      verificationToken,
      verificationTokenExpires,
      resetToken,
      resetTokenExpires,
      ...rest
    } = user;

    const safeUser = {
      ...rest,
      documento: user.documento ? user.documento.toString() : null
    };

    res.json({
      message: 'Usuario actualizado con éxito',
      user: safeUser
    });

  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

