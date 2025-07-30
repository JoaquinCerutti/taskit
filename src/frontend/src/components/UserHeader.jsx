'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, UserCircle } from 'lucide-react'; // íconos bonitos
import Image from 'next/image';

export default function UserHeader() {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const goToProfile = () => {
    router.push(`/profile/${user?.idUsuario}`);
  };

  if (!hydrated || !user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-white hover:bg-gray-50 px-3 py-2 rounded-full shadow border cursor-pointer transition-all"
      >
        {/* Avatar o ícono por defecto */}
        {user.foto ? (
          <Image
            src={user.foto}
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full object-cover border"
          />
        ) : (
          <UserCircle className="w-9 h-9 text-gray-500" />
        )}

        {/* Nombre y rol */}
        <div className="hidden md:flex flex-col text-sm text-left leading-tight">
          <span className="font-semibold text-gray-800">{user.nombre} {user.apellido}</span>
          <span className="text-gray-500 text-xs">{user.rol}</span>
        </div>

        {/* Flecha desplegable */}
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-50 border text-sm overflow-hidden">
          <button
            onClick={goToProfile}
            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
          >
            Mi perfil
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
