# 05 — Separar `src` de Astro y `app` de arquitectura

Fecha de creación: 2026-10-18
Última actualización: 2026-10-18
Estado: Ejecutado y verificado por comandos; revisión en navegador pendiente del usuario.
Ámbito: Exclusivamente `navigate-business-web`.
Relacionada con: [arquitectura implementada](04-arquitectura-completa-modulos-e-islas.md), [fuentes de la plantilla](../fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md), [bitácora de partida](../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md), [bitácora de ejecución](../../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md), [mapa Astro](../../src/README.md), [mapa arquitectura](../../app/README.md).
Revisión de referencia: `f0b65fe24f5c743d6986f673891407a8ef68c432` (guardado previo del estado de migración sobre `71fecfaff3cd7e207036b105de4b4e53d66733f6`).

## 1. Decisión y resultado buscado

Conservar `src/` como directorio fuente convencional de Astro. Crear `app/` como carpeta hermana para alojar la arquitectura completa ya implementada siguiendo `template-clean-architecture`. No intercambiar estos nombres durante la ejecución.

La migración cambia ubicaciones, imports, reglas y documentación. Debe conservar lógica, contratos, estilos y comportamiento del acceso. `app/` será una carpeta fuente del mismo proyecto: no se crea otro paquete, otro `package.json`, otro servidor ni una aplicación Next.js.

