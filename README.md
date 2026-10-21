# aidlc-practica

API mínima de tareas (Node + Express) usada para la práctica *AI-DLC de AWS con y sin herramienta*.

| Rama | Contenido |
|---|---|
| `main` | Proyecto base: `GET /health` y `GET /tasks` |
| `feature-sin-aidlc` | Feature de [feature.md](feature.md) implementado con el asistente de IA directamente |
| `feature-con-aidlc` | El mismo feature implementado con AI-DLC de AWS 2.11.0 (perfil Express) |

La comparación está en [docs/practicas/aidlc-comparacion.md](docs/practicas/aidlc-comparacion.md).

```bash
npm install
npm test
npm start
```
