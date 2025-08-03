-- =====================================================
-- ESTRUCTURA DE BASE DE DATOS - APP PARA BRILLAR
-- MySQL 8.0+
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS app_para_brillar
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE app_para_brillar;

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla de usuarios (perfil de usuario)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fotografia VARCHAR(500),
    id_color_tema INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    es_activo BOOLEAN DEFAULT TRUE,
    INDEX idx_correo (correo_electronico),
    INDEX idx_fecha_registro (fecha_registro),
    INDEX idx_ultimo_acceso (ultimo_acceso)
);

-- Catálogo de colores de temas
CREATE TABLE catalogo_colores_temas (
    id_color_tema INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tema VARCHAR(50) NOT NULL UNIQUE,
    nombre_display VARCHAR(100) NOT NULL,
    colores_tema JSON NOT NULL,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre_tema (nombre_tema)
);

-- Catálogo de sentimientos
CREATE TABLE catalogo_sentimientos (
    id_sentimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sentimiento VARCHAR(100) NOT NULL UNIQUE,
    emoji VARCHAR(10),
    descripcion TEXT,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de logros
CREATE TABLE catalogo_logros (
    id_logro INT AUTO_INCREMENT PRIMARY KEY,
    nombre_logro VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria ENUM('constancia', 'accion', 'crecimiento', 'premium') NOT NULL,
    icono_nombre VARCHAR(50),
    mensaje_desbloqueo TEXT,
    condicion_activacion TEXT,
    es_premium BOOLEAN DEFAULT FALSE,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_premium (es_premium)
);

-- Catálogo de frases motivacionales
CREATE TABLE catalogo_frases (
    id_frase INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria_frase INT,
    nombre_frase VARCHAR(500) NOT NULL,
    autor VARCHAR(100),
    categoria VARCHAR(100),
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_autor (autor),
    INDEX idx_activo (es_activo)
);

-- Catálogo de retos
CREATE TABLE catalogo_retos (
    id_reto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_reto VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    duracion_dias INT DEFAULT 7,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_activo (es_activo)
);

-- =====================================================
-- TABLAS DE RELACIÓN
-- =====================================================

-- Logros obtenidos por usuario
CREATE TABLE logros_obtenidos (
    id_logro_obtenido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_logro INT NOT NULL,
    fecha_obtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_usuario_logro (id_usuario, id_logro),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_logro) REFERENCES catalogo_logros(id_logro) ON DELETE CASCADE,
    INDEX idx_usuario_fecha (id_usuario, fecha_obtencion)
);

-- Frases favoritas del usuario
CREATE TABLE frases_usuario (
    id_frase_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_frase INT NOT NULL,
    fecha_frase TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
    es_favorito BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_usuario_frase (id_usuario, id_frase),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_frase) REFERENCES catalogo_frases(id_frase) ON DELETE CASCADE,
    INDEX idx_usuario_favorito (id_usuario, es_favorito),
    INDEX idx_fecha_frase (fecha_frase)
);

-- Retos semanales asignados a usuarios
CREATE TABLE retos_semanales (
    id_reto_semanal INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reto INT NOT NULL,
    dia_reto INT NOT NULL,
    nota_reto TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estatus ENUM('pendiente', 'en_progreso', 'completado', 'abandonado') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_reto) REFERENCES catalogo_retos(id_reto) ON DELETE CASCADE,
    INDEX idx_usuario_estatus (id_usuario, estatus),
    INDEX idx_fecha_inicio (fecha_inicio),
    INDEX idx_fecha_fin (fecha_fin)
);

