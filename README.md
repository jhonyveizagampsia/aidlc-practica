# aidlc-practica

API mínima de tareas (Node + Express) usada para la práctica *AI-DLC de AWS con y sin herramienta*.

| Rama | Contenido |
|---|---|
| `main` | Proyecto base: `GET /health` y `GET /tasks` |
| `feature-sin-aidlc` | Feature de [feature.md](feature.md) implementado con el asistente de IA directamente |
| `feature-con-aidlc` | El mismo feature implementado con AI-DLC de AWS 2.11.0 (perfil Express) |

La comparación está en [docs/practicas/aidlc-comparacion.md](docs/practicas/aidlc-comparacion.md).

```bash
npm install
npm test
npm start
```

## Endpoints

| Método y ruta | Respuesta |
|---|---|
| `GET /health` | `200 { "status": "ok" }` |
| `GET /tasks` | `200` con el arreglo de tareas en orden de creación |
| `POST /tasks` | `201` con la tarea creada `{ id, title, done }`. Cuerpo: `title` (string obligatorio, se recorta, 1–100 caracteres) y `done` (booleano opcional, `false` por defecto); cualquier otro campo se rechaza |
| `GET /tasks/:id` | `200` con la tarea; `400` si `id` no es un entero positivo; `404` si no existe |

Las tareas viven en memoria y se pierden al reiniciar. Los errores responden en JSON con la forma `{ "error": "<mensaje>" }`, por ejemplo `{ "error": "title is required" }` o `{ "error": "Task not found" }`; un JSON mal formado da `400 { "error": "Invalid JSON body" }`.
