# 04 — Migración Clean e islas independientes

Fecha de creación: 2026-10-18
Estado: Implementado y verificado por comandos; revisión en navegador pendiente del usuario.
Ámbito: Arquitectura completa del frontend; acceso existente.
Relacionada con: [separación de componentes](02-componentes-y-directorios-del-acceso.md), [última corrección](03-retirar-ayuda-local-y-recuperar-servidor.md), [plan](../../docs/plans/04-arquitectura-completa-modulos-e-islas.md), [fuentes](../../docs/fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md), [separación `src`/`app` posterior](05-separar-src-astro-y-app-arquitectura.md).
Revisión de partida: `71fecfaff3cd7e207036b105de4b4e53d66733f6` más los cambios locales preexistentes. El punto de recuperación anterior continúa disponible.

> Continuidad (2026-10-18): en la [etapa 05](05-separar-src-astro-y-app-arquitectura.md) las cinco áreas de arquitectura (`modules`, `shared`, `composition`, `bootstrap` y `ui`) se trasladaron físicamente de `src/` a `app/`. Los enlaces siguientes apuntan a sus ubicaciones vigentes en `app/`.

## Necesidad, evidencia y decisión

El usuario aprueba trasladar la lógica actual a toda la arquitectura de su plantilla, con configuración efectiva y código comprensible. F1/F2 de la [ficha de fuentes](../../docs/fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md) fundamentan capas, puertos, composición, Result, fallos y límites. F3/F4 justifican que la composición se conecte en una entrada cliente y que el núcleo pueda consumirse sin Vue.

Se conservaron las vistas Tailwind y el contrato Go. Se trasladó la coordinación de `useAuth` a un controlador TypeScript observable; el composable quedó como adaptador reactivo. Los SDK se limitaron a infrastructure, y bootstrap no conoce módulos. Se utilizó composición explícita, como la plantilla principal; el contenedor IoC de la otra referencia no aporta una necesidad adicional al módulo actual.

## Comprobaciones de partida

`pnpm test`: 18 pruebas correctas. `pnpm check`: Astro 0 errores, 0 advertencias, 0 hints; Vue/TypeScript correcto. `pnpm build`: correcto, una página estática. No se ha utilizado navegador. Los resultados finales y símbolos implementados constan en las secciones siguientes.

## Implementación y funcionamiento

Se ejecutó el [plan 04](../../docs/plans/04-arquitectura-completa-modulos-e-islas.md). La arquitectura de F1 se aplica con estas correspondencias; las decisiones de adaptación están separadas de la evidencia en la [ficha](../../docs/fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md).

