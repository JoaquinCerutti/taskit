'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/authService';
import Image from 'next/image';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    documento: '',
    direccion: '',
    emailCorporativo: '',
    genero: '',
    telefono: '',
    rol: '',
  });

  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    try {
      await register(form.email, form.username, form.password);
      alert('Usuario creado con éxito');
      router.push('/login');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-sm p-6 hidden md:flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <Image
            src="/imgs/holiday-logo.png"
            alt="Holiday Inn Logo"
            width={140}
            height={50}
          />
          <span className="text-2xl text-gray-600 cursor-pointer">☰</span>
        </div>
        <div className="flex flex-col gap-2">
          {['Dashboard', 'Novedades', 'Tickets', 'Stock e Inventario', 'Staff'].map((item, idx) => (
            <button
              key={idx}
              className="w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:shadow hover:bg-gray-100 transition"
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-10">
        <div className="mb-6">
          <button className="text-blue-600 text-sm mb-2">{'< Volver'}</button>
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
                  <span className="text-4xl text-gray-400">📷</span>
                )}
              </div>
              <input
                type="file"
                id="foto"
                accept="image/png, image/jpeg"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 text-center mt-4">Formatos permitidos<br />JPG, JPEG y PNG</p>
            <p className="text-sm text-gray-500 text-center">Tamaño máximo permitido<br />2MB</p>
          </div>

          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                name="nombre"
                onChange={handleChange}
                placeholder="Ingresar nombre"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input
                name="apellido"
                onChange={handleChange}
                placeholder="Ingresar apellido"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Documento</label>
              <input
                name="documento"
                onChange={handleChange}
                placeholder="Ingresar documento"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <input
                name="direccion"
                onChange={handleChange}
                placeholder="Ingresar dirección"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email personal</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="Email personal"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email corporativo</label>
              <input
                name="emailCorporativo"
                type="email"
                onChange={handleChange}
                placeholder="Email corporativo"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                name="telefono"
                onChange={handleChange}
                placeholder="Ingresar teléfono"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Género</label>
              <select
                name="genero"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Usuario</label>
              <input
                name="username"
                onChange={handleChange}
                placeholder="Ingresar usuario"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="Ingresar contraseña"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
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
            </div>
          </div>
        </form>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition"
          >
            Crear usuario
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-medium transition"
          >
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
}
