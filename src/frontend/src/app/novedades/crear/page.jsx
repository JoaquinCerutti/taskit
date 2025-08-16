'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import api from '@/utils/api';

const UserHeader = dynamic(() => import('@/components/UserHeader'), { ssr: false });

export default function CrearNovedadPage() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idSectorDestino, setIdSectorDestino] = useState('');
  const [idCategoriaNovedad, setIdCategoriaNovedad] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mock de sectores y categorías (reemplaza por fetch real si lo necesitas)
  const sectores = [
    { id: 1, nombre: 'Recepción' },
    { id: 2, nombre: 'Housekeeping' },
    { id: 3, nombre: 'Mantenimiento' },
    // ...otros sectores
  ];
  const categorias = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Urgente' },
    { id: 3, nombre: 'Arribos' },
    // ...otras categorías
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (!user || !token) {
        setError('No hay usuario autenticado.');
        setLoading(false);
        return;
      }
      // Validación básica
      if (!titulo || !descripcion || !idSectorDestino || !idCategoriaNovedad) {
        setError('Completa todos los campos.');
        setLoading(false);
        return;
      }

      await api.post(
        '/novedades',
        {
          titulo,
          descripcion,
          idUsuarioCreador: user.idUsuario,
          idSectorDestino: Number(idSectorDestino),
          idCategoriaNovedad: Number(idCategoriaNovedad),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push('/novedades');
    } catch (err) {
      setError('Error al crear la novedad');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm p-6 hidden md:flex flex-col justify-between">
        <div>
          <Image src="/imgs/holiday-logo.png" alt="Holiday Inn Logo" width={160} height={60} className="mb-10" />
          <nav className="flex flex-col gap-4 text-sm text-gray-700">
            <button onClick={() => router.push('/main')} className="text-left hover:font-semibold">Menú Principal</button>
            <button onClick={() => router.push('/novedades')} className="text-left font-semibold text-green-700">Novedades</button>
            <button onClick={() => router.push('/mantenimiento')} className="text-left hover:font-semibold">Tickets</button>
            <button onClick={() => router.push('/insumos/consultar_insumos')} className="text-left hover:font-semibold">Stock e Inventario</button>
            <button onClick={() => router.push('/consultar')} className="text-left hover:font-semibold">Usuarios</button>
            <button onClick={() => router.push('/reportes')} className="text-left hover:font-semibold">Reportes</button>
          </nav>
        </div>
        <div className="text-right text-xs text-gray-400 mt-8">© 2025 TaskIT</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Crear Novedad</h1>
            <p className="text-sm text-gray-500">Publicá una nueva novedad para el hotel</p>
          </div>
          <div className="flex items-center gap-4">
            <UserHeader />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-8 max-w-xl mx-auto flex flex-col gap-6"
        >
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div>
            <label className="block text-sm font-semibold mb-1">Título</label>
            <input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Ej: Corte programado de agua caliente en Ala Norte"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 text-gray-800 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Agregá detalles relevantes para el equipo..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Sector destino</label>
            <select
              value={idSectorDestino}
              onChange={e => setIdSectorDestino(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Seleccionar sector</option>
              {sectores.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Categoría</label>
            <select
              value={idCategoriaNovedad}
              onChange={e => setIdCategoriaNovedad(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/novedades')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full font-semibold"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#064431] hover:bg-green-800 text-white px-6 py-2 rounded-full font-semibold"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear novedad'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}