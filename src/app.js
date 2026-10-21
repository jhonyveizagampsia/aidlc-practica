const http = require('http');
const express = require('express');
const { validateCreateTask, parseTaskId } = require('./validation');

function createApp() {
  const app = express();
  app.use(express.json());

  // Almacenamiento en memoria: cada instancia de la app tiene sus propias tareas.
  const tasks = [];
  // Contador de id por instancia; solo avanza cuando se crea una tarea.
  let nextId = 1;

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/tasks', (req, res) => {
    res.json(tasks);
  });

  app.post('/tasks', (req, res) => {
    const result = validateCreateTask(req.body);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const task = { id: nextId++, title: result.value.title, done: result.value.done };
    tasks.push(task);
    return res.status(201).json(task);
  });

  app.get('/tasks/:id', (req, res) => {
    const id = parseTaskId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const task = tasks.find((candidate) => candidate.id === id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(task);
  });

  // Manejador de errores: el JSON mal formado responde 400 en JSON (no HTML).
  // El resto de errores también responde en JSON y sin traza de pila (NFR3):
  // los de cliente (4xx, p. ej. cuerpo demasiado grande) conservan su código,
  // y los demás se registran y responden 500.
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const status = err.status || err.statusCode;
    if (Number.isInteger(status) && status >= 400 && status < 500) {
      return res.status(status).json({ error: http.STATUS_CODES[status] || 'Bad Request' });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

module.exports = { createApp };
