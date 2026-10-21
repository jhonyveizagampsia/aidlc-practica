# Práctica: AI-DLC de AWS con y sin herramienta

## 1. Datos

- **Modalidad:** individual
- **Repositorio:** https://github.com/jhonyveizagampsia/aidlc-practica
- **Rama sin herramienta (A):** [`feature-sin-aidlc`](https://github.com/jhonyveizagampsia/aidlc-practica/tree/feature-sin-aidlc)
- **Rama con herramienta (B):** [`feature-con-aidlc`](https://github.com/jhonyveizagampsia/aidlc-practica/tree/feature-con-aidlc)
- **Video (opcional):** —

**Responsables:**

| Integrante | Qué hizo | Commits o PR |
|---|---|---|
| Jhony Veizaga S. | Todo: proyecto base, versión A con Claude Code, versión B con AI-DLC (respuestas y aprobación de puertas) y comparación | Todos los commits de las tres ramas |

## 2. El feature

Especificación completa en [`feature.md`](../../feature.md). Sobre una API de tareas en Express con almacenamiento en memoria:

- **POST /tasks** recibe `{ title, done? }`. `title` es obligatorio, se recorta y debe tener entre 1 y 100 caracteres; `done` es booleano y vale `false` por defecto. Devuelve `201 { id, title, done }`, con `id` autoincremental.
- **GET /tasks/:id** devuelve `200` con la tarea, `400` si el id no es un entero positivo y `404 { "error": "Task not found" }` si no existe.
- Los errores de validación responden `400 { "error": "<mensaje>" }`.
- **Criterio de aceptación:** `npm test` pasa con pruebas del caso feliz y de cada error, y `GET /tasks` lista las tareas creadas.

## 3. Versión A: sin la herramienta

- **Cómo se trabajó:** con el asistente de IA directamente (Claude Code, Opus 5.5), en la misma sesión en la que se escribió `feature.md`. El asistente tenía la especificación en contexto, implementó, ejecutó `npm test` e hizo commit. No hubo plan ni preguntas intermedias.
- **Resultado:** rama [`feature-sin-aidlc`](https://github.com/jhonyveizagampsia/aidlc-practica/tree/feature-sin-aidlc), commit `7c13c81`.
  - Cambios: `src/app.js` (validación y rutas en el mismo archivo) y `tests/tasks.test.js`.
  - Salida de las pruebas: [`test-results-sin-aidlc.txt`](https://github.com/jhonyveizagampsia/aidlc-practica/blob/feature-sin-aidlc/docs/practicas/test-results-sin-aidlc.txt).

## 4. Versión B: con AI-DLC de AWS 2.11.0 (perfil Express)

- **Instalación:** `install.ps1 -Version 2.11.0`, luego `aidlc config --harness claude` y `aidlc config --pin 2.11.0` (commit `adeb43a`).
- **Comando usado:** `/aidlc express "Implementar el feature descrito en feature.md: POST /tasks y GET /tasks/:id con validación y pruebas Jest"`
- **Salida de `aidlc version`:** `aidlc 2.11.0 (runtime 2.11.0)`
- **Puertas revisadas** (tiempos de la auditoría, UTC):

  | Puerta | Lista para revisar | Aprobada | Tiempo de revisión | Request Changes |
  |---|---|---|---|---|
  | Reverse Engineering | 23:05:25 | 23:06:35 | 1 min 10 s | 0 |
  | Requirements Analysis | 23:10:42 | 23:11:51 | 1 min 09 s | 0 |
  | Code Generation | 23:19:22 | 23:21:58 | 2 min 36 s | 0 |
  | Build and Test | 23:24:23 | 23:24:56 | 33 s | 0 |

  - Antes de la puerta de requisitos, AI-DLC hizo 4 preguntas. Elegí "Guide me" y las respondí así:
    - Manejador de errores en JSON: **A**.
    - Campos desconocidos: **B, rechazar**.
    - Validación estricta: **A**.
    - Mensajes de error específicos: **A**.
  - Express omitió Deployment Pipeline, Deployment Execution y Observability porque no hay entorno de despliegue.
- **Artefactos versionados** (commit `11f4d9f`):
  - `.aidlc-version`, con el valor `2.11.0`.
  - Dentro de `aidlc/spaces/default/intents/261021-tasks-post-get/`:
    - `aidlc-state.md`
    - `audit/…md` (la auditoría)
    - `inception/requirements-analysis/requirements.md` y las preguntas
    - `construction/code-generation/code-generation-plan.md`, `code-summary.md` y `traceability.json`
    - `construction/build-and-test/test-results.md` y las instrucciones de build, integración, rendimiento y seguridad
  - `aidlc/spaces/default/codekb/` (9 documentos de ingeniería inversa) y `aidlc/spaces/default/memory/`.
  - `.claude/` (314 archivos de agentes, skills y hooks que instala `aidlc config`).
  - Los archivos de trabajo locales (`.aidlc-engine/`, `runtime-graph.json`, `active-space`) quedan fuera por el `.gitignore` que añade AI-DLC.

## 5. Comparación

| Aspecto | A · sin herramienta | B · con AI-DLC de AWS |
|---|---|---|
| Tiempo total | **≈ 30 s** de generación (17:08:31 → 17:08:58), más la lectura del diff. No incluye escribir `feature.md`, que comparten ambas versiones | **26 min 36 s** (22:59:55Z → 23:26:31Z según la auditoría). Unos 5,5 min fueron míos revisando puertas. Costo registrado: 8,68 USD |
| Veces que tuvieron que intervenir o corregir | 1 instrucción y **0 correcciones** | **0 correcciones** (ningún Request Changes). Intervine **11 veces**: 4 aprobaciones de puerta, 1 elección de modo ("Guide me"), 4 respuestas a preguntas de requisitos y 2 mensajes libres para que siguiera ("continúa") |
| Artefactos que quedaron en el repositorio | Solo código y pruebas: 3 archivos, +150 líneas (`src/app.js`, `tests/tasks.test.js` y la salida de las pruebas) | Código: 5 archivos, +355 líneas (`src/validation.js`, `src/app.js`, 2 archivos de pruebas y README). Además, 36 archivos en `aidlc/` (requisitos, plan, auditoría, trazabilidad, resultados de pruebas), `.aidlc-version` y 314 archivos en `.claude/` |
| ¿Las pruebas pasan? (ejecutadas por mí) | **Sí, 19/19** (2 suites) | **Sí, 53/53** (3 suites), con 95 % de cobertura de líneas |
| Qué salió mejor | Muy rápido y barato. Código compacto, fácil de revisar en un solo diff. Cubre todos los criterios de `feature.md`, incluido el JSON mal formado | Hizo explícitas decisiones que en A quedaron implícitas (campos desconocidos, formato de errores). Separó la validación en un módulo puro. Documentó una desviación del plan (el manejador convierte 413 y 500 a JSON). La trazabilidad requisito → prueba (20/20) y la auditoría con hora de cada decisión quedan en el repo. Más pruebas y más casos límite |
| Qué salió peor | Ninguna decisión queda registrada: el asistente eligió los mensajes de error, ignorar campos extra y el tratamiento del JSON inválido sin consultarme. Las rutas inexistentes siguen devolviendo HTML. No hay evidencia de revisión más allá del commit | Unas 50 veces más lento y con costo apreciable para un cambio de 150–350 líneas. Mucho ruido en el repo (≈ 235 000 líneas añadidas, sobre todo `.claude/` y la auditoría). En dos ocasiones se detuvo y tuve que escribir "continúa". Generó instrucciones de rendimiento y seguridad que no aportan nada a una API en memoria |

## 6. Conclusiones

1. **¿Qué decisiones tomó el agente sin que yo las viera?**
   - **En A:** las tomó casi todas en silencio:
     - Los textos exactos de los errores (`title is required and must be a string`).
     - Ignorar campos desconocidos en vez de rechazarlos.
     - Responder `400 Malformed JSON`.
     - Dejar la validación dentro de `app.js`.
   - **En B:** las decisiones de comportamiento se convirtieron en preguntas (por eso B *rechaza* campos desconocidos y A no). Aun así hubo decisiones no consultadas, aunque quedaron documentadas: el manejador de errores amplió el alcance a 413 y 500, y se añadieron los textos `Payload Too Large` e `Internal Server Error`, que no estaban en los requisitos.
2. **¿Cuántas veces aprobé una puerta por inercia?** Las cuatro duraron entre 33 s y 2 min 36 s. La de Code Generation (2,5 min) fue la única con tiempo para leer el plan y el diff. **Build and Test (33 s) fue en la práctica una aprobación por inercia**: confié en el resumen "todo en verde" y verifiqué las pruebas después, ejecutando `npm test` yo mismo. Reverse Engineering y Requirements, con cerca de un minuto cada una, solo permitieron una lectura superficial.
3. **¿Qué evidencia permite a otra persona entender por qué se hizo así?** En B, la **auditoría de AI-DLC** junto con `requirements.md`, `code-summary.md` (que incluye la sección de desviaciones) y `traceability.json`: cada decisión tiene hora, pregunta, respuesta y requisito asociado. En A solo hay un mensaje de commit. Un PR con revisión daría algo de contexto, pero no recogería las alternativas descartadas.
4. **¿Para qué tamaño de cambio vale la pena?** Para un endpoint como este **no vale la pena**: 27 minutos y 8,68 USD frente a 30 segundos, y el resultado funcional es equivalente. Vale la pena en cambios con requisitos ambiguos, varias personas o varios componentes, o con exigencias de trazabilidad y auditoría (sectores regulados, equipos donde otra persona debe aprobar). Ahí las preguntas y las puertas evitan retrabajo que cuesta más que la ceremonia.
5. **¿Lo usaría en mi proyecto? ¿Por qué?** **Sí, pero de forma selectiva.** Lo usaría para features medianas o grandes, o con reglas de negocio poco claras, donde las preguntas de requisitos y el registro de decisiones aportan valor real. Para correcciones y endpoints pequeños como este seguiría trabajando con el asistente directamente, con una especificación breve tipo `feature.md` y revisando el diff. La ceremonia, el costo y el volumen de archivos de AI-DLC no se justifican a esa escala.

## 7. Antes de entregar

- [x] Las dos ramas están en el repositorio y las pruebas pasan en ambas (19/19 en A, 53/53 en B).
- [x] `aidlc/` y `.aidlc-version` están versionados en la rama B.
- [x] No hay secretos, `.env` ni archivos `*.local.json` en los commits (solo `.claude/settings.local.json.example`, que es una plantilla).
- [x] Trabajo individual: tabla de responsables completa.
