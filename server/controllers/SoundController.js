import handleError from '../utils/handleError.js';
import soundService from '../services/SoundService.js';

//Controlador para la gestión de sonidos
class SoundController {
  constructor(cloudinaryService) {
    this.cloudinaryService = cloudinaryService;
  }

  // Subir un sonido a Cloudinary y guardarlo en la base de datos
  uploadSound = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: 'No se proporcionó ningún archivo de audio'
        });
      }

      // Subir a Cloudinary
      const cloudinaryResult = await this.cloudinaryService.uploadAudio(req.file);
      
      // Guardar en la base de datos
      const soundData = {
        sound_name: req.body.sound_name || req.file.originalname,
        description: req.body.description || '',
        file_path: cloudinaryResult.url, 
        duration_seconds: cloudinaryResult.duration || 0,
        file_size: req.file.size,
        is_institutional: req.body.is_institutional === 'true',
        category_id: req.body.category_id || null,
        created_by: req.user?.id || null
      };
      
      const savedSound = await soundService.createSound(soundData);

      // Responder con la información del archivo subido
      return res.status(201).json({
        error: false,
        message: 'Audio subido correctamente',
        data: {
          ...cloudinaryResult,
          ...savedSound
        }
      });

    } catch (error) {
      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json({
        error: true,
        message: errorResponse.message
      });
    }
  }

  // Eliminar un sonido de Cloudinary y de la base de datos
  deleteSound = async (req, res) => {
    try {
      const { soundId } = req.params;

      if (!soundId) {
        return res.status(400).json({
          error: true,
          message: 'Se requiere el ID del sonido'
        });
      }
      
      
      const sound = await soundService.getSoundById(soundId);
      
      // Extraer el public_id del file_path o usar el soundId como fallback
      const urlParts = sound.file_path.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const publicId = fileName.split('.')[0]; 
      
      // Eliminar de Cloudinary
      const cloudinaryResult = await this.cloudinaryService.deleteAudio(publicId);

      if (cloudinaryResult.result !== 'ok') {
        console.warn('No se pudo eliminar el audio de Cloudinary, pero se eliminará de la base de datos');
      }
      
      // Eliminar de la base de datos
      await soundService.deleteSound(soundId);

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

  // Obtener información de un sonido específico
  getSoundInfo = async (req, res) => {
    try {
      const { soundId } = req.params;

      if (!soundId) {
        return res.status(400).json({
          error: true,
          message: 'Se requiere el ID del sonido'
        });
      }

      const sound = await soundService.getSoundById(soundId);

      return res.status(200).json({
        error: false,
        data: sound
      });
      
    } catch (error) {
      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json({
        error: true,
        message: errorResponse.message
      });
    }
  }
  
  // Obtener todos los sonidos
  getAllSounds = async (req, res) => {
    try {
      const sounds = await soundService.getAllSounds();
      
      return res.status(200).json({
        error: false,
        data: sounds
      });
    } catch (error) {
      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json({
        error: true,
        message: errorResponse.message
      });
    }
  }
  
  // Obtener sonidos institucionales
  getInstitutionalSounds = async (req, res) => {
    try {
      const sounds = await soundService.getInstitutionalSounds();
      
      return res.status(200).json({
        error: false,
        data: sounds
      });
    } catch (error) {
      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json({
        error: true,
        message: errorResponse.message
      });
    }
  }

  // ===== MÉTODOS PARA SONIDOS DE PROGRAMAS =====

  // Crear un sonido asociado a un programa
  createProgramSound = async (req, res) => {
    try {
      const { programId } = req.params;
      const { name, description, duration, category, file_url } = req.body;

      if (!programId || !name || !category) {
        return res.status(400).json({
          success: false,
          message: 'El ID del programa, nombre y categoría son requeridos'
        });
      }

      const soundData = {
        name,
        description: description || '',
        duration: duration || 'N/A',
        category,
        file_url: file_url || '',
        program_id: parseInt(programId)
      };

      const sound = await soundService.createProgramSound(soundData);

      return res.status(201).json({
        success: true,
        message: 'Sonido creado exitosamente',
        data: sound
      });

    } catch (error) {
      return handleError(res, error);
    }
  }

  // Obtener sonidos de un programa específico
  getProgramSounds = async (req, res) => {
    try {
      const { programId } = req.params;

      if (!programId || isNaN(programId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de programa inválido'
        });
      }

      const sounds = await soundService.getSoundsByProgram(parseInt(programId));

      return res.status(200).json({
        success: true,
        message: 'Sonidos obtenidos exitosamente',
        data: sounds
      });

    } catch (error) {
      return handleError(res, error);
    }
  }

  // Obtener un sonido de programa por ID
  getProgramSoundById = async (req, res) => {
    try {
      const { soundId } = req.params;

      if (!soundId || isNaN(soundId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de sonido inválido'
        });
      }

      const sound = await soundService.getProgramSoundById(parseInt(soundId));

      return res.status(200).json({
        success: true,
        message: 'Sonido obtenido exitosamente',
        data: sound
      });

    } catch (error) {
      return handleError(res, error);
    }
  }

  // Actualizar un sonido de programa
  updateProgramSound = async (req, res) => {
    try {
      const { soundId } = req.params;
      const { name, description, duration, category, file_url } = req.body;

      if (!soundId || isNaN(soundId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de sonido inválido'
        });
      }

      if (!name || !category) {
        return res.status(400).json({
          success: false,
          message: 'El nombre y la categoría son requeridos'
        });
      }

      const soundData = {
        name,
        description: description || '',
        duration: duration || 'N/A',
        category,
        file_url: file_url || ''
      };

      const sound = await soundService.updateProgramSound(parseInt(soundId), soundData);

      return res.status(200).json({
        success: true,
        message: 'Sonido actualizado exitosamente',
        data: sound
      });

    } catch (error) {
      return handleError(res, error);
    }
  }

  // Eliminar un sonido de programa
  deleteProgramSound = async (req, res) => {
    try {
      const { soundId } = req.params;

      if (!soundId || isNaN(soundId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de sonido inválido'
        });
      }

      const result = await soundService.deleteProgramSound(parseInt(soundId));

      return res.status(200).json({
        success: true,
        message: 'Sonido eliminado exitosamente'
      });

    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default SoundController;