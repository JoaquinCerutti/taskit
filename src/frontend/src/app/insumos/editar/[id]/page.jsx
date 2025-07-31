'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditarInsumoPage({ params }) {
  const router = useRouter();
  const id = params.id;

  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [idUnidad, setIdUnidad] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [error, setError] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [creandoCategoria, setCreandoCategoria] = useState(false);

  const costoTotal =
    cantidad && precioUnitario ? (cantidad * precioUnitario).toFixed(2) : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insumoRes, catRes, uniRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/insumos/${id}`),
          axios.get('http://localhost:3001/api/categorias'),
          axios.get('http://localhost:3001/api/unidades'),
        ]);

        const insumo = insumoRes.data;
        setNombre(insumo.nombre);
        setCantidad(insumo.cantidad);
        setPrecioUnitario(insumo.precioUnitario);
        setDescripcion(insumo.descripcion || '');
        setIdUnidad(insumo.unidad?.idUnidad?.toString() || '');
        setIdCategoria(insumo.categoria?.idCategoria?.toString() || '');
        setStockMinimo(insumo.stockMinimo?.toString() || '');
        setCategorias(catRes.data);
        setUnidades(uniRes.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.put(`http://localhost:3001/api/insumos/${id}`, {
        nombre,
        cantidad: parseInt(cantidad),
        precioUnitario: parseFloat(precioUnitario),
        descripcion,
        idCategoria: parseInt(idCategoria),
        idUnidad: parseInt(idUnidad),
        stockMinimo: parseInt(stockMinimo),
      });
      router.push('/insumos/consultar_insumos');
    } catch (err) {
      console.error(err);
      setError('Error al guardar los cambios');
    }
  };

  const handleDarDeBaja = () => {
    alert('Funcionalidad pendiente: marcar como dado de baja');
  };

  return (
    <div className="p-8 font-inter">
      <h1 className="text-3xl font-bold mb-2">Detalle Item</h1>
      <p className="text-gray-500 mb-6">
        En este panel podrá modificar los datos de un item del inventario
      </p>

      <button onClick={() => router.back()} className="text-green-700 mb-4">
        &larr; Volver
      </button>

      <div className="bg-white shadow-md rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6">Detalle del producto</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm"
        >
          <div>
            <label className="font-medium mb-1 block">Nombre de producto</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-medium mb-1 block">ID producto</label>
            <input
              disabled
              value={id}
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="font-medium mb-1 block">Cantidad</label>
            <input
              type="number"
              min="0"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-medium mb-1 block">Precio Unitario</label>
            <input
              type="number"
              min="0"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-medium mb-1 block">Descripción</label>
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-medium mb-1 block">Unidad</label>
            <select
              value={idUnidad}
              onChange={(e) => setIdUnidad(e.target.value)}
              className="w-full border px-3 py-2 rounded"
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
            <label className="font-medium mb-1 block">Categoría</label>
            <select
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            <div className="mt-3 flex gap-3">
              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded text-sm"
                placeholder="Nueva categoría"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              />
              <button
                type="button"
                disabled={creandoCategoria || !nuevaCategoria.trim()}
                onClick={async () => {
                  try {
                    setCreandoCategoria(true);
                    const res = await axios.post(
                      'http://localhost:3001/api/categorias',
                      { nombre: nuevaCategoria.trim() }
                    );

                    setCategorias((prev) => [...prev, res.data]);
                    setIdCategoria(res.data.idCategoria);
                    setNuevaCategoria('');
                  } catch (error) {
                    console.error('Error al crear categoría:', error);
                    alert('Error al crear categoría');
                  } finally {
                    setCreandoCategoria(false);
                  }
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>
          </div>

          <div>
            <label className="font-medium mb-1 block">Stock mínimo</label>
            <input
              type="number"
              min="0"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-medium mb-1 block">Costo Total</label>
            <input
              disabled
              value={`$${costoTotal}`}
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div className="col-span-full flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleDarDeBaja}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded"
            >
              Dar de baja
            </button>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded"
            >
              Guardar datos
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
