'use client';

import { useState } from 'react';
import api from '@/utils/api'; // ✅ en lugar de axios
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setMessage('Ingrese un email válido');
      setError(true);
      return;
    }

    try {
      const res = await api.post('/password/forgot-password', { email });
      setMessage(res.data.message);
      setError(false);
    } catch (err) {
      setMessage('Error al enviar el correo');
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064431] to-[#0FAA7B] flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-[2rem] shadow-lg p-10 w-full max-w-md text-sm relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <Image
            src="/imgs/taskit-logo.png"
            alt="Logo"
            width={200}
            height={60}
            className="mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">Restablecer contraseña</h2>
          <p className="text-gray-500 mt-1">Ingresá tu correo corporativo y te enviaremos un enlace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
              Correo corporativo
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Enviar enlace
          </button>

          {message && (
            <p className={`text-center text-sm mt-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
