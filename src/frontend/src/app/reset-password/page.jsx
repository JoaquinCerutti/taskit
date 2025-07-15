'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function ResetPasswordPage() {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/password/reset-password', { token, password });
      setMessage(res.data.message);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setMessage('Token inválido o expirado');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ingresá tu nueva contraseña</h2>
      <input type="password" placeholder="Nueva contraseña" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Actualizar</button>
      {message && <p>{message}</p>}
    </form>
  );
}
