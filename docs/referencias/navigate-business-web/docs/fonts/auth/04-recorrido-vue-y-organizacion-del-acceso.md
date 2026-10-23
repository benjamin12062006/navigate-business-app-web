# 04 — Recorrido Vue aplicado a la organización del acceso

Fecha de creación: 2026-10-17
Última actualización: 2026-10-18
Estado: Investigación aplicada; verificaciones por comandos completadas, revisión del usuario pendiente.
Tipo de fuente: Originales locales, reconstrucciones derivadas y adaptación propia.
Origen: Vue 3 con TypeScript y Quasar; Vue con Pinia y Testing.
Fecha de consulta: 2026-10-17, America/New_York.
Relacionada con: [fuentes anteriores](03-cursos-vue-y-adaptacion-del-acceso.md), [plan 03](../../plans/03-organizacion-astro-estilos-y-reconstruccion-vue.md), [incremento](../../../bitacora-construccion/01-organizacion-astro-tailwind-y-contratos-typescript.md), [arquitectura TypeScript](../arquitectura/01-contratos-y-responsabilidades-typescript.md).
Revisión de partida: `71fecfaff3cd7e207036b105de4b4e53d66733f6`.


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](../../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](../../../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Selección, originales y reconstrucciones

Se consultaron ambos cursos; se leyeron completos los cinco originales de esta tabla y las guías reutilizadas. Las guías nuevas se generaron después del acceso inicial y no se presentan como su procedencia histórica. La selección responde a props, estado, transporte y ciclo de vida que necesita esta etapa; no existe un cupo de lecciones.

La raíz de biblioteca es `/Users/benji/Documents/chrome-extencions/trancripciones`; las rutas de la tabla conservan tecnología, curso y sección. Los metadatos verificables de cada original están en las líneas 3, 5 y 7. No se atribuye instructor por el nombre del directorio.

| Original/guía | Fuente primaria y localizador | Reconstrucción derivada | Interpretación y adaptación |
| --- | --- | --- | --- |
| F1/R1 | [17. defineProps - Script Setup](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/17. defineProps - Script Setup.md>); línea 17, buscar «interfaz interface» | [R1](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/17. defineProps - Script Setup - Reconstrucción guiada.md>), nueva | Props tipadas; AuthButton recibe label, disabled y google. |
| F2/R2 | [48. Composable Functions](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 4 Vue + Vite - Single-File Components/48. Composable Functions.md>); línea 25, buscar «importar ref y computer» | [R2](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 4 Vue + Vite - Single-File Components/48. Composable Functions - Reconstrucción guiada.md>), nueva | Estado/computed en un composable; useAuth conserva la coordinación reactiva. |
| F3/R3 | [132. Ciclo de vida de los componentes](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 9 Vue Router - SPA - Single Page Applications/132. Ciclo de vida de los componentes.md>); línea 29, buscar «quitar suscripciones» | [R3](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 9 Vue Router - SPA - Single Page Applications/132. Ciclo de vida de los componentes - Reconstrucción guiada.md>), nueva | Montaje y limpieza: se conservan start/dispose en AuthSurface. |
| F4/R4 | [31. Composable functions - useCharacters con estado local](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 3 Técnicas para peticiones HTTP/31. Composable functions - useCharacters con estado local.md>); línea 13, buscar «centralizar la lógica» | [R4](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 3 Técnicas para peticiones HTTP/31. Composable functions - useCharacters con estado local - Reconstrucción guiada.md>), reutilizada | Separación de vista, estado y carga; antecedente del acceso inicial. |
| F5/R5 | [209. Login Action - Autenticación](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 15 Autenticación y Autorización/209. Login Action - Autenticación.md>); línea 21, buscar «errores controlados» | [R5](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 15 Autenticación y Autorización/209. Login Action - Autenticación - Reconstrucción guiada.md>), reutilizada | Transporte separado y fallos diferenciados; conservar Bearer Firebase del contrato Go. |

R1 conserva las fases de prop requerida/opcional y fallback, con el título del Navbar recuperable; no inventa sus adjuntos visuales. R2 recupera useCounter con estado local e initialValue; R3 recupera el script de ciclo de vida, con nombres de hooks normalizados y ubicación inferida. No se afirma que esos proyectos del curso se hayan compilado. R4 conserva la diferencia entre su título useCharacters y el ejemplo Pokémon. R5 usa contraseña/JWT propio; no implementa nuestra integración Firebase/Go.

## Fuentes complementarias consultadas y límites

Se leyeron también el original 16 del curso Quasar para recuperar el Navbar heredado de R1; el original 18 para contrastar contratos de tipos colocados junto a su consumidor; y el 43 del curso Pinia para contrastar defineProps con interfaz, bind y valor inicial. La lectura de esos originales no se presenta como una reconstrucción nueva de sus proyectos completos.

Se consultó el inventario de ambas secciones y las rutas del plan. No se seleccionaron formularios de contraseña, guards de Vue Router, Pinia, Quasar, KeepAlive ni un nuevo sistema de pruebas: este incremento no cambia esas capacidades. La guía 73 de pruebas de composables queda fuera porque no se modifica el contrato de prueba ni se añade una suite nueva. Si aparece una necesidad distinta, el inventario debe ampliarse; estos tres documentos nuevos no son cobertura universal de Vue.

## Cadena aplicada al código

- F1/R1, fases 1–3 → entrada tipada → [AuthButton.vue](../../../app/ui/components/ActionButton.vue), Props. La prop google controla el icono; el único botón raíz recibe los atributos y listener del padre. La composición visual es propia, no el Navbar del curso.
- F2/R2 y F4/R4 → lógica reactiva separada → [use-auth.ts](../../../app/modules/auth/presentation/composables/use-auth.ts), useAuth. Conserva refs, cancelación y generación por sesión. La concurrencia y las políticas de errores son decisiones propias ya existentes.
- F3/R3 → vida de la instancia → [AuthSurface.vue](../../../app/modules/auth/presentation/views/AuthSurface.vue), onMounted/start y onUnmounted/dispose. Se conserva script setup; el experimento de script src del curso no se impone aquí.
- F5/R5 → transporte independiente → [account-api.ts](../../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts), createAccountApi. El nuevo [resolveAccount](../../../app/modules/auth/application/use-cases/load-account.use-case.ts) recibe AccountGateway y conserva la sincronización selectiva. Su contrato Go y sus reintentos son adaptación del proyecto.

## Generación y comprobaciones ejecutadas

Se ejecutó inventory_section para cada nueva lección. Se usó el helper de la instalación global activa de reconstruir-cursos-con-scripts: draft → receta revisada → render → lectura de Markdown → verify → install. Se crearon tres guías junto a sus originales, sin sobrescribir las existentes. verify comprobó cuatro originales/contextos y tres salidas. Es comprobación mecánica de estructura, localizadores y huellas, separada de la revisión semántica del agente y de la compilación de nuestra app.

Las [recetas conservadas](recetas-vue/) permiten recuperar el contenido; los manifests conservan las huellas originales y de salida. Para regenerar, usar un staging nuevo y la raíz de cada curso; no editar los hashes ni sobrescribir guías existentes por rutina. El piloto local del repositorio permanece intacto como antecedente.

La aplicación pasa pnpm check, las 18 pruebas existentes y pnpm build. La revisión en navegador pertenece al usuario; no se afirma un login real comprobado ni fidelidad visual confirmada por estas pruebas.
