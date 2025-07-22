'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut, Newspaper, Wrench, Package, Users, BarChart3
} from 'lucide-react';

const modules = [
  { name: 'Novedades', path: '/novedades', icon: <Newspaper className="w-6 h-6 mb-2 text-green-600" /> },
  { name: 'Mantenimiento', path: '/mantenimiento', icon: <Wrench className="w-6 h-6 mb-2 text-green-600" /> },
  { name: 'Insumos', path: '/insumos', icon: <Package className="w-6 h-6 mb-2 text-green-600" /> },
  { name: 'Usuarios', path: '/usuarios', icon: <Users className="w-6 h-6 mb-2 text-green-600" /> },
  { name: 'Reportes y Estadísticas', path: '/reportes', icon: <BarChart3 className="w-6 h-6 mb-2 text-green-600" /> },
];

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        localStorage.clear();
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (!user) return null; // o loading spinner

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064431] to-[#0FAA7B] flex flex-col items-center justify-start py-10 px-4 font-inter">
      
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 px-10 text-center max-w-xl w-full relative mb-10">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center text-red-600 text-sm font-semibold hover:underline"
        >
          <LogOut className="w-4 h-4 mr-1" /> Cerrar sesión
        </button>

        <Image
          src="/imgs/taskit-logo.png"
          alt="TaskIT Logo"
          width={260}
          height={60}
          className="mx-auto mb-2"
        />
        <Image
          src="/imgs/holiday-logo.png"
          alt="Holiday Inn Logo"
          width={180}
          height={50}
          className="mx-auto"
        />
        <h1 className="text-2xl text-gray-800 font-bold mt-4">Bienvenido/a, {user.nombre}</h1>
        <p className="text-gray-600 text-sm">Seleccioná una sección para comenzar</p>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {modules.map((mod) => (
          <Link
            key={mod.name}
            href={mod.path}
            className="bg-white hover:bg-green-100 rounded-2xl shadow-lg p-6 text-center transition-transform hover:scale-[1.03] flex flex-col items-center"
          >
            {mod.icon}
            <h2 className="text-lg font-semibold text-gray-800">{mod.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
