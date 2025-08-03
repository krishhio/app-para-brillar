const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../database/connection');
const logger = require('../utils/logger');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/gratitude - Obtener entradas del diario de gratitud
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, date } = req.query;
    
    let whereClause = 'WHERE usuario_id = ?';
    let params = [userId];
    
    if (date) {
      whereClause += ' AND DATE(fecha) = ?';
      params.push(date);
    }
    
    const offset = (page - 1) * limit;
    
    const entries = await executeQuery(
      `SELECT * FROM diario_gratitud ${whereClause} ORDER BY fecha DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    
    const totalCount = await executeQuery(
      `SELECT COUNT(*) as total FROM diario_gratitud ${whereClause}`,
      params
    );
    
    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount[0].total,
          pages: Math.ceil(totalCount[0].total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching gratitude entries', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener las entradas del diario',
        code: 'GRATITUDE_FETCH_ERROR'
      }
    });
  }
});

// GET /api/gratitude/:id - Obtener entrada específica
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    
    const entry = await executeQuery(
      'SELECT * FROM diario_gratitud WHERE id = ? AND usuario_id = ?',
      [entryId, userId]
    );
    
    if (!entry || entry.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Entrada no encontrada',
          code: 'ENTRY_NOT_FOUND'
        }
      });
    }
    
    res.json({
      success: true,
      data: entry[0]
    });
  } catch (error) {
    logger.error('Error fetching gratitude entry', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener la entrada',
        code: 'ENTRY_FETCH_ERROR'
      }
    });
  }
});

// POST /api/gratitude - Crear nueva entrada
router.post('/', authMiddleware, [
  body('fecha').isISO8601().withMessage('Fecha inválida'),
  body('sentimiento_id').optional().isInt().withMessage('ID de sentimiento inválido'),
  body('logros').optional().isArray().withMessage('Logros debe ser un array'),
  body('agradecimientos').optional().isArray().withMessage('Agradecimientos debe ser un array'),
  body('mejor_momento').optional().isLength({ max: 500 }).withMessage('Mejor momento demasiado largo'),
  body('aprendi_hoy').optional().isLength({ max: 500 }).withMessage('Aprendizaje demasiado largo'),
  body('pensamientos').optional().isLength({ max: 1000 }).withMessage('Pensamientos demasiado largos')
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
    const {
      fecha,
      sentimiento_id,
      logros,
      agradecimientos,
      mejor_momento,
      aprendi_hoy,
      pensamientos,
      negativo_a_positivo
    } = req.body;
    
    // Verificar si ya existe una entrada para esta fecha
    const existingEntry = await executeQuery(
      'SELECT id FROM diario_gratitud WHERE usuario_id = ? AND DATE(fecha) = DATE(?)',
      [userId, fecha]
    );
    
    if (existingEntry.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Ya existe una entrada para esta fecha',
          code: 'ENTRY_ALREADY_EXISTS'
        }
      });
    }
    
    const result = await executeQuery(
      `INSERT INTO diario_gratitud (
        usuario_id, fecha, sentimiento_id, logros, agradecimientos, 
        mejor_momento, aprendi_hoy, pensamientos, negativo_a_positivo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, fecha, sentimiento_id || null,
        logros ? JSON.stringify(logros) : null,
        agradecimientos ? JSON.stringify(agradecimientos) : null,
        mejor_momento, aprendi_hoy, pensamientos,
        negativo_a_positivo ? JSON.stringify(negativo_a_positivo) : null
      ]
    );
    
    const newEntry = await executeQuery(
      'SELECT * FROM diario_gratitud WHERE id = ?',
      [result.insertId]
    );
    
    logger.info('Gratitude entry created', { userId: userId, entryId: result.insertId });
    
    res.status(201).json({
      success: true,
      data: newEntry[0],
      message: 'Entrada creada correctamente'
    });
  } catch (error) {
    logger.error('Error creating gratitude entry', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al crear la entrada',
        code: 'ENTRY_CREATE_ERROR'
      }
    });
  }
});

