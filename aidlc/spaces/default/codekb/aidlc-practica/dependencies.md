# Dependencias

## Externas
| Paquete | Tipo | Rango | Uso |
|---|---|---|---|
| express | runtime | `^4.22.3` | servidor HTTP, enrutado, `express.json()` |
| jest | dev | `^29.7.0` | ejecutor de pruebas (`npm test`) |
| supertest | dev | `^7.3.1` | peticiones HTTP en proceso contra la app |

Versiones resueltas y detalle en [technology-stack.md](technology-stack.md). No se usan servicios externos, bases de datos ni APIs de terceros. Variables de entorno: solo `PORT` (opcional).

## Internas
- `src/server.js` → `src/app.js` (`createApp`)
- `tests/app.test.js` → `src/app.js` (`createApp`)

Grafo completo y convenciones en [code-structure.md](code-structure.md). Ninguna dependencia nueva es necesaria para el feature pendiente: Express y Jest/Supertest ya cubren rutas, validación manual y pruebas.
