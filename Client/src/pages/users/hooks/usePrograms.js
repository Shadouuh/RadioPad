import { useState, useEffect } from 'react';
import programService from '../services/programService';

export const usePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await programService.getAll();
      setPrograms(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar programas');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    error,
    fetchPrograms
  };
};

export default usePrograms;