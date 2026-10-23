# 02 — Filosofía de trabajo: Vue primero y prioridad de fuentes

Fecha de creación: 2026-10-16
Última actualización: 2026-10-16
Estado: Decisión de trabajo vigente; implementación pendiente.
Ámbito: Desarrollo y arquitectura del frontend `navigate-business-web`.
Origen de la decisión: Instrucción expresa del usuario en este chat, 2026-10-16.
Relacionada con: [configuración inicial](01-configuracion-antes-de-construir.md), [plan auth](auth/01-google-firebase-y-api-go.md), [catálogo de cursos](../fonts/01-catalogo-cursos-astro-y-ui.md), [guía documental](../01-guia-documental-y-orden-de-trabajo.md).
Revisión de referencia: frontend `e52268ae9daa83ea820c3d65cbd5783968c083e8`; esta decisión documenta la dirección del trabajo, no una integración ya instalada.

## Objetivo y regla principal

Utilizar Vue.js para casi todo el desarrollo interactivo del frontend, y para todo lo que permita resolver adecuadamente la necesidad. Vue es tanto la primera opción de implementación como la primera fuente de consulta. Astro permanece como base del sitio; su curso se consulta para sus mecanismos propios. Esta elección sustituye la selección abierta entre Vue, React y Svelte de la preparación documental inicial.

La prioridad se aplica a componentes, estado, formularios, autenticación del cliente, consumo HTTP, pruebas, organización y arquitectura frontend. Es una preferencia del usuario, no una afirmación de superioridad universal de un framework.

## Orden de consulta e implementación

| Prioridad | Fuentes | Cómo utilizarlas |
| --- | --- | --- |
| 1 — Vue.js | **Vue con Pinia y Testing** y **Vue 3 con TypeScript y Quasar**, F-C03 y F-C02 del catálogo | Ambos cursos son referencias principales y complementarias. Buscar en ambos y combinar las lecciones pertinentes, sin imponer una jerarquía fija entre ellos ni exigir leer clases que no aporten al problema. Implementar normalmente en Vue. |
| 2 — React | Todos los cursos React del catálogo, F-C05 a F-C10, y otras fuentes React locales pertinentes que se localicen | Consultar cuando los dos cursos Vue no cubran suficientemente el mecanismo, cuando haga falta contraste o cuando una solución React pueda aportar una ventaja concreta. Procurar trasladar el principio a Vue. Usar un componente React solo si esa ventaja justifica introducirlo. |
| 3 — Svelte | SvelteKit Full Stack, F-C04, y fuentes Svelte pertinentes | Uso excepcional y muy minoritario. Considerarlo para un problema específico con una ventaja demostrable frente a las alternativas Vue y React; adaptar el conocimiento a Vue cuando sea suficiente. |
| 4 — Otros cursos | Biblioteca local de frontend, arquitectura y temas relacionados | Ampliar la consulta cuando los niveles anteriores dejen una necesidad sin resolver o una comparación requiera otra perspectiva. El catálogo inicial es un punto de entrada, no una lista cerrada que excluya cursos pertinentes. |

Los nombres y rutas verificadas de los cursos se conservan en el [catálogo](../fonts/01-catalogo-cursos-astro-y-ui.md). Su disponibilidad no implica que todas sus clases sean necesarias para cada incremento.

## Cómo resolver vacíos y excepciones

Que un tema no figure en los cursos Vue no demuestra que Vue no pueda resolverlo. Primero delimitar qué falta: explicación, patrón, ejemplo, biblioteca o capacidad técnica. Consultar React en segundo lugar para recuperar ese mecanismo y valorar su adaptación al frontend Vue.

Consultar un curso React, Svelte u otro no selecciona automáticamente su framework, gestor de estado, router, proveedor auth o backend. Los ejemplos de otro ecosistema se analizarán por sus responsabilidades y contratos; la implementación sigue priorizando Vue.

Si conviene implementar una excepción con React o Svelte, registrar en el plan del incremento: problema concreto, solución Vue evaluada, evidencia y ventaja de la alternativa, alcance del componente, coste de dependencias/mantenimiento y cómo comparte datos o sesión. Una preferencia personal o la mayor cantidad de material React no bastan por sí solas para desplazar Vue. No instalar varios runtimes como preparación especulativa.

Los dos cursos Vue aportan referencias complementarias, pero no seleccionan automáticamente Pinia, TanStack Query, Axios o Quasar. Cada dependencia se incorpora cuando el incremento la requiera y se pueda comprobar su utilidad.

## Astro, documentación oficial y secuencia de construcción

Astro, Firebase y el contrato Go mantienen sus responsabilidades documentadas. Consultar directamente la fuente oficial de la herramienta cuando haga falta verificar compatibilidad, configuración o APIs vigentes; esta verificación acompaña a cualquier nivel de cursos y no espera a agotar cuatro niveles.

Mantener el orden acordado: configurar y comprobar los cimientos; seleccionar y reconstruir las lecciones pertinentes; implementar un incremento pequeño; verificarlo y explicarlo antes de ampliar. Usar `construir-con-evidencia` y `reconstruir-codigo-curso`, conservando original, procedencia y adaptación por separado. No hay un límite artificial de lecciones cuando todas sean pertinentes.

## Reconstrucción sin límite arbitrario de lecciones

Por instrucción expresa del usuario, se puede repetir `reconstruir-codigo-curso` **tantas veces como requiera comprender y fundamentar el incremento**, sin imponer un máximo de lecciones, guías o cursos consultados. Puede abarcar todas las lecciones pertinentes de una sección o un curso si el mecanismo lo requiere, manteniendo la prioridad Vue → React → Svelte → otros cursos.

Cada ejecución trabaja una única lección original y conserva su guía independiente junto a la transcripción, con código final completo, fases y procedencia verificable. La regla de una lección por guía no limita la cantidad total de reconstrucciones. Reutilizar guías existentes cuando sean suficientes y fieles; reconstruir las adicionales necesarias sin detenerse por un cupo prefijado.

La selección depende de la evidencia que haga falta: recuperar contratos, seguir cambios, comprender código o resolver incertidumbres. Mantener los límites de fidelidad de la skill; no reconstruir material irrelevante ni inventar evidencia ausente. Las adaptaciones al proyecto se documentan por separado.

## Comprobación y continuidad

La documentación relacionada debe identificar Vue como elección vigente y conservar React, Svelte y otros cursos en ese orden. Los próximos planes e incrementos partirán de esta decisión sin volver a pedir una elección ya resuelta. Las excepciones se fundamentarán en el problema real y quedarán registradas en su incremento.

Esta actualización solo fija la filosofía y las prioridades. No instala Vue ni otros frameworks, no reconstruye lecciones ni modifica el contrato auth o el backend.
