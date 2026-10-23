# 01 — Catálogo de cursos para Astro y componentes de UI

Fecha de creación: 2026-10-16
Última actualización: 2026-10-16
Estado: Investigación; Vue seleccionado como referencia principal de UI.
Tipo de fuente: Inventario de transcripciones originales y metadatos locales.
Origen: Biblioteca personal de cursos.
Fecha de consulta: 2026-10-16, America/New_York.
Relacionada con: [guía documental](../01-guia-documental-y-orden-de-trabajo.md), [Astro e islas](astro/01-renderizado-islas-y-configuracion.md), [contrato Go](auth/01-contrato-real-api-go.md), [plan de configuración](../plans/01-configuracion-antes-de-construir.md).

## Alcance y criterio de evidencia

Biblioteca: `/Users/benji/Documents/chrome-extencions/trancripciones`. Se inventariaron los directorios Astro, Vue, Svelte y React, y se ejecutó el buscador de la skill con consultas sobre auth, HTTP e islas para cada tecnología. Se localizaron diez cursos: uno de Astro, dos de Vue, uno de Svelte y seis de React.

Los recuentos son archivos locales considerados originales, excluyendo `00.*` y las reconstrucciones guiadas. Incluyen el material [LEGACY] que ya exista, señalado cuando corresponde. No prueban que esté completo el curso publicado ni que se hayan leído todas sus clases. Los nombres de carpeta son etiquetas locales: el campo `Curso` del original puede ser un subtítulo comercial. La extracción en 2026 no es fecha de grabación.

Se verificaron los metadatos de los originales enlazados en cada ficha, líneas 3 (curso), 5 (sección), 7 (Udemy) y 9 (extracción). Los temas siguientes son orientación por inventario; las decisiones de implementación requerirán lectura de pasajes concretos. La ficha [Astro](astro/01-renderizado-islas-y-configuracion.md) conserva los pasajes técnicos ya consultados.

## Cursos disponibles

| ID | Tecnología | Curso y directorio | Originales locales |
| --- | --- | --- | --- |
| F-C01 | Astro | [Astro Full Stack](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack>) | 222 |
| F-C02 | Vue | [Vue 3 con TypeScript y Quasar](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar>) | 113 |
| F-C03 | Vue | [Vue con Pinia y Testing](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing>) | 272 |
| F-C04 | Svelte | [SvelteKit Full Stack](</Users/benji/Documents/chrome-extencions/trancripciones/Svelte/SvelteKit Full Stack>) | 180 |
| F-C05 | React | [Estado Global con Zustand](</Users/benji/Documents/chrome-extencions/trancripciones/React/Estado Global con Zustand>) | 59 |
| F-C06 | React | [React Componentes y Storybook](</Users/benji/Documents/chrome-extencions/trancripciones/React/React Componentes y Storybook>) | 191 |
| F-C07 | React | [React Hooks](</Users/benji/Documents/chrome-extencions/trancripciones/React/React Hooks>) | 25 |
| F-C08 | React | [React OpenAI con NestJS](</Users/benji/Documents/chrome-extencions/trancripciones/React/React OpenAI con NestJS>) | 89 |
| F-C09 | React | [React y MERN](</Users/benji/Documents/chrome-extencions/trancripciones/React/React y MERN>) | 337 |
| F-C10 | React | [React y Socket.io](</Users/benji/Documents/chrome-extencions/trancripciones/React/React y Socket.io>) | 119 |

Astro Full Stack conserva la referencia para los mecanismos de Astro. Por decisión del usuario, **Vue es la primera opción para implementar y consultar**, con **Vue con Pinia y Testing** y **Vue 3 con TypeScript y Quasar** como referencias principales y complementarias. Después se consultan React, Svelte de forma excepcional y otros cursos, según la [filosofía vigente](../plans/02-filosofia-vue-y-prioridad-de-fuentes.md). El orden de filas e identificadores de esta tabla sirve para localizar fuentes; no expresa su prioridad.

