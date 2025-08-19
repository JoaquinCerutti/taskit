'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { tiempoRelativo } from '@/utils/fecha';

export default function NovedadCard({ novedad }) {
  const router = useRouter();
  const etiqueta = novedad?.categorias?.[0]?.categoriaNovedad?.nombre ?? 'General';

  return (
    <button
      onClick={() => router.push(`/novedades/${novedad.idNovedad}`)}
      className="w-full text-left bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition p-8"
    >
      {/* Hace X tiempo */}
      <div className="text-sm text-gray-500 mb-4">{tiempoRelativo(novedad.fecCreacion)}</div>

      <div className="flex items-center gap-5">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
          <Image
            src="/holiday-logo-simple.png"
            alt="Holiday Inn"
            width={56}
            height={56}
            className="w-14 h-14 object-contain"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{novedad.titulo}</h3>
          <p className="text-sm text-gray-500 mt-1">{etiqueta}</p>
        </div>
      </div>
    </button>
  );
}