-- Diario de gratitud
CREATE TABLE diario_gratitud (
    id_entrada INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_escritura DATE NOT NULL,
    id_sentimiento INT,
    logros JSON,
    agradecimientos JSON,
    mejor_parte_dia TEXT,
    aprendi_hoy TEXT,
    convirtiendo_negativo_positivo JSON,
    pensamientos_dia TEXT,
    timestamp_creacion BIGINT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_usuario_fecha (id_usuario, fecha_escritura),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_sentimiento) REFERENCES catalogo_sentimientos(id_sentimiento) ON DELETE SET NULL,
    INDEX idx_usuario_fecha (id_usuario, fecha_escritura),
    INDEX idx_timestamp (timestamp_creacion),
    INDEX idx_sentimiento (id_sentimiento)
);

-- Mensajes diarios asignados
CREATE TABLE mensajes_diarios (
    id_mensaje_diario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_frase INT NOT NULL,
    fecha_asignacion DATE NOT NULL,
    fecha_visualizacion TIMESTAMP NULL,
    UNIQUE KEY unique_usuario_fecha (id_usuario, fecha_asignacion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_frase) REFERENCES catalogo_frases(id_frase) ON DELETE CASCADE,
    INDEX idx_usuario_fecha (id_usuario, fecha_asignacion),
    INDEX idx_fecha_asignacion (fecha_asignacion)
);

-- =====================================================
-- TABLAS DE SEGUIMIENTO
-- =====================================================

-- Seguimiento de logros del usuario
CREATE TABLE seguimiento_logros_usuario (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fechas_mensaje_diario JSON,
    frases_compartidas JSON,
    contador_cambios_tema INT DEFAULT 0,
    diario_primera_vez_click BOOLEAN DEFAULT FALSE,
    diario_primera_entrada BOOLEAN DEFAULT FALSE,
    contador_entradas_gratitud INT DEFAULT 0,
    retos_visitados BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario (id_usuario)
);

