# Instrucciones de pruebas de seguridad

## Alcance en este trabajo

La estrategia Minimal no exige un archivo de seguridad aparte. Aun así, NFR3 (validación en el borde y sin trazas ni HTML en los errores) es un requisito de seguridad de entrada, así que aquí se indica cómo se verifica.

## Verificación de NFR3 (dentro de la suite Jest)

- Todas las entradas inválidas de `POST /tasks` y `GET /tasks/:id` responden `400` con JSON: `tests/validation.test.js` y `tests/tasks.test.js`.
- Un JSON mal formado responde `400` con `Content-Type` JSON, no HTML: `tests/tasks.test.js`.
- Un cuerpo de más de 100 kb responde `413 { "error": "Payload Too Large" }` en JSON, sin traza de pila: `tests/tasks.test.js`.

```bash
npx jest tests/validation.test.js tests/tasks.test.js
```

## Revisión de dependencias

```bash
npm audit --omit=dev
```

Resultado esperado: 0 vulnerabilidades en las dependencias de producción.

## Fuera de alcance

- La API no tiene autenticación ni autorización (fuera de alcance según `requirements.md`).
- No hay análisis SAST/DAST configurado; el proyecto tampoco tiene linter ni CI (deuda técnica registrada).
