'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/authService';
import Image from 'next/image';
import { Camera } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    documento: '',
    direccion: '',
    emailCorporativo: '',
    emailPersonal: '',
    genero: '',
    telefono: '',
    rol: '',
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert('El archivo supera los 2MB o no es válido.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones
    if (!form.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!form.documento) newErrors.documento = 'El documento es obligatorio';
    else if (!/^\d{7,8}$/.test(form.documento)) newErrors.documento = 'Debe tener 7 u 8 dígitos';
    if (!form.direccion) newErrors.direccion = 'La dirección es obligatoria';
    if (!form.telefono) newErrors.telefono = 'El teléfono es obligatorio';
    else if (!/^[0-9()+\s-]{7,15}$/.test(form.telefono)) newErrors.telefono = 'Formato inválido';
    if (!form.emailCorporativo) newErrors.emailCorporativo = 'El email corporativo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.emailCorporativo)) newErrors.emailCorporativo = 'Email inválido';
    if (!form.emailPersonal) newErrors.emailPersonal = 'El email personal es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.emailPersonal)) newErrors.emailPersonal = 'Email inválido';
    if (!form.username) newErrors.username = 'El nombre de usuario es obligatorio';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria';
    else if (form.password.length < 8) newErrors.password = 'Debe tener al menos 8 caracteres';
    if (!form.genero) newErrors.genero = 'Seleccioná un género';
    if (!form.rol) newErrors.rol = 'Seleccioná un rol';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(form);
      alert('Usuario creado con éxito');
      router.push('/login');
    } catch (err) {
      if (err?.response?.data?.errors) {
  const backendErrors = {};
  err.response.data.errors.forEach((e) => {
    const campo = e.param === 'email_corporativo' ? 'emailCorporativo'
                : e.param === 'username' ? 'username'
                : e.param;
    backendErrors[campo] = e.msg;
  });
  setErrors(backendErrors);
} else {
  alert('Error desconocido al registrar');
}

      console.error(err);
    }
  };

  const sidebarRoutes = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Novedades', path: '/novedades' },
    { label: 'Tickets', path: '/mantenimiento' },
    { label: 'Stock e Inventario', path: '/inventario' },
    { label: 'Staff', path: '/usuarios' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white shadow-sm p-6 hidden md:flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <Image src="/imgs/holiday-logo.png" alt="Holiday Inn Logo" width={140} height={50} />
          <span className="text-2xl text-gray-600 cursor-pointer">☰</span>
        </div>
        <div className="flex flex-col gap-2">
          {sidebarRoutes.map(({ label, path }, idx) => (
            <button
              key={idx}
              onClick={() => router.push(path)}
              className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:shadow hover:bg-gray-100 transition"
            >
              {label}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="mb-6">
          <button onClick={() => router.back()} className="text-blue-600 text-sm mb-2">
            {'< Volver'}
          </button>
          <h1 className="text-2xl font-bold">Nuevo Usuario</h1>
          <p className="text-sm text-gray-500">Ingrese los datos para crear un nuevo usuario</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col lg:flex-row gap-6">
          {/* Subir foto */}
          <div className="flex flex-col items-center w-full lg:w-1/3 border border-gray-200 rounded-lg p-6">
            <label htmlFor="foto" className="cursor-pointer">
              <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <input type="file" id="foto" accept="image/png, image/jpeg" onChange={handlePhotoChange} className="hidden" />
            </label>
            <p className="text-sm text-gray-500 text-center mt-4">Formatos permitidos<br />JPG, JPEG y PNG</p>
            <p className="text-sm text-gray-500 text-center">Tamaño máximo permitido<br />2MB</p>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {[
              { label: 'Nombre', name: 'nombre' },
              { label: 'Apellido', name: 'apellido' },
              { label: 'Documento', name: 'documento' },
              { label: 'Dirección', name: 'direccion' },
              { label: 'Email personal', name: 'emailPersonal', type: 'email' },
              { label: 'Email corporativo', name: 'emailCorporativo', type: 'email' },
              { label: 'Teléfono', name: 'telefono' },
              { label: 'Usuario', name: 'username' },
              { label: 'Contraseña', name: 'password', type: 'password' },
            ].map(({ label, name, type = 'text' }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  name={name}
                  type={type}
                  onChange={handleChange}
                  placeholder={`Ingresar ${label.toLowerCase()}`}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
              </div>
            ))}

            {/* Género */}
            <div>
              <label className="block text-sm font-medium mb-1">Género</label>
              <select
                name="genero"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar género</option>
                <option value="HOMBRE">Masculino</option>
                <option value="MUJER">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
              {errors.genero && <p className="text-sm text-red-600 mt-1">{errors.genero}</p>}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                name="rol"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar puesto</option>
                <option value="admin">Administrador</option>
                <option value="gerente">Gerente</option>
                <option value="staff">Staff</option>
              </select>
              {errors.rol && <p className="text-sm text-red-600 mt-1">{errors.rol}</p>}
            </div>
          </div>
        </form>

        <div className="bg-white rounded-xl shadow px-6 pb-6 pt-0 mt-[-24px] flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition"
          >
            Crear usuario
          </button>
          <button
            type="button"
            onClick={() => router.push('/main')}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-medium transition"
          >
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
}
