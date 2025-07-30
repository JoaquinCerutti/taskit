import api from '@/utils/api';
import axios from 'axios';


export const getUserById = (id) =>
  api.get(`/users/by-id/${id}`).then(res => res.data);


export const updateUser = async (id, data) => {
  const res = await axios.put(`http://localhost:3001/api/users/${id}`, data);
  return res.data;
};
