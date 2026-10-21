const express = require('express');

const MAX_TITLE_LENGTH = 100;

function validateNewTask(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Body must be a JSON object';
  }
  if (typeof body.title !== 'string') {
    return 'title is required and must be a string';
  }
  const title = body.title.trim();
  if (title.length === 0) {
    return 'title must not be empty';
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return `title must be at most ${MAX_TITLE_LENGTH} characters`;
  }
  if (body.done !== undefined && typeof body.done !== 'boolean') {
    return 'done must be a boolean';
  }
  return null;
}

function createApp() {
  const app = express();
  app.use(express.json());

  // Almacenamiento en memoria: cada instancia de la app tiene sus propias tareas.
  const tasks = [];
  let nextId = 1;

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/tasks', (req, res) => {
    res.json(tasks);
  });

  app.post('/tasks', (req, res) => {
    const error = validateNewTask(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    const task = { id: nextId++, title: req.body.title.trim(), done: req.body.done ?? false };
    tasks.push(task);
    return res.status(201).json(task);
  });

  app.get('/tasks/:id', (req, res) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(task);
  });

  // JSON mal formado: express.json() lanza un error con status 400.
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Malformed JSON' });
    }
    return next(err);
  });

  return app;
}

module.exports = { createApp };
