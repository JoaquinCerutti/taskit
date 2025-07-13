'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/authService';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form.email, form.username, form.password);
      alert('Usuario creado con éxito');
      router.push('/login');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Registro</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
