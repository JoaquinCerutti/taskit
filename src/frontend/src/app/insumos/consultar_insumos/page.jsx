'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import dynamic from 'next/dynamic';
import ResumenInventario from '@/components/ResumenInventario';


const UserHeader = dynamic(() => import('@/components/UserHeader'), { ssr: false });

export default function ConsultarInsumosPage() {
  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [campoFiltro, setCampoFiltro] = useState('nombre');
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

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


   const obtenerEstadoStock = (cantidad, stockMinimo) => {
  if (cantidad === 0) return { texto: 'Agotado', clase: 'bg-red-200 text-red-800' };
  if (cantidad < stockMinimo) return { texto: 'Stock bajo', clase: 'bg-yellow-200 text-yellow-800' };
  return { texto: 'En stock', clase: 'bg-green-200 text-green-800' };
};


 const insumosFiltrados = insumos.filter((i) => {
  const valor =
  campoFiltro === 'unidad'
    ? i.unidad?.descripcion || ''
    : campoFiltro === 'categoria'
    ? i.categoria?.nombre || ''
    : campoFiltro === 'estado'
    ? obtenerEstadoStock(i.cantidad).texto
    : campoFiltro === 'idInsumo'
    ? String(i.idInsumo) // 👈 lo pasamos a string para usar `.includes()`
    : i[campoFiltro] || '';


  return valor.toLowerCase().includes(busqueda.toLowerCase());
});


  const indiceInicio = (paginaActual - 1) * filasPorPagina;
  const indiceFin = indiceInicio + filasPorPagina;
  const insumosPaginados = insumosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(insumosFiltrados.length / filasPorPagina);

 

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

        <ResumenInventario insumos={insumos} />


        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 text-sm">
            <div>
              Mostrar
              <select
                className="mx-2 border rounded px-2 py-1"
                value={filasPorPagina}
                onChange={(e) => {
                  setFilasPorPagina(Number(e.target.value));
                  setPaginaActual(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              filas por página
            </div>

            <div className="flex gap-2 items-center">
              <label htmlFor="campo" className="text-gray-600">Filtrar por:</label>
              <select
                id="campo"
                value={campoFiltro}
                onChange={(e) => {
                  setCampoFiltro(e.target.value);
                  setPaginaActual(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="nombre">Nombre</option>
                <option value="categoria">Categoría</option>
                <option value="unidad">Unidad</option>
                <option value="estado">Estado</option>
                <option value="idInsumo">ID</option>


              </select>

              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                className="border rounded px-3 py-1"
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-600">
                <th className="py-2">ID</th>
                <th className="py-2">Nombre</th>
                <th>Unidad</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {insumosPaginados.length > 0 ? (
                insumosPaginados.map((insumo) => {
                  const estado = obtenerEstadoStock(insumo.cantidad, insumo.stockMinimo || 10);

                  return (
                    <tr key={insumo.idInsumo} className="border-b hover:bg-gray-50">
                      <td className="text-gray-500">{insumo.idInsumo}</td>
                      <td>{insumo.nombre}</td>
                      <td>{insumo.unidad?.descripcion || '—'}</td>
                      <td>{insumo.categoria?.nombre || '—'}</td>
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
                  <td colSpan="7" className="text-center py-4 text-gray-400">
                    No se encontraron insumos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>
              {insumosFiltrados.length === 0
                ? '0'
                : `${indiceInicio + 1}–${Math.min(indiceFin, insumosFiltrados.length)} de ${insumosFiltrados.length}`}
            </span>
            <div>
              <button
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="mr-2 text-gray-500 disabled:opacity-50"
              >
                &lt;
              </button>
              <button
                onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                className="text-gray-500 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
