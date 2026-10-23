# Navigate · Frontend

Interfaz de acceso de la plataforma de análisis de inversiones, construida con Astro y Vue 3. Esta primera etapa incluye Google mediante Firebase, sincronización/restauración de la cuenta Go y salida local. No implementa todavía dashboard, listas ni análisis.

## Ejecutar en local

1. Instalar dependencias con `pnpm install` (Node 22.13+ o 24+).
2. Copiar `.env.example` a `.env.local` y completar la configuración **pública** de la app web Firebase del mismo proyecto que verifica Go. El archivo local está ignorado por Git.
3. Comprobar que Google esté habilitado y el dominio local autorizado en Firebase.
4. Iniciar Go desde su carpeta: `HTTP_ADDR=127.0.0.1:8081 go run ./cmd/api`. El puerto 8080 está ocupado por otra aplicación local; la URL candidata de este entorno es `http://127.0.0.1:8081/api/v1`.
5. Iniciar Astro en segundo plano: `pnpm astro dev --background --host 127.0.0.1 --port 4321`.

Abrir [acceso local](http://127.0.0.1:4321/). Gestionar Astro con `pnpm astro dev status`, `pnpm astro dev logs` y `pnpm astro dev stop`. Si cambia la configuración pública, reiniciar/reconstruir para que el cliente reciba los valores nuevos. No incluir ADC, credenciales Admin, contraseña SQL ni tokens en variables públicas.

Si Astro indica `Another astro dev server is already running`, abrir la URL existente en vez de iniciar otra instancia. Para reiniciar tras mover archivos o cambiar la configuración:

```bash
pnpm astro dev stop
pnpm astro dev --background --host 127.0.0.1 --port 4321
pnpm astro dev status
```

Sin configuración Firebase completa, la vista muestra que el acceso está en preparación y deshabilita Google. No se muestran instrucciones de `.env.local` ni listas de campos ausentes en la interfaz, tampoco en desarrollo. No hay modo de cuenta ficticia ni acceso privado por omitir configuración. La API puede estar disponible sin que el proveedor Google esté listo.

## Verificar

```bash
pnpm verify
pnpm format:check
```

Las pruebas comprueban contrato HTTP y transiciones con dobles de sesión/red; no sustituyen el recorrido con Google y Go reales. Las pruebas de auth viven en [`app/modules/auth/tests/`](app/modules/auth/tests/) y las de límites de capas en [`tooling/architecture.test.mjs`](tooling/architecture.test.mjs). `verify` ejecuta ESLint, tipos, pruebas y build; los comandos individuales siguen disponibles.

## Documentación y fuentes

- [Guía documental](docs/01-guia-documental-y-orden-de-trabajo.md).
- [Filosofía: Vue primero](docs/plans/02-filosofia-vue-y-prioridad-de-fuentes.md).
- [Incremento de acceso y verificaciones](bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md).
- [Fuentes, reconstrucciones y adaptación](docs/fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md).
- [Organización Astro y Tailwind](bitacora-construccion/01-organizacion-astro-tailwind-y-contratos-typescript.md).
- [Recorrido Vue ampliado](docs/fonts/auth/04-recorrido-vue-y-organizacion-del-acceso.md).
- [Contratos TypeScript y criterio arquitectónico](docs/fonts/arquitectura/01-contratos-y-responsabilidades-typescript.md).
- [Separación de componentes y directorios de auth](bitacora-construccion/auth/02-componentes-y-directorios-del-acceso.md).
- [Retirada de ayuda local y recuperación del servidor](bitacora-construccion/auth/03-retirar-ayuda-local-y-recuperar-servidor.md).
- [Migración Clean e islas independientes](bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md).
- [Separación física entre `src` (Astro) y `app` (arquitectura)](bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md).

## Cómo leer auth

El proyecto separa físicamente dos raíces internas: [`src/`](src/README.md) para el árbol convencional de Astro y [`app/`](app/README.md) para la arquitectura Clean de módulos, kernel compartido, composición, bootstrap y UI reutilizable.

Empezar en [`src/pages/index.astro`](src/pages/index.astro): compone el layout común, la introducción y la isla de acceso. [`src/styles/global.css`](src/styles/global.css) contiene la entrada/tema de Tailwind 4 y registra `@source '../../app'`; los estilos de presentación están en las utilidades de Astro/Vue.

El recorrido actual es página → [AuthIsland](src/islands/AuthIsland.vue) → composición cliente en `app/composition` → vista/composable → controlador → casos de uso → puertos → adaptadores Firebase/HTTP. La isla adquiere una sesión compartida en cliente y entrega el controlador dentro de Vue; Astro no intenta serializar funciones.

- [Mapa de Astro (`src/`)](src/README.md): páginas, layout, componentes estáticos, islas y estilos.
- [Mapa de la arquitectura (`app/`)](app/README.md): capas, aliases, composición, configuración y límites entre `src` y `app`.
- [Guía de auth](app/modules/auth/README.md): flujo, responsabilidades y consumo desde otra isla o TypeScript.
- [Plan de migración Clean](docs/plans/04-arquitectura-completa-modulos-e-islas.md), [fuentes](docs/fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md) y [bitácora 04](bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md).
- [Plan de separación `src`/`app`](docs/plans/05-separar-src-astro-y-app-arquitectura.md) y [bitácora 05](bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md).

`app/shared` conserva las herramientas de la plantilla: Result, familias de fallos, AsyncState, tipos y utilidades; el transporte HTTP mantiene la cancelación y el plazo de espera del acceso. ESLint comprueba dependencias con rutas relativas y aliases en TS, Vue y Astro sobre ambas raíces.

La comprobación del navegador la realiza el usuario. Las pruebas con dobles y la compilación no certifican por sí solas el aspecto ni el acceso con una identidad Google real.

## Historial heredado de la base

El siguiente registro se conserva como antecedente del repositorio. Los nombres anteriores de formularios no describen el alcance actual y esta implementación no crea commits ni tags.

### Registro anterior
- v1.0.0: Configuración inicial.
- v1.1.0: Nueva característica simple en el frontend.
- v1.1.1: Corrección de detalles menores.
- v2.0.0: Agregada carpeta de prueba.
- v2.1.0: Eliminada carpeta de prueba en main.
- v2.1.1: Corrección de errores pequeños y ajustes de estilos.
- v2.1.2: Ajustes y corrección de errores finales.
- v2.1.3: Nueva versión guardada con su commit respectivo.
