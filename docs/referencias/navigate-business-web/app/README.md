# Guía de la arquitectura (`app/`)

Fecha de creación: 2026-10-18
Relacionada con: [mapa de Astro (`src/`)](../src/README.md) (creada el 2026-10-17), [guía de auth](modules/auth/README.md) (trasladada desde `src/modules/auth/README.md`, creada el 2026-10-17), [plan de separación](../docs/plans/05-separar-src-astro-y-app-arquitectura.md), [bitácora 05](../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md), [migración Clean](../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md).

`app/` aloja la arquitectura completa de módulos, kernel compartido, composición, bootstrap y componentes UI reutilizables, separada físicamente del árbol convencional de Astro en [`src/`](../src/README.md). Para estudiar el recorrido del módulo de acceso, sigue la [guía de auth](modules/auth/README.md).

## Carpetas y responsabilidades

```text
app/
├── modules/auth/
│   ├── domain/         Entidades, fallos específicos y puertos inbound/outbound
│   ├── application/    DTOs, mappers de salida y casos de uso
│   ├── infrastructure/ Adaptadores concretos y traducción de DTO/errores externos
│   ├── presentation/   Controlador neutral, view model, composable y vistas Vue
│   ├── tests/          Comprobaciones de contrato, coordinación y lifecycle
│   ├── index.ts        Barrel público del módulo (domain/presentation)
│   └── README.md       Guía específica de auth
├── shared/             Result, cuatro familias de fallos, AsyncState, HTTP y utilidades
├── composition/        Factories que conectan puertos con implementaciones y propietario cliente
├── bootstrap/          Recursos genéricos cliente/servidor, entorno público y runtime compartido
└── ui/                 Componentes visuales reutilizables sin conocer módulos
```

El control de dependencias es parte de la arquitectura. Una carpeta por sí sola no impide que la vista importe Firebase ni que `app/` dependa de `src/`: eso lo comprueba ESLint.

## Orden de lectura

1. [`../src/pages/index.astro`](../src/pages/index.astro) y [`../src/islands/AuthIsland.vue`](../src/islands/AuthIsland.vue) montan la entrada Astro y adquieren el controlador compartido en cliente.
2. [`composition/auth/auth-client.ts`](composition/auth/auth-client.ts) combina entorno público, Firebase y HTTP. Su runtime diferido comparte un controlador por documento mediante [`bootstrap/app/create-shared-runtime.ts`](bootstrap/app/create-shared-runtime.ts).
3. [`composition/auth/create-auth-module.ts`](composition/auth/create-auth-module.ts) conecta puertos, casos de uso y controlador. Se puede reutilizar con dobles de prueba.
4. [`modules/auth/README.md`](modules/auth/README.md) continúa desde la vista y el controlador hasta Firebase y Go.

## Dependencias permitidas entre `app/` y `src/`

| Área                           | Puede depender de                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `app/shared`                   | `shared` y bibliotecas externas                                                                    |
| `app/ui`                       | `ui`, `shared` y Vue para sus componentes                                                          |
| `app/modules/*/domain`         | `domain` del mismo módulo y `shared`                                                               |
| `domain/ports/inbound`         | Lo anterior y **tipos DTO** de `application`, excepción conservada de la plantilla                 |
| `app/modules/*/application`    | `application`, `domain` del mismo módulo y `shared`                                                |
| `app/modules/*/infrastructure` | `infrastructure`, `domain` del mismo módulo, `shared` y SDKs externos                              |
| `app/modules/*/presentation`   | `presentation`, `application`, `domain` del mismo módulo, `ui`, `shared`; Vue en adaptador/vistas  |
| `app/bootstrap`                | `bootstrap` y `shared`; no módulos, composición ni UI                                              |
| `app/composition`              | Las capas de `app` que necesita conectar (`modules`, `bootstrap`, `shared`)                        |
| `src/islands`                  | `app/composition`, `app/modules/*/presentation`, barrel público del módulo, `app/ui`, `app/shared` |

Ninguna capa de `app/` puede importar `src/` (ni por alias `@/` o `@islands/`, ni por rutas relativas): las dependencias fluyen desde Astro hacia la aplicación. Los módulos no importan internamente otros módulos. El núcleo (`domain`, `application`) y los controladores, presenters y view models neutrales no importan paquetes de framework o plataforma ni usan `fetch`/`window`/`document`/`storage` globales. El runtime de servidor ([`bootstrap/server.ts`](bootstrap/server.ts)) está separado y no se importa desde consumidores cliente ni islas.

## Aliases y configuración que sostienen el árbol

| Archivo                                                                 | Función                                                                         |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`astro.config.mjs`](../astro.config.mjs)                               | Vue, Tailwind y puerto 4321 (`srcDir` predeterminado `./src`)                   |
| [`tsconfig.json`](../tsconfig.json)                                     | Base estricta de Astro, imports de tipos, variables sin uso y aliases           |
| [`eslint.config.mjs`](../eslint.config.mjs)                             | ESLint 10 sobre `src/**` y `app/**`, reglas TS y parsers Vue/Astro              |
| [`tooling/eslint/architecture.mjs`](../tooling/eslint/architecture.mjs) | Reconoce las dos raíces (`src` y `app`), resuelve aliases y rutas relativas     |
| [`tooling/architecture.test.mjs`](../tooling/architecture.test.mjs)     | 30 casos de imports permitidos/prohibidos con los parsers reales                |
| [`vitest.config.ts`](../vitest.config.ts)                               | Entorno Node, descubrimiento en `app`, `src` y `tooling`, y aliases de tsconfig |
| [`src/styles/global.css`](../src/styles/global.css)                     | Entrada Tailwind 4 sobre `src` y `@source '../../app'` para vistas/UI de `app`  |
| [`.prettierrc.json`](../.prettierrc.json)                               | Formato sobre `src`, `app`, `tooling` y configuración raíz                      |
| [`bootstrap/env/client-env.ts`](bootstrap/env/client-env.ts)            | Valida exclusivamente campos públicos y base API                                |
| [`bootstrap/server.ts`](bootstrap/server.ts)                            | Factory de recursos por petición futura; no se conecta al acceso cliente actual |
| [`src/env.d.ts`](../src/env.d.ts), [`.env.example`](../.env.example)    | Tipado y plantilla pública; no contienen configuración privada                  |

Aliases en `tsconfig.json`:

- `@/*` → `./src/*` (raíz Astro)
- `@app/*` → `./app/*` (raíz de arquitectura)
- `@shared` → `./app/shared/index.ts` y `@shared/*` → `./app/shared/*`
- `@modules/*` → `./app/modules/*`
- `@composition/*` → `./app/composition/*`
- `@bootstrap/*` → `./app/bootstrap/*`
- `@ui/*` → `./app/ui/*`
- `@islands/*` → `./src/islands/*`

## Comprobación

Desde la raíz: `pnpm verify` ejecuta lint, tipos Astro/Vue, pruebas y build. `pnpm format:check` comprueba formato en `src`, `app`, `tooling` y configuración raíz.

La comprobación visual, la hidratación y el recorrido real con Google corresponden al usuario. Gestionar el servidor existente según el [README](../README.md#ejecutar-en-local); no iniciar una segunda instancia.
