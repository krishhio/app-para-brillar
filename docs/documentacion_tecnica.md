# Documentación Técnica - App Para Brillar

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura de Base de Datos](#estructura-de-base-de-datos)
5. [API y Endpoints](#api-y-endpoints)
6. [Flujo de Datos](#flujo-de-datos)
7. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
8. [Escalabilidad](#escalabilidad)
9. [Mantenimiento](#mantenimiento)

---

## 🎯 Descripción General

**App Para Brillar** es una aplicación móvil híbrida diseñada para el crecimiento personal y el bienestar emocional. La aplicación combina funcionalidades de diario de gratitud, retos semanales, frases motivacionales y análisis de IA para crear una experiencia personalizada de desarrollo personal.

### Funcionalidades Principales:
- 📝 **Diario de Gratitud**: Entradas diarias con reflexiones y agradecimientos
- 🎯 **Retos Semanales**: Desafíos personalizados para crecimiento personal
- 💬 **Frases Motivacionales**: Contenido inspiracional de Candy Díaz
- 🤖 **Chat con IA**: Asistente inteligente para apoyo emocional
- 📊 **Análisis Semanal**: Resúmenes generados por IA
- 🏆 **Sistema de Logros**: Gamificación para mantener motivación
- 🎨 **Temas Personalizables**: 8 temas visuales diferentes

---

## 🏗️ Arquitectura del Sistema

### Arquitectura General
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   Datos         │
│                 │    │                 │    │   (MySQL 8.0)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Capacitor     │    │   API REST      │    │   Almacenamiento│
│   (Móvil)       │    │   Express.js    │    │   LocalStorage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Stack Tecnológico Completo

#### Frontend (Cliente)
- **Framework**: React 18+ con TypeScript
- **UI Framework**: Tailwind CSS
- **Iconos**: Lucide React
- **Estado**: React Hooks (useState, useEffect, useCallback)
- **Almacenamiento Local**: localStorage
- **Híbrido**: Capacitor para iOS/Android

#### Backend (Servidor)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de Datos**: MySQL 8.0+
- **ORM**: Prisma (recomendado) o Sequelize
- **Autenticación**: JWT
- **Validación**: Joi o Zod

#### Base de Datos
- **Motor**: MySQL 8.0+
- **Características**: JSON, ENUMs, Índices optimizados
- **Backup**: Automático diario
- **Replicación**: Master-Slave (opcional)

#### IA y Servicios Externos
- **Chat IA**: Gemini API (Google)
- **Análisis**: OpenAI GPT-4 (opcional)
- **Almacenamiento**: AWS S3 (fotos de perfil)

---

## 💻 Tecnologías Utilizadas

### Frontend Technologies
```typescript
// Dependencias principales
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "lucide-react": "^0.263.0",
  "@capacitor/core": "^5.0.0",
  "@capacitor/react": "^5.0.0"
}
```

### Backend Technologies
```javascript
// Dependencias principales
{
  "express": "^4.18.0",
  "mysql2": "^3.0.0",
  "prisma": "^5.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "helmet": "^7.0.0"
}
```

### Base de Datos
```sql
-- Características utilizadas
- JSON Data Type (MySQL 8.0+)
- Generated Columns
- Window Functions
- Common Table Expressions (CTE)
- Full-Text Search
- JSON Path Expressions
```

---

## 🗄️ Estructura de Base de Datos

### Diseño de Datos

#### Entidades Principales
1. **USUARIOS**: Perfil completo del usuario
2. **CATALOGO_COLORES_TEMAS**: Temas visuales (8 temas)
3. **CATALOGO_SENTIMIENTOS**: Estados emocionales
4. **CATALOGO_LOGROS**: Sistema de gamificación
5. **CATALOGO_FRASES**: Contenido motivacional
6. **CATALOGO_RETOS**: Retos semanales disponibles

#### Entidades de Relación
1. **LOGROS_OBTENIDOS**: Logros desbloqueados por usuario
2. **FRASES_USUARIO**: Frases favoritas del usuario
3. **RETOS_SEMANALES**: Retos asignados a usuarios
4. **DIARIO_GRATITUD**: Entradas del diario personal
5. **MENSAJES_DIARIOS**: Frases asignadas diariamente

#### Entidades de Seguimiento
1. **SEGUIMIENTO_LOGROS_USUARIO**: Tracking interno
2. **CHAT_IA**: Conversaciones con IA
3. **RESUMEN_SEMANAL**: Análisis generado por IA

### Características de Diseño

#### Normalización
- **3NF**: Tercera forma normal aplicada
- **Sin redundancia**: Datos no duplicados
- **Integridad referencial**: Foreign keys apropiadas

#### Optimización
```sql
-- Índices para consultas frecuentes
CREATE INDEX idx_usuarios_correo ON usuarios(correo_electronico);
CREATE INDEX idx_diario_usuario_fecha ON diario_gratitud(id_usuario, fecha_escritura);
CREATE INDEX idx_logros_usuario ON logros_obtenidos(id_usuario, fecha_obtencion);
```

#### Flexibilidad
```sql
-- Campos JSON para datos complejos
logros JSON, -- Array de logros del día
agradecimientos JSON, -- Array de agradecimientos
colores_tema JSON -- Configuración completa del tema
```

---

## 🔌 API y Endpoints

### Estructura de API REST

#### Autenticación
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
DELETE /api/auth/logout
```

#### Usuarios
```http
GET    /api/users/profile
PUT    /api/users/profile
PATCH  /api/users/theme
POST   /api/users/photo
```

#### Diario de Gratitud
```http
GET    /api/gratitude/entries
POST   /api/gratitude/entries
GET    /api/gratitude/entries/:id
PUT    /api/gratitude/entries/:id
DELETE /api/gratitude/entries/:id
GET    /api/gratitude/weekly-summary
```

#### Frases y Contenido
```http
GET    /api/quotes/daily
GET    /api/quotes/favorites
POST   /api/quotes/:id/favorite
DELETE /api/quotes/:id/favorite
GET    /api/quotes/categories
```

#### Retos
```http
GET    /api/challenges/current
POST   /api/challenges/:id/start
PUT    /api/challenges/:id/progress
GET    /api/challenges/available
```

#### Logros
```http
GET    /api/achievements
GET    /api/achievements/unlocked
POST   /api/achievements/:id/unlock
```

#### Chat IA
```http
POST   /api/chat/message
GET    /api/chat/history
DELETE /api/chat/history
```

### Respuestas de API

#### Formato Estándar
```json
{
  "success": true,
  "data": {
    // Datos de la respuesta
  },
  "message": "Operación exitosa",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Manejo de Errores
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": [
      "El correo electrónico es requerido",
      "La fecha de nacimiento debe ser válida"
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔄 Flujo de Datos

### Flujo de Autenticación
```
1. Usuario ingresa credenciales
2. Frontend envía POST /api/auth/login
3. Backend valida credenciales
4. Se genera JWT token
5. Token se almacena en localStorage
6. Frontend incluye token en headers
```

### Flujo de Diario de Gratitud
```
1. Usuario abre diario
2. Frontend carga entradas existentes
3. Usuario crea nueva entrada
4. Frontend valida datos localmente
5. POST /api/gratitude/entries
6. Backend valida y almacena
7. Se actualiza seguimiento de logros
8. Se verifica si desbloquear logros
```

### Flujo de Chat IA
```
1. Usuario envía mensaje
2. Frontend valida límite de mensajes
3. POST /api/chat/message
4. Backend procesa con Gemini API
5. Se almacena conversación
6. Se retorna respuesta
7. Frontend actualiza chat
```

### Flujo de Análisis Semanal
```
1. Sistema detecta fin de semana
2. Se recopilan entradas de la semana
3. Se envían a IA para análisis
4. Se genera resumen personalizado
5. Se almacena en RESUMEN_SEMANAL
6. Usuario recibe notificación
```

---

## 🔒 Consideraciones de Seguridad

### Autenticación y Autorización
- **JWT Tokens**: Con expiración de 24 horas
- **Refresh Tokens**: Para renovación automática
- **Rate Limiting**: Máximo 100 requests por minuto
- **CORS**: Configurado para dominios específicos

### Protección de Datos
```javascript
// Middleware de seguridad
app.use(helmet()); // Headers de seguridad
app.use(express.json({ limit: '10mb' })); // Límite de tamaño
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}));
```

### Validación de Entrada
```javascript
// Esquema de validación
const userSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  correo_electronico: Joi.string().email().required(),
  fecha_nacimiento: Joi.date().max('now').required()
});
```

### Encriptación
- **Passwords**: bcrypt con salt rounds 12
- **Datos sensibles**: Encriptados en tránsito (HTTPS)
- **Almacenamiento**: Base de datos con conexión SSL

---

## 📈 Escalabilidad

### Estrategias de Escalabilidad

#### Horizontal (Más Servidores)
```javascript
// Load Balancer Configuration
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  app.listen(3000);
}
```

#### Vertical (Más Recursos)
- **CPU**: Procesamiento de IA
- **RAM**: Caché de consultas frecuentes
- **Storage**: Almacenamiento de archivos

#### Base de Datos
```sql
-- Replicación Master-Slave
-- Master: Escrituras
-- Slave: Lecturas
-- Backup automático cada 6 horas
```

### Caché
```javascript
// Redis para caché
const redis = require('redis');
const client = redis.createClient();

// Caché de consultas frecuentes
app.get('/api/quotes/daily', async (req, res) => {
  const cached = await client.get('daily_quote');
  if (cached) return res.json(JSON.parse(cached));
  
  const quote = await getDailyQuote();
  await client.setex('daily_quote', 3600, JSON.stringify(quote));
  res.json(quote);
});
```

---

## 🛠️ Mantenimiento

### Monitoreo
- **Logs**: Winston para logging estructurado
- **Métricas**: Prometheus + Grafana
- **Alertas**: Slack/Email para errores críticos
- **Uptime**: Pingdom para monitoreo externo

### Backup y Recuperación
```bash
# Backup automático
#!/bin/bash
mysqldump -u root -p app_para_brillar > backup_$(date +%Y%m%d_%H%M%S).sql
aws s3 cp backup_*.sql s3://brilla-backups/
```

### Actualizaciones
```javascript
// Versionado de API
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Migración de datos
const migrations = [
  '001_create_users_table.sql',
  '002_add_achievements.sql',
  '003_add_chat_ia.sql'
];
```

### Testing
```javascript
// Tests unitarios
describe('User Service', () => {
  test('should create user successfully', async () => {
    const user = await createUser(mockUserData);
    expect(user.id).toBeDefined();
  });
});

// Tests de integración
describe('API Endpoints', () => {
  test('POST /api/auth/login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validCredentials);
    expect(response.status).toBe(200);
  });
});
```

---

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

---

## 🚀 Deployment

### Entornos
- **Development**: Local con Docker
- **Staging**: Servidor de pruebas
- **Production**: AWS/GCP con auto-scaling

### CI/CD Pipeline
```yaml
# GitHub Actions
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Deploy to production
        run: ./deploy.sh
```

---

## 📚 Recursos Adicionales

### Documentación
- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Capacitor Documentation](https://capacitorjs.com/docs)

### Herramientas Recomendadas
- **Base de Datos**: MySQL Workbench, phpMyAdmin
- **API Testing**: Postman, Insomnia
- **Monitoreo**: New Relic, DataDog
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)

---

*Documentación actualizada: Enero 2024*
*Versión: 1.0*
*Autor: Equipo de Desarrollo App Para Brillar* 