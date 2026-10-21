# Instrucciones de pruebas de rendimiento

## Alcance en este trabajo

No aplica. La estrategia de pruebas es **Minimal** (scope express) y `requirements.md` no define requisitos de rendimiento (latencia, rendimiento ni carga). Por eso no se generan pruebas de rendimiento.

## Configuración y ejecución

No hay framework de carga configurado ni comandos que ejecutar.

## Si más adelante se necesitan

Si se añade un objetivo medible (p. ej. p95 < 50 ms para `POST /tasks` a 100 rps), habría que:

- definirlo primero como NFR en los requisitos;
- medirlo con una herramienta de carga (k6 o autocannon) contra `npm start`.
