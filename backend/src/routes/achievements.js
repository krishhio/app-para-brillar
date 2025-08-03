const express = require('express');
const { executeQuery } = require('../database/connection');
const logger = require('../utils/logger');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/achievements - Obtener logros disponibles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const achievements = await executeQuery(
      'SELECT * FROM catalogo_logros WHERE es_activo = TRUE ORDER BY categoria, nombre_logro'
    );
    
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    logger.error('Error fetching achievements', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener los logros',
        code: 'ACHIEVEMENTS_FETCH_ERROR'
      }
    });
  }
});

// GET /api/achievements/user - Obtener logros del usuario
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userAchievements = await executeQuery(
      `SELECT lo.*, cl.nombre_logro, cl.descripcion, cl.categoria, cl.icono_nombre, cl.mensaje_desbloqueo
       FROM logros_obtenidos lo
       JOIN catalogo_logros cl ON lo.logro_id = cl.id
       WHERE lo.usuario_id = ?
       ORDER BY lo.fecha_obtencion DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      data: userAchievements
    });
  } catch (error) {
    logger.error('Error fetching user achievements', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener los logros del usuario',
        code: 'USER_ACHIEVEMENTS_FETCH_ERROR'
      }
    });
  }
});

module.exports = router; 