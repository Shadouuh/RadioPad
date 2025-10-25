import api from '../../../shared/api/axios';

const BASE_URL = '/user-programs';

export const userProgramService = {
  assignProgram: async (userId, programId) => {
    const response = await api.post(`${BASE_URL}/assign`, { userId, programId });
    return response.data;
  },
  
  removeProgram: async (userId, programId) => {
    const response = await api.delete(`${BASE_URL}/remove`, { 
      data: { userId, programId } 
    });
    return response.data;
  },
  
  getUserPrograms: async (userId) => {
    const response = await api.get(`${BASE_URL}/user/${userId}/programs`);
    return response.data;
  }
};

export default userProgramService;