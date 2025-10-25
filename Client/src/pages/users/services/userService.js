import api from '../../../shared/api/axios';

const BASE_URL = '/users';

export const userService = {
  getAll: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },
  
  create: async (userData) => {
    const response = await api.post(BASE_URL, userData);
    return response.data;
  },
  
  update: async (id, userData) => {
    const response = await api.put(`${BASE_URL}/${id}`, userData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};

export default userService;