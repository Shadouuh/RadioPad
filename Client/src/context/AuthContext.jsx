import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Obtener el token JWT
      const token = await userCredential.user.getIdToken();
      // Guardar el token en localStorage para mantener la sesión
      localStorage.setItem('authToken', token);
      return userCredential.user;
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
    } catch (error) {
      setError('Error al cerrar sesión: ' + error.message);
      throw error;
    }
  };

  // Verificar si hay un token guardado al cargar la aplicación
  const checkAuthToken = () => {
    return localStorage.getItem('authToken') !== null;
  };

  // Efecto para observar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Valor del contexto
  const value = {
    currentUser,
    login,
    logout,
    error,
    checkAuthToken,
    isAuthenticated: !!currentUser || checkAuthToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};