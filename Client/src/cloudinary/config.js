// Configuración de Cloudinary
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary con las credenciales
cloudinary.config({
  cloud_name: 'untitle', 
  api_key: '592739979425588',    
  api_secret: 'jHh4O0bPJAbdFNYGGbwYfb1LUrc'  
});

// Función para subir una imagen a Cloudinary
export const uploadImage = async (file) => {
  try {
    // Convertir el archivo a base64
    const base64data = await convertToBase64(file);
    
    // Configurar opciones de carga
    const uploadOptions = {
      upload_preset: 'radiopad_users', // Crear este preset en tu dashboard de Cloudinary
      folder: 'profile_pictures',
    };
    
    // Subir la imagen a Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(base64data, uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para convertir un archivo a base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Función para eliminar una imagen de Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default cloudinary;