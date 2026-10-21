# Visión de negocio

## Propósito
`aidlc-practica` es una API HTTP mínima de gestión de tareas (Node.js + Express) creada como material de práctica académica: sirve para comparar la implementación de un mismo feature con un asistente de IA directo (rama `feature-sin-aidlc`) y con AI-DLC de AWS 2.11.0 en perfil Express (rama `feature-con-aidlc`). Fuente: `README.md`, `package.json` (`description`).

## Dominio
- **Entidad principal**: tarea (`task`). Hoy es un elemento opaco en un arreglo en memoria; `feature.md` la define como `{ id, title, done }`.
- **Usuarios**: estudiantes/desarrolladores que ejecutan la API localmente y sus pruebas; no hay usuarios finales, autenticación ni multi-tenencia.

## Funcionalidad existente
- Comprobación de salud del servicio (`GET /health`).
- Listado de tareas (`GET /tasks`), que en la línea base siempre devuelve `[]` porque no existe forma de crear tareas.

Detalle de contratos en [api-documentation.md](api-documentation.md).

## Funcionalidad pendiente (no implementada)
`feature.md` describe el feature que este intent implementará; **no** es comportamiento existente:
- `POST /tasks`: crear tarea con `title` obligatorio (recortado, no vacío, máx. 100 caracteres) y `done` opcional booleano (por defecto `false`); responde `201` con `id` entero autoincremental desde 1; `400` con `{ "error": "<mensaje>" }` si el cuerpo es inválido.
- `GET /tasks/:id`: `200` con la tarea; `400` si `id` no es entero positivo; `404` con `{ "error": "Task not found" }` si no existe.
- Criterio de aceptación: `npm test` pasa con pruebas del caso feliz y de cada error, y `GET /tasks` lista las tareas creadas.

## Contexto adicional
`docs/practicas/aidlc-comparacion.md` es una plantilla (sin rellenar) de la entrega de la práctica; no afecta al comportamiento de la API.
