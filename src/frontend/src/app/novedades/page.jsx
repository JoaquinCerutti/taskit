'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import api from '@/utils/api';

const UserHeader = dynamic(() => import('@/components/UserHeader'), { ssr: false });

export default function NovedadesPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState(['Todas']);
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/novedades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNovedades(res.data);
      } catch (err) {
        setNovedades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNovedades();

    // Recargar novedades cuando la pestaña vuelve a estar activa
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setLoading(true);
        fetchNovedades();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    // Traer categorías desde la API
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        // Usa la ruta correcta según tu backend
        const res = await api.get('/novedades/categorias-novedad', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategorias(res.data || []);
      } catch (err) {
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  // Maneja la selección múltiple de filtros
  const handleFiltroClick = (filtro) => {
    if (filtro === 'Todas') {
      setFiltrosActivos(['Todas']);
    } else {
      if (filtrosActivos.includes(filtro)) {
        const nuevosFiltros = filtrosActivos.filter(f => f !== filtro);
        setFiltrosActivos(nuevosFiltros.length === 0 ? ['Todas'] : nuevosFiltros);
      } else {
        setFiltrosActivos(
          filtrosActivos.filter(f => f !== 'Todas').concat(filtro)
        );
      }
    }
  };

  // Filtrado adaptado a múltiples categorías
  const novedadesFiltradas =
    filtrosActivos.includes('Todas')
      ? novedades
      : novedades.filter(n =>
          filtrosActivos.some(filtro =>
            (n.categorias?.some(catRel =>
              catRel.categoriaNovedad?.nombre?.toLowerCase().includes(filtro.toLowerCase())
            )) ||
            n.titulo?.toLowerCase().includes(filtro.toLowerCase())
          )
        );

  // Reemplaza 'filtros' por los nombres de las categorías traídas de la API
  const filtros = ['Todas', ...categorias.map(cat => cat.nombre)];

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
            <h1 className="text-2xl font-bold">Novedades</h1>
            <p className="text-sm text-gray-500">Mantenete al día con las últimas actualizaciones del hotel</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/novedades/crear">
              <button
                className="bg-[#064431] hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
              >
                Crear novedad
              </button>
            </Link>
            <UserHeader />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filtros.map((filtro) => (
            <button
              key={filtro}
              onClick={() => handleFiltroClick(filtro)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition
                ${filtrosActivos.includes(filtro)
                  ? 'bg-green-100 text-green-800 border-green-300 shadow'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}
              `}
            >
              {filtro}
            </button>
          ))}
        </div>

        {/* Grilla de novedades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              Cargando novedades...
            </div>
          ) : novedadesFiltradas.length > 0 ? (
            novedadesFiltradas.map(novedad => (
              <div
                key={novedad.idNovedad}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm min-h-[220px]"
              >
                {/* Usa el logo proporcionado */}
                <Image
                  src="/holiday-logo-simple.png"
                  alt="Holiday Inn"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain mb-4"
                />
                <div className="text-gray-500 text-sm mb-2">
                  {novedad.fecCreacion && !isNaN(new Date(novedad.fecCreacion).getTime())
                    ? new Date(novedad.fecCreacion).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
                    : ''}
                </div>
                <div className="font-semibold text-lg text-center text-gray-800">{novedad.titulo}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {novedad.categorias?.map(catRel => catRel.categoriaNovedad?.nombre).filter(Boolean).join(', ')}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-12">
              No hay novedades para mostrar
            </div>
          )}
        </div>
      </main>
    </div>
  );
}