# Análisis de requisitos: preguntas

`feature.md` define con claridad casi todo el comportamiento. Estas preguntas cubren solo los huecos que cambian el código o las pruebas.

## Pregunta 1: JSON malformado en POST /tasks
Hoy, si el cuerpo no es JSON válido (por ejemplo `{"title":`), Express responde `400` con una página HTML. `feature.md` pide `400` con `{ "error": "<mensaje>" }` cuando el cuerpo es inválido.

A. Añadir un manejador de errores que responda `400` con `{ "error": "Invalid JSON body" }` (formato coherente con el resto)
B. Dejar el comportamiento por defecto de Express (400 en HTML) y no probarlo
X. Other (please specify)

[Answer]: A

## Pregunta 2: Campos desconocidos en el cuerpo
¿Qué hacemos si el cuerpo trae campos que no son `title` ni `done` (por ejemplo `{ "title": "x", "priority": 2 }`)?

A. Ignorarlos: se crea la tarea solo con `title` y `done`
B. Rechazar la petición con `400`
X. Other (please specify)

[Answer]: B

## Pregunta 3: Validación del parámetro `id` en GET /tasks/:id
`feature.md` pide `400` si `id` no es un entero positivo. Casos dudosos: `"01"`, `"+1"` o `"1.0"`.

A. Estricto: solo dígitos decimales sin ceros a la izquierda (`^[1-9]\d*$`); `"01"`, `"+1"` y `"1.0"` dan `400`
B. Permisivo: se aceptan si representan un entero positivo (`"01"` busca la tarea 1)
X. Other (please specify)

[Answer]: A

## Pregunta 4: Mensajes de error de validación
Para el `400` de POST /tasks y de GET /tasks/:id, ¿qué texto lleva `error`? (El `404` ya está fijado: `"Task not found"`.)

A. Un mensaje específico por caso, en inglés (p. ej. `"title is required"`, `"title must be at most 100 characters"`, `"done must be a boolean"`, `"id must be a positive integer"`), y las pruebas comprueban el texto exacto
B. Un mensaje genérico (`"Invalid request body"` / `"Invalid id"`), y las pruebas comprueban el texto exacto
C. Mensajes específicos, pero las pruebas solo comprueban el código `400` y que exista la propiedad `error`
X. Other (please specify)

[Answer]: A
