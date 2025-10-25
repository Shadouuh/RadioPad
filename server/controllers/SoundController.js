import handleError from '../utils/handleError.js';

//Controlador para la gestión de sonidos
class SoundController {
  constructor(cloudinaryService) {
    this.cloudinaryService = cloudinaryService;
  }

  uploadSound = async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: 'No se proporcionó ningún archivo de audio'
        });
      }

      const result = await this.cloudinaryService.uploadAudio(req.file);

      // Responder con la información del archivo subido
      return res.status(201).json({
        error: false,
        message: 'Audio subido correctamente',
        data: result
      });

    } catch (error) {
      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json({
        error: true,
        message: errorResponse.message
      });
    }
  }

//Elimina un archivo de audio de Cloudinary
  deleteSound = async (req, res) => {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          error: true,
          message: 'Se requiere el ID público del audio'
        });
      }

      const result = await this.cloudinaryService.deleteAudio(publicId);

      if (result.result !== 'ok') {
        return res.status(404).json({
          error: true,
          message: 'No se pudo eliminar el audio o no existe'
        });
      }

      return res.status(200).json({
        error: false,
        message: 'Audio eliminado correctamente'
      });
    } catch (error) {
      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json({
        error: true,
        message: errorResponse.message
      });
    }
  }

  //Obtener Sonido
  getSoundInfo = async (req, res) => {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          error: true,
          message: 'Se requiere el ID público del audio'
        });
      }

      const result = await this.cloudinaryService.getAudioInfo(publicId);

      return res.status(200).json({
        error: false,
        data: result
      });
      
    } catch (error) {
      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json({
        error: true,
        message: errorResponse.message
      });
    }
  }
}

export default SoundController;