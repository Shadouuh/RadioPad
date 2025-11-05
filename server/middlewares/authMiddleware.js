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
    
    console.log('=== DEBUG AUTH MIDDLEWARE ===');
    console.log('Token decodificado:', decoded);
    console.log('program_id en token:', decoded.program_id);
    console.log('role en token:', decoded.role);

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
  if (!req.user || req.user.role == 'Productor') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: se requieren permisos de administrador'
    });
  }
  next();
}