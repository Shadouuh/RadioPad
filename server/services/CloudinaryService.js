import { v2 as cloudinary } from 'cloudinary';

//COnfiguracion
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

//Manejar la subida de archivos
class CloudinaryService {

  async uploadAudio(file, folder = 'sounds') {
    try {
      if (!file) throw {status: 400, message: 'No se proporcionó ningún archivo'};
      
      // Subir el archivo a Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: folder,
        use_filename: true,
        unique_filename: true
      });
      
      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        duration: result.duration || null,
        resource_type: result.resource_type
      };

    } catch (error) {
      if (error.status) throw error;
      throw {status: 500, message: 'Error al subir el audio a Cloudinary'};
    }
  }

  //Eliminar Sonido
  async deleteAudio(publicId) {
    try {
      if (!publicId) throw {status: 400, message: 'No se proporcionó el ID público del archivo'};
      
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video'
      });
      
      return result;
    } catch (error) {
      if (error.status) throw error;
      throw {status: 500, message: 'Error al eliminar el audio de Cloudinary'};
    }
  }

 //Obtener audio
  async getAudioInfo(publicId) {
    try {
      if (!publicId) throw {status: 400, message: 'No se proporcionó el ID público del archivo'};
      
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'video' 
      });
      
      return result;
    } catch (error) {
      if (error.status) throw error;
      throw {status: 500, message: 'Error al obtener información del audio'};
    }
  }
}

export default new CloudinaryService();