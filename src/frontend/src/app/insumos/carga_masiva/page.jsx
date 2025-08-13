'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

const UserHeader = dynamic(() => import('@/components/UserHeader'), { ssr: false });

export default function CargaMasivaPage() {
  const [todosLosInsumos, setTodosLosInsumos] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [tablaInsumos, setTablaInsumos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/insumos');
        const activos = res.data.filter(i => i.activo);
        setTodosLosInsumos(activos);
        const opcionesFormateadas = activos.map(i => ({
          value: i.idInsumo,
          label: i.nombre,
          insumo: i,
        }));
        setOpciones(opcionesFormateadas);
      } catch (err) {
        console.error('Error al obtener insumos:', err);
      }
    };

    fetchInsumos();
  }, []);

  const agregarInsumo = () => {
    if (!insumoSeleccionado || !cantidad || isNaN(cantidad) || cantidad <= 0) {
      alert('Ingrese una cantidad válida');
      return;
    }

    const yaExiste = tablaInsumos.find(i => i.idInsumo === insumoSeleccionado.insumo.idInsumo);
    if (yaExiste) {
      alert('Ese insumo ya fue agregado');
      return;
    }

    setTablaInsumos((prev) => [
      ...prev,
      {
        ...insumoSeleccionado.insumo,
        cantidadAgregar: parseInt(cantidad),
      },
    ]);

    setInsumoSeleccionado(null);
    setCantidad('');
  };

  const eliminarInsumo = (idInsumo) => {
    setTablaInsumos((prev) => prev.filter(i => i.idInsumo !== idInsumo));
  };

  const enviarCambios = async () => {
    try {
      const cambios = tablaInsumos.map(i => ({
  idInsumo: Number(i.idInsumo),
  cantidad: Number(i.cantidadAgregar),
}));
      console.log('>> Payload a enviar', { cambios }); // 👈 VER EN CONSOLA
      await axios.put('http://localhost:3001/api/insumos/actualizar-stock-masivo', {
  cambios: cambios
});


      alert('Stock actualizado correctamente');
      router.push('/insumos/consultar_insumos');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar el stock');
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
            <button onClick={() => router.push('/novedades')} className="text-left hover:font-semibold">Novedades</button>
            <button onClick={() => router.push('/mantenimiento')} className="text-left hover:font-semibold">Tickets</button>
            <button onClick={() => router.push('/insumos')} className="text-left font-semibold text-green-700">Stock e Inventario</button>
            <button onClick={() => router.push('/consultar')} className="text-left hover:font-semibold">Usuarios</button>
            <button onClick={() => router.push('/reportes')} className="text-left hover:font-semibold">Reportes</button>
          </nav>
        </div>
        <div className="text-right text-xs text-gray-400 mt-8">© 2025 TaskIT</div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Carga Masiva de Stock</h1>
            <p className="text-sm text-gray-500">Buscá insumos existentes e incrementá su stock</p>
            <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline mb-6">
  {'< Volver'}
</button>

          </div>
          <UserHeader />
        </div>

        {/* Buscador */}
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/2">
            <Select
              options={opciones}
              value={insumoSeleccionado}
              onChange={setInsumoSeleccionado}
              placeholder="Buscar insumo..."
            />
          </div>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="border rounded px-3 py-2 w-32"
            placeholder="Cantidad"
          />
          <button
            onClick={agregarInsumo}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
          >
            Agregar
          </button>
        </div>

        {/* Tabla temporal */}
        {tablaInsumos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow text-sm mb-6">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="p-2">Código</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Unidad</th>
                  <th className="p-2">Categoría</th>
                  <th className="p-2">Stock actual</th>
                  <th className="p-2">A agregar</th>
                  <th className="p-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {tablaInsumos.map((i) => (
                  <tr key={i.idInsumo} className="border-b hover:bg-gray-50">
                    <td className="p-2">{i.idInsumo}</td>
                    <td className="p-2">{i.nombre}</td>
                    <td className="p-2">{i.unidad?.descripcion}</td>
                    <td className="p-2">{i.categoria?.nombre}</td>
                    <td className="p-2 text-center">{i.cantidad}</td>
                    <td className="p-2 text-center">{i.cantidadAgregar}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => eliminarInsumo(i.idInsumo)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-4">
              <button
                onClick={enviarCambios}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
              >
                Confirmar Actualización
              </button>
              <button
                onClick={() => router.push('/insumos/consultar_insumos')}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
