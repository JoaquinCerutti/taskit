import api from '@/utils/api';

export const getUserById = (id) =>
  api.get(`/users/by-id/${id}`).then(res => res.data);


export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data).then(res => res.data);
