# Estructura del código

## Organización de módulos

```
aidlc-practica/
├── package.json            # manifiesto npm (scripts start/test)
├── package-lock.json       # versiones resueltas
├── README.md               # descripción y comandos
├── feature.md              # especificación del feature pendiente
├── docs/practicas/aidlc-comparacion.md  # plantilla de entrega de la práctica
├── src/
│   ├── app.js              # fábrica createApp(): rutas y estado en memoria
│   └── server.js           # punto de entrada: listen en PORT
└── tests/
    └── app.test.js         # pruebas Jest + Supertest
```

## Clasificación de archivos

| Archivo | Categoría | Exporta / Rol |
|---|---|---|
| `src/app.js` | Controller/Handler + Configuration | `module.exports = { createApp }` |
| `src/server.js` | Configuration (arranque) | sin exportaciones; efecto lateral `listen` |
| `tests/app.test.js` | Test | suite `API base` (2 pruebas) |
| `package.json` | Configuration | scripts y dependencias |
| `README.md`, `feature.md`, `docs/practicas/aidlc-comparacion.md` | Documentación | — |

No hay modelos, servicios, repositorios, utilidades ni migraciones como archivos separados.

## Grafo de dependencias internas
- `src/server.js` → `./app`
- `tests/app.test.js` → `../src/app`, `supertest`
- `src/app.js` → `express`

Sin dependencias circulares.

## Convenciones observadas
- CommonJS (`require` / `module.exports`), comillas simples, punto y coma, indentación de 2 espacios.
- Nombres camelCase; comentarios y descripciones de prueba en español.
- Manejadores de ruta en línea como funciones flecha `(req, res) => {}`.
- Pruebas: `describe` + `test` con `async/await` y `request(createApp())` por prueba.
