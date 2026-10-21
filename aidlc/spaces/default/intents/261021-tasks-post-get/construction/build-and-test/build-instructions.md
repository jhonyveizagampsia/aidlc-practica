# Instrucciones de construcción

## Requisitos previos

- Node.js con npm. El proyecto no fija versión (no hay campo `engines`; deuda registrada en `code-quality-assessment.md` de la knowledge base). Se verificó con el Node instalado en esta máquina.
- No hacen falta variables de entorno para las pruebas. En ejecución, `PORT` es opcional (por defecto `3000`).
- No hay servicios locales: el almacenamiento es en memoria.

## Instalación de dependencias

```bash
npm install
```

Versiones resueltas: `express@4.22.3`, `jest@29.7.0` y `supertest@7.3.1`. Este trabajo no añadió dependencias.

## Construcción

No hay paso de compilación, empaquetado ni transpilación: es JavaScript CommonJS que Node ejecuta directamente.

## Verificación de la construcción

```bash
node -e "require('./src/app'); require('./src/validation'); console.log('modules load ok')"
npm start
```

- El primer comando comprueba que los módulos cargan sin errores de importación.
- `npm start` levanta la API en `http://localhost:3000`. Comprobación manual opcional: `curl -X POST -H "Content-Type: application/json" -d "{\"title\":\"Leer\"}" http://localhost:3000/tasks` debe devolver `201`.

## Problemas comunes

- `Cannot find module 'express'` o `'supertest'`: falta `npm install`.
- `EADDRINUSE` al hacer `npm start`: el puerto 3000 está ocupado; usa otro con `PORT=3001 npm start`.
- Las pruebas no necesitan puerto: Supertest usa `createApp()` directamente.
