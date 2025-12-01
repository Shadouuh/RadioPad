import express from 'express';
import UserController from '../controllers/UserController.js';
import UserService from '../services/UserService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

const userService = new UserService(pool);
const userController = new UserController(userService);

// Rutas para gestión de usuarios
router.get('/', requireAuth, userController.getAllUsers);
router.get('/:id', requireAuth, userController.getUserById);
router.post('/', requireAuth, userController.createUser);
router.put('/:id', requireAuth, userController.updateUser);
router.delete('/:id', requireAuth, userController.deleteUser);
router.patch('/:id/toggle-status', requireAuth, userController.toggleUserStatus);
router.get('/role/:role', requireAuth, userController.getUsersByRole);

export default router;