// Validación pura de la entrada HTTP de tareas (sin dependencias de Express).

const MAX_TITLE_LENGTH = 100;
const ALLOWED_FIELDS = ['title', 'done'];
const TASK_ID_PATTERN = /^[1-9]\d*$/;

// Valida el cuerpo de POST /tasks en el orden de FR1.10:
// forma del cuerpo, campos desconocidos, title y done.
// Devuelve { value: { title, done } } o { error: '<mensaje>' }.
function validateCreateTask(body) {
  // Sin cuerpo: se trata como objeto vacío y se aplica "title is required".
  if (body === undefined) {
    return { error: 'title is required' };
  }

  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'request body must be a JSON object' };
  }

  const unknownField = Object.keys(body).find((key) => !ALLOWED_FIELDS.includes(key));
  if (unknownField !== undefined) {
    return { error: `unknown field: ${unknownField}` };
  }

  if (body.title === undefined) {
    return { error: 'title is required' };
  }
  if (typeof body.title !== 'string') {
    return { error: 'title must be a string' };
  }

  const title = body.title.trim();
  if (title.length === 0) {
    return { error: 'title must not be empty' };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { error: `title must be at most ${MAX_TITLE_LENGTH} characters` };
  }

  if (body.done !== undefined && typeof body.done !== 'boolean') {
    return { error: 'done must be a boolean' };
  }

  return { value: { title, done: body.done === undefined ? false : body.done } };
}

// Convierte el parámetro :id en entero positivo, o devuelve null si no cumple ^[1-9]\d*$.
function parseTaskId(param) {
  if (typeof param !== 'string' || !TASK_ID_PATTERN.test(param)) {
    return null;
  }
  return Number(param);
}

module.exports = { validateCreateTask, parseTaskId, MAX_TITLE_LENGTH };
