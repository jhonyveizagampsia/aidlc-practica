# Evaluación de calidad del código

## Pruebas y cobertura
- **Framework**: Jest 29 + Supertest 7; `npm test` ejecuta `jest`.
- **Pruebas existentes**: 2 en `tests/app.test.js` (`GET /health`, `GET /tasks` vacío). Cubren ambos endpoints existentes solo en el caso feliz.
- **Cobertura**: sin configuración ni umbral (`coverage/` solo aparece en `.gitignore`). No se ejecutó la suite durante este escaneo; la línea base de pruebas corresponde a Code Generation.

## Linting y formato
Ausentes: no hay ESLint, Prettier ni `.editorconfig`. El estilo es consistente a mano (ver [code-structure.md](code-structure.md)).

## CI/CD
Ausente: no hay pipeline (`.github/workflows/` u otro).

## Documentación
`README.md` breve (propósito, ramas, comandos `npm install/test/start`); `feature.md` especifica el feature pendiente con criterio de aceptación verificable. Comentarios en el código escasos pero suficientes.

## Valoración rápida
| Criterio | Valoración |
|---|---|
| Claridad de nombres | buena |
| Tamaño de funciones | buena |
| Manejo de errores | pobre (sin validación ni middleware de errores) |
| Presencia de pruebas | regular (solo caso feliz) |
| Duplicación | buena |
| Código muerto | buena |

## Deuda técnica
1. Sin validación de entrada ni manejador de errores; JSON malformado responde HTML por defecto de Express — `src/app.js`.
2. Persistencia solo en memoria y sin generación de `id` — `src/app.js:8`.
3. Sin linter, formateador, CI ni umbral de cobertura — raíz.
4. Versión de Node no fijada (sin `engines`) — `package.json`.
5. No hay TODO/FIXME, supresiones de linter ni secretos en el código.
