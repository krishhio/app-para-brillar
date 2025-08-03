const express = require('express');
const { executeQuery } = require('../database/connection');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/themes - Obtener todos los temas disponibles
router.get('/', async (req, res) => {
  try {
    const themes = await executeQuery(
      'SELECT * FROM catalogo_colores_temas WHERE es_activo = TRUE ORDER BY nombre_display'
    );
    
    res.json({
      success: true,
      data: themes
    });
  } catch (error) {
    logger.error('Error fetching themes', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener los temas',
        code: 'THEMES_FETCH_ERROR'
      }
    });
  }
});

// GET /api/themes/:id - Obtener tema específico
router.get('/:id', async (req, res) => {
  try {
    const themeId = req.params.id;
    
    const theme = await executeQuery(
      'SELECT * FROM catalogo_colores_temas WHERE id = ? AND es_activo = TRUE',
      [themeId]
    );
    
    if (!theme || theme.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Tema no encontrado',
          code: 'THEME_NOT_FOUND'
        }
      });
    }
    
    res.json({
      success: true,
      data: theme[0]
    });
  } catch (error) {
    logger.error('Error fetching theme', { error: error.message, themeId: req.params.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener el tema',
        code: 'THEME_FETCH_ERROR'
      }
    });
  }
});

module.exports = router; 