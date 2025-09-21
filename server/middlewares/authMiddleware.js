import { verifyToken } from '../utils/jwt.js';

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

    req.user = decoded; // disponible en el controlador
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
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: se requieren permisos de administrador'
    });
  }
  next();
}