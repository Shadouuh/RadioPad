import express from 'express';
import SoundController from '../controllers/SoundController.js';
import CloudinaryService from '../services/CloudinaryService.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { handleUpload, cleanTempFiles } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

const cloudinaryService = CloudinaryService;
const soundController = new SoundController(cloudinaryService);

//Rutas
router.post('/upload', 
  requireAuth, 
  handleUpload, 
  cleanTempFiles, 
  soundController.uploadSound
);

router.delete('/:publicId', 
  requireAuth, 
  soundController.deleteSound
);

router.get('/:publicId', 
  requireAuth, 
  soundController.getSoundInfo
);

export default router;