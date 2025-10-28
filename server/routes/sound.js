import express from 'express';
import SoundController from '../controllers/SoundController.js';
import CloudinaryService from '../services/CloudinaryService.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { handleUpload, cleanTempFiles } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

const cloudinaryService = CloudinaryService;
const soundController = new SoundController(cloudinaryService);

// Rutas para gestión de sonidos
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

// ===== RUTAS PARA SONIDOS DE PROGRAMAS =====

// Crear un sonido asociado a un programa
router.post('/program/:programId', 
  requireAuth,
  soundController.createProgramSound
);

// Obtener sonidos de un programa específico
router.get('/program/:programId', 
  requireAuth,
  soundController.getProgramSounds
);

// Obtener un sonido de programa por ID
router.get('/program-sound/:soundId', 
  requireAuth,
  soundController.getProgramSoundById
);

// Actualizar un sonido de programa
router.put('/program-sound/:soundId', 
  requireAuth,
  soundController.updateProgramSound
);

// Eliminar un sonido de programa
router.delete('/program-sound/:soundId', 
  requireAuth,
  soundController.deleteProgramSound
);

export default router;