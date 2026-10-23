# 02 — Componentes y directorios legibles para el acceso

Fecha de creación: 2026-10-17
Última actualización: 2026-10-18
Estado: Implementado, pendiente de verificación visual y funcional en navegador por el usuario.
Ámbito: Organización interna de `src/features/auth`, sin cambiar el flujo Firebase/Go.
Relacionada con: [acceso inicial](01-acceso-google-vue-y-cuenta-go.md), [organización anterior](../01-organizacion-astro-tailwind-y-contratos-typescript.md), [fuentes Vue](../../docs/fonts/auth/04-recorrido-vue-y-organizacion-del-acceso.md), [recetas reutilizadas](../../docs/fonts/auth/recetas-vue/).
Revisión de partida: `71fecfaff3cd7e207036b105de4b4e53d66733f6`, más los cambios locales preexistentes de la organización anterior.


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Necesidad y alcance

El usuario pide dividir `AuthSurface.vue` y agrupar los archivos de auth por responsabilidad para leerlos con más facilidad. Se conserva el diseño, el texto, las condiciones de cada acción y el mecanismo de sesión. No se añaden funcionalidades, dependencias ni una suite nueva de pruebas.

## Evidencia y decisión

Se leyeron las recetas 17, 48 y 132, sus originales y las reconstrucciones ya existentes. Se reutilizan las guías, sin regenerarlas ni modificar la biblioteca.

| Necesidad → original y pasaje | Reconstrucción → interpretación | Adaptación propuesta |
| --- | --- | --- |
| Entradas explícitas → F1, líneas 15–25 | R1, fases 1–2, `Props`/`defineProps` → contratos tipados para componentes | Separar presentación en componentes con props locales y eventos; los hijos no crean sesiones. |
| Estado único → F2, líneas 19–31 | R2, fases 1–2, `useCounter` → la vista consume las referencias del composable | Mover `useAuth` a `composables/`, sin dividir su coordinación asíncrona ni cambiar sus políticas. |
| Limpieza → F3, líneas 15–29 | R3, fases 1 y 3, `onMounted`/`onUnmounted` → la instancia libera sus recursos | Mantener `start` y `dispose` en `AuthSurface`, fuera de las ramas que cambian al entrar o salir. |
| Isla interactiva → F4, “Hydrating interactive components” | Documentación oficial, no reconstrucción de curso → una isla puede contener componentes Vue | Conservar el import público y `client:load` en la página Astro. |

**Evidencia:** los cursos muestran props, composables y hooks. **Reconstrucción derivada:** las guías normalizan nombres y recomponen fragmentos; no certifican ejecución de los ejemplos. **Interpretación:** permiten separar presentación de estado sin duplicar instancias. **Propuesta propia:** los nombres y las categorías de directorios responden a este proyecto, no son una estructura obligatoria del instructor.

Se descarta convertir cada elemento HTML en un componente o repartir la sesión con `provide/inject`/store: añadiría navegación e indirección sin necesidad. Se eligen bloques completos de entrada, cuenta, estado y ayuda local; `AuthButton` sigue como pieza compartida de la feature.

## Implementación y funcionamiento

