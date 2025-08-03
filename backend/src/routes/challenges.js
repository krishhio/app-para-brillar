const express = require('express');
const { executeQuery } = require('../database/connection');
const logger = require('../utils/logger');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/challenges - Obtener retos disponibles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const challenges = await executeQuery(
      'SELECT * FROM catalogo_retos WHERE es_activo = TRUE ORDER BY categoria, nombre_reto'
    );
    
    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    logger.error('Error fetching challenges', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener los retos',
        code: 'CHALLENGES_FETCH_ERROR'
      }
    });
  }
});

// GET /api/challenges/user - Obtener retos del usuario
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userChallenges = await executeQuery(
      `SELECT rs.*, cr.nombre_reto, cr.descripcion, cr.categoria, cr.duracion_dias
       FROM retos_semanales rs
       JOIN catalogo_retos cr ON rs.reto_id = cr.id
       WHERE rs.usuario_id = ?
       ORDER BY rs.fecha_inicio DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      data: userChallenges
    });
  } catch (error) {
    logger.error('Error fetching user challenges', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener los retos del usuario',
        code: 'USER_CHALLENGES_FETCH_ERROR'
      }
    });
  }
});

module.exports = router; 