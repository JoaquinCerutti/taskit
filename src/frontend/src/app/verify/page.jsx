'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Verificando...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/verify?token=${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage('Error al verificar el email');
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064431] to-[#0FAA7B] flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-[2rem] shadow-lg p-10 w-full max-w-md text-center">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/imgs/taskit-logo.png"
            alt="TaskIT Logo"
            width={270}
            height={70}
            className="mb-2"
          />
          <h1 className="text-2xl font-semibold text-black mb-3">Confirmación de Email</h1>
          <Image
            src="/imgs/holiday-logo.png"
            alt="Holiday Inn Logo"
            width={180}
            height={60}
            className="mt-1"
          />
        </div>
        <div className="mt-4">
          <p className="text-lg text-gray-700 font-medium">{message}</p>
        </div>
        <div className="mt-6">
          <a
            href="/login"
            className="inline-block bg-black hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Ir a inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}
