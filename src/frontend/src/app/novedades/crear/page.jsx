// src/app/novedades/crear/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import api from '@/utils/api';
import MultiSelectChips from '@/components/MultiSelectChips';

const UserHeader = dynamic(() => import('@/components/UserHeader'), { ssr: false });

// Fallbacks por si la API no responde (seed)
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
  const router = useRouter();

  // Form
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Cat/roles disponibles y seleccionados (ids)
  const [categorias, setCategorias] = useState(SEED_CATEGORIAS);
  const [roles, setRoles] = useState(SEED_ROLES);
  const [catsSel, setCatsSel] = useState([]);   // number[]
  const [rolesSel, setRolesSel] = useState([]); // number[]

  // Estado UI
  const [userInfo, setUserInfo] = useState({ nombre: '', apellido: '', rol: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar opciones desde API + user info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [catRes, rolRes] = await Promise.all([
          // usa el path real de tu backend para categorías:
          api.get('/novedades/categorias-novedad', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/roles', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCategorias(catRes.data?.length ? catRes.data : SEED_CATEGORIAS);
        setRoles(rolRes.data?.length ? rolRes.data : SEED_ROLES);
      } catch {
        setCategorias(SEED_CATEGORIAS);
        setRoles(SEED_ROLES);
      }
    };
    fetchData();

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      setUserInfo({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        rol: user.rol?.nombreRol || user.rol || '',
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');

      if (!user || !token) {
        setError('No hay usuario autenticado.');
        setLoading(false);
        return;
      }
      if (!titulo || !descripcion || catsSel.length === 0 || rolesSel.length === 0) {
        setError('Completá título, descripción y elegí al menos 1 categoría y 1 destinatario.');
        setLoading(false);
        return;
      }

      await api.post(
        '/novedades',
        {
          titulo,
          descripcion,
          idUsuarioCreador: user.idUsuario,
          categoriasIds: catsSel,     // arrays
          destinatariosIds: rolesSel, // arrays
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push('/novedades');
    } catch (err) {
      console.error(err);
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

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Agregar Novedad</h1>
          <UserHeader />
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-3xl">
          {/* Título */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">Título *</label>
            <input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder='Ej: "Corte programado de agua caliente en Ala Norte"'
            />
          </div>

          {/* Descripción */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">Descripción *</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Agregá detalles relevantes para el equipo..."
            />
          </div>

          {/* Categorías (chips verdes + Todos) */}
          <div className="mb-6">
            <MultiSelectChips
              label="Categorías *"
              items={categorias.map(c => ({ id: c.idCategoriaNovedad, label: c.nombre }))}
              value={catsSel}
              onChange={setCatsSel}
              includeAll
            />
          </div>

          {/* Destinatarios (chips verdes + Todos) */}
          <div className="mb-6">
            <MultiSelectChips
              label="Destinatarios *"
              items={roles.map(r => ({ id: r.idRol, label: r.nombreRol }))}
              value={rolesSel}
              onChange={setRolesSel}
              includeAll
            />
          </div>

          {/* Autor y fecha visible */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <Image src="/imgs/avatar-default.png" alt="Avatar" width={40} height={40} />
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {userInfo.nombre} {userInfo.apellido}
                </div>
                <div className="text-xs text-gray-500">{userInfo.rol}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}{' '}
              - {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/novedades')}
              className="bg-transparent hover:bg-gray-100 text-[#064431] px-5 py-2 rounded-full font-semibold"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#064431] hover:bg-emerald-800 text-white px-6 py-2 rounded-full font-semibold"
              disabled={loading}
            >
              {loading ? 'Publicando…' : 'Publicar'}
            </button>
          </div>

          {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
        </form>
      </main>
    </div>
  );
}