-- Chat con IA
CREATE TABLE chat_ia (
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_mensaje VARCHAR(50) NOT NULL,
    remitente ENUM('usuario', 'ai') NOT NULL,
    contenido TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario_timestamp (id_usuario, timestamp),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- Resumen semanal
CREATE TABLE resumen_semanal (
    id_resumen INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_inicio_semana DATE NOT NULL,
    fecha_fin_semana DATE NOT NULL,
    resumen_generado TEXT,
    insights JSON,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_semana (id_usuario, fecha_inicio_semana),
    INDEX idx_usuario_fecha (id_usuario, fecha_inicio_semana)
);

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para consultas frecuentes
CREATE INDEX idx_usuarios_activo ON usuarios(es_activo);
CREATE INDEX idx_frases_activo ON catalogo_frases(es_activo);
CREATE INDEX idx_retos_activo ON catalogo_retos(es_activo);
CREATE INDEX idx_sentimientos_activo ON catalogo_sentimientos(es_activo);
CREATE INDEX idx_temas_activo ON catalogo_colores_temas(es_activo);

-- Índices para búsquedas de texto
CREATE FULLTEXT INDEX idx_frases_texto ON catalogo_frases(nombre_frase, autor);
CREATE FULLTEXT INDEX idx_retos_texto ON catalogo_retos(nombre_reto, descripcion);

-- Índices para consultas de fecha
CREATE INDEX idx_diario_fecha_escritura ON diario_gratitud(fecha_escritura);
CREATE INDEX idx_mensajes_fecha_asignacion ON mensajes_diarios(fecha_asignacion);
CREATE INDEX idx_resumen_fecha_inicio ON resumen_semanal(fecha_inicio_semana);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para estadísticas de usuario
CREATE VIEW vista_estadisticas_usuario AS
SELECT 
    u.id_usuario,
    u.nombre,
    u.apellido,
    COUNT(DISTINCT dg.id_entrada) as total_entradas_diario,
    COUNT(DISTINCT lo.id_logro_obtenido) as total_logros,
    COUNT(DISTINCT fu.id_frase_usuario) as total_frases_favoritas,
    COUNT(DISTINCT rs.id_reto_semanal) as total_retos_participados,
    MAX(dg.fecha_escritura) as ultima_entrada_diario,
    MAX(u.ultimo_acceso) as ultimo_acceso
FROM usuarios u
LEFT JOIN diario_gratitud dg ON u.id_usuario = dg.id_usuario
LEFT JOIN logros_obtenidos lo ON u.id_usuario = lo.id_usuario
LEFT JOIN frases_usuario fu ON u.id_usuario = fu.id_usuario
LEFT JOIN retos_semanales rs ON u.id_usuario = rs.id_usuario
WHERE u.es_activo = TRUE
GROUP BY u.id_usuario;

-- Vista para logros disponibles
CREATE VIEW vista_logros_disponibles AS
SELECT 
    cl.id_logro,
    cl.nombre_logro,
    cl.descripcion,
    cl.categoria,
    cl.icono_nombre,
    cl.mensaje_desbloqueo,
    cl.es_premium,
    COUNT(lo.id_logro_obtenido) as veces_obtenido
FROM catalogo_logros cl
LEFT JOIN logros_obtenidos lo ON cl.id_logro = lo.id_logro
WHERE cl.es_activo = TRUE
GROUP BY cl.id_logro;

-- =====================================================
-- TRIGGERS PARA MANTENER INTEGRIDAD
-- =====================================================

-- Trigger para actualizar fecha_actualizacion automáticamente
DELIMITER //
CREATE TRIGGER trigger_usuarios_update 
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER trigger_diario_gratitud_update 
BEFORE UPDATE ON diario_gratitud
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER trigger_retos_semanales_update 
BEFORE UPDATE ON retos_semanales
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

-- Procedimiento para obtener estadísticas de usuario
DELIMITER //
CREATE PROCEDURE sp_estadisticas_usuario(IN p_id_usuario INT)
BEGIN
    SELECT 
        u.nombre,
        u.apellido,
        u.correo_electronico,
        COUNT(DISTINCT dg.id_entrada) as entradas_diario,
        COUNT(DISTINCT lo.id_logro_obtenido) as logros_obtenidos,
        COUNT(DISTINCT fu.id_frase_usuario) as frases_favoritas,
        DATEDIFF(CURRENT_DATE, u.fecha_registro) as dias_registrado
    FROM usuarios u
    LEFT JOIN diario_gratitud dg ON u.id_usuario = dg.id_usuario
    LEFT JOIN logros_obtenidos lo ON u.id_usuario = lo.id_usuario
    LEFT JOIN frases_usuario fu ON u.id_usuario = fu.id_usuario
    WHERE u.id_usuario = p_id_usuario
    GROUP BY u.id_usuario;
END//
DELIMITER ;

-- Procedimiento para limpiar datos antiguos
DELIMITER //
CREATE PROCEDURE sp_limpiar_datos_antiguos()
BEGIN
    -- Eliminar chats de más de 30 días
    DELETE FROM chat_ia 
    WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    -- Eliminar resúmenes semanales de más de 1 año
    DELETE FROM resumen_semanal 
    WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    
    SELECT ROW_COUNT() as registros_eliminados;
END//
DELIMITER ;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
ESTRUCTURA DE BASE DE DATOS COMPLETA PARA APP PARA BRILLAR

Características principales:
- MySQL 8.0+ con soporte completo para JSON
- Normalización 3NF para evitar redundancia
- Índices optimizados para consultas frecuentes
- Triggers para mantener integridad de datos
- Vistas para consultas complejas
- Procedimientos almacenados para operaciones comunes
- Soporte completo para caracteres Unicode (utf8mb4)

Tablas principales:
1. usuarios - Perfil completo del usuario
2. catalogo_* - Datos maestros (temas, sentimientos, logros, etc.)
3. *_usuario - Relaciones usuario-datos
4. seguimiento_* - Tracking interno y métricas

Optimizaciones incluidas:
- Índices en campos de búsqueda frecuente
- Full-text search para contenido
- JSON para datos complejos
- Timestamps automáticos
- Soft deletes con es_activo
*/ 