Ningún curso pertinente queda excluido por no aparecer en el catálogo inicial: la biblioteca puede ampliarse para desarrollo o arquitectura respetando ese orden. Consultar una fuente no adopta automáticamente sus dependencias, auth ni backend. Los instructores de los cursos complementarios no se atribuyen por semejanza con otros cursos: sus metadatos consultados no incluyen ese campo.

## Fichas de localización

### F-C01 — Astro Full Stack

- Directorio relativo a la biblioteca: `Astro/Astro Full Stack/`.
- Curso publicado según metadatos: Actions, Astro DB, Turso, SSG, SSR, Hybrid, Markdown, MDX, File Uploads, Integraciones, SEO, RSS, REST y más.
- Original verificado: [5. Introducción a la sección.md](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/5. Introducción a la sección.md>).
- Sección del original: `Sección 2 Introducción a Astro`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/astro-guia-completa/learn/lecture/44209442#overview).
- Utilidad potencial: Base principal propuesta por el usuario (Fernando Herrera).
- Ruta orientativa según inventario: Secciones 2 (bases), 4 (scripts/islas), 9 (SSR) y 12 (Firebase/Google).
- Límite/adaptación: El ejemplo de servidor Astro se adapta a Go; la clase 150 menciona Firebase 10, sin fijar esa versión para el proyecto.

### F-C02 — Vue 3 con TypeScript y Quasar

