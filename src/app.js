const express = require('express');

function createApp() {
  const app = express();
  app.use(express.json());

  // Almacenamiento en memoria: cada instancia de la app tiene sus propias tareas.
  const tasks = [];

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/tasks', (req, res) => {
    res.json(tasks);
  });

  return app;
}

module.exports = { createApp };
