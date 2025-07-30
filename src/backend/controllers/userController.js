import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../utils/mailer.js';

const prisma = new PrismaClient();

// Crear usuario
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
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

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

    // Buscar el rol por nombre y crear en tabla intermedia
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

    // ✅ Enviar email de verificación
    await sendVerificationEmail(newUsuario.emailCorporativo, verificationToken);

    // Preparar respuesta sin campos sensibles
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
      include: {
        rolUsuario: {
          where: {
            activo: true,
            fecFin: null
          },
          include: {
            rol: true
          }
        }
      }
    });

    const safeUsers = usuarios.map(u => ({
  id: u.idUsuario,
  nombre: `${u.nombre} ${u.apellido}`, // 👈 Agregamos apellido al nombre
  apellido: u.apellido,                // (opcional si no lo usás)
  email: u.emailCorporativo,
  username: u.username,
  estado: u.activo ? 'ACTIVO' : 'INACTIVO',
  rol: u.rolUsuario[0]?.rol?.nombreRol || 'No asignado',
}));


    res.json(safeUsers);
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


// Obtener por id
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.usuario.findUnique({
      where: { idUsuario: parseInt(id) },
      include: {
        rolUsuario: {
          where: {
            activo: true,
            fecFin: null
          },
          include: {
            rol: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const rolActivo = user.rolUsuario[0]?.rol;

    const safeUser = {
      ...user,
      documento: user.documento?.toString(),
      idRol: rolActivo?.idRol || null,
      rol: rolActivo?.nombreRol || 'No asignado',
      rolUsuario: undefined,
      password: undefined,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
      resetToken: undefined,
      resetTokenExpires: undefined
    };

    res.json(safeUser);
  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};




export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const {
    nombre, apellido, emailPersonal, direccion,
    telefono, genero, activo, idRol
  } = req.body;

  try {
    console.log('🛬 PUT recibido. Body:', req.body);

    // 1. Actualizar datos básicos del usuario
    const user = await prisma.usuario.update({
      where: { idUsuario: parseInt(id) },
      data: {
        nombre,
        apellido,
        emailPersonal,
        direccion,
        telefono,
        genero,
        activo
      }
    });

    // 2. Si se envió un nuevo rol, desactivar roles anteriores y asignar el nuevo
    if (idRol) {
      await prisma.rolUsuario.updateMany({
        where: {
          idUsuario: parseInt(id),
          activo: true,
          fecFin: null
        },
        data: {
          activo: false,
          fecFin: new Date()
        }
      });

      await prisma.rolUsuario.create({
        data: {
          idUsuario: parseInt(id),
          idRol: parseInt(idRol),
          idUsuarioCrea: 1 // ⚠️ Reemplazar por ID real del usuario autenticado
        }
      });
    }

    // 3. Buscar el nombre del rol actualizado (si se pasó uno)
    let rolNombre = null;
    if (idRol) {
      const role = await prisma.role.findUnique({
        where: { idRol: parseInt(idRol) }
      });
      rolNombre = role?.nombreRol || 'Desconocido';
    }

    // 4. Preparar respuesta segura sin campos sensibles
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
  idRol: parseInt(idRol), 
  documento: user.documento ? user.documento.toString() : null
};

    res.json({
      message: 'Usuario actualizado con éxito',
      user: safeUser
    });

  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};




export const updateRolUsuario = async (req, res) => {
  const { id } = req.params;
  const { idRol } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: parseInt(id) },
    });

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    await prisma.rolUsuario.updateMany({
      where: {
        idUsuario: parseInt(id),
        fecFin: null
      },
      data: {
        fecFin: new Date(),
        activo: false
      }
    });

    await prisma.rolUsuario.create({
      data: {
        idUsuario: parseInt(id),
        idRol,
        idUsuarioCrea: 1, // TODO: reemplazar con el ID del usuario autenticado que modifica
      }
    });

    res.json({ message: 'Rol actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
};


