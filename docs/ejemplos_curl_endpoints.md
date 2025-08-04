# Ejemplos de uso de endpoints (curl)

> Reemplaza `TU_TOKEN` por el token JWT válido y ajusta los parámetros según corresponda.

---

## Autenticación (`/api/auth`)

### Registro de usuario

#### Opción tradicional (bash/cmd/curl.exe)
```sh
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Cristian","apellido":"Gómez","correo_electronico":"crishhio@gmail.com","password":"12345678","fecha_nacimiento":"1989-09-26"}'
```

#### Opción PowerShell
```powershell
$body = @{
  nombre = "Cristian"
  apellido = "Gómez"
  correo_electronico = "crishhio@gmail.com"
  password = "12345678"
  fecha_nacimiento = "1989-09-26"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Login

#### Opción tradicional
```sh
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo_electronico":"crishhio@gmail.com","password":"12345678"}'
```

#### Opción PowerShell
```powershell
$body = @{
  correo_electronico = "crishhio@gmail.com"
  password = "12345678"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Refresh token

> **Importante:** Debes enviar el valor de `refreshToken` (no el access token) en el cuerpo de la petición.

#### Opción tradicional (curl)
```sh
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"TU_REFRESH_TOKEN"}'
```

#### Opción PowerShell
```powershell
$body = @{ refreshToken = "TU_REFRESH_TOKEN" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/refresh" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Logout

#### Opción tradicional
```sh
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer TU_TOKEN"
```

#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/logout" `
  -Method POST `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Obtener info de usuario autenticado

#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN"
```

#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

---

## Usuarios (`/api/users`)

### Obtener perfil
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/users/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Actualizar perfil
#### Opción tradicional
```sh
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo_electronico": "juan.perez@email.com",
    "fecha_nacimiento": "1990-01-01",
    "id_color_tema": 2
  }'
```
#### Opción PowerShell
```powershell
$body = @{
  nombre = "Juan"
  apellido = "Pérez"
  correo_electronico = "juan.perez@email.com"
  fecha_nacimiento = "1990-01-01"
  id_color_tema = 2
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/users/me" `
  -Method PUT `
  -Headers @{ Authorization = "Bearer TU_TOKEN" } `
  -Body $body `
  -ContentType "application/json"
```

> Puedes omitir los campos que no quieras actualizar. Todos son opcionales, pero al menos uno debe estar presente.

### Cambiar contraseña
#### Opción tradicional
```sh
curl -X PUT http://localhost:3000/api/users/me/password \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password_actual":"12345678","nueva_password":"nuevaClave123"}'
```
#### Opción PowerShell
```powershell
$body = @{
  password_actual = "12345678"
  nueva_password = "nuevaClave123"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/users/me/password" `
  -Method PUT `
  -Headers @{ Authorization = "Bearer TU_TOKEN" } `
  -Body $body `
  -ContentType "application/json"
```

### Eliminar cuenta
#### Opción tradicional
```sh
curl -X DELETE http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/users/me" `
  -Method DELETE `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

---

## Temas (`/api/themes`)

### Listar temas
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/themes
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/themes" -Method GET
```

### Obtener tema específico
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/themes/1
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/themes/1" -Method GET
```

---

## Frases (`/api/quotes`)

### Obtener frase diaria
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/quotes/daily \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/daily" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Marcar frase diaria como vista
#### Opción tradicional
```sh
curl -X POST http://localhost:3000/api/quotes/daily/view \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/daily/view" `
  -Method POST `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Listar frases favoritas
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/quotes/favorites \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/favorites" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Marcar/desmarcar frase como favorita
#### Opción tradicional
```sh
curl -X POST http://localhost:3000/api/quotes/123/favorite \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/123/favorite" `
  -Method POST `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Listar categorías de frases
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/quotes/categories
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/categories" -Method GET
```

### Buscar frases
#### Opción tradicional
```sh
curl -X GET "http://localhost:3000/api/quotes/search?query=felicidad"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/search?query=felicidad" -Method GET
```

### Obtener frase aleatoria
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/quotes/random
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/random" -Method GET
```

### Historial de frases
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/quotes/history \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/quotes/history" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

---

## Gratitud (`/api/gratitude`)

### Listar entradas
#### Opción tradicional
```sh
curl -X GET "http://localhost:3000/api/gratitude?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/gratitude?page=1&limit=10" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Obtener entrada específica
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/gratitude/ID_ENTRADA \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/gratitude/ID_ENTRADA" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Crear entrada
#### Opción tradicional
```sh
curl -X POST http://localhost:3000/api/gratitude \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"texto":"Hoy agradezco..."}'
```
#### Opción PowerShell
```powershell
$body = @{ texto = "Hoy agradezco..." } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/gratitude" `
  -Method POST `
  -Headers @{ Authorization = "Bearer TU_TOKEN" } `
  -Body $body `
  -ContentType "application/json"
```

### Editar entrada
#### Opción tradicional
```sh
curl -X PUT http://localhost:3000/api/gratitude/ID_ENTRADA \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"texto":"Texto editado"}'
```
#### Opción PowerShell
```powershell
$body = @{ texto = "Texto editado" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/gratitude/ID_ENTRADA" `
  -Method PUT `
  -Headers @{ Authorization = "Bearer TU_TOKEN" } `
  -Body $body `
  -ContentType "application/json"
```

### Eliminar entrada
#### Opción tradicional
```sh
curl -X DELETE http://localhost:3000/api/gratitude/ID_ENTRADA \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/gratitude/ID_ENTRADA" `
  -Method DELETE `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

---

## Chat IA (`/api/chat`)

### Historial de chat
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/chat/history \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/chat/history" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Enviar mensaje
#### Opción tradicional
```sh
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola, IA"}'
```
#### Opción PowerShell
```powershell
$body = @{ message = "Hola, IA" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/chat/message" `
  -Method POST `
  -Headers @{ Authorization = "Bearer TU_TOKEN" } `
  -Body $body `
  -ContentType "application/json"
```

---

## Retos (`/api/challenges`)

### Listar retos
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/challenges \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/challenges" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Retos del usuario
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/challenges/user \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/challenges/user" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

---

## Logros (`/api/achievements`)

### Listar logros
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/achievements \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/achievements" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```

### Logros del usuario
#### Opción tradicional
```sh
curl -X GET http://localhost:3000/api/achievements/user \
  -H "Authorization: Bearer TU_TOKEN"
```
#### Opción PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/achievements/user" `
  -Method GET `
  -Headers @{ Authorization = "Bearer TU_TOKEN" }
```
