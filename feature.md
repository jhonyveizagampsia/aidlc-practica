# Feature: crear y consultar tareas

Ampliar la API de tareas (Express, almacenamiento en memoria) con dos endpoints:

- **POST /tasks**: recibe JSON `{ "title": string, "done"?: boolean }`.
  - `title` es obligatorio, se recorta (trim), no puede quedar vacío y tiene como máximo 100 caracteres.
  - `done` es opcional, debe ser booleano y por defecto es `false`.
  - Respuesta `201` con la tarea creada `{ id, title, done }`; `id` es un entero autoincremental desde 1.
  - Errores: `400` con `{ "error": "<mensaje>" }` si el cuerpo es inválido.
- **GET /tasks/:id**: devuelve `200` con la tarea.
  - Errores: `400` si `id` no es un entero positivo; `404` con `{ "error": "Task not found" }` si no existe.

**Criterio de aceptación:** `npm test` pasa con pruebas que cubren el caso feliz y cada error,
y `GET /tasks` lista las tareas creadas.
