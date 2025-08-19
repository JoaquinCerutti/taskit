// src/app/novedades/crear/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function CrearNovedadPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [destinatarios, setDestinatarios] = useState([]);
  const [categoriasIds, setCategoriasIds] = useState([]);
  const [destinatariosIds, setDestinatariosIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // traer categorías y destinatarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [catsRes, rolesRes] = await Promise.all([
          api.get('/novedades/categorias-novedad', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/roles', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategorias(catsRes.data || []);
        setDestinatarios(rolesRes.data || []);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const idUsuarioCreador = localStorage.getItem('idUsuario');

      await api.post(
        '/novedades',
        { titulo, descripcion, idUsuarioCreador, categoriasIds, destinatariosIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push('/novedades');
    } catch (err) {
      console.error('Error al crear novedad:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Crear Novedad</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          {/* Selección de categorías */}
          <div>
            <label className="block text-sm font-medium mb-1">Categorías</label>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  type="button"
                  key={cat.idCategoriaNovedad}
                  onClick={() => {
                    setCategoriasIds((prev) =>
                      prev.includes(cat.idCategoriaNovedad)
                        ? prev.filter((id) => id !== cat.idCategoriaNovedad)
                        : [...prev, cat.idCategoriaNovedad]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    categoriasIds.includes(cat.idCategoriaNovedad)
                      ? 'bg-green-100 text-green-800 border-green-400'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Selección de destinatarios */}
          <div>
            <label className="block text-sm font-medium mb-1">Destinatarios</label>
            <div className="flex flex-wrap gap-2">
              {destinatarios.map((rol) => (
                <button
                  type="button"
                  key={rol.idRol}
                  onClick={() => {
                    setDestinatariosIds((prev) =>
                      prev.includes(rol.idRol)
                        ? prev.filter((id) => id !== rol.idRol)
                        : [...prev, rol.idRol]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    destinatariosIds.includes(rol.idRol)
                      ? 'bg-green-100 text-green-800 border-green-400'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  {rol.nombreRol}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#064431] hover:bg-green-800 text-white px-4 py-2 rounded"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
