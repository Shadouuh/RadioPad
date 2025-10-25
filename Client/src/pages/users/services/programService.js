import api from '../../../shared/api/axios';

const BASE_URL = '/programs';

export const programService = {
  getAll: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  }
};

export default programService;