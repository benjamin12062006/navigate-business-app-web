# 01 — Acceso Google con Vue y cuenta Go

Fecha de creación: 2026-10-16
Última actualización: 2026-10-18
Estado: Implementado, pendiente de verificación con Google real.
Ámbito: Configuración y primer recorrido visual de autenticación web.
Relacionada con: [configuración previa](../../docs/plans/01-configuracion-antes-de-construir.md), [plan auth](../../docs/plans/auth/01-google-firebase-y-api-go.md), [filosofía Vue](../../docs/plans/02-filosofia-vue-y-prioridad-de-fuentes.md).
Revisión de partida: web `e52268ae9daa83ea820c3d65cbd5783968c083e8`; API `fbb1bc0ba80e8f454a8e299bbc0688790cdf5d2d`, con sus cambios locales preservados.


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Necesidad y punto de partida

Implementar configuración Astro/Vue/Firebase e interfaz auth, limitada a Google, `POST /auth/sync`, `GET /auth/me` y salida local. La compilación de la base Astro pasó mediante `node_modules/.bin/astro build`. La sonda local a `127.0.0.1:8080/api/v1/auth/me` no pudo conectar; la API no estaba escuchando. No se iniciarán migraciones ni se modificarán sus reglas.

## Evidencia y decisión propuesta

Se consultaron y reconstruyeron la 31 de `Vue 3 con TypeScript y Quasar` (estado local en composables), la 209 de `Vue con Pinia y Testing` (acción HTTP separada) y Astro 150 (configuración Firebase). La [ficha aplicada](../../docs/fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md) conserva originales F-C1/F-C2/F-C3, guías R1/R2/R3, pasajes, incertidumbres y correspondencia con los símbolos implementados. Una guía por original; no hubo un máximo numérico prefijado.

La UI y el mecanismo Firebase serán propios del contrato Go. No se copiarán contraseñas, JWT propios, tiendas ni roles de los ejemplos. Vue local basta para una sola isla; Pinia/Quasar no son necesarios para este incremento.

## Implementación y funcionamiento

[`index.astro`](../../src/pages/index.astro) renderiza el contenedor público y monta la isla [`AuthSurface.vue`](../../app/modules/auth/presentation/views/AuthSurface.vue). El diseño, copy, ilustración SVG y [estilos](../../src/styles/global.css) son adaptación propia. La vista ofrece entrada Google, carga, cancelación, errores, cuenta activa y salida; no incorpora páginas ni datos financieros todavía.

[`useAuth`](../../app/modules/auth/presentation/composables/use-auth.ts) expone referencias y transiciones locales (F-C1/R1). [`createAccountApi`](../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts) separa transporte y validación de la vista (F-C2/R2). [`createFirebaseSession`](../../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts) y [`readAuthConfig`](../../app/bootstrap/env/client-env.ts) adaptan inicialización modular (F-C3/R3) y contrato oficial del SDK.

El login explícito sincroniza mediante POST; la restauración consulta GET y solo `account_not_synced` dispara sync. El ID token se obtiene del SDK para cada petición y se fuerza su renovación una vez ante 401. No se renueva ni reintenta automáticamente 403/503. Los errores de proveedor/persistencia dejan la cuenta sin acceso y permiten reintentar según su naturaleza. Hay timeout de transporte/token y espera de restauración del observador.

Una generación de sesión, cancelación y marca de salida local descartan respuestas/eventos tardíos. Se oculta la cuenta antes de esperar a signOut. La presentación del usuario procede de Firebase; el estado y UUID autorizados vienen de Go. No se guarda una segunda copia manual del token.

El puerto 8080 resultó ocupado por Express/Descope de otra aplicación. Go se inició en 8081 con variable de proceso; `.env.example` y el archivo ignorado `.env.local` apuntan allí. No se modificaron archivos ni se aplicaron migraciones del backend. La configuración pública Firebase quedó vacía a la espera del usuario; la UI no inicializa auth ni simula cuenta cuando falta.

## Comprobación ejecutada

| Comando o inspección | Resultado |
| --- | --- |
| Build de la base antes de cambios | Pasó con el ejecutable Astro local. |
| `pnpm build` | Compilación estática completada. |
| `pnpm check` | Astro y Vue/TypeScript sin errores; Astro informó 0 advertencias. |
| `pnpm test` | 18 pruebas pasaron en dos archivos: contrato HTTP, configuración, restauración, sync selectivo, 401 acotado, 403/503, cancelación y aislamiento entre cuentas. |
| `pnpm peers check` | Sin conflictos, tras resolver TypeScript compatible con Astro check. |
| `git check-ignore .env.local` | Archivo local ignorado; `.env.example` permanece versionable. |
| Go en `127.0.0.1:8081` | Inicio y conexión de runtime correctos; GET me sin Bearer devolvió 401 `invalid_token`. |
| OPTIONS me, origen `http://127.0.0.1:4321` | HTTP 200, origen admitido, GET y Authorization permitidos. |
| Navegador real | Vista de preparación revisada en escritorio y compacto; sin errores/advertencias capturados. DOM sin desbordamiento horizontal en ancho compacto medido. |
| Documentación | Diez Markdown y 151 enlaces locales comprobados; fences y metadatos válidos. Las tres guías originales tienen fences balanceados y sus rutas existen. |
| Preservación y servidor | Contenidos backend comparados con la referencia del chat: intactos. `git diff --check` pasó. Astro quedó reiniciado en segundo plano en 4321, con `astro dev status` confirmando su registro activo. |

Capturas: [escritorio](../../docs/visual/auth/01-acceso-escritorio.jpg), [compacto](../../docs/visual/auth/02-acceso-compacto.jpg). Las pruebas usan identidades/datos ficticios de test; no se presentan como autenticación real. Los scripts de instalación de `@firebase/util` y protobufjs fueron inspeccionados y autorizados específicamente en pnpm; no se deshabilitó la política general de scripts. La política de suministro de pnpm pasó.

## Pendiente y continuidad

Completar la configuración pública de la app web Firebase del mismo proyecto que Go, verificar Google/dominio autorizado y ejecutar el recorrido en navegador con una identidad real. La CLI Firebase tenía sesión inválida y gcloud no permitió leer apps; no se creó otro proyecto ni se obtuvieron credenciales privadas. Falta verificar cuenta nueva/repetida, restauración, logout y revocación contra Google/SQL reales. Los resultados con dobles no cierran esos criterios.

La configuración, UI y lógica están implementadas y comprobadas en su alcance local; **auth integrado no se declara cerrado**. Se mantiene una sola entrada para completar las comprobaciones cuando se disponga de la configuración. No se implementaron funcionalidades ajenas a auth ni se alteraron los cambios preexistentes del backend.
