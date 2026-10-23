# 01 — Replicar Navigate en Expo para app y web

Fecha de creación: 2026-10-22
Estado: Implementado, pendiente de compilación y aceptación manual por el usuario
Ámbito: React Native/Expo, Google/Firebase y cuenta de la API actual
Relacionada con: [historial web](../docs/referencias/navigate-business-web/bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md), [historial backend](../docs/referencias/backend/bitacora-construccion/03-integrar-auth-sin-retirar-backend-existente.md), [inventario copiado](../docs/referencias/manifest.json)

El usuario solicita el equivalente del frontend actual usando el instalador de Expo, pnpm y Tailwind, copiando documentación y entorno público. Solicita ejecutar él mismo compiladores móviles/web y la revisión visual: no se abrirán navegador, app o simuladores, ni se ejecutarán builds, prebuild, export o tsc.

Se reutiliza la arquitectura app/modules, shared, composition y bootstrap. Las vistas Vue/Astro se adaptan a React Native con rutas Expo en src/app. El código neutral del controlador/casos de uso conserva restauración, sync explícito, renovación acotada, cancelación y generaciones. Se conserva el contrato Go de la web actual y su entorno expo-city-bol/8085/api/v1. Rust usa otro contrato y proyecto Firebase; su documentación se copia como contexto, sin cambiar de backend ni mezclar identidades.

El historial web/backend se conserva byte por byte bajo docs/referencias, con manifiesto de hashes y fuentes de código necesarias para sus enlaces. Las verificaciones históricas de Astro/Go/Rust no acreditan esta app nueva.

## Evidencia y resultado

La [ficha de fuentes](../docs/fonts/01-expo-y-adaptacion-del-frontend.md) distingue documentación oficial, código local y decisiones propias. Expo SDK 58/RN 0.88 procede del instalador oficial; pnpm view confirmó Expo 58.0.17 y create-expo-app 5.0.0 como versiones actuales el 2026-10-22. NativeWind 4.2.7 usa Tailwind 3.4.19, preset Babel y wrapper Metro; no se copia la entrada Tailwind 4 de Astro.

La revisión de partida de la web es 8fbc64cb712970c4d04c42931f67f8481159ce37, con copia del árbol local. El instalador creó automáticamente el repositorio/commit inicial de plantilla f2b9a766f2354fa08ba73e0e19fb14565d99d0dc; esta adaptación no creó commits. El manifiesto identifica cada copia histórica sin atribuirle otra revisión o comprobación.

| Área implementada | Archivos y mecanismo |
| --- | --- |
| Instalación/identidad | package.json y lockfile pnpm; carpeta final con & y slug técnico válido. app.config.ts fija src/app como rutas y conserva app como arquitectura. |
| Lógica heredada | domain/application, controlador y presenter neutrales, shared Result/AsyncState y factory createAuthModule. Se conservan el observable y los contratos TypeScript del frontend. |
| React Native | AuthPageView/useAuth usa useSyncExternalStore. La ruta adquiere un lease al montar y lo libera al desmontar; el runtime compartido maneja remontajes sin retener un controlador disposed. |
| UI | Cabecera, introducción, SVG, tarjeta, estado, Google, cuenta y salida adaptados a View/Text/Pressable; tipografías empaquetadas e iconos derivados del SVG original. No se trasladan Vue, Astro SSR ni WebViews al runtime. |
| SDK | FirebaseSessionAdapter web mantiene popup/browserSessionPersistence. La rama native usa Nitro Google y canje Firebase con persistencia AsyncStorage. SDK/token no se entregan al estado UI. |
| Retorno Apple | Plugin local conecta Google al AppDelegate conservando otros handlers; +native-intent mantiene la raíz de acceso. Se inspeccionó SceneEventForwarder de Expo 58 para fundamentar el enlace, sin ejecutar Swift. |
| Red/entorno | Se copian todos los PUBLIC_ reales como EXPO_PUBLIC_, incluyendo expo-city-bol/8085/api/v1. Android cambia únicamente el host al loopback de emulador. Cancelación compartida evita depender de AbortSignal.any/throwIfAborted en RN. |
| Documentos | 146 archivos copiados, incluidos los dos JPG visuales, todas las cinco entradas backend y las fuentes web relacionadas. El archivo histórico está fuera de rutas, tipos, Tailwind y tests activos. |

El archivo bootstrap/server de Astro se mantiene en el snapshot histórico: depende de import.meta.env.SSR y no pertenece a este cliente universal. Su funcionalidad futura de servidor no se inventa como auth móvil. El composable Vue se sustituye por el hook React.

## Comprobaciones ejecutadas

- Instalación oficial con pnpm y expo install para elegir versiones nativas del SDK: correcta. Los scripts de instalación Firebase/protobufjs y esbuild se permitieron explícitamente como en el proyecto web; no son builds de aplicaciones.
- pnpm lint: correcto, incluyendo límites de capas en TS/TSX y prohibición de IO global en núcleo.
- pnpm test: 29 pruebas correctas en cinco archivos. Se portaron 23 pruebas de gateway/controlador/lifecycle; seis nuevas comprueban entorno por destino y parche de callback Apple, incluidos idempotencia y conservación de handlers.
- pnpm exec expo config --type public --json: correcto; SDK 58, slug e identificadores nativos propuestos se resuelven sin generar plataformas.
- pnpm exec expo install --check --pnpm: correcto contra metadatos de Expo. Un primer intento sin red utilizó el mapa local; el segundo con acceso a red confirmó Dependencies are up to date.
- Se confirmaron por lectura las APIs RN de Firebase 13.1.0 y Nitro 2.3.0. La declaración local completa el tipo RN que falta en auth-public.d.ts; no modifica archivos del SDK.
- node --check para Babel, Metro y plugin: correcto. No se ejecutó Metro al comprobar su sintaxis.
- Todos los 146 hashes del snapshot coinciden. Se comprobó igualdad de cada valor público copiado del entorno web sin imprimir claves. Los seis documentos activos no tienen enlaces locales rotos; no hay colisiones de numeración.
- git diff --check: correcto. No existen ios/, android/ o dist/ generados por este trabajo.

Estas comprobaciones no incluyen tsc ni validan props/tipos del programa completo, enlace Swift/Kotlin, empaquetado Metro, aspecto renderizado o acceso con una cuenta Google real. El Node observado 24.2.0 queda fuera del rango de Expo 58 en la línea 24; el README requiere actualizar a 24.3+ antes del arranque.

## Configuración externa pendiente

No se encontraron archivos móviles de expo-city-bol en las ubicaciones revisadas. Los disponibles en KOTLIN-APP son de business-managment-rs y se descartaron del cliente nuevo. Los dos OAuth client IDs móviles quedan vacíos deliberadamente; la web mantiene sus valores reales y móvil muestra configuración pendiente sin simular sesión.

El [README](../README.md) detalla registro Android/iOS en el mismo proyecto Firebase, archivos/identificadores, client IDs, huellas de firma, CORS, acceso LAN y comandos pnpm web/android/ios. app.config.ts comprueba el proyecto de los archivos móviles que se añadan. La revisión/arranque de apps y servidores pertenece al usuario según su petición; no se ejecutaron navegador, emulador, simulador, tsc, prebuild, export, Gradle, Xcode o EAS Build.

Los proyectos web, Rust y Kotlin existentes no se modificaron. La siguiente verificación será la ejecución del usuario y sus capturas o errores concretos.