- Directorio relativo a la biblioteca: `Vue/Vue 3 con TypeScript y Quasar/`.
- Curso publicado según metadatos: Vue 3, Pinia, Vite, TypeScript, Composition API, Script Setup, Vue-Query, Quasar, Caché y más.
- Original verificado: [6. Introducción a la sección.md](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/6. Introducción a la sección.md>).
- Sección del original: `Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/vue-intermedio/learn/lecture/39256624#overview).
- Utilidad potencial: TypeScript, Composition API y consultas HTTP.
- Ruta orientativa según inventario: Sección 3 (HTTP/composables), 5 (VueQuery), 6–8 (estado/mutaciones) y 9–11 (Quasar/consultas).
- Límite/adaptación: El inventario incluye una aplicación Quasar; elegir sus clases no instala ni adopta Quasar en Astro.

### F-C03 — Vue con Pinia y Testing

- Directorio relativo a la biblioteca: `Vue/Vue con Pinia y Testing/`.
- Curso publicado según metadatos: Pinia, unit test, composition api, autenticación, composables, deployment, file structure, lazy load, vitest y más.
- Original verificado: [24. Introducción a la sección.md](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 3 Introducción a Vue.js/24. Introducción a la sección.md>).
- Sección del original: `Sección 3 Introducción a Vue.js`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/vuejs-fh/learn/lecture/43912262#overview).
- Utilidad potencial: Componentes, composables, formularios y estado para una isla Vue.
- Ruta orientativa según inventario: Secciones 4–5 (componentes), 11–12 (slots/Pinia), 15 (auth) y 16 (formularios).
- Límite/adaptación: La introducción 205 describe login con usuario/contraseña y JWT propio. Solo se trasladaría la organización UI, usando Firebase y el contrato Go.

### F-C04 — SvelteKit Full Stack

- Directorio relativo a la biblioteca: `Svelte/SvelteKit Full Stack/`.
- Curso publicado según metadatos: Build & Deploy Full Stack, High Performance, Server Side Rendered Web Apps that Work Even with JavaScript Disabled..
- Original verificado: [1. Before Getting Started.md](</Users/benji/Documents/chrome-extencions/trancripciones/Svelte/SvelteKit Full Stack/Sección 1 Introduction to Svelte & Signal Based Reactivity/1. Before Getting Started.md>).
- Sección del original: `Sección 1 Introduction to Svelte & Signal Based Reactivity`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/svelte-and-sveltekit/learn/lecture/48182441#overview).
- Utilidad potencial: Componentes y reactividad de Svelte para una isla.
- Ruta orientativa según inventario: Secciones 1–8 (Svelte, estado, contexto, acciones y animación). Secciones 11–13 y 16–17 son contexto SvelteKit.
- Límite/adaptación: Los load functions, hooks, form actions y Better Auth de SvelteKit no se copian como backend de Astro. Separar primero Svelte de SvelteKit.

### F-C05 — Estado Global con Zustand

- Directorio relativo a la biblioteca: `React/Estado Global con Zustand/`.
- Curso publicado según metadatos: TypeScript, Middlewares, Firebase, Immer, Persistencia, Slices Pattern, JWTs, Autenticación, Interceptores y más.
- Original verificado: [6. Introducción a la sección.md](</Users/benji/Documents/chrome-extencions/trancripciones/React/Estado Global con Zustand/Sección 2 Bases de Zustand/6. Introducción a la sección.md>).
- Sección del original: `Sección 2 Bases de Zustand`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/react-zustand/learn/lecture/40259410#overview).
- Utilidad potencial: Consulta especializada para estado y transporte autenticado.
- Ruta orientativa según inventario: Secciones 2–5 (estado) y 6 (Peticiones HTTP - Zustand fuera de React).
- Límite/adaptación: La introducción 63 usa otro backend y Axios; no selecciona Zustand ni Axios para este proyecto.

### F-C06 — React Componentes y Storybook

- Directorio relativo a la biblioteca: `React/React Componentes y Storybook/`.
- Curso publicado según metadatos: Storybook, Github Actions, publicar NPM, TypeScript, patrones de componentes, PWA, Formik, formularios dinámicos y más.
- Original verificado: [1. Introducción al curso - Visón General.md](</Users/benji/Documents/chrome-extencions/trancripciones/React/React Componentes y Storybook/Sección 1 Introducción/1. Introducción al curso - Visón General.md>).
- Sección del original: `Sección 1 Introducción`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/react-pro/learn/lecture/29330228#overview).
- Utilidad potencial: Patrones de componentes y formularios cuando una pantalla los necesite.
- Ruta orientativa según inventario: Secciones 5–8 (patrones), 10–11 (formularios) y 12–13 (Storybook/paquetes).
- Límite/adaptación: Tiene una sección React Router DOM v5 marcada [LEGACY]. El catálogo la contabiliza, pero no la propone como referencia de API vigente.

### F-C07 — React Hooks

- Directorio relativo a la biblioteca: `React/React Hooks/`.
- Curso publicado según metadatos: Master React Hooks, the next evolution of the popular React library for building dynamic front end interfaces.
- Original verificado: [1. Welcome to React Hooks.md](</Users/benji/Documents/chrome-extencions/trancripciones/React/React Hooks/Sección 1 Introduction/1. Welcome to React Hooks.md>).
- Sección del original: `Sección 1 Introduction`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/getting-started-with-react-hooks/learn/lecture/13758766#overview).
- Utilidad potencial: Apoyo centrado en useState, useEffect, useContext y custom hooks.
- Ruta orientativa según inventario: Secciones 2–5.
- Límite/adaptación: Es una fuente de fundamentos; su fecha de extracción y el número de clases no demuestran actualidad de React ni cobertura de auth Firebase.

### F-C08 — React OpenAI con NestJS

- Directorio relativo a la biblioteca: `React/React OpenAI con NestJS/`.
- Curso publicado según metadatos: Imágenes, modelos, audio a texto, texto a audio, asistentes, transcripciones, traducciones, librería de OpenAI y más..
- Original verificado: [6. Introducción a la sección.md](</Users/benji/Documents/chrome-extencions/trancripciones/React/React OpenAI con NestJS/Sección 2 Frontend - Diseño y creación de la aplicación/6. Introducción a la sección.md>).
- Sección del original: `Sección 2 Frontend - Diseño y creación de la aplicación`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/react-nest-openai/learn/lecture/41368720#overview).
- Utilidad potencial: Posible consulta posterior para presentación de resultados y comunicación con un backend.
- Ruta orientativa según inventario: Sección 2 (frontend/estructura), 4 (peticiones), 6 (streams) y 16 (frontend de asistentes).
- Límite/adaptación: No es necesaria para la configuración auth inicial. Su API OpenAI/NestJS no se adopta; cualquier API de proveedor se verificará al necesitarla.

### F-C09 — React y MERN

- Directorio relativo a la biblioteca: `React/React y MERN/`.
- Curso publicado según metadatos: Context API, MERN, Hooks, Firestore, JWT, Testing, Autenticaciones, Despliegues, AI, CRUD, Logs, MUI, Multiple Routers...
- Original verificado: [32. Introducción.md](</Users/benji/Documents/chrome-extencions/trancripciones/React/React y MERN/Sección 4 Primeros pasos en React/32. Introducción.md>).
- Sección del original: `Sección 4 Primeros pasos en React`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/react-cero-experto/learn/lecture/51976575#overview).
- Utilidad potencial: Ruta general de componentes, hooks, consumo HTTP y UI de auth.
- Ruta orientativa según inventario: Secciones 4, 9–15 y 18–22; en particular sección 20 Auth.
- Límite/adaptación: El backend MERN, los JWT propios y sus roles no son el contrato de esta API Go.

### F-C10 — React y Socket.io

- Directorio relativo a la biblioteca: `React/React y Socket.io/`.
- Curso publicado según metadatos: Aplicaciones de Mapas, colas, tickets de trabajo, gráficas, chat, CRUD completo en tiempo real y más....
- Original verificado: [8. Introducción a la sección.md](</Users/benji/Documents/chrome-extencions/trancripciones/React/React y Socket.io/Sección 2 Introducción a los WebSockets y a Socket.io/8. Introducción a la sección.md>).
- Sección del original: `Sección 2 Introducción a los WebSockets y a Socket.io`; localizadores de metadatos: líneas 3, 5, 7 y 9.
- Procedencia: [clase original en Udemy](https://www.udemy.com/course/react-socket-io-fernando/learn/lecture/22600514#overview).
- Utilidad potencial: Consulta posterior si el producto incorpora eventos en tiempo real.
- Ruta orientativa según inventario: Sección 4 (useSocket/contexto) y 11–13 (chat/auth/mensajería).
- Límite/adaptación: No hace falta Socket.io para consumir los endpoints auth actuales. Incorporarlo dependería de un contrato backend futuro.

## Pasajes que delimitan la adaptación de auth

- **Vue con Pinia y Testing:** original `Sección 15 Autenticación y Autorización/205. Introducción a la sección.md`, líneas 13–17. Describe POST de usuario/contraseña, JWT y roles. Su contrato difiere del Bearer Firebase que exige Go. [Abrir original](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 15 Autenticación y Autorización/205. Introducción a la sección.md>).
- **Estado Global con Zustand:** original `Sección 6 Peticiones HTTP - Zustand fuera de React/63. Introducción a la sección.md`, líneas 13–21. Presenta otro backend, stores fuera de componentes, interceptores y lógica auth separada. Es evidencia de organización, no de integración Firebase de esta API. [Abrir original](</Users/benji/Documents/chrome-extencions/trancripciones/React/Estado Global con Zustand/Sección 6 Peticiones HTTP - Zustand fuera de React/63. Introducción a la sección.md>).

## Cómo continuar con la elección vigente

1. Partir de Vue y los dos cursos principales ya elegidos; la base Astro permanece. Buscar en ambos según la necesidad y recurrir a React, Svelte u otros cursos conforme al plan 02. Priorizar adaptar sus principios a Vue; justificar cualquier excepción de implementación.
2. Para cada necesidad, listar los originales de la sección elegida, ordenados por número; leer los pasajes pertinentes y seleccionar las lecciones suficientes. Excluir guías generadas del conjunto de originales.
3. Leer completamente cada lección que se vaya a reconstruir y recuperar solo su contexto previo indispensable. Crear o reutilizar una guía por original junto a la transcripción, con mapa de procedencia y certeza.
4. Citar original y guía desde la ficha específica, plan y bitácora del incremento aplicado. Mantener las mejoras de este proyecto fuera de la reconstrucción fiel del instructor.

El inventario inicial no creó reconstrucciones. El [incremento auth 01](../../bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md) utiliza ahora tres guías, enlazadas en su [ficha aplicada](auth/03-cursos-vue-y-adaptacion-del-acceso.md). No hay un cupo artificial de lecciones: se reconstruirán todas las que aporten evidencia al mecanismo seleccionado.
