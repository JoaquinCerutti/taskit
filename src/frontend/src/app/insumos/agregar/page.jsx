'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

export default function AgregarInsumoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [idUnidad, setIdUnidad] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [error, setError] = useState('');

  const costoTotal = cantidad && precioUnitario ? (cantidad * precioUnitario).toFixed(2) : '';

 useEffect(() => {
  const fetchData = async () => {
    try {
      const [catRes, uniRes] = await Promise.all([
        axios.get('http://localhost:3001/api/categorias'),
        axios.get('http://localhost:3001/api/unidades')
      ]);
      setCategorias(catRes.data);
      setUnidades(uniRes.data); 
    } catch (err) {
      console.error('Error al obtener datos:', err);
    }
  };
  fetchData();
}, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !cantidad || !precioUnitario || !idUnidad || !idCategoria) {
      return setError('Todos los campos son obligatorios');
    }

    try {
      await axios.post('http://localhost:3001/api/insumos', {
        nombre,
        cantidad: parseInt(cantidad),
        precioUnitario: parseFloat(precioUnitario),
        idUnidad: parseInt(idUnidad),
        idCategoria: parseInt(idCategoria),
      });
      router.push('/insumos/consultar_insumos');
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm p-6 hidden md:flex flex-col justify-between">
        <div>
          <Image src="/imgs/holiday-logo.png" alt="Holiday Inn Logo" width={160} height={60} className="mb-10" />
          <nav className="flex flex-col gap-4 text-sm text-gray-700">
            <button onClick={() => router.push('/main')} className="text-left hover:font-semibold">Dashboard</button>
            <button onClick={() => router.push('/novedades')} className="text-left hover:font-semibold">Novedades</button>
            <button onClick={() => router.push('/mantenimiento')} className="text-left hover:font-semibold">Tickets</button>
            <button onClick={() => router.push('/insumos/consultar_insumos')} className="text-left font-semibold text-green-700">Stock e Inventario</button>
            <button onClick={() => router.push('/consultar')} className="text-left hover:font-semibold">Staff</button>
          </nav>
        </div>
        <div className="text-right text-xs text-gray-400 mt-8">© 2025 TaskIT</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-1">Nuevo Item</h1>
        <p className="text-sm text-gray-500 mb-6">Ingrese los datos para crear un nuevo item</p>

        <button onClick={() => router.back()} className="text-green-700 text-sm mb-6 flex items-center">
          &larr; Volver
        </button>

        <div className="bg-white shadow rounded-xl p-8">
          <h2 className="text-lg font-semibold mb-4">Añadir un nuevo producto</h2>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <label className="block font-medium mb-1">Nombre de producto</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Ingresar Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Cantidad</label>
              <input
                type="number"
                min="0"
                className="w-full border px-3 py-2 rounded"
                placeholder="Ingresar cantidad disponible"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Precio Unitario</label>
              <input
                type="number"
                min="0"
                className="w-full border px-3 py-2 rounded"
                placeholder="Ingresar Precio Unitario"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Unidad</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={idUnidad}
                onChange={(e) => setIdUnidad(e.target.value)}
              >
                <option value="">Seleccionar unidad</option>
                {unidades.map((u) => (
                  <option key={u.idUnidad} value={u.idUnidad}>
                    {u.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Categoría</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Costo Total</label>
              <input
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
                value={costoTotal}
              />
            </div>

            <div className="col-span-full flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push('/insumos/consultar_insumos')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded"
              >
                Agregar Item
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
