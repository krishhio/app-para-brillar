const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../database/connection');
const logger = require('../utils/logger');
const { authMiddleware, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me - Obtener perfil del usuario actual
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await executeQuery(
      'SELECT id_usuario, nombre, apellido, correo_electronico, fecha_nacimiento, fotografia, id_color_tema, fecha_registro FROM usuarios WHERE id_usuario = ?',
      [userId]
    );

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: user[0]
    });
  } catch (error) {
    logger.error('Error getting user profile', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener el perfil del usuario',
        code: 'PROFILE_FETCH_ERROR'
      }
    });
  }
});

// PUT /api/users/me - Actualizar perfil del usuario
router.put('/me', authMiddleware, [
  body('nombre').optional().isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('apellido').optional().isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('correo_electronico').optional().isEmail().withMessage('Correo electrónico inválido'),
  body('fecha_nacimiento').optional().isISO8601().withMessage('Fecha de nacimiento inválida'),
  body('id_color_tema').optional().isInt().withMessage('ID de tema inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      });
    }

    const userId = req.user.id;
    const { nombre, apellido, correo_electronico, fecha_nacimiento, id_color_tema } = req.body;

    // Verificar que el correo_electronico no esté en uso por otro usuario
    if (correo_electronico) {
      const existingUser = await executeQuery(
        'SELECT id_usuario FROM usuarios WHERE correo_electronico = ? AND id_usuario != ?',
        [correo_electronico, userId]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'El correo electrónico ya está en uso',
            code: 'EMAIL_ALREADY_EXISTS'
          }
        });
      }
    }

    // Construir query de actualización
    const updateFields = [];
    const updateValues = [];

    if (nombre) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    if (apellido) {
      updateFields.push('apellido = ?');
      updateValues.push(apellido);
    }
    if (correo_electronico) {
      updateFields.push('correo_electronico = ?');
      updateValues.push(correo_electronico);
    }
    if (fecha_nacimiento) {
      updateFields.push('fecha_nacimiento = ?');
      updateValues.push(fecha_nacimiento);
    }
    if (id_color_tema) {
      updateFields.push('id_color_tema = ?');
      updateValues.push(id_color_tema);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No se proporcionaron datos para actualizar',
          code: 'NO_UPDATE_DATA'
        }
      });
    }

    // Log de depuración para ver la consulta y los valores
    logger.debug('Actualización de perfil', {
      updateQuery: `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = ?`,
      updateValues: [...updateValues, userId]
    });

    updateValues.push(userId);
    const updateQuery = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = ?`;

    await executeQuery(updateQuery, updateValues);

    // Obtener usuario actualizado
    const updatedUser = await executeQuery(
      'SELECT id_usuario, nombre, apellido, correo_electronico, fecha_nacimiento, fotografia, id_color_tema, fecha_registro FROM usuarios WHERE id_usuario = ?',
      [userId]
    );

    logger.info('User profile updated', { userId: userId });

    res.json({
      success: true,
      data: updatedUser[0],
      message: 'Perfil actualizado correctamente'
    });
  } catch (error) {
    logger.error('Error updating user profile', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar el perfil',
        code: 'PROFILE_UPDATE_ERROR'
      }
    });
  }
});

// PUT /api/users/me/password - Cambiar contraseña
router.put('/me/password', authMiddleware, [
  body('currentPassword').notEmpty().withMessage('Contraseña actual requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Obtener contraseña actual
    const user = await executeQuery(
      'SELECT password_hash FROM usuarios WHERE id_usuario = ?',
      [userId]
    );

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user[0].password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Contraseña actual incorrecta',
          code: 'INVALID_CURRENT_PASSWORD'
        }
      });
    }

    // Hashear nueva contraseña
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await executeQuery(
      'UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?',
      [newPasswordHash, userId]
    );

    logger.info('User password changed', { userId: userId });

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    logger.error('Error changing password', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al cambiar la contraseña',
        code: 'PASSWORD_CHANGE_ERROR'
      }
    });
  }
});

// DELETE /api/users/me - Eliminar cuenta del usuario
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Eliminar datos relacionados del usuario
    await executeQuery('DELETE FROM diario_gratitud WHERE usuario_id = ?', [userId]);
    await executeQuery('DELETE FROM frases_usuario WHERE usuario_id = ?', [userId]);
    await executeQuery('DELETE FROM retos_semanales WHERE usuario_id = ?', [userId]);
    await executeQuery('DELETE FROM logros_obtenidos WHERE usuario_id = ?', [userId]);
    await executeQuery('DELETE FROM seguimiento_logros_usuario WHERE usuario_id = ?', [userId]);
    await executeQuery('DELETE FROM chat_ia WHERE usuario_id = ?', [userId]);
    await executeQuery('DELETE FROM resumen_semanal WHERE usuario_id = ?', [userId]);
    await executeQuery('DELETE FROM mensajes_diarios WHERE usuario_id = ?', [userId]);

    // Eliminar usuario
    await executeQuery('DELETE FROM usuarios WHERE id_usuario = ?', [userId]);

    logger.info('User account deleted', { userId: userId });

    res.json({
      success: true,
      message: 'Cuenta eliminada correctamente'
    });
  } catch (error) {
    logger.error('Error deleting user account', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al eliminar la cuenta',
        code: 'ACCOUNT_DELETE_ERROR'
      }
    });
  }
});

module.exports = router;