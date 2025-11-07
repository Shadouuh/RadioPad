import { verifyToken } from '../utils/jwt.js';
import pool from './../db/conex.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }

  try {
    const decoded = verifyToken(token);

    const [userResult] = await pool.query('SELECT u.*, c.* FROM users u JOIN config c ON u.user_id = c.user_id WHERE u.user_id = ?', [decoded.user_id]);
    const user = {...userResult[0], config:{
      effects_sounds: userResult[0].effects_sounds,
      notify: userResult[0].notify,
      dark_mode: userResult[0].dark_mode,
    }};
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    req.user = user; // disponible en el controlador
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}

// Middleware para verificar que el usuario es admin
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role == 'Productor') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: se requieren permisos de administrador'
    });
  }
  next();
}