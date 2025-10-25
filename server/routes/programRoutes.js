import express from 'express';
import * as programController from '../controllers/programController.js';

const router = express.Router();

// Rutas para programas
router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramById);
router.post('/', programController.createProgram);
router.put('/:id', programController.updateProgram);
router.delete('/:id', programController.deleteProgram);

export default router;