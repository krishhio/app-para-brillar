# 🌟 App Para Brillar

**Aplicación de crecimiento personal y desarrollo emocional**

Una aplicación móvil híbrida diseñada para ayudar a las personas en su camino de crecimiento personal, con funcionalidades de diario de gratitud, frases motivacionales, retos semanales y chat con IA.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Documentación](#-documentación)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 🎯 Funcionalidades Principales
- **Diario de Gratitud**: Registro diario de agradecimientos y reflexiones
- **Frases Motivacionales**: Mensajes inspiradores de Candy Díaz
- **Retos Semanales**: Desafíos para el crecimiento personal
- **Sistema de Logros**: Gamificación del progreso personal
- **Chat con IA**: Asistente inteligente para apoyo emocional
- **Temas Personalizables**: Múltiples opciones de diseño visual
- **Análisis Semanal**: Resúmenes y insights del progreso

### 🎨 Temas Disponibles
- Autenticamente Candy (Lime Vibes)
- Magia Púrpura
- Claridad Celeste
- Brillo Esmeralda
- Energía Ámbar
- Poder Rosa
- Luz Clara
- Acero Brillante

## 🛠 Tecnologías

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconografía
- **Capacitor** - Aplicación híbrida (iOS/Android)

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL 8.0+** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Winston** - Logging

### Servicios Externos
- **Gemini AI** - Chat inteligente
- **AWS S3** - Almacenamiento de archivos
- **OpenAI** - Análisis de texto (opcional)

## 📁 Estructura del Proyecto

```
app-para-brillar/
├── 📱 Frontend (React + TypeScript)
│   ├── components/          # Componentes React
│   ├── services/           # Servicios y APIs
│   ├── types.ts           # Definiciones TypeScript
│   ├── themes.ts          # Configuración de temas
│   └── App.tsx           # Componente principal
│
├── 🔧 Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/        # Endpoints de la API
│   │   ├── middleware/    # Middlewares (auth, error handling)
│   │   ├── database/      # Conexión y esquemas DB
│   │   ├── utils/         # Utilidades (logger, etc.)
│   │   └── server.js      # Servidor principal
│   ├── logs/              # Archivos de log
│   └── package.json       # Dependencias del backend
│
├── 📚 Documentación
│   ├── docs/
│   │   ├── diagramas/     # Diagramas PlantUML
│   │   ├── documentacion_tecnica.md
│   │   ├── casos_de_uso.md
│   │   └── diagrama_entidad_relacion.md
│   └── README.md          # Este archivo
│
├── 📱 Mobile (Capacitor)
│   ├── android/           # Configuración Android
│   └── ios/              # Configuración iOS
│
└── 📄 Archivos de Configuración
    ├── package.json       # Dependencias del frontend
    ├── capacitor.config.ts # Configuración Capacitor
    ├── vite.config.ts     # Configuración Vite
    └── tsconfig.json      # Configuración TypeScript
```

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/app-para-brillar.git
cd app-para-brillar
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 4. Configurar base de datos
```bash
# Crear base de datos
mysql -u root -p < backend/src/database/schema.sql

# Insertar datos iniciales
mysql -u root -p app_para_brillar < backend/src/database/seed.sql
```

### 5. Configurar variables de entorno
```bash
# En backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=app_para_brillar
JWT_SECRET=tu_secret_super_seguro
```

## ⚙️ Configuración

### Variables de Entorno (Backend)
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=app_para_brillar

# JWT
JWT_SECRET=tu_secret_super_seguro
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# APIs Externas
GEMINI_API_KEY=tu_gemini_key
AWS_ACCESS_KEY_ID=tu_aws_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret
```

## 🎯 Uso

### Desarrollo

1. **Iniciar backend**
```bash
cd backend
npm run dev
```

2. **Iniciar frontend**
```bash
npm run dev
```

3. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

### Producción

1. **Construir frontend**
```bash
npm run build
```

2. **Iniciar backend en producción**
```bash
cd backend
npm start
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios
- `GET /api/users/me` - Perfil del usuario
- `PUT /api/users/me` - Actualizar perfil
- `PUT /api/users/me/password` - Cambiar contraseña
- `DELETE /api/users/me` - Eliminar cuenta

### Diario de Gratitud
- `GET /api/gratitude` - Obtener entradas
- `POST /api/gratitude` - Crear entrada
- `PUT /api/gratitude/:id` - Actualizar entrada
- `DELETE /api/gratitude/:id` - Eliminar entrada

### Frases Motivacionales
- `GET /api/quotes/daily` - Frase del día
- `GET /api/quotes/categories` - Categorías
- `GET /api/quotes/search` - Buscar frases
- `POST /api/quotes/:id/favorite` - Marcar favorita

### Retos y Logros
- `GET /api/challenges` - Retos disponibles
- `GET /api/achievements` - Logros disponibles
- `GET /api/achievements/user` - Logros del usuario

### Chat IA
- `GET /api/chat/history` - Historial de chat
- `POST /api/chat/message` - Enviar mensaje

### Temas
- `GET /api/themes` - Temas disponibles
- `GET /api/themes/:id` - Tema específico

## 🗄️ Base de Datos

### Tablas Principales
- `usuarios` - Información de usuarios
- `diario_gratitud` - Entradas del diario
- `catalogo_frases` - Frases motivacionales
- `catalogo_retos` - Retos semanales
- `catalogo_logros` - Sistema de logros
- `catalogo_colores_temas` - Temas visuales
- `chat_ia` - Historial de chat
- `seguimiento_logros_usuario` - Progreso de logros

### Características de la DB
- MySQL 8.0+
- Soporte para JSON
- Triggers y stored procedures
- Índices optimizados
- Normalización 3NF

## 📚 Documentación

### Archivos de Documentación
- [`docs/documentacion_tecnica.md`](docs/documentacion_tecnica.md) - Documentación técnica completa
- [`docs/casos_de_uso.md`](docs/casos_de_uso.md) - Casos de uso detallados
- [`docs/diagrama_entidad_relacion.md`](docs/diagrama_entidad_relacion.md) - Diagrama ER

### Diagramas
- [`docs/diagramas/diagrama_entidad_relacion_plantuml.puml`](docs/diagramas/diagrama_entidad_relacion_plantuml.puml) - ERD en PlantUML
- [`docs/diagramas/diagrama_arquitectura_alto_nivel.puml`](docs/diagramas/diagrama_arquitectura_alto_nivel.puml) - Arquitectura del sistema

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Verifica que el código pase los linters

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Candy Díaz** - *Concepto y contenido*
- **Equipo de Desarrollo** - *Implementación técnica*

## 🙏 Agradecimientos

- Candy Díaz por la inspiración y contenido motivacional
- Comunidad de React y Node.js
- Contribuidores del proyecto

---

**🌟 ¡Brilla cada día! 🌟**
