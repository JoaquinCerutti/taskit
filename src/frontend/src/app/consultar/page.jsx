'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users');
        setUsuarios(res.data);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
      }
    };

    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.username.toLowerCase().includes(busqueda.toLowerCase())
  );

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
            <button onClick={() => router.push('/insumos')} className="text-left hover:font-semibold">Stock e Inventario</button>
            <button onClick={() => router.push('/consultar')} className="text-left font-semibold text-green-700">Usuarios</button>
            <button onClick={() => router.push('/reportes')}className="text-left hover:font-semibold">Reportes</button>
          </nav>
        </div>
        <div className="text-right text-xs text-gray-400 mt-8">© 2025 TaskIT</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <p className="text-sm text-gray-500">Administra fácilmente las cuentas y permisos de tu equipo</p>
          </div>
          <button
            onClick={() => router.push('/register')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
          >
            Nuevo Usuario
          </button>
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
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-600">
                <th className="py-2">Nombre</th>
                <th>Email</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Consultar</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.username}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <button
                        onClick={() => router.push(`/profile/${usuario.id}`)}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                      >
                        DETALLE
                      </button>
                    </td>
                    <td>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        usuario.estado === 'ACTIVO'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {usuario.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>1–{usuariosFiltrados.length} de {usuarios.length}</span>
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
