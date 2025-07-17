'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function ResetPasswordPage() {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/password/reset-password', {
        token,
        password,
      });
      setMessage(res.data.message);
      setError(false);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setMessage('Token inválido o expirado');
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064431] to-[#0FAA7B] flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-[2rem] shadow-lg p-10 w-full max-w-md text-sm relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="text-5xl text-green-600 mb-3">🔒</div>
          <h2 className="text-xl font-bold text-gray-800">Ingresá tu nueva contraseña</h2>
          <p className="text-gray-500 mt-1">Asegurate de elegir una clave segura</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-[35px] text-gray-500 text-sm"
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Actualizar
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
