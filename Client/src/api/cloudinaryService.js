// Servicio para manejar la carga de imágenes a Cloudinary
import axios from 'axios';

// Constantes para la configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = 'botonera'; // Reemplazar con tu cloud_name
const CLOUDINARY_UPLOAD_PRESET = 'botoneraPreset'; // Preset configurado en Cloudinary

/**
 * Sube una imagen a Cloudinary directamente desde el frontend
 * @param {File} file - El archivo de imagen a subir
 * @returns {Promise<Object>} - Objeto con la URL y el ID público de la imagen
 */
export const uploadImageToCloudinary = async (file) => {
  try {
    // Crear un objeto FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'profile_pictures');

    // Realizar la petición a la API de Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    // Devolver los datos relevantes de la respuesta
    return {
      success: true,
      url: response.data.secure_url,
      public_id: response.data.public_id
    };
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
};

/**
 * Elimina una imagen de Cloudinary usando su ID público
 * @param {string} publicId - El ID público de la imagen a eliminar
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const deleteImageFromCloudinary = async (publicId) => {
  // Nota: La eliminación segura de imágenes debería hacerse desde un backend
  // Esta función es solo para referencia y debería implementarse en un servidor
  console.warn('La eliminación de imágenes desde el frontend no es segura.');
  console.warn('Se recomienda implementar esta función en un backend.');
  
  return {
    success: false,
    error: 'La eliminación de imágenes debe implementarse en un backend por seguridad.'
  };
};

//Sube un archivo de audio a Cloudinary
export const uploadAudioToCloudinary = async (file) => {
  try {
    //Formdata envia archivos a travez de una peticion http
    const formData = new FormData();
    formData.append('file', file); //Agregas el archivo a l formulario "file"(!OBLIGATORIO¡)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);//Agregar Upload Preset que sirve para comtrolar configracones de subida
    formData.append('resource_type', 'auto'); // Detecta automáticamente si es audio o video
    formData.append('folder', 'sounds'); // Directorio de los audios  

    // Realiza la petición a la API de Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      formData
    );

    return {
      success: true,
      url: response.data.secure_url, //URL del audio 
      public_id: response.data.public_id //ID que claudio le da al archivo
    };
  } catch (error) {
    console.error('Error al subir audio a Cloudinary:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
};