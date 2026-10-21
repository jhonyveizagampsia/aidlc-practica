# Resumen de generación de código

## Archivos creados y modificados

| Archivo | Cambio | Contenido |
|---|---|---|
| `src/validation.js` | nuevo | `validateCreateTask(body)` y `parseTaskId(param)`, funciones puras con los mensajes exactos de `requirements.md` y el orden de FR1.10 |
| `src/app.js` | modificado | `let nextId = 1` dentro de `createApp()`, `POST /tasks`, `GET /tasks/:id` y un manejador de errores JSON al final; `GET /health`, `GET /tasks` y la firma de `createApp()` no cambian |
| `tests/validation.test.js` | nuevo | 25 pruebas unitarias de validación |
| `tests/tasks.test.js` | nuevo | 26 pruebas de endpoints con Supertest (una `createApp()` por prueba) |
| `README.md` | modificado | sección "Endpoints" con los endpoints y el formato de error |

`src/server.js` y `tests/app.test.js` no se tocaron.

## Decisiones de implementación

- La validación vive en un módulo puro aparte (`src/validation.js`), así se prueba sin HTTP y `app.js` queda con manejadores cortos.
- El estado (`tasks` y `nextId`) se declara dentro de `createApp()`, de modo que cada instancia está aislada (NFR2). El contador solo avanza cuando se crea una tarea (FR3.2).
- Sin cuerpo, Express 4 deja `req.body` como `{}`, y también se acepta `undefined`. En ambos casos se aplica `"title is required"` (FR1.8).
- `parseTaskId` usa `^[1-9]\d*$`, así que `"01"`, `"+1"`, `"1.0"`, `"1e3"` y `" 1"` dan 400 (FR2.2).

## Cobertura de pruebas

- Línea base antes del cambio: `npm test` pasó 2/2 en 1 suite.
- Después: `npm test` pasó **53/53 en 3 suites**. Las 2 pruebas existentes siguen en verde.
- Cada `400` y `404` comprueba el código HTTP y el texto exacto de `error` (NFR1, FR4.1). El JSON mal formado comprueba que la respuesta es JSON y no HTML (FR1.9).
- Sin umbral de cobertura en el scope express. Todas las ramas de `src/validation.js` y de los manejadores nuevos tienen al menos una prueba.

## Desviaciones del plan

- **Manejador de errores (paso 4, NFR3).** El plan decía pasar con `next(err)` cualquier error que no fuera de JSON mal formado. Pero fuera de producción el manejador por defecto de Express responde HTML con traza de pila (por ejemplo, un 413 por cuerpo de más de 100 kb), y eso incumpliría NFR3 y la frase "en ningún caso se exponen trazas" del propio plan. El manejador implementado hace esto:
  - JSON mal formado → `400 { "error": "Invalid JSON body" }`.
  - Otros errores 4xx del parser → conservan su código y responden `{ "error": <texto estándar HTTP> }` (p. ej. `413 { "error": "Payload Too Large" }`).
  - Cualquier otro error → se registra con `console.error` y responde `500 { "error": "Internal Server Error" }`.
  - `next(err)` solo se usa si ya se enviaron las cabeceras.

  Los textos `Payload Too Large` e `Internal Server Error` no figuran en los requisitos, y una prueba cubre el caso 413.
- Fuera de alcance, sin cambios: las rutas inexistentes (p. ej. `GET /nope`) siguen con el 404 HTML por defecto de Express. FR4.1 se limita a los endpoints de tareas.
