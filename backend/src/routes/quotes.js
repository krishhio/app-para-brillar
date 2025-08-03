const express = require('express');
const router = express.Router();

const db = require('../database/connection');
const logger = require('../utils/logger');

// GET /api/quotes/daily - Obtener frase del día
router.get('/daily', async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    // Verificar si ya se asignó una frase para hoy
    const [existingMessages] = await db.execute(
      'SELECT * FROM mensajes_diarios WHERE id_usuario = ? AND fecha_asignacion = ?',
      [userId, today]
    );

    let dailyQuote;

    if (existingMessages.length > 0) {
      // Obtener la frase ya asignada
      const [quotes] = await db.execute(
        `SELECT cf.*, md.fecha_visualizacion
         FROM catalogo_frases cf
         INNER JOIN mensajes_diarios md ON cf.id_frase = md.id_frase
         WHERE md.id_mensaje_diario = ?`,
        [existingMessages[0].id_mensaje_diario]
      );
      dailyQuote = quotes[0];
    } else {
      // Asignar nueva frase del día
      const [availableQuotes] = await db.execute(
        `SELECT cf.* FROM catalogo_frases cf
         WHERE cf.es_activo = TRUE
         AND cf.id_frase NOT IN (
           SELECT md.id_frase FROM mensajes_diarios md 
           WHERE md.id_usuario = ? 
           AND md.fecha_asignacion >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         )
         ORDER BY RAND()
         LIMIT 1`,
        [userId]
      );

      if (availableQuotes.length === 0) {
        // Si no hay frases disponibles, usar cualquier frase activa
        const [fallbackQuotes] = await db.execute(
          'SELECT * FROM catalogo_frases WHERE es_activo = TRUE ORDER BY RAND() LIMIT 1'
        );
        dailyQuote = fallbackQuotes[0];
      } else {
        dailyQuote = availableQuotes[0];
      }

      // Guardar la asignación
      await db.execute(
        'INSERT INTO mensajes_diarios (id_usuario, id_frase, fecha_asignacion) VALUES (?, ?, ?)',
        [userId, dailyQuote.id_frase, today]
      );
    }

    res.json({
      success: true,
      data: {
        quote: dailyQuote
      }
    });

  } catch (error) {
    logger.error('Error al obtener frase del día:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// POST /api/quotes/daily/view - Marcar frase como vista
router.post('/daily/view', async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    // Actualizar fecha de visualización
    await db.execute(
      'UPDATE mensajes_diarios SET fecha_visualizacion = CURRENT_TIMESTAMP WHERE id_usuario = ? AND fecha_asignacion = ?',
      [userId, today]
    );

    // Actualizar seguimiento de logros
    await db.execute(
      `UPDATE seguimiento_logros_usuario 
       SET fechas_mensaje_diario = JSON_ARRAY_APPEND(
         COALESCE(fechas_mensaje_diario, JSON_ARRAY()), 
         '$', ?
       )
       WHERE id_usuario = ?`,
      [today, userId]
    );

    res.json({
      success: true,
      message: 'Frase marcada como vista'
    });

  } catch (error) {
    logger.error('Error al marcar frase como vista:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// GET /api/quotes/favorites - Obtener frases favoritas
router.get('/favorites', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const [favorites] = await db.execute(
      `SELECT cf.*, fu.fecha_frase, fu.estatus
       FROM catalogo_frases cf
       INNER JOIN frases_usuario fu ON cf.id_frase = fu.id_frase
       WHERE fu.id_usuario = ? AND fu.es_favorito = TRUE AND fu.estatus = 'activo'
       ORDER BY fu.fecha_frase DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), offset]
    );

    // Contar total de favoritos
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM frases_usuario WHERE id_usuario = ? AND es_favorito = TRUE AND estatus = "activo"',
      [userId]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    logger.error('Error al obtener frases favoritas:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// POST /api/quotes/:id/favorite - Agregar/remover de favoritos
router.post('/:id/favorite', async (req, res) => {
  try {
    const userId = req.user.userId;
    const quoteId = req.params.id;
    const { isFavorite = true } = req.body;

    // Verificar que la frase existe
    const [quotes] = await db.execute(
      'SELECT id_frase FROM catalogo_frases WHERE id_frase = ? AND es_activo = TRUE',
      [quoteId]
    );

    if (quotes.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'QUOTE_NOT_FOUND',
          message: 'Frase no encontrada'
        }
      });
    }

    // Verificar si ya existe la relación
    const [existingRelations] = await db.execute(
      'SELECT id_frase_usuario FROM frases_usuario WHERE id_usuario = ? AND id_frase = ?',
      [userId, quoteId]
    );

    if (existingRelations.length > 0) {
      // Actualizar relación existente
      await db.execute(
        'UPDATE frases_usuario SET es_favorito = ?, fecha_frase = CURRENT_TIMESTAMP WHERE id_usuario = ? AND id_frase = ?',
        [isFavorite, userId, quoteId]
      );
    } else {
      // Crear nueva relación
      await db.execute(
        'INSERT INTO frases_usuario (id_usuario, id_frase, es_favorito) VALUES (?, ?, ?)',
        [userId, quoteId, isFavorite]
      );
    }

    // Actualizar seguimiento de logros si es la primera vez
    if (isFavorite) {
      const [trackingResult] = await db.execute(
        'SELECT frases_compartidas FROM seguimiento_logros_usuario WHERE id_usuario = ?',
        [userId]
      );

      if (trackingResult.length > 0) {
        const sharedQuotes = JSON.parse(trackingResult[0].frases_compartidas || '[]');
        if (!sharedQuotes.includes(quoteId)) {
          sharedQuotes.push(quoteId);
          await db.execute(
            'UPDATE seguimiento_logros_usuario SET frases_compartidas = ? WHERE id_usuario = ?',
            [JSON.stringify(sharedQuotes), userId]
          );
        }
      }
    }

    const action = isFavorite ? 'agregada a' : 'removida de';
    logger.info(`Frase ${action} favoritos: usuario ${userId}, frase ${quoteId}`);

    res.json({
      success: true,
      message: `Frase ${action} favoritos exitosamente`
    });

  } catch (error) {
    logger.error('Error al gestionar favoritos:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// GET /api/quotes/categories - Obtener categorías de frases
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute(
      `SELECT categoria, COUNT(*) as total_frases
       FROM catalogo_frases 
       WHERE es_activo = TRUE AND categoria IS NOT NULL
       GROUP BY categoria
       ORDER BY total_frases DESC`
    );

    res.json({
      success: true,
      data: {
        categories
      }
    });

  } catch (error) {
    logger.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// GET /api/quotes/search - Buscar frases
router.get('/search', async (req, res) => {
  try {
    const { q, categoria, autor, page = 1, limit = 20 } = req.query;

    if (!q && !categoria && !autor) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_SEARCH_PARAMS',
          message: 'Se requiere al menos un parámetro de búsqueda'
        }
      });
    }

    let whereClause = 'WHERE es_activo = TRUE';
    const params = [];

    if (q) {
      whereClause += ' AND (nombre_frase LIKE ? OR autor LIKE ?)';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm);
    }

    if (categoria) {
      whereClause += ' AND categoria = ?';
      params.push(categoria);
    }

    if (autor) {
      whereClause += ' AND autor LIKE ?';
      params.push(`%${autor}%`);
    }

    const offset = (page - 1) * limit;

    const [quotes] = await db.execute(
      `SELECT * FROM catalogo_frases 
       ${whereClause}
       ORDER BY fecha_creacion DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Contar total de resultados
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM catalogo_frases ${whereClause}`,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    logger.error('Error al buscar frases:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// GET /api/quotes/random - Obtener frase aleatoria
router.get('/random', async (req, res) => {
  try {
    const { categoria } = req.query;

    let whereClause = 'WHERE es_activo = TRUE';
    const params = [];

    if (categoria) {
      whereClause += ' AND categoria = ?';
      params.push(categoria);
    }

    const [quotes] = await db.execute(
      `SELECT * FROM catalogo_frases 
       ${whereClause}
       ORDER BY RAND()
       LIMIT 1`,
      params
    );

    if (quotes.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_QUOTES_FOUND',
          message: 'No se encontraron frases'
        }
      });
    }

    res.json({
      success: true,
      data: {
        quote: quotes[0]
      }
    });

  } catch (error) {
    logger.error('Error al obtener frase aleatoria:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
});

// GET /api/quotes/history - Obtener historial de frases del día
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 30 } = req.query;

    const offset = (page - 1) * limit;

    const [history] = await db.execute(
      `SELECT cf.*, md.fecha_asignacion, md.fecha_visualizacion
       FROM catalogo_frases cf
       INNER JOIN mensajes_diarios md ON cf.id_frase = md.id_frase
       WHERE md.id_usuario = ?
       ORDER BY md.fecha_asignacion DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), offset]
    );

    // Contar total de entradas en historial
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM mensajes_diarios WHERE id_usuario = ?',
      [userId]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    logger.error('Error al obtener historial de frases:', error);
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