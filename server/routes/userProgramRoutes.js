import express from 'express';
import * as userProgramController from '../controllers/userProgramController.js';

const router = express.Router();

// Rutas para la relación entre usuarios y programas
router.post('/assign', userProgramController.assignProgramToUser);
router.delete('/:userId/:programId', userProgramController.removeProgramFromUser);
router.get('/user/:userId', userProgramController.getUserPrograms);
router.get('/program/:programId', userProgramController.getProgramUsers);

export default router;