# Instrucciones de pruebas de integración

## Alcance en este trabajo

La estrategia de pruebas es **Minimal** (scope express), que no genera instrucciones de integración aparte. Este archivo existe solo para dejar constancia de esa decisión.

## Qué cubre igualmente la integración

- `tests/tasks.test.js` ejercita la app real (Express + `express.json()` + validación + almacén en memoria) de punta a punta con Supertest, sin dobles de prueba. En la práctica son pruebas de integración en proceso de la API.
- No hay otros componentes, servicios externos ni varias Units que integrar.

## Cómo ejecutarlas

```bash
npx jest tests/tasks.test.js
```

## Cobertura esperada

- Sin umbral en este scope. Ver `test-results.md` para la cobertura medida.
