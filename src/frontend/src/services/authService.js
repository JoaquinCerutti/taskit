import api from '@/utils/api';

export const login = (email, password) => api.post('/auth/login', { email, password }).then(res => res.data);

export const register = (email, username, password) => api.post('/users', { email, username, password }).then(res => res.data);
