// Configuración de Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import express from 'express';
import multer from 'multer';


/// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'botonera',
  api_key: '592739979425588',
  api_secret: 'jHh4O0bPJAbdFNYGGbwYfb1LUrc'
});

// Crear instancia de express y multer para manejar los archivos
const app = express();
const upload = multer({ dest: 'uploads/' });  // Carpeta temporal para almacenamiento de archivos

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

// Ruta para subir audio
app.post('../api/cloudinaryService', upload.single('file'), async (req, res) => {
  try {
    const file = req.file; // El archivo subido

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Subir archivo a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      upload_preset: 'botoneraPreset',
      resource_type: 'video', // Auto-detecta si es audio
      folder: 'sounds'
    });

    // Responder con la URL y el public_id
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default cloudinary;