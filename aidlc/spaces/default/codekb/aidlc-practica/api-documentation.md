# Documentación de la API

Base: `http://localhost:${PORT}` (por defecto 3000). Sin autenticación, sin limitación de tasa, sin versionado. Middleware común: `express.json()`.

## Endpoints existentes

### GET /health
- **Parámetros**: ninguno.
- **Respuesta**: `200` `{ "status": "ok" }`.
- **Origen**: `src/app.js:10-12`. Cubierto por prueba.

### GET /tasks
- **Parámetros**: ninguno (sin paginación ni filtros).
- **Respuesta**: `200` arreglo JSON de tareas; en la línea base siempre `[]`.
- **Origen**: `src/app.js:14-16`. Cubierto por prueba.

## Endpoints pendientes (definidos en `feature.md`, no implementados)

### POST /tasks
- **Cuerpo**: `{ "title": string, "done"?: boolean }`.
- **Reglas**: `title` obligatorio, se aplica trim, no vacío, máx. 100 caracteres; `done` opcional, booleano, por defecto `false`.
- **Respuestas**: `201` `{ id, title, done }` con `id` entero autoincremental desde 1; `400` `{ "error": "<mensaje>" }` si el cuerpo es inválido.

### GET /tasks/:id
- **Respuestas**: `200` tarea; `400` si `id` no es entero positivo; `404` `{ "error": "Task not found" }`.

## Formato de error
No existe aún un formato de error en el código. `feature.md` fija el formato plano `{ "error": "<mensaje>" }`. Un JSON malformado hoy produce la respuesta de error por defecto de Express (HTML, 400).
