# 01 — Astro: ejecución, islas y configuración

Fecha de creación: 2026-10-16
Última actualización: 2026-10-16
Estado: Investigación
Tipo de fuente: Transcripciones originales y documentación oficial.
Origen: Astro Full Stack, referencia Fernando Herrera indicada por el usuario; documentación Astro.
Fecha de consulta: 2026-10-16.
Relacionada con: [catálogo](../01-catalogo-cursos-astro-y-ui.md), [configuración previa](../../plans/01-configuracion-antes-de-construir.md), [plan auth](../../plans/auth/01-google-firebase-y-api-go.md).

## Originales consultados y próximos candidatos

Raíz de biblioteca: `/Users/benji/Documents/chrome-extencions/trancripciones`. Las rutas siguientes son relativas a esa raíz. Esta ficha comenzó con pasajes e inventarios. El [incremento auth 01](../../../bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md) reconstruye ya Astro 150 y dos lecciones Vue; su [ficha aplicada](../auth/03-cursos-vue-y-adaptacion-del-acceso.md) enlaza las guías y el código.

| ID | Original y localizador | Evidencia y límite |
| --- | --- | --- |
| F-A1 | [5. Introducción a la sección](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/5. Introducción a la sección.md>), líneas 13–23 | Distingue generación estática y aplicaciones con ejecución de servidor. |
| F-A2 | [47. Client Side Scripting](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 4 Añadir dinamismo a nuestro sitio estático/47. Client Side Scripting.md>), línea 17, buscar «algo tan sencillo» | Explica que un script cliente puede bastar para una interacción pequeña. |
| F-A3 | [51. Astro Islands - Integración con SolidJS](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 4 Añadir dinamismo a nuestro sitio estático/51. Astro Islands - Integración con SolidJS.md>), líneas 15–21 y 39–41 | Muestra integración e hidratación. Su ejemplo es SolidJS; no constituye código Vue/React/Svelte listo para copiar. |
| F-A4 | [150. Firebase Auth - Configuración de proyecto](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 12 Autenticación y protección de rutas/150. Firebase Auth - Configuración de proyecto.md>), líneas 21–29 | Registra una app web e incorpora `firebase/auth`. La línea 23 identifica la versión 10 del momento del curso; no la fija para este proyecto. |
| F-A5 | [157. Google SignIn](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 12 Autenticación y protección de rutas/157. Google SignIn.md>), líneas 13–15 y 29–41 | Habilita Google y presenta un flujo con lógica de servidor Astro. Esa parte requiere adaptación al verificador Go existente. |

Los originales identifican el curso comercial en línea 3, la sección en línea 5 y la clase Udemy en línea 7; el nombre local es `Astro Full Stack`. La atribución principal a Fernando Herrera procede de la selección del usuario, corroborada por su presentación del propio nombre en el original `Sección 10 Astro DB/121. Turso - Una base de datos para desarrolladores.md`, línea 33.

## Documentación oficial consultada

| ID | Fuente y sección | Evidencia |
| --- | --- | --- |
| F-OA1 | [Front-end frameworks](https://docs.astro.build/en/guides/framework-components/), «Official front-end framework integrations» y «Hydrating interactive components» | React, Vue y Svelte tienen integraciones oficiales. Los componentes requieren hidratación para interacción; un script Astro también puede ejecutar JavaScript cliente. |
| F-OA2 | [Using environment variables](https://docs.astro.build/en/guides/environment-variables/), «Vite’s built-in support» y «Setting environment variables» | `PUBLIC_` expone valores al cliente; se sustituyen durante la construcción. |
| F-OA3 | [Data fetching](https://docs.astro.build/en/guides/data-fetching/), «fetch() in Astro» | En una página estática, el fetch del frontmatter ocurre al construir. Para datos cambiantes por usuario se necesita ejecución cliente o renderizado por petición. |
| F-OA4 | [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), «Server adapters» | Renderizar Astro por petición requiere un adaptador para el destino de despliegue. |

Consulta oficial: 2026-10-16. El proyecto tiene Astro 7.3.3 instalado; se verificará compatibilidad de cada integración antes de añadirla. Las recetas del curso pueden corresponder a APIs y modos antiguos.

## Interpretación y adaptación propuesta

El frontend puede empezar sirviendo un contenedor público y consultar la API autenticada desde el navegador. Así, el HTML construido no contiene información privada y las respuestas siguen pasando por Go. Esta elección responde al [contrato actual](../auth/01-contrato-real-api-go.md), no implica que todo dashboard deba usar ese modelo. [F-A1, F-OA3]

El curso muestra que una interacción pequeña puede resolverse con un script cliente y que las islas permiten incorporar un framework. [F-A2, F-A3, F-OA1] La decisión vigente del usuario es **priorizar Vue para casi toda la UI**, también para auth. Se consultarán ambos cursos Vue; React será el segundo apoyo, Svelte excepcional y otros cursos el cuarto recurso. Usar otra integración requiere una ventaja concreta documentada conforme a la [filosofía de trabajo](../../plans/02-filosofia-vue-y-prioridad-de-fuentes.md). Esa prioridad es una decisión del proyecto, no una instrucción atribuida al curso Astro.

No cargar el SDK web de auth al construir una página para intentar recuperar la sesión del navegador. Si más adelante se exige HTML privado entregado por el servidor, habrá que diseñar sesión/cookies, su validación y el despliegue correspondiente. Un redirect visual cliente no convierte el documento estático en privado. [F-OA3, F-OA4]

## Reconstrucciones futuras

El inventario verificó también las clases 8–10 y 14 de la sección 2; 52–53 de la sección 4; 106–107 de la sección 9; 153, 158–159 de la sección 12. Son candidatas, no una lista obligatoria. Se leerá cada original completo y el mínimo contexto previo antes de decidir si reconstruirlo. Las clases 150 y 157 serán candidatas directas para la configuración/auth; su código final fiel quedará separado de la adaptación API-first.
