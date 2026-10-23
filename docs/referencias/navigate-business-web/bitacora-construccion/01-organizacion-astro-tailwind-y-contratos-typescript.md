# 01 — Organización Astro, Tailwind y contratos TypeScript

Fecha de creación: 2026-10-17
Última actualización: 2026-10-18
Estado: Implementado, pendiente de verificación visual y funcional por el usuario.
Ámbito: frontend Astro + Vue, sin cambios del contrato Go.
Relacionada con: [plan anterior](../docs/plans/03-organizacion-astro-estilos-y-reconstruccion-vue.md), [acceso inicial](auth/01-acceso-google-vue-y-cuenta-go.md).
Revisión de partida: `71fecfaff3cd7e207036b105de4b4e53d66733f6`. Respaldo API: `4b9d0e9d22050e5533294d19366b2d99a2d961b4`.


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](auth/04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](auth/05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Necesidad y alcance

Aplicar el plan diferido: layout tipado, responsabilidades visuales separadas y código comprensible. La instrucción del 2026-10-17 sustituye la adopción opcional/gradual de Tailwind por utilidades para todos los estilos propios, incluidos los de Vue. Se conserva el flujo auth actual y el diseño como objetivo de la migración.

Se consultan los dos cursos Vue y se reutilizan las guías 31 y 209. Se amplían props, composables y ciclo de vida; la adaptación de contratos se fundamenta además en los originales Node/TypeScript y arquitectura indicados por el usuario. La ficha de fuentes se completará con los pasajes y símbolos efectivamente aplicados.

## Comprobación de partida

`pnpm check`, `pnpm test` (18 pruebas) y `pnpm build`: correctos antes de modificar la aplicación. Ambos repositorios quedaron guardados localmente por separado, sin publicar ni crear tags. El respaldo API conserva incluso sus cambios de texto/espacios preexistentes; este incremento no los corrige.

La comprobación visual y funcional en navegador corresponde al usuario según [no-usar-navegador](</Users/benji/.agents/skills/no-usar-navegador/SKILL.md>). Las comprobaciones finales por comandos y la revisión manual pendiente se registrarán por separado.

## Evidencia, decisión y adaptación

La [ficha Vue](../docs/fonts/auth/04-recorrido-vue-y-organizacion-del-acceso.md) relaciona originales y guías R1–R5 con props, composables, transporte y ciclo de vida. La [ficha TypeScript](../docs/fonts/arquitectura/01-contratos-y-responsabilidades-typescript.md) registra los pasajes SOLID/Node y la decisión de mantener contratos pequeños en una feature, sin multiplicar capas sin uso.

| Necesidad → fuente | Decisión y alternativa | Código aplicado |
| --- | --- | --- |
| Documento común → Astro 14, líneas 13–33; guía 14, fases 1–3 | Layout con Props y slot; metadatos configurables. Evitar repetir html/head/body en cada página. | [MainLayout.astro](../src/layouts/MainLayout.astro), Props; [index.astro](../src/pages/index.astro). |
| Presentación separada → Astro 13, líneas 13–27; guía 13, fases 1–3 | Cabecera e introducción separadas; SVG aislado para leer la portada. El footer breve permanece en el layout. | [SiteHeader](../src/components/layout/SiteHeader.astro), [AccessIntroduction](../src/components/home/AccessIntroduction.astro), [PerspectiveArt](../src/components/home/PerspectiveArt.astro). |
| Estilos compartidos → Astro 15, líneas 35–39; guía 15, fase 5 | Importar una única entrada desde el layout. La elección de utilidades Tailwind y el diseño son nuestros; no se copian adjuntos ausentes del curso. | [global.css](../src/styles/global.css), tema e importación; Astro/Vue sin selectores CSS propios ni style scoped. |
| Entrada tipada → Vue F1/R1 | Extraer el botón repetido con label/disabled/google. El padre conserva sus acciones; no duplicar sus estados de login. | [AuthButton](../app/ui/components/ActionButton.vue), Props; [AuthSurface](../app/modules/auth/presentation/views/AuthSurface.vue). |
| Contratos independientes → fuentes de arquitectura F-A3/F-A5/F-A7 | Definir SessionPort/AccountGateway y recibirlos en los colaboradores. Mantener composición pequeña en useAuth. | [contracts.ts](../app/modules/auth/domain/ports/outbound/session.port.ts), [resolveAccount](../app/modules/auth/application/use-cases/load-account.use-case.ts), [createFirebaseSession](../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts). |
| Estado y errores → Vue F2/R2, F4/R4, F5/R5; responsabilidad única F-A2 | Mantener estado/cancelación en el composable; separar mensajes y lectura/validación de respuesta. | [useAuth](../app/modules/auth/presentation/composables/use-auth.ts), [auth-errors.ts](../app/modules/auth/presentation/presenters/auth-failure.presenter.ts), [account-api.ts](../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts). |

Originales Astro y sus guías: [13](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/13. Reutilización de componentes.md>) / [R13](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/13. Reutilización de componentes - Reconstrucción guiada.md>), [14](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/14. Layouts y Props.md>) / [R14](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/14. Layouts y Props - Reconstrucción guiada.md>), [15](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/15. Estilos por componente y globales.md>) / [R15](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/15. Estilos por componente y globales - Reconstrucción guiada.md>). Curso local Astro Full Stack, Fernando Herrera según la atribución documentada en las fuentes anteriores. Las guías son evidencia derivada, no sustituyen los originales.

## Tailwind y conservación del diseño

La integración usa el plugin Vite de Tailwind ya instalado y la entrada CSS importada por MainLayout, conforme a [Astro: Add Tailwind 4](https://docs.astro.build/en/guides/styling/#add-tailwind-4). El tema centraliza fuentes, colores realmente compartidos y sombra, según [Theme variables](https://tailwindcss.com/docs/theme). Consulta oficial: 2026-10-17; dependencias del proyecto Tailwind 4.3.3, Astro 7.3.3, sin cambios de versiones en este incremento.

Se limitaron las fuentes de detección a src con source('../'), conforme a [Setting your base path](https://tailwindcss.com/docs/detecting-classes-in-source-files#setting-your-base-path), para que los ejemplos de docs/skills no generen utilidades ajenas a la página. Las clases condicionales se escriben completas.

Se trasladaron medidas, colores, estados deshabilitados/hover, foco visible, spinner y variantes de movimiento reducido. [Preflight](https://tailwindcss.com/docs/preflight) elimina márgenes y estilos nativos: se explicitaron los márgenes de correo/dl y las listas de diagnóstico, así como el tamaño/peso de títulos. Se conservan Google Fonts como enlaces del head; las formas y colores SVG son atributos de la ilustración. No hay CSS de presentación escrito fuera de Tailwind, @apply ni nuevas hojas de estilos. La equivalencia visual sigue pendiente de la revisión del usuario.

## Flujo conservado y lectura del TypeScript

AuthSurface monta useAuth; este compone los adaptadores Firebase/HTTP y obtiene la cuenta mediante resolveAccount. Login explícito usa sync; restauración usa current y solo el error 404 account_not_synced permite sync. El transporte conserva el token actual, la renovación única ante 401, validación UUID/status, no-store, timeout y cancelación. La generación de sesión sigue descartando respuestas tardías. describeAuthFailure traduce fallos sin realizar operaciones externas.

Los contratos no importan Vue ni Firebase. La cuenta es de solo lectura en tipos y se reemplaza al recibir una respuesta; no se congela el runtime ni se introduce un historial. Las políticas son adaptaciones del proyecto, no mecanismos que se atribuyan a un ejemplo del curso. No se añade una segunda sesión, un router SPA, un store global ni persistencia local de tokens.

## Comprobación final por comandos

| Comprobación ejecutada | Resultado |
| --- | --- |
| pnpm check | 0 errores, 0 advertencias, 0 hints Astro; vue-tsc correcto. |
| pnpm test | Las 18 pruebas existentes pasaron; el test solo actualiza el import de SessionPort/SessionUser. |
| pnpm build | Sitio estático compilado correctamente. |
| Resolución de clases con el compilador Tailwind instalado | 280 utilidades de los templates/clases condicionales reconocidas; ninguna sin CSS generable. No se usa navegador. |
| Formato de los TS/Vue/CSS modificados | Prettier ya disponible en caché, sin instalar dependencias ni modificar package/lockfile. |
| Guías Vue nuevas | Tres renderizadas, leídas, verificadas e instaladas junto a sus originales; cero sobrescrituras. |
| Documentación | 16 Markdown, 365 enlaces locales resueltos y fences balanceados; secuencias por carpeta sin colisiones. |
| git diff --check | Sin errores en el incremento web. La API permanece limpia después de su respaldo. |
| Servidor local | El puerto 4321 no respondía y no había registro Astro activo; se inició Astro en segundo plano con host 127.0.0.1 y puerto 4321. Status confirmó el proceso y una petición HTTP sin identidad devolvió 200. |

Pendiente del usuario: revisar escritorio y pantalla compacta, foco por teclado, entrada Google/cancelación, recarga de sesión y salida; compartir captura o error concreto si hay diferencias. No se realizaron capturas, inspecciones DOM ni automatización de navegador. Los comandos y el HTTP 200 no prueban el login real ni la presentación autenticada. No se detuvieron procesos del usuario ni se alteró la API después de su respaldo.
