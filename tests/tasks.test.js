const request = require('supertest');
const { createApp } = require('../src/app');

describe('POST /tasks', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  test('crea una tarea con done=false por defecto', async () => {
    const res = await request(app).post('/tasks').send({ title: '  Comprar pan  ' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, title: 'Comprar pan', done: false });
  });

  test('respeta done=true y asigna ids incrementales', async () => {
    await request(app).post('/tasks').send({ title: 'Primera' });
    const res = await request(app).post('/tasks').send({ title: 'Segunda', done: true });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, title: 'Segunda', done: true });
  });

  test('la tarea creada aparece en GET /tasks', async () => {
    await request(app).post('/tasks').send({ title: 'Listar' });
    const res = await request(app).get('/tasks');
    expect(res.body).toEqual([{ id: 1, title: 'Listar', done: false }]);
  });

  test.each([
    ['sin title', {}, 'title is required and must be a string'],
    ['title no string', { title: 42 }, 'title is required and must be a string'],
    ['title vacío', { title: '   ' }, 'title must not be empty'],
    ['title demasiado largo', { title: 'a'.repeat(101) }, 'title must be at most 100 characters'],
    ['done no booleano', { title: 'x', done: 'yes' }, 'done must be a boolean'],
  ])('400 si %s', async (_name, body, message) => {
    const res = await request(app).post('/tasks').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: message });
  });

  test('acepta un title de exactamente 100 caracteres', async () => {
    const res = await request(app).post('/tasks').send({ title: 'a'.repeat(100) });
    expect(res.status).toBe(201);
  });

  test('400 si el cuerpo es un arreglo', async () => {
    const res = await request(app).post('/tasks').send([{ title: 'x' }]);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Body must be a JSON object' });
  });

  test('400 si el JSON está mal formado', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send('{"title": ');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Malformed JSON' });
  });
});

describe('GET /tasks/:id', () => {
  let app;
  beforeEach(async () => {
    app = createApp();
    await request(app).post('/tasks').send({ title: 'Existente' });
  });

  test('200 con la tarea si existe', async () => {
    const res = await request(app).get('/tasks/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, title: 'Existente', done: false });
  });

  test('404 si no existe', async () => {
    const res = await request(app).get('/tasks/99');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });

  test.each(['abc', '0', '-1', '1.5'])('400 si id es "%s"', async (id) => {
    const res = await request(app).get(`/tasks/${id}`);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'id must be a positive integer' });
  });
});