Astro seguirá con su `srcDir` predeterminado `./src`; no configurar `srcDir: './app'`, no cambiar `root` y no mover `pages` fuera de `src`. Esto conserva el enrutamiento existente. La opción está documentada por [Astro, Configuration Reference, srcDir](https://docs.astro.build/en/reference/configuration-reference/#srcdir), consultada el 2026-10-18; proyecto actual Astro 7.3.3.

## 2. Árbol final obligatorio

Los siguientes destinos son **propuestos**, todavía no existen al redactar este plan:

```text
navigate-business-web/
├── src/                                  # Astro y entradas que lo conectan con app
│   ├── pages/
│   │   └── index.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── components/
│   │   ├── home/
│   │   │   ├── AccessIntroduction.astro
│   │   │   └── PerspectiveArt.astro
│   │   └── layout/
│   │       └── SiteHeader.astro
│   ├── islands/
│   │   └── AuthIsland.vue
│   ├── styles/
│   │   └── global.css
│   ├── env.d.ts
│   └── README.md                         # Guía específica de Astro
├── app/                                  # Arquitectura completa existente
│   ├── modules/
│   │   └── auth/
│   │       ├── domain/
│   │       ├── application/
│   │       ├── infrastructure/
│   │       ├── presentation/
│   │       ├── tests/
│   │       ├── index.ts
│   │       └── README.md
│   ├── shared/
│   ├── composition/
│   │   └── auth/
│   ├── bootstrap/
│   │   ├── app/create-shared-runtime.ts
│   │   ├── env/client-env.ts
│   │   ├── client.ts
│   │   └── server.ts
│   ├── ui/
│   │   └── components/ActionButton.vue
│   └── README.md                         # Mapa de la arquitectura
├── tooling/                              # Herramientas de desarrollo
├── docs/
├── bitacora-construccion/
├── public/                               # Si existe; ubicación sin cambios
├── astro.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── package.json
└── pnpm-lock.yaml
```

`app/bootstrap/app/` ya existe como `src/bootstrap/app/`. Conservar su nombre y contenido: esta tarea no debe aprovechar el traslado para rediseñar o renombrar utilidades.

## 3. Mapa exacto de movimientos

Ejecutar desde la raíz del frontend. Mover directorios completos, incluidos archivos sin seguimiento; no reconstruirlos desde el índice Git.

| Origen actual | Destino final | Contenido que debe acompañarlo |
| --- | --- | --- |
| `src/modules/` | `app/modules/` | Todos los módulos; auth con sus cuatro capas, puertos, DTOs, mappers, vistas, tests, barrel y guía |
| `src/shared/` | `app/shared/` | Result, cuatro familias de failures, AsyncState, tipos, HTTP, abort y utilidades; también su barrel |
| `src/composition/` | `app/composition/` | Factories y propietario cliente de auth |
| `src/bootstrap/` | `app/bootstrap/` | Recursos cliente/servidor, entorno público y runtime compartido |
| `src/ui/` | `app/ui/` | Botón Vue reutilizable y futuros componentes comunes |

Permanecen en su sitio `src/pages/`, `src/layouts/`, `src/components/`, `src/islands/`, `src/styles/`, `src/env.d.ts` y `src/README.md`. `tooling/`, documentación, configuración raíz, dependencias, archivos de entorno y backend tampoco se trasladan.

No dejar copias funcionales, symlinks ni barrels de compatibilidad bajo `src/modules`, `src/shared`, `src/composition`, `src/bootstrap` o `src/ui`: el objetivo es que exista una sola implementación en `app`.

## 4. Preparación antes de tocar código

1. Leer este plan, `AGENTS.md` y la bitácora 04; contrastar el árbol real con la tabla. Si hay nuevos archivos, clasificarlos por responsabilidad antes de moverlos.
2. Registrar `git status --short`, revisión e inventario. El estado actual tiene diferencias entre índice y árbol de trabajo, además de archivos sin seguimiento. No ejecutar `reset`, `restore`, `checkout`, `clean` ni `stash` para simplificarlo.
3. Conservar una copia local recuperable del estado inmediatamente anterior al traslado: fuentes de `src`, configuración a modificar y documentación afectada; incluir los archivos sin seguimiento. Mantener esa copia fuera del árbol de fuentes y no copiar ni imprimir secretos de `.env.local`.
4. Obtener la línea base con `pnpm verify` y `pnpm format:check`. La bitácora previa registra 48 pruebas correctas, pero es un antecedente, no una ejecución de esta nueva etapa. Si aparece un fallo previo, distinguirlo de la migración.
5. Comprobar que no haya un destino `app` ajeno que se pueda sobrescribir. Si ya existe, inspeccionar y conciliar su contenido; no usar un movimiento que cree accidentalmente `app/modules/modules`.
6. Abrir una entrada de implementación `En curso` en la bitácora al iniciar la migración, usando la siguiente numeración disponible en esa fecha. Este plan no es esa entrada ni afirma que el traslado esté ejecutado.

## 5. Traslado e imports

Crear `app/` y trasladar los cinco directorios de la tabla. Al haber ficheros sin seguimiento, usar un movimiento de filesystem que preserve su contenido; `git mv` no debe asumirse aplicable a todo. No modificar el índice ni crear un commit por defecto.

La mayoría de imports relativos internos seguirá siendo válida porque los cinco directorios mantienen su posición entre sí. No sustituirlos todos por estilo: revisar los que cruzan raíces, las referencias con prefijo `src/` y los enlaces Markdown. Conservar los nombres de los aliases existentes para evitar reescribir innecesariamente las vistas y casos de uso.

En `src/pages/index.astro`, mantener `@islands/AuthIsland.vue` y `<AuthIsland client:load />`. En `src/islands/AuthIsland.vue`, mantener la adquisición en `onMounted`, liberación en `onUnmounted` y el estado inicial SSR. Sus imports `@composition/...` y `@modules/...` pasarán a resolver a `app` mediante tsconfig.

No pasar controladores con funciones desde el frontmatter Astro como props hidratadas, no crear otra sesión por isla y no mover Firebase a los componentes de Astro.

## 6. Configuración: cambios concretos por archivo

### `tsconfig.json`

Conservar la base estricta de Astro, flags de tipos e inclusión de `.astro/types.d.ts`. Los aliases finales deben quedar así:

```json
{
  "@/*": ["./src/*"],
  "@app/*": ["./app/*"],
  "@shared": ["./app/shared/index.ts"],
  "@shared/*": ["./app/shared/*"],
  "@modules/*": ["./app/modules/*"],
  "@composition/*": ["./app/composition/*"],
  "@bootstrap/*": ["./app/bootstrap/*"],
  "@ui/*": ["./app/ui/*"],
  "@islands/*": ["./src/islands/*"]
}
```

`@/` seguirá significando Astro; no reasignarlo silenciosamente a `app`. `@app/` identificará la raíz de arquitectura cuando haga falta; se somete a los mismos límites que los aliases específicos. La inclusión actual `**/*` ya abarca ambas raíces: verificar que no se añada una exclusión de `app` ni se pierda la comprobación de sus archivos Vue.

### `vitest.config.ts`

La resolución de aliases ya se obtiene de tsconfig: conservar ese mecanismo y el anclaje exacto del alias `@shared`, sin recuperar la colisión corregida en la etapa anterior. Cambiar el descubrimiento de pruebas a:

```ts
include: [
  'app/**/*.test.ts',
  'src/**/*.test.ts',
  'tooling/**/*.test.mjs',
]
```

Los tres archivos de pruebas de auth se trasladan junto al módulo. Mantener entorno Node; no introducir pruebas en navegador ni alterar aserciones funcionales para que pasen después de mover archivos.

### `eslint.config.mjs`

Aplicar `architecture/boundaries` a `src/**/*.{ts,js,vue,astro}` **y** `app/**/*.{ts,js,vue,astro}`. Trasladar los patrones de núcleo neutral y controladores/presenters/view-models de `src/modules/**` a `app/modules/**`. Conservar parsers TS, Vue y Astro, restricciones de globals/entorno, excepciones de tests y compatibilidad con Prettier.

No ampliar los ignores a `app` ni quitar restricciones para resolver errores de traslado.

### `tooling/eslint/architecture.mjs`

Este archivo requiere una adaptación funcional; no basta reemplazar `src` por `app`:

- Actualmente `sourceRoot` es solo `src`, por lo que todo destino fuera de él se considera externo a las áreas válidas. Reconocer **dos raíces internas**: `src` para Astro y `app` para arquitectura.
- Clasificar cada ruta resuelta con raíz, área, módulo y capa. Una ruta entre ambas raíces es interna al proyecto; una ruta fuera de ambas sigue siendo inválida.
- Resolver aliases desde tsconfig y rutas relativas/absolutas normalizadas. Admitir también `/app/...` al igual que `/src/...`, sin usar coincidencias de prefijo que acepten por error carpetas como `app-backup`.
- Mantener las reglas entre capas dentro de `app`, la excepción de imports **de tipos DTO** en puertos inbound, el bloqueo entre módulos y el control de barrels.
- Permitir a las entradas `src/islands` importar composición y presentación cliente de `app`. Las páginas/layouts/componentes Astro pueden consumir presentación pública apropiada; no deben importar directamente SDKs, infraestructura o casos de uso para ejecutar negocio.
- Impedir que cualquier capa de `app` importe `src`: las dependencias fluyen desde Astro hacia la aplicación. Bootstrap seguirá sin importar módulos, composición o UI.
- Mantener la barrera cliente/servidor: la isla y componentes cliente no importan `app/bootstrap/server` ni su entorno privado. Distinguir las páginas/entradas servidor autorizadas usando la clasificación de la raíz, no un regex que accidentalmente deje de reconocerlas.
- Conservar la inspección de imports, reexports, imports dinámicos, tipos importados y `require` literal. El fallo que se debe evitar es aceptar todo `app` como si fuera una biblioteca externa no revisada.

### `tooling/architecture.test.mjs`

Actualizar las rutas virtuales de las capas trasladadas a `app/...`, conservando las de islas/componentes Astro en `src/...`. Sustituir el caso prohibido `@/modules/...`, que dejará de apuntar a una capa real, por `@app/modules/...` o su alias específico: las pruebas deben ejercer la nueva arquitectura real.

Conservar los 25 casos actuales de restricciones y ampliar solo los necesarios para las dos raíces: isla → composición permitido; app → src prohibido por alias y ruta relativa; app → fuera de ambas raíces prohibido; presentación → infraestructura prohibido con `@app`; isla → bootstrap servidor prohibido. Comprobar que un import permitido no falle por la antigua condición `../` relativa a una única raíz.

### `src/styles/global.css`: Tailwind en ambas carpetas

Conservar tema y entrada actual; añadir explícitamente la nueva fuente:

```css
@import 'tailwindcss' source('../');
@source '../../app';
```

Desde `src/styles/global.css`, `../` corresponde a `src` y `../../app` corresponde a la arquitectura. Esto permite detectar las clases de vistas Vue y UI trasladadas. `@source` usa rutas relativas al stylesheet según [Tailwind 4.3, Explicitly registering sources](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources), consultado el 2026-10-18.

No sustituir Tailwind por CSS propio, añadir estilos scoped ni inventar una safelist de todas las clases como compensación del escaneo incorrecto. Verificar en el CSS compilado utilidades representativas presentes únicamente en las vistas/UI de `app`, no solo clases compartidas con Astro.

### `package.json`, formato y demás configuración

Añadir `app` a los scripts de formato:

```json
{
  "format": "prettier --write src app tooling *.mjs *.ts *.json",
  "format:check": "prettier --check src app tooling *.mjs *.ts *.json"
}
```

`eslint .`, `astro check`, `vue-tsc --noEmit` y `verify` pueden conservarse si comprueban ambas raíces con las configuraciones anteriores. No instalar dependencias ni actualizar versiones por un cambio de directorios. El lockfile no debería variar si no cambia la resolución de dependencias; investigar una modificación inesperada.

Conservar `astro.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.env.example`, `.env.local`, `src/env.d.ts` y la configuración de plugins. Revisar que ninguna herramienta ignore `app`. No crear un `tsconfig` o paquete separado sin una necesidad adicional.

## 7. Documentación y trazabilidad

1. Reescribir `src/README.md` como mapa de la parte Astro: páginas, layout, bloques, isla, estilos y vínculo con la aplicación.
2. Crear `app/README.md` con capas, aliases, composición, flujo y límites; conservar la fecha de creación de cualquier guía trasladada y diferenciarla de esta guía nueva.
3. Revisar `app/modules/auth/README.md`: al mover el módulo, sus enlaces relativos deben seguir resolviendo; en particular, `../../README.md` ahora debe llegar a la nueva guía de `app`.
4. Actualizar el README raíz para mostrar ambas carpetas y las nuevas ubicaciones de tests y guía de arquitectura.
5. Revisar enlaces a `src/modules`, `src/shared`, `src/composition`, `src/bootstrap` y `src/ui` en `docs` y bitácoras. Actualizar destinos hacia sus sucesores y añadir nota de continuidad cuando corresponda; conservar fechas originales y conclusiones históricas. Los caminos antiguos pueden permanecer como texto dentro de mapas históricos, etiquetados como tales.
6. Enlazar este plan y el incremento de implementación. No reabrir ni marcar como errónea la etapa 04: se amplía con una separación física nueva solicitada por el usuario.
7. Cerrar la bitácora con resultados realmente ejecutados y distinguir comandos/SSR de la revisión del navegador que corresponde al usuario.

## 8. Comportamiento que debe permanecer igual

Conservar Google popup y persistencia por sesión; GET `/auth/me` al restaurar; POST `/auth/sync` sin cuerpo al entrar; fallback solo por `404 account_not_synced`; renovación única ante 401; tratamiento de 403/503; cancelación; generaciones y descarte de respuestas antiguas; snapshots inmutables sin token; sesión compartida entre consumidores y cleanup al liberar el último.

Conservar SSR inicial determinista y adquisición del runtime solo en cliente. El traslado no introduce cookies/sesiones de servidor, nuevos endpoints, rutas adicionales, otro proveedor o modificaciones de Go. La presentación conserva textos, atributos de accesibilidad y utilidades Tailwind.

## 9. Orden de ejecución y criterios de aceptación

- [x] Registrar estado y copia recuperable; ejecutar línea base; abrir bitácora de implementación.
- [x] Mover los cinco directorios completos a `app`, conservando sus contenidos.
- [x] Actualizar aliases, descubrimiento de tests y scripts de formato.
- [x] Adaptar ESLint a ambas raíces y sus pruebas de límites, sin desactivar reglas.
- [x] Añadir la fuente Tailwind de `app` y comprobar imports de la isla.
- [x] Ejecutar `pnpm verify` y `pnpm format:check`; resolver errores atribuibles al traslado.
- [x] Confirmar que se siguen descubriendo las 23 pruebas de auth/runtime y los 25 casos de límites anteriores, más únicamente los nuevos casos necesarios. Una reducción accidental de tests no cuenta como éxito.
- [x] Inspeccionar build: estado inicial de la isla, ausencia de cuentas de prueba y código exclusivo de servidor en el bundle cliente; CSS con utilidades de `app`.
- [x] Revisar que `src` contenga exclusivamente su parte Astro/entrada y que las cinco carpetas antiguas ya no existan allí; comprobar resolución de rutas sin duplicados.
- [x] Actualizar guías, enlaces y bitácora; comprobar secuencia documental, fechas, enlaces locales y `git diff --check`.
- [x] Dejar Astro disponible en su URL habitual y registrar estado real; la revisión visual y login real permanecen a cargo del usuario.

Si hay servidor activo, reutilizarlo. Tras cambiar la estructura, comprobar su estado/logs por comandos. Solo si precisa reinicio, gestionar la instancia registrada con `astro dev stop` y `astro dev --background`, conforme a `AGENTS.md`; no crear una segunda instancia o cambiar puertos para ocultar un problema de imports. Las peticiones HTTP locales pueden comprobar entrega de HTML/módulos, sin ejecutar una sesión Google ni automatizar navegador.

No abrir, controlar ni inspeccionar un navegador. Al entregar, pedir al usuario el recorrido concreto que quede pendiente: aspecto escritorio/móvil, entrada/cancelación, recarga/restauración y salida; solicitar captura o error solo si hace falta diagnosticar algo.

## 10. Recuperación si algo falla

Mantener la migración como un incremento de movimientos y configuración. Si falla un control, corregir primero el import/patrón que lo provoca; no reescribir la lógica ni debilitar los checks.

Si es necesario deshacer este incremento, usar el inventario y la copia inmediatamente anterior: devolver únicamente los cinco directorios a `src` y recuperar solo las modificaciones de configuración/documentación de esta etapa. No sobrescribir cambios posteriores de otros trabajos, no restaurar todo el repo desde `71fecfa` y no borrar archivos sin seguimiento de forma global. La copia previa es necesaria porque la arquitectura vigente todavía no está representada íntegramente en HEAD.

## 11. Estado de este documento

Plan ejecutado el 2026-10-18. Los detalles de implementación, adaptaciones de configuración y resultados verificados constan en la [bitácora 05](../../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md).
