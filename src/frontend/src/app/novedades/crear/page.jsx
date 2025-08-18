'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import api from '@/utils/api';

const UserHeader = dynamic(() => import('@/components/UserHeader'), { ssr: false });

// Opciones del seed.js como fallback
const SEED_ROLES = [
  { idRol: 1, nombreRol: 'GERENTE' },
  { idRol: 2, nombreRol: 'SUPERVISOR' },
  { idRol: 3, nombreRol: 'EMPLEADO_INTERNO' },
  { idRol: 4, nombreRol: 'MANTENIMIENTO' },
];

const SEED_CATEGORIAS = [
  { idCategoriaNovedad: 1, nombre: 'Urgente' },
  { idCategoriaNovedad: 2, nombre: 'Arribos' },
  { idCategoriaNovedad: 3, nombre: 'Mantenimiento' },
  { idCategoriaNovedad: 4, nombre: 'Housekeeping' },
  { idCategoriaNovedad: 5, nombre: 'Cocina y Bar' },
  { idCategoriaNovedad: 6, nombre: 'Recepcion' },
  { idCategoriaNovedad: 7, nombre: 'Olvidos' },
  { idCategoriaNovedad: 8, nombre: 'RRHH' },
];

export default function CrearNovedadPage() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idCategoriaNovedad, setIdCategoriaNovedad] = useState('');
  const [idDestinatarioRol, setIdDestinatarioRol] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [categorias, setCategorias] = useState(SEED_CATEGORIAS);
  const [roles, setRoles] = useState(SEED_ROLES);
  const [userInfo, setUserInfo] = useState({ nombre: '', apellido: '', rol: '' });

  const router = useRouter();

  useEffect(() => {
    // Cargar categorías y roles reales desde la API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [catRes, rolRes] = await Promise.all([
          api.get('/categorias-novedad', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/roles', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        // Si la API responde, usa los datos de la API
        setCategorias(catRes.data.length ? catRes.data : SEED_CATEGORIAS);
        setRoles(rolRes.data.length ? rolRes.data : SEED_ROLES);
      } catch (e) {
        // Si la API falla, usa los del seed
        setCategorias(SEED_CATEGORIAS);
        setRoles(SEED_ROLES);
      }
    };
    fetchData();

    // Obtener datos del usuario logueado
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserInfo({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        rol: user.rol?.nombreRol || user.rol || '', // Ajusta según cómo guardes el rol en user
      });
    }
  }, []);

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
      if (!titulo || !descripcion || !idCategoriaNovedad || !idDestinatarioRol) {
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
          categoriasIds: [Number(idCategoriaNovedad)],
          destinatariosIds: [Number(idDestinatarioRol)],
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
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Agregar Novedad</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Título *</label>
              <input
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Ej: Corte programado de agua caliente en Ala Norte"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Descripción *</label>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 text-gray-800 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Agregá detalles relevantes para el equipo..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Destinatario *</label>
              <select
                value={idDestinatarioRol}
                onChange={e => setIdDestinatarioRol(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="">Seleccionar destinatario</option>
                {roles.map(r => (
                  <option key={r.idRol} value={r.idRol}>{r.nombreRol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Categoría *</label>
              <select
                value={idCategoriaNovedad}
                onChange={e => setIdCategoriaNovedad(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(c => (
                  <option key={c.idCategoriaNovedad} value={c.idCategoriaNovedad}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <Image src="/imgs/avatar-default.png" alt="Avatar" width={40} height={40} />
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {userInfo.nombre} {userInfo.apellido}
                </div>
                <div className="text-xs text-gray-500">
                  {userInfo.rol}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-gray-500">
                {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/novedades')}
                  className="bg-transparent hover:bg-gray-100 text-green-900 px-5 py-2 rounded-full font-semibold"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#064431] hover:bg-green-800 text-white px-6 py-2 rounded-full font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        </div>
      </main>
    </div>
  );
}