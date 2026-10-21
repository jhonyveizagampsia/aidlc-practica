# Inventario de componentes

### App Factory
- **Ubicación**: `src/app.js`
- **Responsabilidad**: crear una instancia de Express con `express.json()`, registrar las rutas `GET /health` y `GET /tasks`, y mantener el arreglo `tasks` en memoria por instancia.
- **Dependencias**: `express`.
- **Consumidores**: Server Entry Point, Test Suite.
- **Punto de cambio del intent**: aquí se añadirán `POST /tasks` y `GET /tasks/:id`.

### Server Entry Point
- **Ubicación**: `src/server.js`
- **Responsabilidad**: obtener la app de `createApp()` y escuchar en `process.env.PORT || 3000`; registra un mensaje en consola.
- **Dependencias**: App Factory.
- **Consumidores**: script `npm start`.

### Test Suite
- **Ubicación**: `tests/app.test.js`
- **Responsabilidad**: verificar `GET /health` y `GET /tasks` (lista vacía) mediante Supertest sobre una app nueva por prueba.
- **Dependencias**: App Factory, `supertest`, `jest` (globales `describe`/`test`/`expect`).
- **Consumidores**: script `npm test`.
