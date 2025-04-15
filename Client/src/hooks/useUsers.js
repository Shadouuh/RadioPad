import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

const useUsers = () => {
  // Inicializar con array vacío en lugar del array de ejemplo
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Función para crear un nuevo usuario
  const createUser = async (formData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
     
    // Validar que todos los campos estén completos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.rol || !formData.programas) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return { success: false };
    }
     
    // Usar contraseña simple "hola1234", despues va a dar la opcion de cambiarla (como en zoho)
    const tempPassword = 'hola1234';
    
    try {
      // Generar un ID único para el usuario
      const userDocRef = doc(collection(db, 'users'));
      const uid = userDocRef.id;
      
      // Preparar el objeto de usuario
      const userData = {
        displayName: `${formData.nombre} ${formData.apellido}`,
        efectos: [],
        email: formData.email,
        password: tempPassword, // Guardar la contraseña directamente en Firestore
        programas: formData.programas.includes(',') ? formData.programas.split(',').map(prog => prog.trim()) : [formData.programas], // Convertir a array
        role: formData.rol,
        nombre: formData.nombre,
        apellido: formData.apellido,
        avatarColor: '#3b82f6', // Color por defecto
        // Si hay una imagen de perfil, incluirla
        profilePicture: formData.profilePicture ? {
          url: formData.profilePicture.url,
          public_id: formData.profilePicture.public_id
        } : null
      };
      
      // Guardar información del usuario directamente en Firestore
      await setDoc(userDocRef, userData);
      
      console.log('Usuario guardado en Firestore correctamente');
      
      // Después de crear el usuario, actualizar la lista de usuarios
      await fetchUsers();
      
      setSuccessMessage(`Usuario creado exitosamente con email: ${formData.email} y contraseña: ${tempPassword}`);
      
      setLoading(false);
      return { success: true, message: successMessage };
    } catch (error) {
      console.error('Error al guardar usuario en Firestore:', error);
      setError('Error al guardar datos de usuario en la base de datos: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Función para obtener todos los usuarios desde Firestore
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      if (usersSnapshot.empty) {
        console.log('No hay usuarios en la base de datos');
        setUsers([]);
        return [];
      }
      
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre && doc.data().apellido ? 
               `${doc.data().nombre} ${doc.data().apellido}` : 
               doc.data().displayName || 'Sin nombre',
        rol: doc.data().role || 'Sin rol',
        programas: Array.isArray(doc.data().programas) ? 
                  doc.data().programas.join(', ') : 
                  (doc.data().programas || 'Sin programas')
      }));
      
      console.log('Usuarios obtenidos de Firestore:', usersList);
      setUsers(usersList);
      return usersList;
    } catch (error) {
      setError('Error al obtener usuarios: ' + error.message);
      console.error('Error al obtener usuarios:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un usuario existente
  const updateUser = async (userId, formData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    // Validar que todos los campos estén completos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.rol || !formData.programas) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return { success: false };
    }
    
    try {
      const userDocRef = doc(db, 'users', userId);
      
      // Obtener datos actuales del usuario para mantener campos que no se modifican
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('El usuario no existe');
      }
      
      // Actualizar información del usuario en Firestore
      await updateDoc(userDocRef, {
        displayName: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        programas: formData.programas.includes(',') ? formData.programas.split(',').map(prog => prog.trim()) : [formData.programas],
        role: formData.rol,
        nombre: formData.nombre,
        apellido: formData.apellido
      });
      
      console.log('Usuario actualizado en Firestore correctamente');
      
      // Después de actualizar el usuario, actualizar la lista de usuarios
      await fetchUsers();
      
      setSuccessMessage(`Usuario actualizado exitosamente`);
      
      setLoading(false);
      return { success: true, message: successMessage };
    } catch (error) {
      console.error('Error al actualizar usuario en Firestore:', error);
      setError('Error al actualizar datos de usuario en la base de datos: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (userId) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const userDocRef = doc(db, 'users', userId);
      
      // Eliminar el documento del usuario
      await deleteDoc(userDocRef);
      
      console.log('Usuario eliminado de Firestore correctamente');
      
      // Actualizar la lista de usuarios después de eliminar
      await fetchUsers();
      
      setSuccessMessage('Usuario eliminado exitosamente');
      
      setLoading(false);
      return { success: true, message: successMessage };
    } catch (error) {
      console.error('Error al eliminar usuario de Firestore:', error);
      setError('Error al eliminar usuario de la base de datos: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Función para obtener un usuario específico por ID
  const getUserById = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        email: userData.email || '',
        rol: userData.role || '',
        programas: Array.isArray(userData.programas) ? userData.programas.join(', ') : (userData.programas || '')
      };
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      setError('Error al obtener datos del usuario: ' + error.message);
      return null;
    }
  };

  return {
    users,
    loading,
    error,
    successMessage,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    fetchUsers,
    setError,
    setSuccessMessage
  };
};

export default useUsers;