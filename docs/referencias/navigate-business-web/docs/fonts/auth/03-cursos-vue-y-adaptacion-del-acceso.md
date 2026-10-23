# 03 — Cursos, reconstrucciones y adaptación del acceso web

Fecha de creación: 2026-10-16
Última actualización: 2026-10-18
Estado: Investigación aplicada a una implementación; recorrido Google real pendiente.
Tipo de fuente: Transcripciones originales, reconstrucciones derivadas, documentación oficial y código propio.
Origen: Los dos cursos Vue seleccionados, Astro Full Stack y contrato Go.
Fecha de consulta: 2026-10-16, America/New_York.
Relacionada con: [incremento implementado](../../../bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md), [plan auth](../../plans/auth/01-google-firebase-y-api-go.md), [contrato Go](01-contrato-real-api-go.md), [Firebase](02-firebase-web-y-limites-del-cliente.md).


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](../../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](../../../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Originales y reconstrucciones utilizadas

Raíz de biblioteca: `/Users/benji/Documents/chrome-extencions/trancripciones`. Cada guía permanece junto al original y no lo sustituye. Se leyeron completamente las tres lecciones seleccionadas y el contexto mínimo indicado en sus guías. Sus metadatos de curso/sección/procedencia están en líneas 3, 5 y 7.

| Fuente original | Pasaje y mecanismo | Reconstrucción y símbolo |
| --- | --- | --- |
| F-C1 — [31. Composable functions - useCharacters con estado local](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 3 Técnicas para peticiones HTTP/31. Composable functions - useCharacters con estado local.md>), curso `Vue 3 con TypeScript y Quasar`, sección 3 | Líneas 13–33: extraer carga, referencias, estado y computed; consultar 27/28 para modelo y helper previos. El título y los nombres dictados no coinciden del todo; la explicación usa Pokémon. | R1 — [Guía 31](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 3 Técnicas para peticiones HTTP/31. Composable functions - useCharacters con estado local - Reconstrucción guiada.md>), fases 1–3 y `usePokemons`. |
| F-C2 — [209. Login Action - Autenticación](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 15 Autenticación y Autorización/209. Login Action - Autenticación.md>), curso `Vue con Pinia y Testing`, sección 15 | Líneas 19–41: acción HTTP independiente, respuesta tipada, distinguir 401 de otros errores; contexto 208 para el módulo. Su backend autentica contraseña y emite token propio. | R2 — [Guía 209](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 15 Autenticación y Autorización/209. Login Action - Autenticación - Reconstrucción guiada.md>), fases 1–3, `loginAction`, `LoginError`, `LoginSuccess`. |
| F-C3 — [150. Firebase Auth - Configuración de proyecto](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 12 Autenticación y protección de rutas/150. Firebase Auth - Configuración de proyecto.md>), `Astro Full Stack`, sección 12 | Líneas 21–29: registrar app web, SDK modular, `initializeApp`, `getAuth`, exportar cliente. El SDK 10 pertenece al momento del curso. | R3 — [Guía 150](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 12 Autenticación y protección de rutas/150. Firebase Auth - Configuración de proyecto - Reconstrucción guiada.md>), fases 1–3, `firebase.app`/`firebase.auth`. |

Se consultó también la 208, líneas 13–33, para contrastar entorno y separación de vistas; no se reconstruyó su router SPA, ajeno al recorrido actual. Se seleccionaron estas tres guías por los mecanismos que aportan, sin imponer un máximo. Las dependencias heredadas e importaciones cuya grafía no es recuperable se declaran en cada reconstrucción; no se atribuye literalidad ni compilación del ejemplo del curso.

## Verificación con documentación oficial

| ID | Fuente y sección consultada | Aplicación |
| --- | --- | --- |
| F-O1 | [Astro Vue](https://docs.astro.build/en/guides/integrations-guide/vue/) y [framework components](https://docs.astro.build/en/guides/framework-components/), instalación/hidratación | Integración Vue y carga cliente de la isla auth. |
| F-O2 | [Astro components](https://docs.astro.build/en/basics/astro-components/), [routing](https://docs.astro.build/en/guides/routing/) y [styling](https://docs.astro.build/en/guides/styling/) | Página Astro, marcado y estilos propios; no se crea un backend Astro. |
| F-O3 | [Google Sign-In web](https://firebase.google.com/docs/auth/web/google-signin), «Handle the sign-in flow» | Popup con proveedor Google; su resultado entrega el usuario Firebase. |
| F-O4 | [Auth state persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence), persistencia de sesión; [User](https://firebase.google.com/docs/reference/js/auth.user), `getIdToken` | Persistencia por sesión del navegador y recuperación del ID token actual para Go. |

Consulta: 2026-10-16. Versiones resueltas: Astro 7.3.3, integración Vue 7.1.0, Vue 3.5.44 y Firebase 13.0.0. TypeScript se fijó en la familia 6 porque `@astrojs/check` instalado admite 5/6 y la resolución inicial 7 generó un conflicto de peer. `pnpm peers check` terminó sin conflictos tras resolverlo.

## Evidencia → interpretación → adaptación

| Necesidad | Evidencia y código derivado | Adaptación implementada y límite |
| --- | --- | --- |
| Vista pequeña con lógica recuperable | F-C1/R1: refs y carga en `usePokemons` | [`useAuth`](../../../app/modules/auth/presentation/composables/use-auth.ts) concentra las transiciones de una sola isla, sin añadir store global. |
| Contrato HTTP separado | F-C2/R2: `loginAction` fuera del store | [`createAccountApi`](../../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts) usa fetch nativo, sync/me, Bearer Firebase y errores Go. No copia Axios, contraseñas ni JWT propio. |
| Configuración de proveedor | F-C3/R3: inicialización modular | [`createFirebaseSession`](../../../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts) inicializa al montar el cliente; [`readAuthConfig`](../../../app/bootstrap/env/client-env.ts) valida variables públicas. No crea otro proyecto Firebase. |
| Login y restauración | F-O3/F-O4 más [contrato Go](01-contrato-real-api-go.md) | Login explícito sincroniza; restauración consulta me y solo `404 account_not_synced` dispara sync. La cuenta queda lista tras Go. |
| Salida y aislamiento | Propuesta propia sobre los eventos del SDK | Contador de generación, AbortController y marca de salida local impiden que una respuesta/evento viejo restaure la cuenta anterior. Las pruebas cubren Alice → salir → Bob. |
| Parte visual inicial | Diseño propio, apoyado por la separación vista/lógica de F-C1/R1 | [`AuthSurface.vue`](../../../app/modules/auth/presentation/views/AuthSurface.vue), [`index.astro`](../../../src/pages/index.astro) y [CSS](../../../src/styles/global.css): página adaptable, Google, carga, errores y cuenta mínima. No se atribuyen layout, paleta ni ilustración al curso. |

Las decisiones de timeout, validación de JSON/UUID, única renovación ante 401 y presentación de errores son propias del proyecto. Las guías se mantienen fieles a sus ejemplos y no contienen la adaptación Go.

## Entorno observado y límites reales

La API Go pudo iniciar y conectar SQL, pero su puerto predeterminado 8080 estaba ocupado por otro servicio Express/Descope. Se ejecutó Go con `HTTP_ADDR=127.0.0.1:8081` y el frontend usa esa base local en `.env.example`/`.env.local`; no se alteró ni se detuvo el servicio ajeno.

En 8081 se observó `GET /api/v1/auth/me` → `401 {"error":"invalid_token"}` y preflight con origen `http://127.0.0.1:4321` → `200`, permitiendo GET y Authorization. Son sondas sin identidad; no demuestran aún sincronización de una cuenta real ni login Google.

Firebase CLI respondió que su autenticación no era válida; la consulta con gcloud devolvió 403 y el Hosting público no aportó configuración. Se solicitó al usuario únicamente el objeto de configuración web público. La app quedó con Firebase incompleto, botón deshabilitado y mensaje de preparación; no se fabricaron valores. El SDK y el cliente están implementados, pero el recorrido real sigue pendiente.

La comprobación de UI observó el estado sin configuración en escritorio y compacto, sin errores de consola registrados y sin desbordamiento horizontal en las medidas DOM comprobadas. [Escritorio](../../visual/auth/01-acceso-escritorio.jpg) y [compacto](../../visual/auth/02-acceso-compacto.jpg). Los demás estados se verificaron en pruebas de lógica con dobles, no como sesiones reales ni recorridos visuales autenticados.
