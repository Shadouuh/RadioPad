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
// Rutas para asignación de programas a usuarios (colocar antes de rutas con :id para evitar colisiones)
router.post('/assign', requireAuth, programController.assignProgramToUser);
router.delete('/unassign', requireAuth, programController.unassignProgramFromUser);
router.get('/:id', requireAuth, programController.getProgramById);
router.put('/:id', requireAuth, programController.updateProgram);
router.delete('/:id', requireAuth, programController.deleteProgram);
router.patch('/:id/toggle-status', requireAuth, programController.toggleProgramStatus);
router.get('/:id/users', requireAuth, programController.getProgramUsers);

export default router;