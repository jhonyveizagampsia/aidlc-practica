# Resultados de construcción y pruebas

Ejecución: 2026-10-21, rama `feature-con-aidlc`, en el entorno local.

## Construcción

- **Estado: OK.** No hay paso de compilación.
- `node -e "require('./src/app'); require('./src/validation'); ..."` → `modules load ok`.
- `npm ls --depth=0` → `express@4.22.3`, `jest@29.7.0`, `supertest@7.3.1`; no falta ninguna dependencia.

## Pruebas unitarias de este trabajo

Comando (de `construction/code-generation/unit-test-instructions.md`, ejecutado una sola vez):

```
npx jest tests/validation.test.js tests/tasks.test.js
```

Resultado: **2 suites, 51 pruebas: 51 pasan, 0 fallan, 0 omitidas.**

## Regresión completa con cobertura

```
npx jest --coverage --coverageReporters=text-summary --coverageReporters=text
```

Resultado: **3 suites, 53 pruebas: 53 pasan, 0 fallan, 0 omitidas.** Las 2 pruebas existentes de `tests/app.test.js` siguen en verde; la línea base antes del cambio era 2/2.

| Archivo | % Sentencias | % Ramas | % Funciones | % Líneas | Líneas sin cubrir |
|---|---|---|---|---|---|
| Total | 95.45 | 91.30 | 100 | 95.31 | — |
| `src/app.js` | 92.30 | 78.94 | 100 | 92.10 | 52, 63-64 |
| `src/validation.js` | 100 | 100 | 100 | 100 | — |

Las líneas sin cubrir de `src/app.js` son dos ramas defensivas del manejador de errores:

- `next(err)` cuando ya se enviaron las cabeceras;
- el `500` para errores inesperados.

Ninguna corresponde a un requisito y el scope express no fija umbral de cobertura (informativo).

## Seguridad

- `npm audit --omit=dev` → `found 0 vulnerabilities`.
- NFR3 cubierto en `tests/tasks.test.js`:
  - el JSON mal formado y el 413 responden JSON;
  - la respuesta no contiene `<html`, `<pre` ni marcos de pila.

## Fallos

Ninguno.

## Matriz de verificación de objetivos

| Target ID | Fuente | Esperado | Real | Evidencia | Etapa responsable | Veredicto |
|---|---|---|---|---|---|---|
| TC-SUITE-GREEN | `code-generation-plan.md` § Testing Contract → `obligations.scope_floor` | La suite existente sigue en verde | 2/2 de `tests/app.test.js` pasan (53/53 en total) | salida de `npx jest --coverage` arriba | build-and-test | Met |
| TC-REQ-TESTS | `code-generation-plan.md` § Testing Contract → `obligations.strategy_volume` | Al menos una prueba verificable por requisito (FR1.1–FR4.1, NFR1–NFR4) | 20/20 IDs con prueba | `cross-unit-traceability.md`; `tests/validation.test.js`, `tests/tasks.test.js` | build-and-test | Met |
| TC-HAPPY-PATH | `code-generation-plan.md` § Testing Contract → `obligations.strategy_volume` | Al menos una prueba de caso feliz por componente | `validateCreateTask`, `parseTaskId`, `POST /tasks`, `GET /tasks/:id` y `GET /tasks` tienen caso feliz | `tests/validation.test.js`, `tests/tasks.test.js` | build-and-test | Met |
| NFR1 | `requirements.md` § NFR1 | `npm test` sale con código 0; cada error comprueba código y texto exacto | 53/53 pasan; aserciones de texto exacto en cada 400/404 | salida de Jest; `tests/tasks.test.js` | build-and-test | Met |
| NFR3 | `requirements.md` § NFR3 | Ningún error devuelve traza ni HTML | JSON en 400 (JSON roto) y 413; el texto no contiene HTML ni pila | `tests/tasks.test.js` líneas 69 y 77 | build-and-test | Met |
