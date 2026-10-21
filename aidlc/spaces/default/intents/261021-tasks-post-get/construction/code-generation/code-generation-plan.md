# Plan de generación de código: crear y consultar tareas

## Summary

- Builds: POST /tasks y GET /tasks/:id con validación y errores JSON
- Touches: src/validation.js (nuevo), src/app.js, tests/validation.test.js y tests/tasks.test.js (nuevos)
- Tests: unas 25 pruebas Jest (validación unitaria + endpoints con Supertest); las 2 existentes siguen en verde

## Contexto

- Trabajo sin Units (scope express): una sola iteración; fuente de requisitos `inception/requirements-analysis/requirements.md` (FR1–FR4, NFR1–NFR4).
- Brownfield: se modifica `src/app.js` en su sitio; no se tocan `src/server.js` ni `GET /health` (NFR4). Convenciones: CommonJS, comillas simples, punto y coma, 2 espacios (codekb `code-structure.md`).
- Sin dependencias nuevas: Express 4.22, Jest 29, Supertest 7 ya instalados.
- Impacto (blast radius): bajo. `src/app.js` lo consumen `src/server.js` y `tests/app.test.js`; la firma `createApp()` no cambia.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "express",
  "test_strategy": "minimal",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Verify the existing test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Verify the existing test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:c8f84e35190e007d9863fad236154d0269ab9bf633fc2a3ff106ed965ba4a9b9",
  "contract_sha256": "sha256:bb76c1b22f8307be6e5780d50cabab891684449d5b164bd0e825e9e4e5c61e5b"
}
```

Capas que no aplican: la estructura y la configuración de producción ya existen (Express, `createApp()`); no hay base de datos (el almacén es un arreglo en memoria dentro de `createApp()`, cubierto por las pruebas de endpoint); no hay frontend ni configuración de entorno nueva.

## Pasos

- [x] **Step 1 — Línea base y runner de pruebas.** Ejecutar `npm test` antes de cualquier cambio y anotar el resultado (se esperan 2 pruebas en verde). Verificar que Jest descubre `tests/*.test.js` sin configuración extra (no hay `jest.config`; se usa la configuración por defecto, que basta) y que funciona el comando acotado `npx jest tests/validation.test.js tests/tasks.test.js`. Trazabilidad: NFR1.
- [x] **Step 2 — Lógica de negocio: validación (implementar).** Crear `src/validation.js` con funciones puras exportadas:
  - `validateCreateTask(body)` → `{ value: { title, done } }` o `{ error: '<mensaje>' }`, aplicando el orden de FR1.10: el cuerpo no es un objeto (FR1.8), campo desconocido (FR1.7), `title` ausente / no string / vacío tras recortar / más de 100 caracteres (FR1.2–FR1.4) y `done` no booleano (FR1.5), con `done` por defecto `false`. Si no hay cuerpo (`undefined` o `{}`), da `"title is required"`.
  - `parseTaskId(param)` → entero o `null`, según `^[1-9]\d*$` (FR2.2).
  - Mensajes exactos de `requirements.md` (FR4.1).
- [x] **Step 3 — Lógica de negocio: pruebas (escribir y ejecutar).** Crear `tests/validation.test.js` con una prueba por regla: caso feliz, recorte, límite de 100 / 101 caracteres, `title` ausente, no string y vacío, `done` no booleano, `done` por defecto, campo desconocido, cuerpo arreglo/`null`, y `parseTaskId` válido frente a `abc`, `0`, `-1`, `1.5`, `1.0`, `01` y `+1`. Ejecutar `npx jest tests/validation.test.js`. Trazabilidad: FR1.2–FR1.8, FR1.10, FR2.2.
- [x] **Step 4 — API / endpoints (implementar).** En `src/app.js`, dentro de `createApp()` (NFR2):
  - Añadir `let nextId = 1;` junto a `tasks`.
  - `POST /tasks`: valida con `validateCreateTask`; si hay error responde `400 { error }`; si no, crea `{ id: nextId++, title, done }`, la añade a `tasks` y responde `201` con ella. Una petición rechazada no consume `id` (FR1.1, FR1.6, FR3.2).
  - `GET /tasks/:id`: `parseTaskId`; si da `null`, `400 { error: 'id must be a positive integer' }`; si no existe, `404 { error: 'Task not found' }`; si existe, `200` con la tarea (FR2.1–FR2.3).
  - Middleware de errores al final, que responde a los fallos de JSON (`err.type === 'entity.parse.failed'`) con `400 { error: 'Invalid JSON body' }` (FR1.9). Cualquier otro error se pasa a `next(err)`, así no se silencia nada; en ningún caso se exponen trazas (NFR3).
  - `GET /tasks` y `GET /health` no cambian (FR3.1, NFR4).
- [x] **Step 5 — API / endpoints: pruebas (escribir y ejecutar).** Crear `tests/tasks.test.js` (Supertest, `createApp()` por prueba):
  - POST `201` con `done` por defecto y explícito.
  - `id` 1 y 2 consecutivos.
  - Recorte de `title`.
  - Cada `400` con su mensaje exacto: `title` ausente, no string, vacío, de 101 caracteres; `done` no booleano; campo desconocido; cuerpo arreglo; JSON mal formado, comprobando además que responde JSON y no HTML.
  - Un `400` no consume `id`.
  - GET `/tasks/:id` `200`; `400` con `abc`, `0` y `01`; `404 Task not found`.
  - `GET /tasks` lista las tareas creadas en orden.
  - Aislamiento entre instancias.

  Ejecutar `npx jest tests/tasks.test.js`. Trazabilidad: FR1.1–FR1.10, FR2.1–FR2.3, FR3.1–FR3.2, FR4.1, NFR2–NFR4.
- [x] **Step 6 — Regresión completa.** Ejecutar `npm test`: deben pasar las 2 pruebas existentes y todas las nuevas (NFR1, NFR4).
- [x] **Step 7 — Documentación y trazabilidad.** Añadir a `README.md` los dos endpoints nuevos y su formato de error, de forma breve y siguiendo el estilo actual. La trazabilidad (`code-summary.md` y `traceability.json`) la escribe la etapa después de la construcción.

## Trazabilidad requisito → paso

| Requisito | Pasos |
|---|---|
| FR1.1, FR1.6 | 4, 5 |
| FR1.2–FR1.5, FR1.7, FR1.8, FR1.10 | 2, 3, 4, 5 |
| FR1.9 | 4, 5 |
| FR2.1, FR2.3 | 4, 5 |
| FR2.2 | 2, 3, 4, 5 |
| FR3.1, FR3.2 | 4, 5 |
| FR4.1 | 2, 4, 5 |
| NFR1 | 1, 3, 5, 6 |
| NFR2 | 4, 5 |
| NFR3 | 4, 5 |
| NFR4 | 4, 6 |
