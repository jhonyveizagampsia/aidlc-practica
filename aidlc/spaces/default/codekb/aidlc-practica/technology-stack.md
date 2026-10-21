# Pila tecnológica

| Capa | Tecnología | Versión | Fuente |
|---|---|---|---|
| Lenguaje | JavaScript (CommonJS) | — | `src/*.js` |
| Entorno de ejecución | Node.js | no fijada (sin `engines`) | `package.json` |
| Gestor de paquetes | npm | lockfile presente | `package-lock.json` |
| Framework HTTP | express | `^4.22.3` (resuelta 4.22.3) | `package.json`, `package-lock.json` |
| Pruebas | jest | `^29.7.0` (resuelta 29.7.0) | devDependency |
| Pruebas HTTP | supertest | `^7.3.1` (resuelta 7.3.1) | devDependency |
| Persistencia | arreglo en memoria | — | `src/app.js` |

Sin TypeScript, transpilador, bundler, linter, formateador, contenedores ni infraestructura como código. Licencia: MIT.
