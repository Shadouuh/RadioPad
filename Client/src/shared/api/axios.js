import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

// Interceptor para manejar errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 429) {
      // Crear un error personalizado que mantenga la estructura de axios
      const customError = {
        ...error,
        response: {
          ...error.response,
          data: {
            success: false,
            message: 'Demasiadas solicitudes, por favor intenta más tarde.'
          }
        }
      };
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

export default instance;