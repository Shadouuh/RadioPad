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
      // Comentado temporalmente para evitar errores de conexión
      // const response = await axios.get('/auth/me');
      
      // if (response.data.success) {
      //   setUser(response.data.user);
      // }
      
      // Usuario estático por defecto
      setUser({
        name: 'Jefe de Operaciones',
        role: 'Administrador',
        email: 'admin@radiopad.com'
      });
    } catch (err) {
      if(err?.response?.status === 401) return
      if (err?.response?.status === 403) notify(err?.response?.data?.message || 'Error al verificar sesión', 'error');
      console.error(err?.response?.data?.message || 'Error al verificar sesión:', err);
      // handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      // Comentado temporalmente para evitar errores de conexión
      // await axios.post('/auth/logout');
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
