# 05 — Separar `src` de Astro y `app` de arquitectura

Fecha de creación: 2026-10-18
Estado: Implementado y verificado por comandos; revisión en navegador pendiente del usuario.
Ámbito: Exclusivamente `navigate-business-web`; separación física entre la raíz convencional de Astro (`src/`) y la raíz de arquitectura (`app/`).
Relacionada con: [migración Clean e islas](04-migracion-clean-e-islas-independientes.md), [plan de separación](../../docs/plans/05-separar-src-astro-y-app-arquitectura.md), [plan anterior](../../docs/plans/04-arquitectura-completa-modulos-e-islas.md), [fuentes de la plantilla](../../docs/fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md), [mapa Astro](../../src/README.md), [mapa arquitectura](../../app/README.md).
Revisión de partida: `f0b65fe24f5c743d6986f673891407a8ef68c432` (guardado previo sobre `71fecfaff3cd7e207036b105de4b4e53d66733f6`).

## Necesidad, evidencia y decisión

El usuario solicita separar físicamente la parte de Astro (`src/`) y la arquitectura Clean ya implementada (`app/`), ejecutando el [plan 05](../../docs/plans/05-separar-src-astro-y-app-arquitectura.md) tras guardar el estado previo en Git.

- **Evidencia oficial:** Astro mantiene `./src` como `srcDir` predeterminado para páginas, layouts y componentes ([Astro Configuration Reference — `srcDir`](https://docs.astro.build/en/reference/configuration-reference/#srcdir), consultado el 2026-10-18, Astro 7.3.3). Tailwind 4 permite registrar fuentes adicionales con `@source` relativo a la hoja de estilos ([Tailwind CSS 4.3 — Explicitly registering sources](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources), consultado el 2026-10-18).
- **Decisión aplicada:** Conservar `src/` para `pages/`, `layouts/`, `components/`, `islands/`, `styles/`, `env.d.ts` y su guía; trasladar `modules/`, `shared/`, `composition/`, `bootstrap/` y `ui/` a `app/`; actualizar aliases en `tsconfig.json`, descubrimiento en `vitest.config.ts`, límites de dos raíces en `tooling/eslint/architecture.mjs` y `eslint.config.mjs`, `@source '../../app'` en `src/styles/global.css`, scripts de formato y documentación.

## Comprobaciones de partida

- Respaldo Git previo: commit `f0b65fe24f5c743d6986f673891407a8ef68c432` en `main` y copia local fuera del árbol de fuentes.
- `pnpm verify`: ESLint sin errores ni advertencias; `astro check` y `vue-tsc --noEmit` con 0 errores; 48 pruebas en Vitest (23 de auth/runtime y 25 de límites arquitectónicos); `astro build` estático correcto.
- `pnpm format:check`: correcto.

## Implementación y cambios aplicados

| Área o archivo | Cambio ejecutado | Resultado |
| --- | --- | --- |
| Traslado de arquitectura | `src/{modules,shared,composition,bootstrap,ui}` → [`app/`](../../app/) | Los 63 archivos se trasladaron íntegros a `app/`, sin copias ni barrels de compatibilidad en `src/`. `src/` conserva únicamente `pages/`, `layouts/`, `components/`, `islands/`, `styles/`, `env.d.ts` y `README.md`. |
| [`tsconfig.json`](../../tsconfig.json) | Añadir `@app/*` y apuntar `@shared`, `@shared/*`, `@modules/*`, `@composition/*`, `@bootstrap/*` y `@ui/*` a `./app/...` | `@/*` y `@islands/*` permanecen en `./src/...`. `src/islands/AuthIsland.vue` conserva sus imports `@composition/*` y `@modules/*` sin cambios de código. |
| [`vitest.config.ts`](../../vitest.config.ts) | Ampliar `include` a `['app/**/*.test.ts', 'src/**/*.test.ts', 'tooling/**/*.test.mjs']` | Descubre las 23 pruebas de `app/modules/auth/tests/` y las 30 de `tooling/architecture.test.mjs` con los mismos aliases de tsconfig. |
| [`eslint.config.mjs`](../../eslint.config.mjs) y [`tooling/eslint/architecture.mjs`](../../tooling/eslint/architecture.mjs) | Reconocer dos raíces internas (`src` y `app`), clasificar raíz/área/módulo/capa, admitir `/app/...` y `/src/...`, impedir `app → src` y mantener barrera cliente/servidor | `src/islands` puede importar composición y presentación cliente de `app`; ninguna capa de `app` puede importar `src` ni destinos fuera de ambas raíces; `app/bootstrap/server` sigue restringido a entradas servidor autorizadas. |
| [`tooling/architecture.test.mjs`](../../tooling/architecture.test.mjs) | Actualizar rutas virtuales a `app/...`, reemplazar `@/modules/...` por `@app/modules/...` y añadir 5 pruebas de dos raíces | Se conservan los 25 casos previos y se verifican además `isla → composición` (permitido), `app → src` por alias y ruta relativa (prohibidos), `app → fuera de ambas raíces` (prohibido) y `presentación → infraestructura` con `@app` (prohibido). |
| [`src/styles/global.css`](../../src/styles/global.css) | Añadir `@source '../../app';` junto a `@import 'tailwindcss' source('../');` | El CSS compilado en `dist/_astro/` incluye las utilidades exclusivas de vistas y botones en `app/` (`shadow-access`, `bg-action`, `border-action`, `hover:bg-action-hover`, `min-h-[53px]`, `rounded-[22px]`, `scroll-mt-[35px]`, `animate-spin`, `#e1e5dd`, `#eaf0e7`). |
| [`package.json`](../../package.json) | Añadir `app` a `format` y `format:check` | Prettier formatea y verifica `src`, `app`, `tooling` y configuración raíz; `pnpm-lock.yaml` sin cambios. |
| Documentación | Reescribir [`src/README.md`](../../src/README.md), crear [`app/README.md`](../../app/README.md), actualizar [`app/modules/auth/README.md`](../../app/modules/auth/README.md), [`README.md`](../../README.md), planes, fuentes y bitácoras | 26 archivos Markdown y 591 enlaces locales verificados sin enlaces rotos y con fences balanceados. |

## Verificación final

| Comprobación ejecutada | Resultado |
| --- | --- |
| `pnpm verify` | ESLint sin errores ni advertencias; `astro check` (0 errores, 0 advertencias, 0 hints) y `vue-tsc --noEmit` correctos; Vitest 53 pruebas en 4 archivos (23 de auth/runtime en `app/modules/auth/tests/` y 30 de límites en `tooling/architecture.test.mjs`); `astro build` estático correcto. |
| `pnpm format:check` | Todos los archivos en `src`, `app`, `tooling` y raíz cumplen el formato Prettier. |
| Inspección de `dist/` | `dist/index.html` conserva el estado inicial determinista (`Comprobando tu sesión`); ni el HTML ni los bundles JS contienen cuentas de prueba (`alice`, `token-prueba`), `AuthConfigHelp`, `.env.local` ni `createServerRuntime`; el CSS compilado contiene las utilidades Tailwind exclusivas de `app/`. |
| Servidor Astro en segundo plano | Reiniciado según `AGENTS.md` (`pnpm astro dev stop` → `pnpm astro dev --background --host 127.0.0.1 --port 4321` → `pnpm astro dev status`). Peticiones HTTP locales a `/`, `/src/islands/AuthIsland.vue`, `/app/composition/auth/auth-client.ts`, `/app/modules/auth/presentation/views/AuthPageView.vue`, `/app/modules/auth/presentation/views/AuthSurface.vue`, `/app/modules/auth/presentation/controllers/auth.controller.ts` y `/app/ui/components/ActionButton.vue` devolvieron 200; `pnpm astro dev logs` sin errores. |
| Documentación e integridad Git | Secuencia documental sin colisiones (`05` en `bitacora-construccion/auth/`), 26 Markdown y 591 enlaces locales verificados, `git diff --check` y `git diff --cached --check` sin errores. |

No se abrió, controló ni inspeccionó ningún navegador. Las comprobaciones por comandos, el build estático y las respuestas HTTP 200 verifican tipos, límites, pruebas con dobles y entrega de módulos, pero no sustituyen la revisión visual ni una sesión real con Google. Queda a cargo del usuario revisar en `http://127.0.0.1:4321/` el aspecto en escritorio y móvil, la entrada o cancelación con Google, la recarga/restauración de sesión y la salida.

