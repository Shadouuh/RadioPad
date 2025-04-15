import { useState } from 'react';
import { uploadImageToCloudinary } from '../api/cloudinaryService';
import { db } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const useCloudinary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Función para subir una imagen de perfil y actualizar el usuario
  const uploadProfilePicture = async (file, userId, currentUser = null) => {
    if (!file) {
      setError('No se ha seleccionado ninguna imagen');
      return { success: false };
    }

    // Validar que el archivo sea una imagen
    if (!file.type.match('image.*')) {
      setError('El archivo seleccionado no es una imagen');
      return { success: false };
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Subir la imagen a Cloudinary usando el servicio frontend
      const uploadResult = await uploadImageToCloudinary(file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Error al subir la imagen');
      }

      // Actualizar el documento del usuario en Firestore
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('El usuario no existe en la base de datos');
      }

      // Obtener datos actuales para verificar si ya tenía una imagen
      const userData = userDoc.data();
      const oldImageId = userData.profilePicture?.public_id;

      // Actualizar el documento con la nueva URL de la imagen
      await updateDoc(userDocRef, {
        profilePicture: {
          url: uploadResult.url,
          public_id: uploadResult.public_id
        }
      });

      // Si hay un usuario autenticado, actualizar también su perfil
      if (currentUser) {
        await updateProfile(currentUser, {
          photoURL: uploadResult.url
        });
      }

      // Si había una imagen anterior, podríamos eliminarla de Cloudinary
      // Nota: La eliminación segura debería hacerse desde un backend
      if (oldImageId) {
        console.log('Imagen anterior detectada:', oldImageId);
        // La eliminación de imágenes se implementaría en un backend por seguridad
      }

      setSuccessMessage('Imagen de perfil actualizada correctamente');
      setLoading(false);
      
      return {
        success: true,
        url: uploadResult.url,
        public_id: uploadResult.public_id
      };
    } catch (error) {
      console.error('Error al actualizar imagen de perfil:', error);
      setError('Error al actualizar imagen de perfil: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return {
    loading,
    error,
    successMessage,
    uploadProfilePicture,
    setError,
    setSuccessMessage
  };
};

export default useCloudinary;