const request = require('supertest');
const { createApp } = require('../src/app');

// Comprueba un error JSON: código HTTP, Content-Type y texto exacto.
function expectJsonError(res, status, message) {
  expect(res.status).toBe(status);
  expect(res.headers['content-type']).toMatch(/application\/json/);
  expect(res.body).toEqual({ error: message });
}

describe('POST /tasks', () => {
  test('crea una tarea con done en false por defecto', async () => {
    const res = await request(createApp()).post('/tasks').send({ title: 'Comprar pan' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, title: 'Comprar pan', done: false });
  });

  test('crea una tarea con done explícito', async () => {
    const res = await request(createApp()).post('/tasks').send({ title: 'x', done: true });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, title: 'x', done: true });
  });

  test('asigna ids consecutivos 1 y 2', async () => {
    const app = createApp();
    const first = await request(app).post('/tasks').send({ title: 'Uno' });
    const second = await request(app).post('/tasks').send({ title: 'Dos' });
    expect(first.body.id).toBe(1);
    expect(second.body.id).toBe(2);
  });

  test('recorta el title', async () => {
    const res = await request(createApp()).post('/tasks').send({ title: '  Leer  ' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Leer');
  });

  test('acepta un title de 100 caracteres', async () => {
    const title = 'a'.repeat(100);
    const res = await request(createApp()).post('/tasks').send({ title });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(title);
  });

  test.each([
    ['title ausente', { done: false }, 'title is required'],
    ['title no string', { title: 42 }, 'title must be a string'],
    ['title vacío', { title: '   ' }, 'title must not be empty'],
    ['title de 101 caracteres', { title: 'a'.repeat(101) }, 'title must be at most 100 characters'],
    ['done no booleano', { title: 'x', done: 'yes' }, 'done must be a boolean'],
    ['campo desconocido', { title: 'x', priority: 1 }, 'unknown field: priority'],
    ['cuerpo arreglo', [{ title: 'x' }], 'request body must be a JSON object'],
  ])('responde 400 con %s', async (_caso, body, message) => {
    const res = await request(createApp()).post('/tasks').send(body);
    expectJsonError(res, 400, message);
  });

  test('responde 400 sin cuerpo', async () => {
    const res = await request(createApp()).post('/tasks');
    expectJsonError(res, 400, 'title is required');
  });

  test('responde 400 en JSON (no HTML) ante JSON mal formado', async () => {
    const res = await request(createApp())
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send('{"title":');
    expectJsonError(res, 400, 'Invalid JSON body');
    expect(res.text).not.toMatch(/<html|<pre|\s+at\s+\S+\s+\(/i);
  });

  test('un cuerpo demasiado grande responde JSON sin traza de pila', async () => {
    const res = await request(createApp())
      .post('/tasks')
      .send({ title: 'a'.repeat(200 * 1024) });
    expectJsonError(res, 413, 'Payload Too Large');
    expect(res.text).not.toMatch(/<html|<pre|\s+at\s+\S+\s+\(/i);
  });

  test('una petición rechazada no consume id ni crea tarea', async () => {
    const app = createApp();
    await request(app).post('/tasks').send({ title: '' });
    const res = await request(app).post('/tasks').send({ title: 'Válida' });
    expect(res.body.id).toBe(1);
    const list = await request(app).get('/tasks');
    expect(list.body).toEqual([{ id: 1, title: 'Válida', done: false }]);
  });
});

describe('GET /tasks/:id', () => {
  test('devuelve 200 con la tarea existente', async () => {
    const app = createApp();
    await request(app).post('/tasks').send({ title: 'Comprar pan' });
    const res = await request(app).get('/tasks/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, title: 'Comprar pan', done: false });
  });

  test.each(['abc', '0', '01', '-1', '1.5'])('responde 400 con id "%s"', async (id) => {
    const res = await request(createApp()).get(`/tasks/${id}`);
    expectJsonError(res, 400, 'id must be a positive integer');
  });

  test('responde 404 si la tarea no existe', async () => {
    const res = await request(createApp()).get('/tasks/99');
    expectJsonError(res, 404, 'Task not found');
  });
});

describe('GET /tasks', () => {
  test('lista las tareas creadas en orden de creación', async () => {
    const app = createApp();
    await request(app).post('/tasks').send({ title: 'Uno' });
    await request(app).post('/tasks').send({ title: 'Dos', done: true });
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, title: 'Uno', done: false },
      { id: 2, title: 'Dos', done: true },
    ]);
  });

  test('cada instancia de la app tiene su propio almacén y contador', async () => {
    const appA = createApp();
    const appB = createApp();
    await request(appA).post('/tasks').send({ title: 'Solo en A' });
    const created = await request(appB).post('/tasks').send({ title: 'Primera de B' });
    expect(created.body.id).toBe(1);
    const listA = await request(appA).get('/tasks');
    const listB = await request(appB).get('/tasks');
    expect(listA.body).toEqual([{ id: 1, title: 'Solo en A', done: false }]);
    expect(listB.body).toEqual([{ id: 1, title: 'Primera de B', done: false }]);
  });
});

describe('GET /health', () => {
  test('mantiene su contrato tras los cambios', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