// PUT /api/gratitude/:id - Actualizar entrada
router.put('/:id', authMiddleware, [
  body('sentimiento_id').optional().isInt().withMessage('ID de sentimiento inválido'),
  body('logros').optional().isArray().withMessage('Logros debe ser un array'),
  body('agradecimientos').optional().isArray().withMessage('Agradecimientos debe ser un array'),
  body('mejor_momento').optional().isLength({ max: 500 }).withMessage('Mejor momento demasiado largo'),
  body('aprendi_hoy').optional().isLength({ max: 500 }).withMessage('Aprendizaje demasiado largo'),
  body('pensamientos').optional().isLength({ max: 1000 }).withMessage('Pensamientos demasiado largos')
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
    const entryId = req.params.id;
    const {
      sentimiento_id,
      logros,
      agradecimientos,
      mejor_momento,
      aprendi_hoy,
      pensamientos,
      negativo_a_positivo
    } = req.body;
    
    // Verificar que la entrada existe y pertenece al usuario
    const existingEntry = await executeQuery(
      'SELECT id FROM diario_gratitud WHERE id = ? AND usuario_id = ?',
      [entryId, userId]
    );
    
    if (!existingEntry || existingEntry.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Entrada no encontrada',
          code: 'ENTRY_NOT_FOUND'
        }
      });
    }
    
    // Construir query de actualización
    const updateFields = [];
    const updateValues = [];
    
    if (sentimiento_id !== undefined) {
      updateFields.push('sentimiento_id = ?');
      updateValues.push(sentimiento_id);
    }
    if (logros !== undefined) {
      updateFields.push('logros = ?');
      updateValues.push(JSON.stringify(logros));
    }
    if (agradecimientos !== undefined) {
      updateFields.push('agradecimientos = ?');
      updateValues.push(JSON.stringify(agradecimientos));
    }
    if (mejor_momento !== undefined) {
      updateFields.push('mejor_momento = ?');
      updateValues.push(mejor_momento);
    }
    if (aprendi_hoy !== undefined) {
      updateFields.push('aprendi_hoy = ?');
      updateValues.push(aprendi_hoy);
    }
    if (pensamientos !== undefined) {
      updateFields.push('pensamientos = ?');
      updateValues.push(pensamientos);
    }
    if (negativo_a_positivo !== undefined) {
      updateFields.push('negativo_a_positivo = ?');
      updateValues.push(JSON.stringify(negativo_a_positivo));
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
    
    updateValues.push(entryId);
    const updateQuery = `UPDATE diario_gratitud SET ${updateFields.join(', ')} WHERE id = ? AND usuario_id = ?`;
    updateValues.push(userId);
    
    await executeQuery(updateQuery, updateValues);
    
    const updatedEntry = await executeQuery(
      'SELECT * FROM diario_gratitud WHERE id = ?',
      [entryId]
    );
    
    logger.info('Gratitude entry updated', { userId: userId, entryId: entryId });
    
    res.json({
      success: true,
      data: updatedEntry[0],
      message: 'Entrada actualizada correctamente'
    });
  } catch (error) {
    logger.error('Error updating gratitude entry', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar la entrada',
        code: 'ENTRY_UPDATE_ERROR'
      }
    });
  }
});

// DELETE /api/gratitude/:id - Eliminar entrada
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    
    const result = await executeQuery(
      'DELETE FROM diario_gratitud WHERE id = ? AND usuario_id = ?',
      [entryId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Entrada no encontrada',
          code: 'ENTRY_NOT_FOUND'
        }
      });
    }
    
    logger.info('Gratitude entry deleted', { userId: userId, entryId: entryId });
    
    res.json({
      success: true,
      message: 'Entrada eliminada correctamente'
    });
  } catch (error) {
    logger.error('Error deleting gratitude entry', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al eliminar la entrada',
        code: 'ENTRY_DELETE_ERROR'
      }
    });
  }
});

module.exports = router; 