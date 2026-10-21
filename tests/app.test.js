const request = require('supertest');
const { createApp } = require('../src/app');

describe('API base', () => {
  test('GET /health responde ok', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /tasks devuelve una lista vacía al inicio', async () => {
    const res = await request(createApp()).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
