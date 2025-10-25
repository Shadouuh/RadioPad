import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useNotification from '../hooks/useNotification';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const notify = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      if (err?.response?.status === 401) return;
      if (err?.response?.status === 403) notify(err?.response?.data?.message || 'Error al verificar sesión', 'error');
      console.error(err?.response?.data?.message || 'Error al verificar sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data?.success) {
        setUser(response.data.user);
        notify('Sesión iniciada correctamente', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Error al iniciar sesión';
      notify(message, 'error');
      console.error(message, err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      notify('Sesión cerrada', 'info');
    } catch (err) {
      console.error('Error al cerrar sesión:', err?.response?.data?.message || 'Error al cerrar sesión');
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
