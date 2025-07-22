'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Confirmación de Email</h1>
      <p>{message}</p>
    </div>
  );
}
