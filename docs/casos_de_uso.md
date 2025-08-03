# 📋 Casos de Uso - App Para Brillar

## 📖 Índice
1. [Casos de Uso de Autenticación](#casos-de-uso-de-autenticación)
2. [Casos de Uso del Perfil de Usuario](#casos-de-uso-del-perfil-de-usuario)
3. [Casos de Uso del Diario de Gratitud](#casos-de-uso-del-diario-de-gratitud)
4. [Casos de Uso de Frases Motivacionales](#casos-de-uso-de-frases-motivacionales)
5. [Casos de Uso de Retos Semanales](#casos-de-uso-de-retos-semanales)
6. [Casos de Uso del Sistema de Logros](#casos-de-uso-del-sistema-de-logros)
7. [Casos de Uso del Chat con IA](#casos-de-uso-del-chat-con-ia)
8. [Casos de Uso del Análisis Semanal](#casos-de-uso-del-análisis-semanal)
9. [Casos de Uso de Personalización](#casos-de-uso-de-personalización)
10. [Casos de Uso de Administración](#casos-de-uso-de-administración)

---

## 🔐 Casos de Uso de Autenticación

### **CU-001: Registro de Usuario**
**Actor:** Usuario no registrado  
**Precondición:** El usuario no tiene una cuenta en el sistema  
**Flujo Principal:**
1. El usuario accede a la pantalla de registro
2. El usuario ingresa sus datos personales (nombre, apellido, correo, contraseña, fecha de nacimiento)
3. El sistema valida que el correo no esté registrado
4. El sistema encripta la contraseña
5. El sistema crea la cuenta del usuario
6. El sistema crea el registro de seguimiento de logros
7. El sistema genera tokens JWT
8. El sistema redirige al usuario a la pantalla principal

**Flujos Alternativos:**
- **A1:** El correo ya está registrado → Mostrar mensaje de error
- **A2:** Los datos son inválidos → Mostrar errores de validación

**Postcondición:** El usuario tiene una cuenta activa y está autenticado

---

### **CU-002: Inicio de Sesión**
**Actor:** Usuario registrado  
**Precondición:** El usuario tiene una cuenta en el sistema  
**Flujo Principal:**
1. El usuario accede a la pantalla de login
2. El usuario ingresa su correo y contraseña
3. El sistema valida las credenciales
4. El sistema verifica que la cuenta esté activa
5. El sistema actualiza el último acceso
6. El sistema genera tokens JWT
7. El sistema redirige al usuario a la pantalla principal

**Flujos Alternativos:**
- **A1:** Credenciales incorrectas → Mostrar mensaje de error
- **A2:** Cuenta deshabilitada → Mostrar mensaje de cuenta bloqueada

**Postcondición:** El usuario está autenticado y puede acceder a las funcionalidades

---

### **CU-003: Renovación de Token**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene un refresh token válido  
**Flujo Principal:**
1. El sistema detecta que el token JWT ha expirado
2. El sistema envía el refresh token al servidor
3. El servidor valida el refresh token
4. El servidor verifica que el usuario esté activo
5. El servidor genera nuevos tokens JWT
6. El sistema actualiza los tokens localmente

**Flujos Alternativos:**
- **A1:** Refresh token inválido → Redirigir al login
- **A2:** Usuario deshabilitado → Redirigir al login

**Postcondición:** El usuario mantiene su sesión activa

---

### **CU-004: Cerrar Sesión**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario selecciona "Cerrar Sesión"
2. El sistema elimina los tokens locales
3. El sistema redirige al usuario a la pantalla de login

**Postcondición:** El usuario no está autenticado

---

## 👤 Casos de Uso del Perfil de Usuario

### **CU-005: Ver Perfil de Usuario**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la sección de perfil
2. El sistema obtiene los datos del usuario
3. El sistema obtiene las estadísticas del usuario
4. El sistema muestra la información del perfil

**Postcondición:** El usuario puede ver su información personal y estadísticas

---

### **CU-006: Actualizar Perfil**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la edición del perfil
2. El usuario modifica sus datos personales
3. El sistema valida los datos ingresados
4. El sistema actualiza la información del usuario
5. El sistema muestra confirmación de actualización

**Flujos Alternativos:**
- **A1:** Datos inválidos → Mostrar errores de validación

**Postcondición:** Los datos del perfil han sido actualizados

---

### **CU-007: Cambiar Tema Visual**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la configuración de temas
2. El sistema muestra los temas disponibles
3. El usuario selecciona un tema
4. El sistema aplica el tema seleccionado
5. El sistema actualiza la preferencia del usuario
6. El sistema actualiza el seguimiento de logros

**Postcondición:** El tema visual ha sido cambiado y registrado

---

### **CU-008: Subir Foto de Perfil**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario selecciona "Cambiar Foto"
2. El usuario selecciona una imagen
3. El sistema valida el formato y tamaño de la imagen
4. El sistema sube la imagen a AWS S3
5. El sistema actualiza la URL de la foto en el perfil
6. El sistema muestra la nueva foto

**Flujos Alternativos:**
- **A1:** Imagen inválida → Mostrar mensaje de error
- **A2:** Error de subida → Mostrar mensaje de error

**Postcondición:** La foto de perfil ha sido actualizada

---

## 📝 Casos de Uso del Diario de Gratitud

### **CU-009: Crear Entrada del Diario**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede al diario de gratitud
2. El usuario selecciona "Nueva Entrada"
3. El usuario ingresa la fecha de escritura
4. El usuario selecciona su sentimiento del día
5. El usuario escribe sus logros del día
6. El usuario escribe sus agradecimientos
7. El usuario escribe la mejor parte del día
8. El usuario escribe lo que aprendió
9. El usuario escribe sus pensamientos del día
10. El sistema valida que no exista entrada para esa fecha
11. El sistema guarda la entrada
12. El sistema actualiza el seguimiento de logros

**Flujos Alternativos:**
- **A1:** Ya existe entrada para esa fecha → Mostrar mensaje de error
- **A2:** Datos inválidos → Mostrar errores de validación

**Postcondición:** La entrada del diario ha sido creada

---

### **CU-010: Ver Entradas del Diario**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede al diario de gratitud
2. El sistema obtiene las entradas del usuario
3. El sistema aplica filtros (fecha, sentimiento)
4. El sistema muestra las entradas paginadas
5. El usuario puede navegar entre páginas

**Postcondición:** El usuario puede ver sus entradas del diario

---

### **CU-011: Editar Entrada del Diario**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene entradas en el diario  
**Flujo Principal:**
1. El usuario selecciona una entrada existente
2. El usuario selecciona "Editar"
3. El usuario modifica los campos deseados
4. El sistema valida los datos
5. El sistema actualiza la entrada
6. El sistema muestra confirmación

**Flujos Alternativos:**
- **A1:** Datos inválidos → Mostrar errores de validación

**Postcondición:** La entrada del diario ha sido actualizada

---

### **CU-012: Eliminar Entrada del Diario**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene entradas en el diario  
**Flujo Principal:**
1. El usuario selecciona una entrada existente
2. El usuario selecciona "Eliminar"
3. El sistema solicita confirmación
4. El usuario confirma la eliminación
5. El sistema elimina la entrada
6. El sistema muestra confirmación

**Postcondición:** La entrada del diario ha sido eliminada

---

### **CU-013: Ver Estadísticas del Diario**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene entradas en el diario  
**Flujo Principal:**
1. El usuario accede a las estadísticas del diario
2. El sistema calcula las estadísticas:
   - Total de entradas
   - Racha actual
   - Sentimientos más frecuentes
   - Días con más actividad
3. El sistema muestra las estadísticas

**Postcondición:** El usuario puede ver sus estadísticas del diario

---

## 💬 Casos de Uso de Frases Motivacionales

### **CU-014: Ver Frase del Día**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la pantalla principal
2. El sistema verifica si ya se asignó una frase para hoy
3. Si no hay frase asignada, el sistema selecciona una frase aleatoria
4. El sistema asigna la frase al usuario para hoy
5. El sistema muestra la frase del día

**Postcondición:** El usuario puede ver su frase motivacional del día

---

### **CU-015: Marcar Frase como Vista**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene una frase del día asignada  
**Flujo Principal:**
1. El usuario visualiza la frase del día
2. El sistema registra la fecha de visualización
3. El sistema actualiza el seguimiento de logros
4. El sistema verifica si se desbloquean logros

**Postcondición:** La frase ha sido marcada como vista

---

### **CU-016: Agregar Frase a Favoritos**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está viendo una frase  
**Flujo Principal:**
1. El usuario selecciona "Agregar a Favoritos"
2. El sistema crea la relación usuario-frase
3. El sistema actualiza el seguimiento de logros
4. El sistema muestra confirmación

**Postcondición:** La frase ha sido agregada a favoritos

---

### **CU-017: Ver Frases Favoritas**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene frases favoritas  
**Flujo Principal:**
1. El usuario accede a "Mis Favoritos"
2. El sistema obtiene las frases favoritas del usuario
3. El sistema muestra las frases paginadas
4. El usuario puede navegar entre páginas

**Postcondición:** El usuario puede ver sus frases favoritas

---

### **CU-018: Buscar Frases**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la búsqueda de frases
2. El usuario ingresa criterios de búsqueda
3. El sistema busca frases que coincidan
4. El sistema muestra los resultados paginados
5. El usuario puede filtrar por categoría o autor

**Postcondición:** El usuario puede ver frases que coinciden con su búsqueda

---

## 🎯 Casos de Uso de Retos Semanales

### **CU-019: Ver Retos Disponibles**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la sección de retos
2. El sistema obtiene los retos disponibles
3. El sistema muestra los retos activos
4. El usuario puede ver detalles de cada reto

**Postcondición:** El usuario puede ver los retos disponibles

---

### **CU-020: Iniciar Reto Semanal**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario selecciona un reto disponible
2. El usuario selecciona "Iniciar Reto"
3. El sistema asigna el reto al usuario
4. El sistema establece las fechas de inicio y fin
5. El sistema actualiza el seguimiento de logros
6. El sistema muestra confirmación

**Postcondición:** El usuario tiene un reto activo

---

### **CU-021: Actualizar Progreso del Reto**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene un reto activo  
**Flujo Principal:**
1. El usuario accede a su reto activo
2. El usuario selecciona el día del reto
3. El usuario escribe sus notas del día
4. El sistema guarda el progreso
5. El sistema actualiza el estado del reto

**Postcondición:** El progreso del reto ha sido actualizado

---

### **CU-022: Completar Reto**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene un reto activo  
**Flujo Principal:**
1. El usuario completa todos los días del reto
2. El sistema verifica que todos los días estén completados
3. El sistema marca el reto como completado
4. El sistema actualiza el seguimiento de logros
5. El sistema verifica si se desbloquean logros
6. El sistema muestra felicitaciones

**Postcondición:** El reto ha sido completado exitosamente

---

## 🏆 Casos de Uso del Sistema de Logros

### **CU-023: Ver Logros Disponibles**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la sección de logros
2. El sistema obtiene todos los logros disponibles
3. El sistema identifica cuáles están desbloqueados
4. El sistema muestra los logros con su estado

**Postcondición:** El usuario puede ver todos los logros disponibles

---

### **CU-024: Ver Logros Desbloqueados**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a "Mis Logros"
2. El sistema obtiene los logros desbloqueados del usuario
3. El sistema muestra los logros con fecha de desbloqueo
4. El usuario puede ver detalles de cada logro

**Postcondición:** El usuario puede ver sus logros desbloqueados

---

### **CU-025: Desbloquear Logro**
**Actor:** Sistema  
**Precondición:** El usuario cumple las condiciones del logro  
**Flujo Principal:**
1. El sistema detecta que se cumplen las condiciones
2. El sistema verifica que el logro no esté ya desbloqueado
3. El sistema desbloquea el logro
4. El sistema registra la fecha de desbloqueo
5. El sistema muestra notificación de logro desbloqueado

**Postcondición:** El logro ha sido desbloqueado

---

### **CU-026: Ver Notificación de Logro**
**Actor:** Usuario autenticado  
**Precondición:** Un logro ha sido desbloqueado  
**Flujo Principal:**
1. El sistema muestra la notificación de logro
2. El usuario puede ver el nombre y descripción del logro
3. El usuario puede ver el mensaje de desbloqueo
4. El usuario puede cerrar la notificación

**Postcondición:** El usuario ha visto la notificación del logro

---

## 🤖 Casos de Uso del Chat con IA

### **CU-027: Enviar Mensaje al Chat**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede al chat con IA
2. El usuario escribe su mensaje
3. El sistema valida el límite de mensajes
4. El sistema envía el mensaje a Gemini AI
5. El sistema recibe la respuesta de la IA
6. El sistema guarda la conversación
7. El sistema muestra la respuesta

**Flujos Alternativos:**
- **A1:** Límite de mensajes excedido → Mostrar mensaje de límite
- **A2:** Error de IA → Mostrar mensaje de error

**Postcondición:** El usuario ha recibido respuesta de la IA

---

### **CU-028: Ver Historial del Chat**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene conversaciones previas  
**Flujo Principal:**
1. El usuario accede al chat con IA
2. El sistema obtiene el historial de conversaciones
3. El sistema muestra las conversaciones ordenadas por fecha
4. El usuario puede ver mensajes anteriores

**Postcondición:** El usuario puede ver su historial de chat

---

### **CU-029: Limpiar Historial del Chat**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene conversaciones previas  
**Flujo Principal:**
1. El usuario selecciona "Limpiar Historial"
2. El sistema solicita confirmación
3. El usuario confirma la acción
4. El sistema elimina todas las conversaciones
5. El sistema muestra confirmación

**Postcondición:** El historial del chat ha sido limpiado

---

## 📊 Casos de Uso del Análisis Semanal

### **CU-030: Generar Análisis Semanal**
**Actor:** Sistema  
**Precondición:** Es fin de semana y el usuario tiene entradas  
**Flujo Principal:**
1. El sistema detecta que es fin de semana
2. El sistema obtiene las entradas de la semana
3. El sistema envía los datos a OpenAI para análisis
4. El sistema recibe el análisis generado
5. El sistema guarda el resumen semanal
6. El sistema notifica al usuario

**Postcondición:** Se ha generado un análisis semanal

---

### **CU-031: Ver Análisis Semanal**
**Actor:** Usuario autenticado  
**Precondición:** Existe un análisis semanal generado  
**Flujo Principal:**
1. El usuario accede al resumen semanal
2. El sistema obtiene el análisis más reciente
3. El sistema muestra el resumen generado
4. El sistema muestra los insights principales
5. El usuario puede ver estadísticas detalladas

**Postcondición:** El usuario puede ver su análisis semanal

---

### **CU-032: Ver Estadísticas Semanales**
**Actor:** Usuario autenticado  
**Precondición:** El usuario tiene entradas en la semana  
**Flujo Principal:**
1. El usuario accede a las estadísticas semanales
2. El sistema calcula las estadísticas:
   - Total de entradas
   - Sentimientos predominantes
   - Agradecimientos más frecuentes
   - Aprendizajes principales
3. El sistema muestra las estadísticas

**Postcondición:** El usuario puede ver sus estadísticas semanales

---

## 🎨 Casos de Uso de Personalización

### **CU-033: Ver Temas Disponibles**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la configuración de temas
2. El sistema obtiene todos los temas disponibles
3. El sistema identifica el tema actual del usuario
4. El sistema muestra los temas con vista previa

**Postcondición:** El usuario puede ver todos los temas disponibles

---

### **CU-034: Aplicar Tema**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario selecciona un tema
2. El sistema aplica el tema inmediatamente
3. El sistema actualiza la preferencia del usuario
4. El sistema actualiza el seguimiento de logros
5. El sistema muestra confirmación

**Postcondición:** El tema ha sido aplicado

---

### **CU-035: Ver Configuraciones de Usuario**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está autenticado  
**Flujo Principal:**
1. El usuario accede a la configuración
2. El sistema obtiene las configuraciones del usuario
3. El sistema muestra las opciones disponibles
4. El usuario puede modificar configuraciones

**Postcondición:** El usuario puede ver y modificar sus configuraciones

---

## 👨‍💼 Casos de Uso de Administración

### **CU-036: Gestionar Usuarios (Admin)**
**Actor:** Administrador  
**Precondición:** El administrador está autenticado  
**Flujo Principal:**
1. El administrador accede al panel de administración
2. El administrador selecciona "Gestionar Usuarios"
3. El sistema muestra la lista de usuarios
4. El administrador puede ver, editar o deshabilitar usuarios
5. El sistema aplica los cambios

**Postcondición:** Los usuarios han sido gestionados

---

### **CU-037: Gestionar Contenido (Admin)**
**Actor:** Administrador  
**Precondición:** El administrador está autenticado  
**Flujo Principal:**
1. El administrador accede al panel de administración
2. El administrador selecciona "Gestionar Contenido"
3. El sistema muestra las opciones:
   - Gestionar frases
   - Gestionar retos
   - Gestionar logros
   - Gestionar temas
4. El administrador puede agregar, editar o eliminar contenido

**Postcondición:** El contenido ha sido gestionado

---

### **CU-038: Ver Estadísticas del Sistema (Admin)**
**Actor:** Administrador  
**Precondición:** El administrador está autenticado  
**Flujo Principal:**
1. El administrador accede al panel de administración
2. El administrador selecciona "Estadísticas"
3. El sistema muestra estadísticas:
   - Usuarios registrados
   - Entradas de diario creadas
   - Frases compartidas
   - Logros desbloqueados
4. El administrador puede exportar los datos

**Postcondición:** El administrador puede ver las estadísticas del sistema

---

### **CU-039: Gestionar Logros (Admin)**
**Actor:** Administrador  
**Precondición:** El administrador está autenticado  
**Flujo Principal:**
1. El administrador accede a "Gestionar Logros"
2. El sistema muestra todos los logros disponibles
3. El administrador puede:
   - Agregar nuevos logros
   - Editar logros existentes
   - Configurar condiciones de desbloqueo
   - Activar/desactivar logros
4. El sistema guarda los cambios

**Postcondición:** Los logros han sido gestionados

---

### **CU-040: Backup del Sistema (Admin)**
**Actor:** Administrador  
**Precondición:** El administrador está autenticado  
**Flujo Principal:**
1. El administrador accede al panel de administración
2. El administrador selecciona "Backup del Sistema"
3. El sistema genera un backup de la base de datos
4. El sistema sube el backup a AWS S3
5. El sistema notifica al administrador

**Postcondición:** Se ha creado un backup del sistema

---

## 📈 Casos de Uso de Reportes

### **CU-041: Generar Reporte de Usuarios**
**Actor:** Administrador  
**Precondición:** El administrador está autenticado  
**Flujo Principal:**
1. El administrador accede a "Reportes"
2. El administrador selecciona "Reporte de Usuarios"
3. El administrador define los filtros (fecha, actividad)
4. El sistema genera el reporte
5. El sistema permite descargar el reporte

**Postcondición:** Se ha generado el reporte de usuarios

---

### **CU-042: Generar Reporte de Actividad**
**Actor:** Administrador  
**Precondición:** El administrador está autenticado  
**Flujo Principal:**
1. El administrador accede a "Reportes"
2. El administrador selecciona "Reporte de Actividad"
3. El administrador define el período de análisis
4. El sistema genera estadísticas de actividad
5. El sistema muestra gráficos y métricas

**Postcondición:** Se ha generado el reporte de actividad

---

## 🔧 Casos de Uso de Mantenimiento

### **CU-043: Limpiar Datos Antiguos**
**Actor:** Sistema  
**Precondición:** Es hora de mantenimiento programado  
**Flujo Principal:**
1. El sistema ejecuta la limpieza automática
2. El sistema elimina chats de más de 30 días
3. El sistema elimina resúmenes de más de 1 año
4. El sistema registra la limpieza realizada
5. El sistema notifica al administrador

**Postcondición:** Los datos antiguos han sido limpiados

---

### **CU-044: Verificar Integridad de Datos**
**Actor:** Sistema  
**Precondición:** Es hora de verificación programada  
**Flujo Principal:**
1. El sistema ejecuta verificaciones de integridad
2. El sistema verifica referencias entre tablas
3. El sistema identifica datos inconsistentes
4. El sistema genera reporte de integridad
5. El sistema notifica al administrador si hay problemas

**Postcondición:** Se ha verificado la integridad de los datos

---

## 📱 Casos de Uso Móviles

### **CU-045: Sincronización Offline**
**Actor:** Usuario autenticado  
**Precondición:** El usuario está en modo offline  
**Flujo Principal:**
1. El usuario crea entradas sin conexión
2. El sistema almacena los datos localmente
3. Cuando se restaura la conexión, el sistema sincroniza
4. El sistema envía los datos al servidor
5. El sistema confirma la sincronización

**Postcondición:** Los datos offline han sido sincronizados

---

### **CU-046: Notificaciones Push**
**Actor:** Usuario autenticado  
**Precondición:** El usuario ha habilitado notificaciones  
**Flujo Principal:**
1. El sistema detecta eventos importantes
2. El sistema genera notificaciones push
3. El sistema envía las notificaciones al dispositivo
4. El usuario recibe la notificación
5. El usuario puede interactuar con la notificación

**Postcondición:** El usuario ha recibido la notificación push

---

## 🎯 Resumen de Casos de Uso

### **Por Categoría:**
- **Autenticación:** 4 casos de uso
- **Perfil de Usuario:** 4 casos de uso
- **Diario de Gratitud:** 5 casos de uso
- **Frases Motivacionales:** 5 casos de uso
- **Retos Semanales:** 4 casos de uso
- **Sistema de Logros:** 4 casos de uso
- **Chat con IA:** 3 casos de uso
- **Análisis Semanal:** 3 casos de uso
- **Personalización:** 3 casos de uso
- **Administración:** 5 casos de uso
- **Reportes:** 2 casos de uso
- **Mantenimiento:** 2 casos de uso
- **Móviles:** 2 casos de uso

### **Total:** 46 casos de uso documentados

### **Prioridad de Implementación:**
1. **Alta:** Casos de uso de autenticación y funcionalidades core
2. **Media:** Casos de uso de personalización y análisis
3. **Baja:** Casos de uso de administración y reportes

---

*Documentación actualizada: Enero 2024*
*Versión: 1.0*
*Autor: Equipo de Desarrollo App Para Brillar* 