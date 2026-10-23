# 03 — Retirar ayuda local y recuperar el servidor de desarrollo

Fecha de creación: 2026-10-17
Última actualización: 2026-10-18
Estado: Implementado y verificado por comandos; revisión visual del usuario pendiente.
Ámbito: Presentación de auth y ejecución local de Astro.
Relacionada con: [separación anterior](02-componentes-y-directorios-del-acceso.md), [ejecución local](../../README.md#ejecutar-en-local).
Revisión de partida: `71fecfaff3cd7e207036b105de4b4e53d66733f6`, más los cambios locales preexistentes de las etapas anteriores.


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Necesidad, evidencia y decisión

El usuario pide eliminar la ayuda «Configurar acceso local» y comunica que Astro rechaza iniciar otro servidor.

- **Evidencia del código previo:** `AuthSurface` mostraba `AuthConfigHelp` solo con `import.meta.env.DEV && !authConfig.ok`. La ayuda no se renderizaba en producción; no era una condición que se eliminara tras un plazo de tiempo.
- **Decisión del usuario:** retirar completamente esa ayuda, incluido componente, import y condición. Se conserva la validación de configuración del composable: sin configuración válida no se inicializa Firebase ni se habilita el acceso. El mensaje público de preparación permanece.
- **Evidencia de ejecución:** `pnpm astro dev status` informó un servidor en segundo plano en `127.0.0.1:4321`. Los logs registraron imports fallidos durante el traslado de archivos; una petición HTTP actual devolvió 500 aunque los archivos ya existían en las rutas nuevas.
- **Interpretación:** el mensaje «Another astro dev server is already running» evita iniciar una segunda instancia; es distinto del HTTP 500 de la instancia existente. Se propone reiniciar la instancia local y comprobar la página y sus módulos, sin volver a mover archivos ni usar `--force`.

Esta corrección se fundamenta en el código actual y las comprobaciones del servidor, no en una nueva lección de curso. No modifica los mecanismos de props, composable o sesión respaldados por las recetas anteriores.

## Implementación y comprobaciones

Se eliminó `components/development/AuthConfigHelp.vue` y su import, condición y uso en [AuthSurface.vue](../../app/modules/auth/presentation/views/AuthSurface.vue). La superficie ya no depende directamente de la configuración; [useAuth](../../app/modules/auth/presentation/composables/use-auth.ts) conserva esa responsabilidad. El [README](../../README.md#ejecutar-en-local) explica cómo reutilizar y reiniciar el servidor existente. Se conserva la descripción histórica de la ayuda en la entrada 02, con enlace a esta retirada.

Se detuvo únicamente la instancia Astro registrada del proyecto y se inició otra en segundo plano en la misma URL, sin `--force` ni cambiar puertos. El reinicio solucionó el HTTP 500 sin modificar las rutas nuevas, lo que es compatible con un estado obsoleto del servidor tras el traslado.

| Comprobación realmente ejecutada | Resultado |
| --- | --- |
| `pnpm astro dev stop` → `pnpm astro dev --background --host 127.0.0.1 --port 4321` → `pnpm astro dev status` | Instancia anterior detenida; nueva instancia activa en la misma URL. |
| Peticiones HTTP con Python a `/` y al grafo de imports internos de auth | Página y 13 módulos devolvieron 200. El HTML no contiene «Configurar acceso local» ni `.env.local`; los módulos no contienen `AuthConfigHelp`. |
| `pnpm astro dev logs` después del reinicio y las peticiones | Inicio correcto y respuestas 200, sin errores en los logs de la nueva instancia en esa comprobación. |
| `pnpm check` | 0 errores, 0 advertencias, 0 hints de Astro; Vue/TypeScript correcto. |
| `pnpm test` | 18 pruebas existentes correctas; sin suite nueva. |
| `pnpm build` | Compilación estática correcta, una página generada. |
| Inspección del HTML y JavaScript de `dist/` | Ausentes «Configurar acceso local», `AuthConfigHelp` y `.env.local`. La página de desarrollo siguió respondiendo 200 después del build. |
| Documentación | 18 Markdown, 407 enlaces locales existentes y fences balanceados. |
| `git diff --check` | Correcto. |

No se abrió ni automatizó un navegador. Las peticiones HTTP comprueban la entrega de HTML/módulos, no su ejecución cliente ni un login Google real. Queda al usuario recargar `http://127.0.0.1:4321/` y comprobar su recorrido habitual. Las advertencias antiguas de Firebase/IndexedDB no se reinterpretan como errores de imports ni se alteran sus políticas de persistencia.
