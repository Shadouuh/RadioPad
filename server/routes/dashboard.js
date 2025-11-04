import express from 'express';
import DashboardController from '../controllers/DashboardController.js';
import DashboardService from '../services/DashboardService.js';
import pool from '../db/conex.js';

const router = express.Router();

const dashboardService = new DashboardService(pool);
const dashboardController = new DashboardController(dashboardService);

// Rutas para gestión de usuarios
router.get('/data', dashboardController.getData);

export default router;