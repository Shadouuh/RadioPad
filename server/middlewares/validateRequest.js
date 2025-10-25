/**
 * Middleware para validación de solicitudes
 * @param {Object} schema - Esquema de validación
 * @returns {Function} Middleware de Express
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Si no hay esquema, continuar
      if (!schema) return next();
      
      const { error } = schema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          message: 'Error de validación',
          details: error.details.map(detail => detail.message)
        });
      }
      
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validateRequest;