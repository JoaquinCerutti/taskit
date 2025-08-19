// src/app/novedades/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import api from '@/utils/api';
import NovedadCard from '@/components/NovedadCard';

const UserHeader = dynamic(() => import('@/components/UserHeader'), { ssr: false });

export default function NovedadesPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState(['Todas']);
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- helpers ---
  const normalizar = (str) =>
    (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

  // --- fetch novedades ---
  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await api.get('/novedades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNovedades(Array.isArray(res.data) ? res.data : []);
      } catch {
        setNovedades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNovedades();

    // recargar cuando vuelve la pestaña
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchNovedades();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // --- fetch categorías ---
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/novedades/categorias-novedad', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategorias(Array.isArray(res.data) ? res.data : []);
      } catch {
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  // --- filtros ---
  const filtros = useMemo(
    () => ['Todas', ...categorias.map((cat) => cat.nombre)],
    [categorias]
  );

  const handleFiltroClick = (filtro) => {
    if (filtro === 'Todas') {
      setFiltrosActivos(['Todas']);
      return;
    }
    if (filtrosActivos.includes(filtro)) {
      const nuevos = filtrosActivos.filter((f) => f !== filtro);
      setFiltrosActivos(nuevos.length === 0 ? ['Todas'] : nuevos);
    } else {
      setFiltrosActivos(filtrosActivos.filter((f) => f !== 'Todas').concat(filtro));
    }
  };

  // --- filtrado + orden (más nuevas primero) ---
  const novedadesFiltradas = useMemo(() => {
    if (filtrosActivos.includes('Todas')) return novedades;
    return novedades.filter((n) =>
      filtrosActivos.some(
        (filtro) =>
          n.categorias?.some(
            (c) => normalizar(c?.categoriaNovedad?.nombre) === normalizar(filtro)
          ) || normalizar(n.titulo).includes(normalizar(filtro))
      )
    );
  }, [novedades, filtrosActivos]);

  const novedadesOrdenadas = useMemo(() => {
    return [...novedadesFiltradas].sort((a, b) => {
      const da = new Date(a.fecCreacion).getTime() || 0;
      const db = new Date(b.fecCreacion).getTime() || 0;
      if (db !== da) return db - da;                 // fecha desc
      return (b.idNovedad || 0) - (a.idNovedad || 0); // backup por id
    });
  }, [novedadesFiltradas]);

  // --- UI ---
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
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Novedades</h1>
            <p className="text-sm text-gray-500">Mantenete al día con las últimas actualizaciones del hotel</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/novedades/crear">
              <button className="bg-[#064431] hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
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

        {/* Grilla */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              Cargando novedades...
            </div>
          ) : novedadesOrdenadas.length > 0 ? (
            novedadesOrdenadas.map((n) => <NovedadCard key={n.idNovedad} novedad={n} />)
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
