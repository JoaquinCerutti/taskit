import api from '@/utils/api';

// Login con emailCorporativo y password
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(res => res.data);

// Registro: se envía todo el objeto "form"
export const register = (formData) =>
  api.post('/users', formData).then(res => res.data);