| Mecanismo y procedencia | Implementación final | Adaptación aplicada |
| --- | --- | --- |
| Módulos y entidades, F1/F2 | [domain](../../app/modules/auth/domain/), `Account`, `SessionUser`, `AuthFailure` | ID de cuenta validado en mapper y marcado con Brand. La identidad expone capacidad de token mediante un puerto, sin tipos Firebase. |
| Puertos inbound/outbound, F1 | [puertos](../../app/modules/auth/domain/ports/) | Inbound permite tipos DTO de application, como la excepción de la plantilla. Las implementaciones quedan fuera de domain. |
| DTOs, mapper y use cases, F1/F2 | [load-account](../../app/modules/auth/application/use-cases/load-account.use-case.ts), [session](../../app/modules/auth/application/use-cases/session.use-cases.ts), [DTOs](../../app/modules/auth/application/dto/) | La restauración sincroniza solo ante `404 account_not_synced`; los casos de uso reciben puertos y devuelven Result. |
| Adaptadores y mappers externos, F1 | [Firebase](../../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts), [HTTP](../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts), [mappers](../../app/modules/auth/infrastructure/mappers/) | Usuarios/errores Firebase se traducen al contrato propio. Los errores Go desconocidos se normalizan; no se pasan objetos del SDK, cuerpos arbitrarios o tokens a las vistas. |
| Shared kernel completo, F1 | [shared](../../app/shared/), [barrel](../../app/shared/index.ts) | Se conservan Result y sus combinadores, cuatro familias de failures, AsyncState, branded/nullable types y utilidades. HTTP ofrece request/get/post/put/patch/delete, headers, JSON desconocido, señal/plazo combinados y fetch inyectado. Cada adaptador valida su DTO; no se afirma que un genérico valide datos en ejecución. |
| Coordinación y presentación, F1 + adaptación propia | [AuthController](../../app/modules/auth/presentation/controllers/auth.controller.ts), [view model](../../app/modules/auth/presentation/view-models/auth-view-model.ts), [presenter](../../app/modules/auth/presentation/presenters/auth-failure.presenter.ts) | Estado neutral, generaciones, cancelación y suscripciones. Snapshots inmutables, sin capacidad de token, compartibles con consumidores JavaScript. AsyncState evita representar simultáneamente una cuenta disponible y fallida. |
| Hook/vista, F1 adaptada a Vue | [useAuth](../../app/modules/auth/presentation/composables/use-auth.ts), [AuthPageView](../../app/modules/auth/presentation/views/AuthPageView.vue), [AuthSurface](../../app/modules/auth/presentation/views/AuthSurface.vue), [ActionButton](../../app/ui/components/ActionButton.vue) | El composable adapta suscripción/reactividad; la superficie solo recibe datos y emite intenciones. Las clases Tailwind y mensajes se conservan. El botón común vive en ui, sin conocer módulos. |
| Composición explícita, F1 | [createAuthModule](../../app/composition/auth/create-auth-module.ts), [auth-client](../../app/composition/auth/auth-client.ts) | Se conectan puertos, use cases y controlador. La entrada cliente selecciona adaptadores reales; no se reexporta composición desde el barrel del módulo. |
| Bootstrap/entorno, F1 adaptada a Astro | [client](../../app/bootstrap/client.ts), [client-env](../../app/bootstrap/env/client-env.ts), [server](../../app/bootstrap/server.ts) | Configuración pública explícita; factory server separada, sin credenciales inventadas ni sesión global. Bootstrap no importa módulos. La página actual continúa estática y el acceso sigue siendo cliente. |
| Entradas independientes, F3/F4 + propuesta propia | [AuthIsland](../../src/islands/AuthIsland.vue), [runtime compartido](../../app/bootstrap/app/create-shared-runtime.ts) | SSR y primera hidratación usan estado inicial determinista. Solo `onMounted` adquiere el controlador; cada consumidor libera un lease y el último libera observer/operaciones. Un script TS puede consumir la misma API sin Vue; véase la [guía](../../app/modules/auth/README.md#otra-isla-o-un-script-typescript). |
| Configuración efectiva, F1/F5 + propuesta propia | [tsconfig](../../tsconfig.json), [ESLint](../../eslint.config.mjs), [regla](../../tooling/eslint/architecture.mjs), [Vitest](../../vitest.config.ts), [Prettier](../../.prettierrc.json) | Aliases compartidos y rutas resueltas; comprobar imports, exports, imports dinámicos y tipos importados en TS/Vue/Astro. Bloquear dependencias de framework/configuración global en el núcleo y Firebase fuera de infrastructure. |

### Mapa de traslado desde la etapa anterior

Los enlaces de documentos históricos se actualizaron hacia sus sucesores, acompañados de una nota de continuidad. Sus descripciones siguen correspondiendo a la etapa que documentaban; no se atribuyen estos cambios nuevos a cursos anteriores.

| Ubicación anterior bajo `src/features/auth/` | Sucesor actual |
| --- | --- |
| `AuthSurface.vue` (entrada y tarjeta) | [isla](../../src/islands/AuthIsland.vue), [vista](../../app/modules/auth/presentation/views/AuthPageView.vue) y [tarjeta](../../app/modules/auth/presentation/views/AuthSurface.vue) |
| `components/` | [componentes](../../app/modules/auth/presentation/components/) y [botón común](../../app/ui/components/ActionButton.vue) |
| `composables/use-auth.ts` | [controlador neutral](../../app/modules/auth/presentation/controllers/auth.controller.ts) y [adaptador Vue](../../app/modules/auth/presentation/composables/use-auth.ts) |
| `types/contracts.ts` | [entidades](../../app/modules/auth/domain/entities/), [puertos](../../app/modules/auth/domain/ports/), [DTOs](../../app/modules/auth/application/dto/) y [view model](../../app/modules/auth/presentation/view-models/auth-view-model.ts) |
| `config/auth-config.ts` | [bootstrap/env/client-env.ts](../../app/bootstrap/env/client-env.ts) |
| `errors/auth-errors.ts` | [fallos propios](../../app/modules/auth/domain/failures/auth-failure.ts), [mapper Firebase](../../app/modules/auth/infrastructure/mappers/firebase-failure.mapper.ts) y [mensajes](../../app/modules/auth/presentation/presenters/auth-failure.presenter.ts) |
| `services/account-api.ts` | [gateway HTTP](../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts), [mapper](../../app/modules/auth/infrastructure/mappers/account.mapper.ts) y [transporte shared](../../app/shared/http/http-client.ts) |
| `services/firebase-client.ts` | [adaptador Firebase](../../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts) |
| `services/resolve-account.ts` | [caso de uso load-account](../../app/modules/auth/application/use-cases/load-account.use-case.ts) |
| `tests/` | [pruebas migradas](../../app/modules/auth/tests/) y [límites ESLint](../../tooling/architecture.test.mjs) |

Se actualizaron el [README principal](../../README.md), el [mapa src](../../src/README.md), el [mapa app](../../app/README.md) y la [guía de auth](../../app/modules/auth/README.md), con orden de lectura y ejemplo de consumo TS. No se conserva una segunda implementación funcional en `features`.

## Verificación final

| Comprobación ejecutada | Resultado |
| --- | --- |
| `pnpm verify` | ESLint sin errores/advertencias; `astro check` y `vue-tsc` correctos; pruebas y build estático correctos. |
| `pnpm test` | 48 pruebas: 18 comprobaciones migradas, 5 de runtime/contratos independientes y timeout, 25 de límites reales/configuración ESLint. |
| Comparación temporal SSR con compiler-sfc/server-renderer instalados | 13 estados en desarrollo y los mismos 13 en producción: etiquetas, textos, clases y atributos equivalentes, normalizando comentarios y espacios de formato. Incluye carga, configuración, cancelación, variantes de error/suspensión y cuenta activa con/sin perfil. Se rechazan advertencias de render en esa comparación. No se incorpora un runner temporal al proyecto. |
| `pnpm format:check`, `pnpm peers check` | Formato y compatibilidad de peers correctos. ESLint 10 es requerido por el plugin Astro 3 instalado; engines de desarrollo se ajusta a Node 22.13 o 24+, según ESLint. |
| Entrega local sin navegador | No había servidor en 4321. Se inició Astro en background según AGENTS.md. Peticiones HTTP a `/`, isla, composición, vista y controlador devolvieron 200; logs de la instancia nueva sin errores en esa comprobación. |
| Integridad | Índice Git idéntico al de partida; backend sin cambios. No se ejecutaron commits ni tags nuevos durante esta migración. Documentación con enlaces locales existentes y fences equilibrados; `git diff --check` correcto. |

Las pruebas de límites incluyen aliases, rutas relativas, reexports, imports dinámicos, `import()` de tipos, Vue y Astro; detectaron y permitieron corregir el nodo `TSImportType.source` del parser vigente. Las primeras ejecuciones también detectaron una colisión entre el alias exacto `@shared` y su subruta en Vitest; ahora el alias exacto se ancla al nombre completo. Son correcciones verificadas durante esta migración.

La comparación SSR es estructural y no demuestra hidratación, clics, persistencia del navegador ni Google real. No se abrió, inspeccionó ni automatizó un navegador. Queda al usuario revisar [la página local](http://127.0.0.1:4321/): escritorio/móvil, entrada/cancelación de Google, cuenta, salida y recarga/restauración; compartir captura o error si aparece una diferencia. El backend no se inició ni se modificó en esta etapa.
