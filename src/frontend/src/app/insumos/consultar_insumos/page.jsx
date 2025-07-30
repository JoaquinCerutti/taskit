'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import UserHeader from '@/components/UserHeader';

export default function ConsultarInsumosPage() {
  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/insumos');
        setInsumos(res.data);
      } catch (err) {
        console.error('Error al obtener insumos:', err);
      }
    };

    fetchInsumos();
  }, []);

  const insumosFiltrados = insumos.filter((i) =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const obtenerEstadoStock = (cantidad) => {
    if (cantidad === 0) return { texto: 'Agotado', clase: 'bg-red-200 text-red-800' };
    if (cantidad < 10) return { texto: 'Stock bajo', clase: 'bg-yellow-200 text-yellow-800' };
    return { texto: 'En stock', clase: 'bg-green-200 text-green-800' };
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm p-6 hidden md:flex flex-col justify-between">
        <div>
          <Image src="/imgs/holiday-logo.png" alt="Holiday Inn Logo" width={160} height={60} className="mb-10" />
          <nav className="flex flex-col gap-4 text-sm text-gray-700">
            <button onClick={() => router.push('/main')} className="text-left hover:font-semibold">Menú Principal</button>
            <button onClick={() => router.push('/novedades')} className="text-left hover:font-semibold">Novedades</button>
            <button onClick={() => router.push('/mantenimiento')} className="text-left hover:font-semibold">Tickets</button>
            <button onClick={() => router.push('/insumos')} className="text-left font-semibold text-green-700">Stock e Inventario</button>
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
            <h1 className="text-2xl font-bold">Stock e Inventario</h1>
            <p className="text-sm text-gray-500">Gestioná los insumos disponibles en el hotel</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/insumos/agregar')}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Agregar insumo
            </button>
            <UserHeader />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm">
              Mostrar
              <select className="mx-2 border rounded px-2 py-1 text-sm">
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              filas por página
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-600">
                <th className="py-2">Nombre</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {insumosFiltrados.length > 0 ? (
                insumosFiltrados.map((insumo) => {
                  const estado = obtenerEstadoStock(insumo.cantidad);
                  return (
                    <tr key={insumo.idInsumo} className="border-b hover:bg-gray-50">
                      <td className="py-2">{insumo.nombre}</td>
                      <td>{insumo.unidad?.descripcion || '—'}</td>
                      <td>{insumo.cantidad}</td>
                      <td>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estado.clase}`}>
                          {estado.texto}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => router.push(`/insumos/editar/${insumo.idInsumo}`)}

                          className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                        >
                          DETALLE
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No se encontraron insumos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>1–{insumosFiltrados.length} de {insumos.length}</span>
            <div>
              <button className="mr-2 text-gray-500">&lt;</button>
              <button className="text-gray-500">&gt;</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
