const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    console.log('HEADER AUTH:', authHeader);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token de acceso requerido',
          code: 'TOKEN_REQUIRED'
        }
      });
    }

    // Verificar formato del token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    console.log('TOKEN RECIBIDO:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Formato de token inválido',
          code: 'INVALID_TOKEN_FORMAT'
        }
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DECODED PAYLOAD:', decoded);
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    logger.info('User authenticated', {
      userId: req.user.id,
      email: req.user.email,
      endpoint: req.originalUrl
    });

    next();
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error.message,
      endpoint: req.originalUrl,
      ip: req.ip
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        }
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token inválido',
          code: 'INVALID_TOKEN'
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Error en la autenticación',
        code: 'AUTH_ERROR'
      }
    });
  }
};

// Middleware opcional de autenticación (no falla si no hay token)
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(); // Continuar sin autenticación
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return next(); // Continuar sin autenticación
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    // Si hay error en el token, continuar sin autenticación
    next();
  }
};

// Middleware para verificar roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Autenticación requerida',
          code: 'AUTH_REQUIRED'
        }
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        userRole: userRole,
        requiredRoles: allowedRoles,
        endpoint: req.originalUrl
      });

      return res.status(403).json({
        success: false,
        error: {
          message: 'Permisos insuficientes',
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario es el propietario del recurso
const requireOwnership = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Autenticación requerida',
          code: 'AUTH_REQUIRED'
        }
      });
    }

    const resourceId = req.params[resourceIdParam];
    const userId = req.user.id;

    // Si el usuario es admin, permitir acceso
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar que el usuario es el propietario
    if (resourceId !== userId) {
      logger.warn('Resource ownership violation', {
        userId: req.user.id,
        resourceId: resourceId,
        endpoint: req.originalUrl
      });

      return res.status(403).json({
        success: false,
        error: {
          message: 'Acceso denegado al recurso',
          code: 'RESOURCE_ACCESS_DENIED'
        }
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole,
  requireOwnership
};