const logger = require('../utils/logger');

// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.logError(err, req);

  // Determinar el tipo de error
  let statusCode = 500;
  let message = 'Error interno del servidor';

  // Errores de validación
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
  }
  // Errores de autenticación
  else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'No autorizado';
  }
  // Errores de permisos
  else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Acceso denegado';
  }
  // Errores de recursos no encontrados
  else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Recurso no encontrado';
  }
  // Errores de conflicto
  else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = 'Conflicto con el recurso';
  }
  // Errores de base de datos
  else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'El recurso ya existe';
  }
  else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referencia inválida';
  }
  else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    message = 'No se puede eliminar, está siendo referenciado';
  }

  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.message
      })
    },
    timestamp: new Date().toISOString()
  });
};

// Middleware para capturar errores no manejados
const unhandledErrorHandler = (err) => {
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  
  // En producción, podrías enviar una notificación aquí
  process.exit(1);
};

// Middleware para capturar promesas rechazadas
const unhandledRejectionHandler = (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise
  });
  
  // En producción, podrías enviar una notificación aquí
  process.exit(1);
};

// Configurar handlers para errores no capturados
process.on('uncaughtException', unhandledErrorHandler);
process.on('unhandledRejection', unhandledRejectionHandler);

module.exports = errorHandler; 