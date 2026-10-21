# Instrucciones de pruebas unitarias

## Framework y configuración

- Jest 29 (`devDependencies`) con la configuración por defecto: no hay `jest.config.*`; Jest descubre `tests/**/*.test.js`. No hace falta añadir configuración.
- Supertest 7 para las pruebas HTTP: `request(createApp())` en cada prueba, sin abrir puerto.
- Requisito previo: haber ejecutado `npm install`.

## Cómo ejecutar las pruebas de este trabajo

Comando acotado a los archivos de este trabajo (sirve desde antes de la primera prueba nueva; con los archivos aún inexistentes, Jest informa de que no encuentra pruebas):

```bash
npx jest tests/validation.test.js tests/tasks.test.js
```

Por capa:

```bash
npx jest tests/validation.test.js
npx jest tests/tasks.test.js
```

## Alcance (estrategia Minimal)

- `tests/validation.test.js`: una prueba por regla de validación (FR1.2–FR1.8, FR1.10, FR2.2), con el caso feliz de cada función.
- `tests/tasks.test.js`: una prueba por requisito de endpoint (FR1.1, FR1.6, FR1.9, FR2.1, FR2.3, FR3.1, FR3.2, FR4.1, NFR2–NFR4). Cada `400` y `404` comprueba el código HTTP y el texto exacto de `error`.
- En total, unas 25 pruebas. Las 2 pruebas existentes de `tests/app.test.js` siguen en verde.

## Cobertura esperada

- Sin umbral de cobertura en este scope (express). Se espera que todas las ramas de `src/validation.js` y de los nuevos manejadores de `src/app.js` tengan al menos una prueba.

## Mocks y stubs

- No se necesitan: no hay dependencias externas. El almacén en memoria es real y cada prueba usa una instancia nueva de `createApp()`.

## Datos de prueba

- Títulos literales en las pruebas. Para los límites se usan `'a'.repeat(100)` y `'a'.repeat(101)`.
- El JSON mal formado se envía con `.set('Content-Type', 'application/json').send('{"title":')`.
