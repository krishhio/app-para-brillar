const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Configuración de la conexión
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app_para_brillar',
  charset: process.env.DB_CHARSET || 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de conexiones
let pool = null;

// Función para crear el pool de conexiones
const createPool = () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Configurar eventos del pool
    pool.on('connection', (connection) => {
      logger.info('New database connection established');
      
      connection.on('error', (err) => {
        logger.error('Database connection error', { error: err.message });
      });
    });

    pool.on('acquire', (connection) => {
      logger.debug('Connection acquired from pool');
    });

    pool.on('release', (connection) => {
      logger.debug('Connection released to pool');
    });

    logger.info('Database connection pool created successfully');
    return pool;
  } catch (error) {
    logger.error('Failed to create database pool', { error: error.message });
    throw error;
  }
};

// Función para obtener una conexión del pool
const getConnection = async () => {
  try {
    if (!pool) {
      pool = createPool();
    }
    
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    logger.error('Failed to get database connection', { error: error.message });
    throw error;
  }
};

// Función para ejecutar queries
const executeQuery = async (sql, params = []) => {
  let connection = null;
  
  try {
    connection = await getConnection();
    
    logger.debug('Executing query', { 
      sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
      params: params 
    });
    
    const [rows] = await connection.execute(sql, params);
    
    logger.debug('Query executed successfully', { 
      rowCount: Array.isArray(rows) ? rows.length : 1 
    });
    
    return rows;
  } catch (error) {
    logger.error('Query execution failed', { 
      error: error.message, 
      sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
      params: params 
    });
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Función para ejecutar transacciones
const executeTransaction = async (callback) => {
  let connection = null;
  
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    
    logger.debug('Transaction started');
    
    const result = await callback(connection);
    
    await connection.commit();
    
    logger.debug('Transaction committed successfully');
    
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
      logger.debug('Transaction rolled back');
    }
    
    logger.error('Transaction failed', { error: error.message });
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Función para verificar la conexión
const testConnection = async () => {
  try {
    const result = await executeQuery('SELECT 1 as test');
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    logger.error('Database connection test failed', { error: error.message });
    return false;
  }
};

// Función para cerrar el pool
const closePool = async () => {
  if (pool) {
    await pool.end();
    logger.info('Database connection pool closed');
  }
};

// Manejar cierre graceful del proceso
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, closing database connections...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, closing database connections...');
  await closePool();
  process.exit(0);
});

module.exports = {
  createPool,
  getConnection,
  executeQuery,
  executeTransaction,
  testConnection,
  closePool,
  pool
}; 