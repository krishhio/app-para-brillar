const express = require('express');
const { executeQuery } = require('../database/connection');
const logger = require('../utils/logger');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/history - Obtener historial de chat
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;
    
    const chatHistory = await executeQuery(
      `SELECT * FROM chat_ia 
       WHERE usuario_id = ? 
       ORDER BY fecha_creacion DESC 
       LIMIT ?`,
      [userId, parseInt(limit)]
    );
    
    res.json({
      success: true,
      data: chatHistory
    });
  } catch (error) {
    logger.error('Error fetching chat history', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener el historial de chat',
        code: 'CHAT_HISTORY_FETCH_ERROR'
      }
    });
  }
});

// POST /api/chat/message - Enviar mensaje al chat
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El mensaje no puede estar vacío',
          code: 'EMPTY_MESSAGE'
        }
      });
    }
    
    // Guardar mensaje del usuario
    const userMessageResult = await executeQuery(
      `INSERT INTO chat_ia (usuario_id, mensaje, es_usuario, fecha_creacion) 
       VALUES (?, ?, TRUE, NOW())`,
      [userId, message.trim()]
    );
    
    // TODO: Integrar con Gemini AI para obtener respuesta
    // Por ahora, devolver una respuesta simulada
    const aiResponse = "Gracias por tu mensaje. Estoy aquí para ayudarte en tu camino de crecimiento personal.";
    
    // Guardar respuesta de la IA
    await executeQuery(
      `INSERT INTO chat_ia (usuario_id, mensaje, es_usuario, fecha_creacion) 
       VALUES (?, ?, FALSE, NOW())`,
      [userId, aiResponse]
    );
    
    logger.info('Chat message processed', { userId: userId, messageLength: message.length });
    
    res.json({
      success: true,
      data: {
        userMessage: message.trim(),
        aiResponse: aiResponse
      }
    });
  } catch (error) {
    logger.error('Error processing chat message', { error: error.message, userId: req.user.id });
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al procesar el mensaje',
        code: 'CHAT_MESSAGE_ERROR'
      }
    });
  }
});

module.exports = router; 