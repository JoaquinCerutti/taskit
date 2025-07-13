'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('No estás autenticado');
        router.push('/login');
        return;
      }

      try {
        const res = await api.get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error('Error al obtener perfil:', err);
        alert('Sesión inválida o expirada');
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-green-700 text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Perfil</h1>
        {user ? (
          <ul className="space-y-2 text-green-900">
            <li><span className="font-semibold">ID:</span> {user.id}</li>
            <li><span className="font-semibold">Email:</span> {user.email}</li>
            <li><span className="font-semibold">Username:</span> {user.username}</li>
            <li><span className="font-semibold">Creado:</span> {new Date(user.createAt).toLocaleString()}</li>
            <li><span className="font-semibold">Actualizado:</span> {new Date(user.updatedAt).toLocaleString()}</li>
          </ul>
        ) : (
          <p className="text-red-600">No se encontró el usuario.</p>
        )}
      </div>
    </div>
  );
}
