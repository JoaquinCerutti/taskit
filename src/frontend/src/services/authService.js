import api from '@/utils/api';

// Login con emailCorporativo y password
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });

    // ✅ Guardar en localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Registro: se envía todo el objeto "form"
export const register = async (formData) => {
  try {
    const response = await api.post('/users', formData);

    // ✅ Guardar en localStorage (opcional, si querés loguearlo al registrarse)
    // localStorage.setItem('token', response.data.token);
    // localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw error;
  }
};
