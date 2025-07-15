'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/password/forgot-password', { email });
      setMessage(res.data.message);
    } catch {
      setMessage('Error al enviar el correo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Restablecer contraseña</h2>
      <input type="email" placeholder="Tu email" onChange={e => setEmail(e.target.value)} required />
      <button type="submit">Enviar enlace</button>
      {message && <p>{message}</p>}
    </form>
  );
}
