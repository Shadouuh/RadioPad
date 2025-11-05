import express from 'express';
import ProgramController from '../controllers/ProgramController.js';
import ProgramService from '../services/ProgramService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

const programService = new ProgramService(pool);
const programController = new ProgramController(programService);

// Rutas para programas
router.post('/', requireAuth, programController.createProgram);
router.get('/', requireAuth, programController.getAllPrograms);
router.get('/user/my-programs', requireAuth, programController.getUserPrograms);
router.get('/:id', requireAuth, programController.getProgramById);
router.put('/:id', requireAuth, programController.updateProgram);
router.delete('/:id', requireAuth, programController.deleteProgram);
router.patch('/:id/toggle-status', requireAuth, programController.toggleProgramStatus);

export default router;