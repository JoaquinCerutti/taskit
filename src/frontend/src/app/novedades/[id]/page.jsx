'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/utils/api';
import { formatearFechaLarga } from '@/utils/fecha';

export default function NovedadDetallePage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [novedad, setNovedad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/novedades/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNovedad(res.data);
      } catch (e) {
        console.error(e);
        setNovedad(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) {
    return (
      <div className="px-6 py-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow border border-gray-100 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!novedad) {
    return (
      <div className="px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => router.push('/novedades')} className="text-sm text-[#064431] hover:underline mb-4">
            ← Volver a Novedades
          </button>
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">No se encontró la novedad.</div>
        </div>
      </div>
    );
  }

  const categorias = novedad?.categorias?.map((c) => c.categoriaNovedad?.nombre).filter(Boolean) || [];
  const roles = novedad?.destinatarios?.map((d) => d.rol?.nombreRol).filter(Boolean) || [];
  const creador = novedad?.creador;

  return (
    <div className="px-6 py-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/novedades')} className="text-sm text-[#064431] hover:underline mb-4">
          ← Volver a Novedades
        </button>

        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <Image src="/holiday-logo-simple.png" alt="Holiday Inn" width={40} height={40} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{novedad.titulo}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categorias.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{formatearFechaLarga(novedad.fecCreacion)}</div>
            </div>

            {/* Autor */}
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                {/* Si tenés foto real, poné la URL */}
                <Image src="/avatar-placeholder.png" alt="Creador" width={40} height={40} />
              </div>
              <div className="text-sm">
                <div className="text-gray-900 font-medium">
                  {creador?.nombre} {creador?.apellido}
                </div>
                <div className="text-gray-500">{roles.length ? roles.join(' · ') : '—'}</div>
              </div>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="p-6">
            <p className="whitespace-pre-wrap leading-7 text-gray-800">{novedad.descripcion}</p>
          </div>

          {/* Destinatarios */}
          {roles.length > 0 && (
            <div className="px-6 pb-6">
              <div className="text-xs text-gray-500 mb-2">Destinatarios</div>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <span key={r} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
