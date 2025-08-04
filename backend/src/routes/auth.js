const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { executeQuery } = require('../database/connection');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');

// Middleware de validación
const validateRegistration = [
  body('nombre').trim().isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido').trim().isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('correo_electronico').isEmail().normalizeEmail().withMessage('Correo electrónico inválido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('fecha_nacimiento').isISO8601().toDate().withMessage('Fecha de nacimiento inválida')
];

const validateLogin = [
  body('correo_electronico').isEmail().normalizeEmail().withMessage('Correo electrónico inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// POST /api/auth/register - Registro de usuario
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de registro inválidos',
          details: errors.array().map(err => err.msg)
        }
      });
    }

    const { nombre, apellido, correo_electronico, password, fecha_nacimiento } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await executeQuery(
      'SELECT id_usuario FROM usuarios WHERE correo_electronico = ?',
      [correo_electronico]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: 'Ya existe un usuario con este correo electrónico'
        }
      });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo usuario
    const result = await executeQuery(
      `INSERT INTO usuarios (nombre, apellido, correo_electronico, password_hash, fecha_nacimiento) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, correo_electronico, passwordHash, fecha_nacimiento]
    );

    const userId = result.insertId;

    // Crear registro de seguimiento de logros
    await executeQuery(
      'INSERT INTO seguimiento_logros_usuario (id_usuario) VALUES (?)',
      [userId]
    );

    // Generar JWT token
    const token = jwt.sign(
      { userId, email: correo_electronico },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generar refresh token
    const refreshToken = jwt.sign(
      { userId, email: correo_electronico },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`Usuario registrado exitosamente: ${correo_electronico}`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: userId,
          nombre,
          apellido,
          correo_electronico,
          fecha_nacimiento
        },
        token,
        refreshToken
      }
    });

  } catch (error) {
    logger.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// POST /api/auth/login - Inicio de sesión
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de login inválidos',
          details: errors.array().map(err => err.msg)
        }
      });
    }

    const { correo_electronico, password } = req.body;

    // Buscar usuario
    const users = await executeQuery(
      `SELECT id_usuario, nombre, apellido, password_hash, es_activo 
       FROM usuarios WHERE correo_electronico = ?`,
      [correo_electronico]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciales inválidas'
        }
      });
    }

    const user = users[0];

    // Verificar si el usuario está activo
    if (!user.es_activo) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'La cuenta está deshabilitada'
        }
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciales inválidas'
        }
      });
    }

    // Actualizar último acceso
    await executeQuery(
      'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = ?',
      [user.id_usuario]
    );

    // Generar JWT token
    const token = jwt.sign(
      { userId: user.id_usuario, email: correo_electronico },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generar refresh token
    const refreshToken = jwt.sign(
      { userId: user.id_usuario, email: correo_electronico },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`Usuario logueado exitosamente: ${correo_electronico}`);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          correo_electronico
        },
        token,
        refreshToken
      }
    });

  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token es requerido'
        }
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Verificar que el usuario existe y está activo (refresh)
    const users = await executeQuery(
      'SELECT id_usuario, correo_electronico, es_activo FROM usuarios WHERE id_usuario = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].es_activo) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token inválido'
        }
      });
    }

    // Generar nuevo token
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generar nuevo refresh token
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token inválido o expirado'
        }
      });
    }

    logger.error('Error al renovar token:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', async (req, res) => {
  try {
    // En una implementación más robusta, podrías invalidar el token
    // agregándolo a una lista negra en Redis
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    logger.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener información del usuario actual (me)
    const users = await executeQuery(
      `SELECT id_usuario, nombre, apellido, correo_electronico, fecha_nacimiento, 
              fotografia, id_color_tema, fecha_registro, ultimo_acceso
       FROM usuarios WHERE id_usuario = ? AND es_activo = TRUE`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado'
        }
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          correo_electronico: user.correo_electronico,
          fecha_nacimiento: user.fecha_nacimiento,
          fotografia: user.fotografia,
          id_color_tema: user.id_color_tema,
          fecha_registro: user.fecha_registro,
          ultimo_acceso: user.ultimo_acceso
        }
      }
    });

  } catch (error) {
    logger.error('Error al obtener información del usuario:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

module.exports = router;