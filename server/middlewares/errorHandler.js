/**
 * Middleware para manejo centralizado de errores
 */

const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Errores específicos de Prisma
  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return res.status(409).json({
          message: 'Error de restricción única',
          details: err.meta?.target || 'Un registro con los mismos datos ya existe'
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          message: 'Recurso no encontrado',
          details: err.meta?.cause || 'El registro solicitado no existe'
        });
      default:
        return res.status(500).json({
          message: 'Error en la base de datos',
          details: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
        });
    }
  }

  // Error por defecto
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

module.exports = errorHandler;