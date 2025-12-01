import { verifyToken } from '../utils/jwt.js';
import pool from './../db/conex.js';

const DEBUG_AUTH = process.env.DEBUG_AUTH === 'true';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token && DEBUG_AUTH) {
    console.warn('[AUTH] Cookie token ausente en la solicitud a', req.originalUrl);
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }

  try {
    const decoded = verifyToken(token);
    if (DEBUG_AUTH) {
      console.info('[AUTH] Token recibido y verificado para user_id:', decoded.user_id);
    }

    // Obtener datos básicos del usuario y configuración
    const [userResult] = await pool.query('SELECT u.*, c.* FROM users u JOIN config c ON u.user_id = c.user_id WHERE u.user_id = ?', [decoded.user_id]);
    
    if (!userResult[0]) {
      return res.status(403).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener programas asignados al usuario
    const [programs] = await pool.query(`
      SELECT p.id, p.name, p.description, p.status
      FROM programs p
      INNER JOIN user_programs up ON p.id = up.program_id
      WHERE up.user_id = ? AND p.status = 'Active'
      ORDER BY p.name ASC
    `, [decoded.user_id]);

    const user = {
      ...userResult[0],
      programs: programs || [],
      config: {
        effects_sounds: userResult[0].effects_sounds,
        notify: userResult[0].notify,
        dark_mode: userResult[0].dark_mode,
      }
    };

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