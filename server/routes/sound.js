import express from 'express';
import SoundController from '../controllers/SoundController.js';
import CloudinaryService from '../services/CloudinaryService.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { handleUpload, cleanTempFiles } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

const cloudinaryService = CloudinaryService;
const soundController = new SoundController(cloudinaryService);

// Rutas para gestión de sonidos
// Subir un nuevo sonido (Cloudinary + BD)
router.post('/upload', 
  // requireAuth,  // Comentado temporalmente para pruebas
  handleUpload, 
  cleanTempFiles, 
  soundController.uploadSound
);

// Obtener todos los sonidos
router.get('/', 
  // requireAuth,  // Comentado temporalmente para pruebas
  soundController.getAllSounds
);

// Obtener sonidos institucionales
router.get('/institutional', 
  // requireAuth,  // Comentado temporalmente para pruebas
  soundController.getInstitutionalSounds
);

// Obtener un sonido específico por ID
router.get('/:soundId', 
  // requireAuth,  // Comentado temporalmente para pruebas
  soundController.getSoundInfo
);

// Eliminar un sonido por ID
router.delete('/:soundId', 
  // requireAuth,  // Comentado temporalmente para pruebas
  soundController.deleteSound
);

export default router;