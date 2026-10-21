# Requisitos: crear y consultar tareas

## Análisis de la intención

- **Objetivo**: ampliar la API de tareas en memoria para poder crear tareas (`POST /tasks`) y consultarlas por identificador (`GET /tasks/:id`), con validación de entrada y pruebas Jest que cubran el caso feliz y cada error. [desc]
- **Tipo**: mejora de un servicio existente (brownfield), un solo componente (`src/app.js`, fábrica `createApp()`), complejidad baja.
- **Profundidad**: Minimal. `feature.md` define casi todo el contrato; las cuatro decisiones abiertas se resolvieron en `requirements-analysis-questions.md` [Q1]–[Q4].
- **Éxito**: `npm test` pasa, las pruebas nuevas cubren el caso feliz y cada error, y `GET /tasks` lista las tareas creadas. [desc]

Fuentes: `feature.md` (leído como entrada del intent), descripción inicial del intent [desc], knowledge base del código en `aidlc/spaces/default/codekb/aidlc-practica/` (business-overview, architecture, code-structure), respuestas [Q1]–[Q4].

## Requisitos funcionales

### FR1 — Crear tarea (`POST /tasks`)

- **FR1.1** — El sistema aceptará `POST /tasks` con un cuerpo JSON y, si es válido, responderá `201` con la tarea creada `{ id, title, done }`.
  - Given una app recién creada, When se envía `{ "title": "Comprar pan" }`, Then responde `201` con `{ "id": 1, "title": "Comprar pan", "done": false }`.
- **FR1.2** — `title` es obligatorio y debe ser una cadena (string). Si falta o no es string, responde `400`.
  - Mensajes: falta → `"title is required"`; no es string → `"title must be a string"`.
- **FR1.3** — `title` se recorta (trim) antes de validar la longitud y guardarse. Si tras el recorte queda vacío, responde `400` con `"title must not be empty"`.
  - Given `{ "title": "  Leer  " }`, Then la tarea guardada tiene `title: "Leer"`.
- **FR1.4** — `title`, ya recortado, tendrá como máximo 100 caracteres. Con 101 o más responde `400` con `"title must be at most 100 characters"`. Con exactamente 100 se acepta (valor límite).
- **FR1.5** — `done` es opcional. Si aparece, debe ser booleano; si no lo es, responde `400` con `"done must be a boolean"`. Si falta, vale `false`.
  - Given `{ "title": "x", "done": true }`, Then responde `201` con `done: true`.
- **FR1.6** — `id` es un entero autoincremental que empieza en 1 en cada instancia de la app (estado dentro de `createApp()`) y nunca se reutiliza.
  - Given dos creaciones seguidas, Then los `id` son `1` y `2`.
- **FR1.7** — Si el cuerpo trae campos distintos de `title` y `done`, responde `400` con `"unknown field: <campo>"` (se nombra el primer campo desconocido). [Q2]
- **FR1.8** — Si el cuerpo no es un objeto JSON (por ejemplo un arreglo o `null`), o si no hay cuerpo, responde `400`: sin cuerpo se aplica FR1.2 (`"title is required"`); un cuerpo que no es objeto da `"request body must be a JSON object"`.
- **FR1.9** — Si el cuerpo es JSON mal formado, responde `400` con `{ "error": "Invalid JSON body" }` en JSON, no en HTML. [Q1]
- **FR1.10** — Cuando hay varios errores a la vez, la validación devuelve uno solo, en este orden: forma del cuerpo (FR1.8), campos desconocidos (FR1.7), `title` (FR1.2 → FR1.3 → FR1.4) y `done` (FR1.5).

### FR2 — Consultar tarea por id (`GET /tasks/:id`)

- **FR2.1** — El sistema responderá `200` con `{ id, title, done }` cuando exista una tarea con ese `id`.
  - Given una tarea creada con `id` 1, When `GET /tasks/1`, Then `200` con esa tarea.
- **FR2.2** — `:id` debe cumplir `^[1-9]\d*$` (entero positivo, solo dígitos y sin ceros a la izquierda). Si no lo cumple, responde `400` con `"id must be a positive integer"`. [Q3]
  - Casos de `400`: `abc`, `0`, `-1`, `1.5`, `1.0`, `01`, `+1`.
- **FR2.3** — Si `:id` es válido pero no existe ninguna tarea con ese valor, responde `404` con `{ "error": "Task not found" }`.

### FR3 — Listar tareas (`GET /tasks`, existente)

- **FR3.1** — `GET /tasks` seguirá respondiendo `200` con un arreglo y ahora incluirá, en orden de creación, las tareas creadas con `POST /tasks`, con forma `{ id, title, done }`.
  - Given dos tareas creadas, When `GET /tasks`, Then `200` con ambas en orden.
- **FR3.2** — Las peticiones rechazadas (`400`) no crean tareas ni consumen `id`.

### FR4 — Formato de errores

- **FR4.1** — Toda respuesta `400` o `404` de estos endpoints lleva `Content-Type` JSON y el cuerpo `{ "error": "<mensaje>" }`. Los mensajes son fijos, en inglés, y son los de FR1 y FR2. [Q4]

## Requisitos no funcionales

- **NFR1 — Pruebas**: hay al menos una prueba Jest + Supertest por cada requisito FR1.x, FR2.x y FR3.x: el caso feliz más cada error, comprobando el código HTTP y el texto exacto de `error` [Q4]. Las 2 pruebas existentes siguen pasando y `npm test` termina con código 0.
- **NFR2 — Aislamiento**: cada llamada a `createApp()` tiene su propio almacén y su propio contador de `id`. Una prueba no ve las tareas de otra.
- **NFR3 — Seguridad de entrada**: toda la entrada se valida en el borde HTTP (FR1, FR2). El límite de tamaño del cuerpo es el de `express.json()` por defecto (100 kb). Ningún error devuelve trazas de pila ni HTML.
- **NFR4 — Compatibilidad**: no cambia el contrato de `GET /health`. `GET /tasks` mantiene `200` + arreglo.

## Restricciones

- Node.js + Express, almacenamiento en memoria (sin base de datos). [desc] (`feature.md`)
- Pruebas con Jest y Supertest, ya instalados en el proyecto (ver `technology-stack.md` en la knowledge base).
- Estilo existente: CommonJS, comillas simples, punto y coma, 2 espacios (ver `code-structure.md`).
- No se añaden dependencias nuevas.

## Supuestos

- [assumption] La longitud de `title` se cuenta en unidades de cadena de JavaScript (`String.prototype.length`) tras el recorte. Razón: es lo habitual en Node y `feature.md` no dice nada de emojis ni grafemas.
- [assumption] Los mensajes de error van en inglés. Razón: el único mensaje fijado por `feature.md` (`"Task not found"`) está en inglés, y en la pregunta 4 se eligieron mensajes en inglés por caso.
- [assumption] Un `title` duplicado está permitido. Razón: `feature.md` no exige unicidad.

## Fuera de alcance

- Actualizar o borrar tareas (`PUT`/`PATCH`/`DELETE`).
- Persistencia entre reinicios, autenticación, paginación y filtrado.
- Linter, CI y configuración de cobertura (deuda técnica registrada en `code-quality-assessment.md`).

## Preguntas abiertas

- Ninguna.
