# Guía de la capa Astro (`src/`)

Fecha de creación: 2026-10-17
Última actualización: 2026-10-18
Relacionada con: [mapa de la arquitectura (`app/`)](../app/README.md), [guía de auth](../app/modules/auth/README.md), [plan de separación](../docs/plans/05-separar-src-astro-y-app-arquitectura.md), [bitácora 05](../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md).

`src/` conserva exclusivamente el directorio fuente convencional de Astro (`srcDir: './src'`): rutas, documento HTML, componentes estáticos, hojas de estilo y las islas que conectan Astro con la arquitectura en [`app/`](../app/README.md).

## Estructura de `src/`

```text
src/
├── pages/
│   └── index.astro                     Ruta principal; compone layout, introducción e isla
├── layouts/
│   └── MainLayout.astro                Documento HTML, metadatos, cabecera, pie y <slot />
├── components/
│   ├── home/
│   │   ├── AccessIntroduction.astro    Presentación editorial estática de la portada
│   │   └── PerspectiveArt.astro        Ilustración SVG decorativa
│   └── layout/
│       └── SiteHeader.astro            Cabecera estática del sitio
├── islands/
│   └── AuthIsland.vue                  Entrada cliente Vue; adquiere el controlador compartido en cliente
├── styles/
│   └── global.css                      Entrada Tailwind 4 (@source sobre src y app) y tokens de tema
├── env.d.ts                            Tipado de variables públicas ImportMetaEnv
└── README.md                           Este mapa de la parte Astro
```

## Recorrido en `src/` y vínculo con `app/`

1. [`pages/index.astro`](pages/index.astro) compone [`MainLayout.astro`](layouts/MainLayout.astro), [`AccessIntroduction.astro`](components/home/AccessIntroduction.astro) y `<AuthIsland client:load />`.
2. [`layouts/MainLayout.astro`](layouts/MainLayout.astro) importa [`styles/global.css`](styles/global.css), define el documento y renderiza [`SiteHeader.astro`](components/layout/SiteHeader.astro) junto al `<slot />`.
3. [`islands/AuthIsland.vue`](islands/AuthIsland.vue) renderiza [`AuthSurface`](../app/modules/auth/presentation/views/AuthSurface.vue) con un estado inicial determinista durante SSR y, únicamente en `onMounted`, adquiere el controlador compartido desde `@composition/auth/auth-client` y libera su lease en `onUnmounted`. No recibe controladores con funciones como props hidratadas desde Astro.
4. [`styles/global.css`](styles/global.css) importa Tailwind 4 sobre `src/` (`source('../')`) y registra explícitamente `app/` (`@source '../../app'`) para generar las utilidades empleadas tanto en componentes Astro como en vistas y componentes Vue de `app/`.

## Reglas de dependencia desde `src/`

- Las dependencias fluyen desde `src/` hacia `app/`, nunca al revés (`app/` no importa nada de `src/`).
- `src/islands/` puede importar composición (`@composition/*`), presentación pública (`@modules/*`, `@ui/*`) y tipos compartidos (`@shared/*`), pero no `app/bootstrap/server` ni adaptadores de infraestructura.
- `src/pages/`, `src/layouts/` y `src/components/` no importan directamente SDKs como Firebase, adaptadores de infraestructura ni casos de uso para ejecutar lógica de negocio.
- Los límites se verifican mediante [`eslint.config.mjs`](../eslint.config.mjs), [`tooling/eslint/architecture.mjs`](../tooling/eslint/architecture.mjs) y [`tooling/architecture.test.mjs`](../tooling/architecture.test.mjs).

Para recorrer las capas de dominio, aplicación, infraestructura, presentación, composición y bootstrap, continúa en el [mapa de `app/`](../app/README.md) y en la [guía de auth](../app/modules/auth/README.md).
