# 02 — Plantilla Clean y adaptación a Astro

Fecha de creación: 2026-10-18
Tipo de fuente: Código local y documentación oficial.
Fecha de consulta: 2026-10-18
Relacionada con: [fundamentos previos](01-contratos-y-responsabilidades-typescript.md), [plan](../../plans/04-arquitectura-completa-modulos-e-islas.md), [implementación](../../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md).

Referencias Git consultadas: plantilla `31c0d37`, Next.js `bdfaf31`, además de sus árboles locales existentes. Las referencias se usaron en lectura; no se editaron. Proyecto objetivo: Astro 7.3.3, Vue 3.5.44, TypeScript 6.0.3 y Firebase 13.0.0.

## Evidencia verificable

| Fuente | Localizador consultado y evidencia | Interpretación y adaptación |
| --- | --- | --- |
| F1: [template-clean-architecture](</Users/benji/Documents/PROYECTO1/template-clean-architecture/README.md>) | `DDD-RESOURCE-MAPA.md`; `src/composition/resource/create-resource-module.ts`, `createResourceModule`; `src/modules/resource/{domain,application,infrastructure,presentation}`; `src/shared/{result,failures,types,http}`; `src/bootstrap/{client,server}.ts`; `eslint.config.mjs` y `tsconfig.json`. | Modelo principal indicado por el usuario. Factories explícitas, puertos, DTOs, mappers y controlador neutral; shared ofrece Result, cuatro familias de fallos y AsyncState. Se conserva el mecanismo completo y se adapta la integración de React/Next a Vue/Astro. |
| F2: [nextjs-clean-architecture](</Users/benji/Documents/PROYECTO1/nextjs-clean-architecture/README.md>) | `di/container.ts`, `di/modules/todos.module.ts`, `.eslintrc.json`; separación de controllers, use cases, interfaces e infraestructura. | Confirma composición externa y límites de dependencia. No se añade su contenedor IoC: F1 resuelve la misma necesidad mediante factories tipadas. |
| F3: [Astro, framework components](https://docs.astro.build/en/guides/framework-components/) | “Passing props to framework components”, hidratación y componentes anidados. | Un controlador con métodos no es una prop serializable de Astro a la isla. La isla crea/adquiere dependencias en cliente y las pasa dentro del árbol Vue. |
| F4: [Astro, scripts](https://docs.astro.build/en/guides/client-side-scripts/) | Importación de scripts locales y procesamiento TypeScript. | El núcleo no requiere Vue; otro punto de entrada puede consumirlo desde un script Astro procesado. No se necesita otra página ni duplicar auth para demostrarlo. |
| F5: [typescript-eslint](https://typescript-eslint.io/users/configs/), [Vue ESLint](https://eslint.vuejs.org/user-guide/), [Astro ESLint](https://github.com/ota-meshi/eslint-plugin-astro) | Configuración plana recomendada y parsers para TypeScript, Vue SFC y Astro. | Adaptar los parsers al formato real. Comprobar restricciones con imports válidos y prohibidos, incluidos relativos y aliases. |

## Límites y decisiones propias

F1 es código de referencia, no una demostración de que su UI esté terminada: su vista es un placeholder. Su helper HTTP elige señal externa **o** timeout y termina el temporizador antes de leer el cuerpo. La adaptación conserva ambos límites combinados y cubre también la obtención del token y la lectura del cuerpo. El mapper de auth sigue validando UUID y estado `active`; no se copia la generación de identificadores de ejemplo de Resource.

El runtime cliente compartido con consumidores contados, la protección de SSR y la regla ESLint que resuelve rutas son propuestas propias necesarias para Astro. No se atribuyen a los cursos ni a la plantilla. La configuración server se mantiene fuera del grafo cliente; al ser una página estática con auth cliente, no se inventan credenciales privadas ni sesiones de servidor.

Las fuentes de cursos y reconstrucciones de la etapa anterior siguen documentadas en [contratos y responsabilidades](01-contratos-y-responsabilidades-typescript.md) y [recorrido Vue](../auth/04-recorrido-vue-y-organizacion-del-acceso.md). Esta migración se basa directamente en los dos repositorios solicitados; no se presenta como una nueva reconstrucción de lecciones.
