'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserById, updateUser } from '@/services/userService';
import Image from 'next/image';

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(id);
        setForm(user);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener usuario', err);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(id, form);
      alert('Cambios guardados con éxito');
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#064431] to-[#0FAA7B] text-white font-inter">
        <p className="text-lg">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064431] to-[#0FAA7B] py-12 px-6 text-sm font-inter text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Aside izquierdo con imagen y branding */}
          <div className="bg-[#064431] text-white p-6 md:w-1/3 flex flex-col items-center justify-center">
            <Image src="/imgs/holiday-logo.png" alt="Holiday Inn Logo" width={700} height={110} className="mb-6" />
           
            <p className="mt-6 text-center text-sm opacity-80">Gestión de perfiles</p>
          </div>

          {/* Formulario de edición */}
          <div className="p-8 md:w-2/3 w-full">
            <button
              onClick={() => router.back()}
              className="text-sm text-blue-600 hover:underline mb-4"
            >
              {'< Volver'}
            </button>
            <h1 className="text-xl font-bold mb-6">Editar Usuario</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1">Apellido</label>
                <input name="apellido" value={form.apellido} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1">Email Personal</label>
                <input name="emailPersonal" value={form.emailPersonal || ''} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1">Teléfono</label>
                <input name="telefono" value={form.telefono || ''} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1">Dirección</label>
                <input name="direccion" value={form.direccion || ''} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div>
                <label className="block mb-1">Género</label>
                <select name="genero" value={form.genero} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="HOMBRE">Masculino</option>
                  <option value="MUJER">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Estado</label>
                <select name="activo" value={form.activo ? 'true' : 'false'} onChange={(e) =>
                  setForm({ ...form, activo: e.target.value === 'true' })
                } className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </form>

            <div className="text-right mt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
