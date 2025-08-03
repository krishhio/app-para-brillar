# 🚀 Backend - App Para Brillar

Backend API completo para la aplicación "App Para Brillar" - Una plataforma de crecimiento personal y bienestar emocional.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Desarrollo](#-desarrollo)
- [Testing](#-testing)
- [Deployment](#-deployment)

## ✨ Características

- 🔐 **Autenticación JWT** con refresh tokens
- 📝 **Diario de Gratitud** con entradas detalladas
- 💬 **Sistema de Frases** motivacionales diarias
- 🎯 **Retos Semanales** personalizados
- 🏆 **Sistema de Logros** gamificado
- 🤖 **Chat con IA** (Gemini API)
- 📊 **Análisis Semanal** generado por IA
- 🎨 **Temas Personalizables** (8 temas disponibles)
- 📱 **API REST** completa y documentada
- 🔒 **Seguridad** con rate limiting y validación
- 📈 **Escalabilidad** con índices optimizados

## 🛠️ Tecnologías

### Core
- **Node.js** 18+
- **Express.js** - Framework web
- **MySQL** 8.0+ - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

### Seguridad
- **Helmet** - Headers de seguridad
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Protección contra spam
- **Express Validator** - Validación de datos

### Logging y Monitoreo
- **Winston** - Logging estructurado
- **Compression** - Compresión de respuestas

### IA y Servicios Externos
- **Gemini API** - Chat inteligente
- **AWS S3** - Almacenamiento de archivos
- **OpenAI** - Análisis avanzado (opcional)

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd app-para-brillar/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos**
```bash
# Ejecutar el script de base de datos
mysql -u root -p < src/database/schema.sql
```

5. **Ejecutar migraciones y seeders**
```bash
npm run migrate
npm run seed
```

6. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## ⚙️ Configuración

### Variables de Entorno

Copia `env.example` a `.env` y configura:

```env
# Configuración básica
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=app_para_brillar

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# IA
GEMINI_API_KEY=tu_gemini_api_key
```

### Generar Claves JWT Seguras

```bash
# Generar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generar JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── database/
│   │   ├── connection.js      # Conexión a MySQL
│   │   ├── schema.sql         # Estructura de BD
│   │   ├── migrate.js         # Migraciones
│   │   └── seed.js           # Datos iniciales
│   ├── middleware/
│   │   ├── auth.js           # Middleware de autenticación
│   │   └── errorHandler.js   # Manejo de errores
│   ├── routes/
│   │   ├── auth.js           # Autenticación
│   │   ├── users.js          # Usuarios
│   │   ├── gratitude.js      # Diario de gratitud
│   │   ├── quotes.js         # Frases motivacionales
│   │   ├── challenges.js     # Retos semanales
│   │   ├── achievements.js   # Logros
│   │   ├── chat.js           # Chat con IA
│   │   └── themes.js         # Temas
│   ├── services/
│   │   ├── geminiService.js  # Servicio de IA
│   │   └── emailService.js   # Servicio de email
│   ├── utils/
│   │   ├── logger.js         # Configuración de logs
│   │   └── validators.js     # Validadores
│   └── server.js             # Archivo principal
├── tests/                    # Tests unitarios
├── logs/                     # Archivos de log
├── package.json
├── env.example
└── README.md
```

## 🔌 API Endpoints

### Autenticación
```http
POST   /api/auth/register     # Registro de usuario
POST   /api/auth/login        # Inicio de sesión
POST   /api/auth/refresh      # Renovar token
POST   /api/auth/logout       # Cerrar sesión
GET    /api/auth/me           # Información del usuario
```

### Usuarios
```http
GET    /api/users/profile     # Obtener perfil
PUT    /api/users/profile     # Actualizar perfil
PATCH  /api/users/theme       # Cambiar tema
POST   /api/users/photo       # Subir foto
```

### Diario de Gratitud
```http
GET    /api/gratitude/entries           # Obtener entradas
POST   /api/gratitude/entries           # Crear entrada
GET    /api/gratitude/entries/:id       # Obtener entrada específica
PUT    /api/gratitude/entries/:id       # Actualizar entrada
DELETE /api/gratitude/entries/:id       # Eliminar entrada
GET    /api/gratitude/weekly-summary    # Resumen semanal
GET    /api/gratitude/stats             # Estadísticas
```

### Frases Motivacionales
```http
GET    /api/quotes/daily               # Frase del día
POST   /api/quotes/daily/view          # Marcar como vista
GET    /api/quotes/favorites           # Frases favoritas
POST   /api/quotes/:id/favorite        # Agregar/remover favorito
GET    /api/quotes/categories          # Categorías
GET    /api/quotes/search              # Buscar frases
GET    /api/quotes/random              # Frase aleatoria
GET    /api/quotes/history             # Historial
```

### Retos Semanales
```http
GET    /api/challenges/current         # Reto actual
POST   /api/challenges/:id/start       # Iniciar reto
PUT    /api/challenges/:id/progress    # Actualizar progreso
GET    /api/challenges/available       # Retos disponibles
```

### Logros
```http
GET    /api/achievements               # Todos los logros
GET    /api/achievements/unlocked      # Logros desbloqueados
POST   /api/achievements/:id/unlock    # Desbloquear logro
```

### Chat IA
```http
POST   /api/chat/message               # Enviar mensaje
GET    /api/chat/history               # Historial de chat
DELETE /api/chat/history               # Limpiar historial
```

### Temas
```http
GET    /api/themes                     # Listar temas
GET    /api/themes/:id                 # Obtener tema específico
```

## 🗄️ Base de Datos

### Características
- **MySQL 8.0+** con soporte completo para JSON
- **Normalización 3NF** para evitar redundancia
- **Índices optimizados** para consultas frecuentes
- **Triggers automáticos** para timestamps
- **Vistas útiles** para estadísticas
- **Procedimientos almacenados** para operaciones complejas

### Tablas Principales
- `usuarios` - Perfil de usuario
- `catalogo_*` - Datos maestros (temas, sentimientos, logros, frases, retos)
- `diario_gratitud` - Entradas del diario
- `mensajes_diarios` - Frases asignadas diariamente
- `seguimiento_logros_usuario` - Tracking interno
- `chat_ia` - Conversaciones con IA
- `resumen_semanal` - Análisis generado por IA

### Scripts de Base de Datos
```bash
# Crear estructura completa
mysql -u root -p < src/database/schema.sql

# Ejecutar migraciones
npm run migrate

# Insertar datos iniciales
npm run seed
```

## 💻 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor con nodemon
npm run dev:debug        # Servidor con debugging

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura

# Linting
npm run lint             # Verificar código
npm run lint:fix         # Corregir problemas de linting

# Base de datos
npm run migrate          # Ejecutar migraciones
npm run seed             # Insertar datos iniciales
npm run db:reset         # Resetear base de datos

# Producción
npm start                # Iniciar servidor
npm run build            # Build para producción
```

### Estructura de Respuestas

Todas las respuestas siguen un formato estándar:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    // Datos de la respuesta
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Manejo de Errores

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": [
      "El correo electrónico es requerido"
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🧪 Testing

### Configuración de Tests

```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

### Estructura de Tests

```
tests/
├── unit/
│   ├── auth.test.js
│   ├── gratitude.test.js
│   └── quotes.test.js
├── integration/
│   ├── api.test.js
│   └── database.test.js
└── fixtures/
    ├── users.json
    └── quotes.json
```

### Ejemplo de Test

```javascript
describe('Auth Endpoints', () => {
  test('POST /api/auth/register should create new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test',
        apellido: 'User',
        correo_electronico: 'test@example.com',
        password: 'password123',
        fecha_nacimiento: '1990-01-01'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## 🚀 Deployment

### Entornos

#### Desarrollo Local
```bash
npm run dev
```

#### Staging
```bash
NODE_ENV=staging npm start
```

#### Producción
```bash
NODE_ENV=production npm start
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3000
DB_HOST=production-db-host
DB_PASSWORD=production-password
JWT_SECRET=production-jwt-secret
ALLOWED_ORIGINS=https://app-para-brillar.com
```

### Monitoreo

- **Logs**: Winston con rotación automática
- **Métricas**: Prometheus + Grafana
- **Alertas**: Slack/Email para errores críticos
- **Uptime**: Pingdom para monitoreo externo

## 📊 Métricas y KPIs

### Métricas Técnicas
- **Uptime**: 99.9%
- **Response Time**: < 200ms promedio
- **Error Rate**: < 0.1%
- **Concurrent Users**: 1000+

### Métricas de Negocio
- **Usuarios Activos**: DAU/MAU
- **Retención**: 7 días, 30 días
- **Engagement**: Entradas de diario por usuario
- **Conversión**: Usuarios premium

## 🔧 Mantenimiento

### Backup Automático
```bash
#!/bin/bash
# Backup diario de base de datos
mysqldump -u root -p app_para_brillar > backup_$(date +%Y%m%d_%H%M%S).sql
aws s3 cp backup_*.sql s3://brilla-backups/
```

### Limpieza de Datos
```sql
-- Limpiar chats antiguos (30 días)
DELETE FROM chat_ia WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Limpiar resúmenes antiguos (1 año)
DELETE FROM resumen_semanal WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- **Email**: soporte@app-para-brillar.com
- **Documentación**: [docs.app-para-brillar.com](https://docs.app-para-brillar.com)
- **Issues**: [GitHub Issues](https://github.com/app-para-brillar/backend/issues)

---

**Desarrollado con ❤️ por el equipo de App Para Brillar** 