El [mapa de lectura](../../README.md#cómo-leer-auth) describe el árbol completo. La raíz de auth conserva únicamente `AuthSurface.vue` como punto de entrada, además de sus directorios. No se crean archivos de reexportación ni capas vacías.

| Decisión respaldada | Archivo y símbolo | Adaptación realizada |
| --- | --- | --- |
| Una instancia y su ciclo de vida, F2/R2 y F3/R3 | [AuthSurface.vue](../../app/modules/auth/presentation/views/AuthSurface.vue), `useAuth`/`onMounted`/`onUnmounted` | El archivo pasa de 206 a 74 líneas; coordina props y eventos y mantiene la sección accesible. El composable no se monta en los hijos. |
| Presentación con entradas tipadas, F1/R1 | [AuthAccount.vue](../../app/modules/auth/presentation/components/account/AuthAccount.vue), props y `name` | Recibe cuenta, nombre y correo; calcula el saludo y emite `logout`, sin recibir el método de token del usuario. |
| Presentación con entradas tipadas, F1/R1 | [AuthSignIn.vue](../../app/modules/auth/presentation/components/sign-in/AuthSignIn.vue), props y eventos | Compone título, estado, acciones y privacidad; propaga `login`/`retry`/`logout` a la superficie. |
| Bloques comprensibles, propuesta propia apoyada en F1/R1 | [AuthSignInActions.vue](../../app/modules/auth/presentation/components/sign-in/AuthSignInActions.vue), condiciones de botones; [AuthPrivacyNote.vue](../../app/modules/auth/presentation/components/sign-in/AuthPrivacyNote.vue) | Conserva las condiciones de entrada, reintento, suspensión y salida. Se pasa `hasUser` en lugar de la identidad completa. No se añaden elementos contenedores al HTML. |
| Cálculo de presentación local, F1/R1 y F2/R2 | [AuthStatus.vue](../../app/modules/auth/presentation/components/status/AuthStatus.vue), `loadingLabel` | Reúne carga, preparación, errores y mensajes, con los mismos roles y `aria-live`. Los textos de carga se trasladan desde la superficie. |
| Ayuda local separada, propuesta propia | `components/development/AuthConfigHelp.vue` (retirado posteriormente; ver [entrada 03](03-retirar-ayuda-local-y-recuperar-servidor.md)) | En esta etapa el padre conservaba la condición `DEV && !authConfig.ok`. Los nombres de campos ausentes no eran secretos. |
| Agrupar por responsabilidad, propuesta propia apoyada en F2/R2 | [useAuth](../../app/modules/auth/presentation/composables/use-auth.ts), [configuración](../../app/bootstrap/env/client-env.ts), [errores](../../app/modules/auth/presentation/presenters/auth-failure.presenter.ts), [contratos](../../app/modules/auth/domain/ports/outbound/session.port.ts) | Se cambian ubicaciones e imports, no implementación ni reglas. |
| Agrupar servicios y pruebas, propuesta propia | [account-api](../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts), [firebase-client](../../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts), [resolve-account](../../app/modules/auth/application/use-cases/load-account.use-case.ts), [tests](../../app/modules/auth/tests/) | Transporte, proveedor y resolución de cuenta quedan juntos. Las dos suites existentes se trasladan a `tests/`, sin cambiar sus aserciones ni añadir dependencias. |

El flujo sigue siendo página Astro → superficie → composable → servicios. Los datos bajan por props y las intenciones suben por eventos. Firebase y las peticiones HTTP permanecen fuera de los componentes visuales. Se conservan la renovación única ante 401, la sincronización selectiva, la cancelación y el descarte de respuestas tardías; no se vuelve a implementar ninguna de esas políticas.

Se corrigieron únicamente los destinos de enlaces históricos afectados por los movimientos; sus fechas, conclusiones y resultados originales se conservan. La nueva decisión queda documentada en esta entrada, no atribuida a la etapa anterior.

## Comprobación ejecutada

| Comprobación | Resultado |
| --- | --- |
| `pnpm check` | Astro: 0 errores, 0 advertencias, 0 hints; `vue-tsc --noEmit` correcto. |
| `pnpm test` | 18 pruebas correctas: 11 de contrato/configuración y 7 de estado de sesión, ahora en `tests/`. |
| `pnpm build` | Compilación estática correcta, una página generada. |
| Documentación e integridad del diff | 17 Markdown y 401 enlaces locales resueltos; fences balanceados y numeración auth sin colisiones. `git diff --check` y `git diff --cached --check` correctos. Búsqueda sin referencias a las rutas antiguas en código/documentación. |
| Comparación temporal de los nueve TypeScript trasladados con su copia de partida | Contenidos idénticos al normalizar exclusivamente rutas de imports relativos; los archivos anteriores ya no existen. |
| Comparación temporal SSR con el compilador y renderer Vue instalados | HTML equivalente en 30 escenarios: 15 estados/variantes en desarrollo y producción. Incluye carga inicial, popup, carga de cuenta, salida, cancelación, preparación, errores con distintas acciones, suspensión y cuenta activa con/sin nombre/correo. Solo se normalizan comentarios de fragmentos y espacios de formato; se comparan etiquetas, textos, clases y atributos. |

La primera ejecución de tipos/pruebas detectó que los movimientos de archivos no se habían materializado; se completaron los traslados y se repitieron ambos comandos con los resultados correctos anteriores. Las comprobaciones temporales no se incorporan como una nueva suite ni inicializan Firebase o contactan Go. SSR comprueba presentación renderizada, no clics, hidratación ni efectos reales del proveedor.

## Pendiente y continuidad

La comprobación visual y el acceso Google real corresponden al usuario. Revisar escritorio y pantalla compacta, foco por teclado, entrada/cancelación de Google, reintento, cuenta activa y salida. No se abrió navegador ni se generaron capturas. No se modificó el backend, la configuración pública ni las versiones de dependencias.

## Fuentes consultadas

Biblioteca local: `/Users/benji/Documents/chrome-extencions/trancripciones`. Instructor no indicado en los metadatos de estos originales; no se deduce del nombre del directorio. Consulta: 2026-10-17, America/New_York.

- **F1:** [17. defineProps - Script Setup](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/17. defineProps - Script Setup.md>). Curso original: “Vue 3, Pinia, Vite, TypeScript, Composition API, Script Setup, Vue-Query, Quasar, Caché y más”, sección 2. Ruta relativa: `Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/17. defineProps - Script Setup.md`. Líneas 15–25; buscar «interfaz interface».
- **R1:** [guía derivada 17](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/17. defineProps - Script Setup - Reconstrucción guiada.md>), fases 1–2; [receta conservada](../../docs/fonts/auth/recetas-vue/17.json).
- **F2:** [48. Composable Functions](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 4 Vue + Vite - Single-File Components/48. Composable Functions.md>). Curso original: “Pinia, unit test, composition api, autenticación, composables, deployment, file structure, lazy load, vitest y más”, sección 4. Ruta relativa: `Vue/Vue con Pinia y Testing/Sección 4 Vue + Vite - Single-File Components/48. Composable Functions.md`. Líneas 19–31; buscar «Use counter punto TS».
- **R2:** [guía derivada 48](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 4 Vue + Vite - Single-File Components/48. Composable Functions - Reconstrucción guiada.md>), fases 1–2; [receta conservada](../../docs/fonts/auth/recetas-vue/48.json).
- **F3:** [132. Ciclo de vida de los componentes](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 9 Vue Router - SPA - Single Page Applications/132. Ciclo de vida de los componentes.md>). Mismo curso original que F2, sección 9. Ruta relativa: `Vue/Vue con Pinia y Testing/Sección 9 Vue Router - SPA - Single Page Applications/132. Ciclo de vida de los componentes.md`. Líneas 15–29; buscar «quitar suscripciones».
- **R3:** [guía derivada 132](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 9 Vue Router - SPA - Single Page Applications/132. Ciclo de vida de los componentes - Reconstrucción guiada.md>), fases 1 y 3; [receta conservada](../../docs/fonts/auth/recetas-vue/132.json). Se conserva `script setup` en lugar del experimento con script externo.
- **F4:** [Astro — Front-end frameworks](https://docs.astro.build/en/guides/framework-components/), secciones “Hydrating interactive components” y “Nesting framework components”. Consulta: 2026-10-17; proyecto Astro 7.3.3 y Vue 3.5.44.
