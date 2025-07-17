'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.email, form.password);
      localStorage.setItem('token', data.token);
      alert('Login exitoso');
      router.push('/profile');
    } catch (err) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064431] to-[#0FAA7B] flex items-center justify-center p-4 relative font-inter">
      {/* Logo gigante # de fondo */}
      <div className="absolute text-[200px] font-black text-white/5 select-none">#</div>

      {/* Contenedor del login */}
      <div className="relative z-10 bg-white rounded-[2rem] shadow-lg p-10 w-full max-w-md text-sm">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/imgs/taskit-logo.png"
            alt="TaskIT Logo"
            width={270}
            height={70}
            className="mb-2"
          />
          <p className="text-center font-medium text-black">Iniciá sesión en tu comunidad</p>
          <Image
            src="/imgs/holiday-logo.png"
            alt="Holiday Inn Logo"
            width={180}
            height={60}
            className="mt-1"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Usuario
            </label>
            <input
              name="email"
              type="email"
              placeholder="email@domain.com"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-green-600 hover:underline">
              Olvidé mi contraseña
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
