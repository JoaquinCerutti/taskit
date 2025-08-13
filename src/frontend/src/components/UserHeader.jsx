'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, UserCircle, Bell, Check } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

export default function UserHeader() {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

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

  const fetchNotificaciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/notificaciones', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificaciones(res.data);
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setMostrarNotificaciones(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leido);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const goToProfile = () => {
    router.push(`/profile/${user?.idUsuario}`);
  };

  const marcarComoLeida = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/api/notificaciones/${id}/leida`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotificaciones();
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/api/notificaciones/todas/leidas`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotificaciones();
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  if (!hydrated || !user) return null;

  return (
    <div className="relative flex items-center gap-4" ref={dropdownRef}>
      {/* Campanita de notificaciones */}
      <div className="relative">
        <button
          onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
          className="relative text-gray-600 hover:text-black"
        >
          <Bell className="w-6 h-6" />
          {notificacionesNoLeidas.length > 0 && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          )}
        </button>

        {mostrarNotificaciones && (
          <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No hay notificaciones</p>
            ) : (
              <>
                <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
                  <span className="text-sm font-semibold">Notificaciones</span>
                  <button
                    onClick={marcarTodasComoLeidas}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Marcar todas
                  </button>
                </div>

                {notificaciones.map((noti) => (
                  <div
                    key={noti.idNotificacion}
                    className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-50"
                  >
                    <div className="text-sm text-gray-700">{noti.mensaje}</div>
                    {!noti.leido && (
                      <button
                        onClick={() => marcarComoLeida(noti.idNotificacion)}
                        className="text-green-600 hover:text-green-800"
                        title="Marcar como leída"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Menú de usuario */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-white hover:bg-gray-50 px-3 py-2 rounded-full shadow border cursor-pointer transition-all"
      >
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

        <div className="hidden md:flex flex-col text-sm text-left leading-tight">
          <span className="font-semibold text-gray-800">{user.nombre} {user.apellido}</span>
          <span className="text-gray-500 text-xs">{user.rol}</span>
        </div>

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
