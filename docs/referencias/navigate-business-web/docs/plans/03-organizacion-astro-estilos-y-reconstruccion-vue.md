# 03 — Organización Astro, estilos y próxima reconstrucción desde Vue

Fecha de creación: 2026-10-16
Última actualización: 2026-10-18
Estado: Aplicado con adaptación a Tailwind completo; revisión manual del usuario pendiente.
Ámbito: navigate-business-web; estructura Astro, CSS y evidencia de los dos cursos Vue.
Relacionada con: [configuración previa](01-configuracion-antes-de-construir.md), [filosofía Vue primero](02-filosofia-vue-y-prioridad-de-fuentes.md), [plan auth](auth/01-google-firebase-y-api-go.md), [recorrido Astro reconstruido](../fonts/astro/02-recorrido-completo-auth-sin-vue.md), [fuentes de la implementación actual](../fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md), [skill local](../../skills/reconstruir-cursos-con-scripts/SKILL.md).
Revisión de referencia: e52268ae9daa83ea820c3d65cbd5783968c083e8, con cambios staged/unstaged previos preservados. El plan parte del árbol actual, no solo de ese commit.


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](../../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Aplicación del 2026-10-17

El [incremento de organización y Tailwind](../../bitacora-construccion/01-organizacion-astro-tailwind-y-contratos-typescript.md) parte del respaldo `71fecfa`. La instrucción posterior del usuario sustituye la alternativa CSS/Tailwind gradual por utilidades Tailwind para toda la presentación, incluida AuthSurface. Por tanto, las propuestas históricas de mantener style scoped y mover selectores CSS no son la solución aplicada.

Se extrajo MainLayout, cabecera, introducción e ilustración; global.css conserva únicamente la importación Tailwind y su tema. El TypeScript separa contratos, resolución de cuenta, transporte, proveedor y presentación. El [recorrido Vue aplicado](../fonts/auth/04-recorrido-vue-y-organizacion-del-acceso.md) agrega tres guías y reutiliza dos; su [ficha de arquitectura](../fonts/arquitectura/01-contratos-y-responsabilidades-typescript.md) relaciona los contratos con los cursos adicionales indicados por el usuario.

Las etapas y decisiones de abajo se conservan como **propuesta histórica del 2026-10-16**. No se marcan como ejecutadas las alternativas que fueron sustituidas. Se usó el helper global de reconstrucción disponible en esta sesión; no se modificó ni promovió la skill piloto local. La revisión en navegador corresponde al usuario mediante capturas/resultados; el agente realiza únicamente las verificaciones por comandos.

## Objetivo y alcance de esta entrega

Dejar preparada para después la organización propuesta tras estudiar Astro. Mantener Vue + TypeScript para la interacción, Astro para la página y Go para la API. Conservar el diseño y el comportamiento auth actuales mientras se cambia, más adelante, la distribución de responsabilidades y estilos.

**En esta entrega solo se crea el plan y una skill local con sus scripts/receta.** No se ejecutan los cambios de aplicación de las etapas siguientes, no se inicia el nuevo recorrido Vue, no se instala una skill global y no se cambia Firebase, Go ni la configuración de la app.

## Punto de partida observado

- [index.astro](../../src/pages/index.astro) contiene documento HTML, metadatos, cabecera, portada, footer y la isla AuthSurface con client:load. No hay un layout compartido todavía.
- [global.css](../../src/styles/global.css) mezcla fuentes/reglas base con estilos de esta portada: main, h1, ilustración y footer, entre otros.
- [AuthSurface.vue](../../app/modules/auth/presentation/views/AuthSurface.vue) mantiene su CSS en style scoped; esta separación ya es adecuada.
- [astro.config.mjs](../../astro.config.mjs) registra Vue y el plugin Vite de Tailwind. [package.json](../../package.json) contiene sus dependencias, pero global.css no incluye el import de Tailwind. La apariencia actual procede del CSS propio.
- Firebase cliente, estado auth y cliente HTTP de Go ya están separados en features/auth. Estudiar más material no implica que se deban reemplazar por el backend Astro del curso.

Releer archivos y diffs al reanudar: puede haber cambios concurrentes. Estos puntos describen la observación del 2026-10-16, no una garantía sobre el estado futuro.

## Ruta de lectura antes de implementar

**No empezar un cambio leyendo únicamente este plan ni ejecutando la receta Python.** Seguir el orden de esta tabla; después consultar las lecciones específicas del siguiente apartado. Las rutas del proyecto son relativas a este Markdown. Las transcripciones viven fuera del repositorio, en `/Users/benji/Documents/chrome-extencions/trancripciones/`, y se enlazan directamente más abajo.

| Orden | Markdown que hay que abrir y leer | Qué debe entenderse antes de seguir |
| --- | --- | --- |
| 1 | [AGENTS.md](../../AGENTS.md) y [01-guia-documental-y-orden-de-trabajo.md](../01-guia-documental-y-orden-de-trabajo.md), apartados «Dónde se conserva cada cosa», «Orden acordado» y «Convenciones y continuidad» | Instrucciones de trabajo, diferencia entre plan/fuentes/bitácora y cómo registrar un cambio sin presentar una propuesta como implementación. Releer también estado y diffs del checkout. |
| 2 | [02-filosofia-vue-y-prioridad-de-fuentes.md](02-filosofia-vue-y-prioridad-de-fuentes.md), completo | Vue es la primera opción; los dos cursos son complementarios. Astro se usa para sus mecanismos. No hay un máximo arbitrario de reconstrucciones ni una selección automática de Pinia, Quasar o varios frameworks. |
| 3 | [01-configuracion-antes-de-construir.md](01-configuracion-antes-de-construir.md), «Decisiones propuestas y su fundamento», «Incremento 1» y «Despliegue y continuidad»; [auth/01-google-firebase-y-api-go.md](auth/01-google-firebase-y-api-go.md), completo | Responsabilidades y configuración acordadas, flujo Google → token → Go y criterios de cierre. Diferenciar valores/estados históricos de lo comprobado al reanudar. |
| 4 | [fonts/auth/01-contrato-real-api-go.md](../fonts/auth/01-contrato-real-api-go.md), F-B2 a F-B5; [fonts/auth/02-firebase-web-y-limites-del-cliente.md](../fonts/auth/02-firebase-web-y-limites-del-cliente.md), completo | Qué token acepta Go, sync frente a me, errores, cuenta suspendida, configuración pública frente a credenciales privadas y límites de la sesión cliente. Un refactor visual debe conservar ese contrato. |
| 5 | [fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md](../fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md), «Originales y reconstrucciones utilizadas», «Evidencia → interpretación → adaptación» y «Entorno observado y límites reales»; [bitácora auth 01](../../bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md), «Implementación y funcionamiento», «Comprobación ejecutada» y «Pendiente y continuidad» | Cómo se construyó realmente el incremento, qué decisiones son propias, qué pruebas se ejecutaron y qué sigue pendiente. Las reconstrucciones Astro posteriores no son la procedencia histórica de toda la implementación anterior. |
| 6 | [fonts/astro/01-renderizado-islas-y-configuracion.md](../fonts/astro/01-renderizado-islas-y-configuracion.md), «Documentación oficial consultada» e «Interpretación y adaptación propuesta»; [fonts/astro/02-recorrido-completo-auth-sin-vue.md](../fonts/astro/02-recorrido-completo-auth-sin-vue.md), «Orden de lectura», «Inventario», comparación con Go y «Límites conservados» | Qué se ejecuta al construir y qué en el navegador; para qué se hidrata Vue; cuáles de las 30 lecciones son relevantes a cada cambio y cuáles solo explican el ejemplo servidor del curso. |
| 7 | Este plan 03: mapa de cambios, etapas y comprobación prevista | Formular el cambio concreto, sus archivos afectados, el comportamiento que se conserva y la evidencia que permitirá comprobar el resultado. |

Los documentos anteriores son contexto histórico, no sustituyen leer el código actual. Antes de editar, contrastarlos con [index.astro](../../src/pages/index.astro), [global.css](../../src/styles/global.css), [AuthSurface.vue](../../app/modules/auth/presentation/views/AuthSurface.vue), [use-auth.ts](../../app/modules/auth/presentation/composables/use-auth.ts), [firebase-client.ts](../../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts), [account-api.ts](../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts), [config.ts](../../app/bootstrap/env/client-env.ts), [astro.config.mjs](../../astro.config.mjs), [package.json](../../package.json) y [tsconfig.json](../../tsconfig.json). No copiar secretos de archivos de entorno al plan.

## Qué leer para cada cambio Astro y de estilos

Para una lección seleccionada, leer el **original completo** y después su **reconstrucción**: fuente/punto de partida, certeza, procedencia cuando exista, fases señaladas y código final. La reconstrucción facilita seguir los archivos; no reemplaza la autoridad del original. Si surge una contradicción, resolverla antes de implementar y dejar constancia.

| Cambio | Markdown concretos y apartados | Qué hay que comprender y contrastar en la app |
| --- | --- | --- |
| Extraer MainLayout | F1/R1, [original 14](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/14. Layouts y Props.md>) y [guía 14](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/14. Layouts y Props - Reconstrucción guiada.md>), fases 1–3 y archivos finales | Identificar documento común frente a contenido propio. Comprender slot, Astro.props e interface Props; decidir qué metadatos son configurables y cómo mantener título, descripción, idioma, favicon y montaje de AuthSurface actuales. |
| Extraer cabecera/footer si se justifica | [Original 13](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/13. Reutilización de componentes.md>) y [guía 13](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/13. Reutilización de componentes - Reconstrucción guiada.md>), fases 1–3; después R1 | Comprender importación y reutilización de componentes Astro, sin exigir una única raíz. Comparar qué se repite o merece una responsabilidad separada. No extraer componentes únicamente para aumentar el número de archivos. |
| Separar CSS de portada y CSS compartido | F2/R2, [original 15](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/15. Estilos por componente y globales.md>) y [guía 15](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/15. Estilos por componente y globales - Reconstrucción guiada.md>), fases 1–3, 5 y 7; fase 6 solo si se cambian fuentes/recursos | Comprender scope, is:global, CSS importado por layout y diferencia src/public. Clasificar cada selector actual antes de moverlo. No asumir que CSS de un componente Astro alcanzará automáticamente el HTML interno de un componente Vue. Mantener las reglas de AuthSurface en su style scoped. |
| Conservar diseño y definir variables comunes | R2 más los archivos de estilos actuales; fuentes oficiales de F3 | La centralización de colores/medidas es una propuesta nuestra. Identificar valores realmente compartidos entre portada y tarjeta; no atribuir al curso nuestra paleta, ilustración o sistema de variables. Comprobar los estados de interacción y las media queries. |
| Completar Tailwind si se mantiene | F3 y los enlaces oficiales de styling ya registrados en [fonts/astro/01](../fonts/astro/01-renderizado-islas-y-configuracion.md); revisar package.json, astro.config.mjs y global.css actuales | Confirmar la versión instalada, plugin y punto de importación CSS. Releer la documentación oficial vigente antes del cambio y comparar efectos de sus estilos base. Las clases históricas del curso no prueban la configuración correcta de la versión instalada. |
| Conservar la separación Astro/Vue/Go | [fonts/astro/02](../fonts/astro/02-recorrido-completo-auth-sin-vue.md), «Lo que enseña el curso y lo que requeriría nuestro proyecto» y «Límites conservados»; documentos auth de los pasos 3–5 | Distinguir hidratación Vue, sesión del navegador y cuenta autorizada por Go. Para este refactor no hacen falta las acciones o middleware servidor de Astro. Si se plantea cambiar ese modelo, releer originales/guías 106–107 y 157–159 enlazados en el inventario y diseñar un incremento independiente. |

**Antes de aplicar cada fila**, registrar brevemente: original y pasaje → guía/fase/símbolo → interpretación → archivo que se cambiará → comprobación prevista. Si no se puede explicar esa cadena, ampliar la lectura o reconocer que la propuesta es propia; no rellenar el vacío con un script ni con una referencia genérica al curso entero. No es necesario recorrer las 30 guías para mover un selector si las lecciones pertinentes ya fundamentan el cambio.

## Evidencia y decisiones pendientes de aplicación

| Necesidad | Fuente original y reconstrucción | Aplicación propuesta |
| --- | --- | --- |
| Documento común | F1: clase 14, líneas 13–19 y 27–33; R1: guía 14, MainLayout, slot y Props | Extraer MainLayout.astro con título y metadatos configurables e importar los estilos globales desde el layout. |
| CSS local y compartido | F2: clase 15, líneas 19–25 y 35–39; R2: guía 15, fases de scope, global.css y recursos | Dejar global solo lo compartido; mover reglas de portada a su página/componente Astro y conservar scoped en Vue. |
| Tailwind vigente | F3: documentación oficial de estilos, Add Tailwind 4; observación de configuración y CSS actuales | Si se mantiene Tailwind, completar su import y comprobar el efecto de estilos base sobre el diseño existente. No copiar la integración histórica del curso sin verificarla. |
| Tokens visuales comunes | Propuesta propia derivada de colores y medidas repetidos en los archivos actuales | Definir variables CSS para valores que realmente se comparten, sin introducir un sistema de diseño completo por adelantado. |
| Separación Astro/Vue/Go | [Fuentes Astro y límites](../fonts/astro/02-recorrido-completo-auth-sin-vue.md), [contrato Go](../fonts/auth/01-contrato-real-api-go.md) | Conservar la isla Vue y las peticiones al backend actual; no añadir sesiones o acciones Astro solo para reproducir el curso. |

F1 — [14. Layouts y Props, original](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/14. Layouts y Props.md>); R1 — [reconstrucción 14](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/14. Layouts y Props - Reconstrucción guiada.md>).

F2 — [15. Estilos por componente y globales, original](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/15. Estilos por componente y globales.md>); R2 — [reconstrucción 15](</Users/benji/Documents/chrome-extencions/trancripciones/Astro/Astro Full Stack/Sección 2 Introducción a Astro/15. Estilos por componente y globales - Reconstrucción guiada.md>).

F3 — [Styles and CSS, Astro: Add Tailwind 4](https://docs.astro.build/en/guides/styling/#add-tailwind-4) y [scoped styles](https://docs.astro.build/en/guides/styling/#scoped-styles), consultadas en el análisis del 2026-10-16. El curso fundamenta la organización; la documentación vigente fundamenta cómo configurar la versión actual.

## Etapas de aplicación para después

- [ ] Releer código, configuración, versiones efectivas y diffs; tomar una referencia visual antes de refactorizar. Confirmar los límites del cambio y conservar trabajo concurrente.
- [ ] Extraer MainLayout con html/head/body, metadatos y slot. Mantener el contenido propio de la portada en index.astro. Extraer cabecera/footer a componentes solo si se comparten o si la separación mejora claramente su mantenimiento.
- [ ] Separar global.css: fuentes, base y valores compartidos permanecen globales; portada e ilustración pasan a CSS de sus componentes Astro. Revisar selectores genéricos como main, h1 y footer para evitar que condicionen futuras páginas.
- [ ] Mantener style scoped de AuthSurface.vue. Compartir únicamente las variables CSS necesarias; no mover todos sus estilos a global.css ni convertir la tarjeta a Astro por este plan.
- [ ] Centralizar colores/medidas realmente repetidos en variables CSS. Mantener paleta, distribución, accesibilidad y adaptación a pantallas pequeñas.
- [ ] Resolver la configuración incompleta de Tailwind. Si se mantiene, añadir el import correcto y comprobar su efecto visual antes de adoptar utilidades gradualmente. Si se decide continuar exclusivamente con CSS propio, documentar la decisión antes de retirar dependencias sin uso. No reescribir todos los estilos para parecerse al curso.
- [ ] Ejecutar las comprobaciones proporcionadas al cambio y registrar el incremento implementado en su bitácora. No marcar este plan como aplicado por haber creado documentos o la skill.

## Comprobación prevista de la aplicación

Comparar escritorio y pantalla compacta antes/después: disposición, tipografía, foco, botones y desbordamiento. Verificar que CSS de la portada no afecte otras páginas que se añadan y que los estilos scoped de Vue sigan aplicándose. Revisar especialmente el cambio visual al importar Tailwind.

Ejecutar pnpm check y pnpm build; ejecutar las pruebas auth existentes si se tocan imports, montaje o comportamiento de la isla. No crear tests que solo repitan la distribución de archivos. Confirmar los estados que puedan ejercitarse con la configuración disponible, diferenciando dobles de prueba de un login Google real.

## Herramienta local creada ahora y scripts preservados

La skill [reconstruir-cursos-con-scripts](../../skills/reconstruir-cursos-con-scripts/SKILL.md) vive únicamente en skills/ de este frontend. Sus helpers usan Python estándar y no dependen de rutas temporales del chat:

| Recurso | Función |
| --- | --- |
| [reconstruction.py](../../skills/reconstruir-cursos-con-scripts/scripts/reconstruction.py) | Preparar receta JSON, validar frases/líneas, generar staging, comprobar huellas e instalar solo Markdown nuevo sin sobrescribir guías existentes. |
| [export_astro_recipe.py](../../skills/reconstruir-cursos-con-scripts/scripts/export_astro_recipe.py) | Exportar las 28 recetas Astro preservadas a JSON para recuperar el trabajo cuando haga falta. |
| [recipe.py](../../skills/reconstruir-cursos-con-scripts/assets/astro-auth-2026-10-16/recipe.py) | Consolidación de las definiciones de los cinco scripts Python del recorrido Astro; conserva su contenido y las correcciones de procedencia revisadas. |
| [origins.json](../../skills/reconstruir-cursos-con-scripts/assets/astro-auth-2026-10-16/origins.json) | Huellas de los cinco scripts originales, cantidad de recetas y guías reutilizadas. |
| [test_reconstruction.py](../../skills/reconstruir-cursos-con-scripts/scripts/test_reconstruction.py) | Comprobar generación, integridad, rechazos y reutilización con cursos sintéticos temporales. |

Consultar el [formato de recetas](../../skills/reconstruir-cursos-con-scripts/references/01-formato-recetas.md) y la [procedencia/validación de la receta Astro](../../skills/reconstruir-cursos-con-scripts/references/02-receta-astro-y-validacion.md). Las rutas de curso, staging y fecha se pasan como argumentos. El manifest detecta si una fuente o una guía preparada cambió antes de instalar.

Orden de lectura para usar la herramienta: **SKILL.md local completo → references/01-formato-recetas.md completo → references/02-receta-astro-y-validacion.md completo si se recupera Astro**. Leer además el SKILL.md y el output-standard.md de reconstruir-codigo-curso como indica la skill local. No empezar por ejecutar recipe.py: es una receta histórica derivada y no explica por sí sola la semántica, fidelidad ni adaptación al proyecto. Consultar reconstruction.py para comprender los comandos y sus límites; consultar test_reconstruction.py si se modifican los helpers.

Se ejecutaron 12 pruebas del helper con fuentes sintéticas y una exportación/renderizado/verificación de las 28 recetas Astro reales en staging, con 31 originales/contextos comprobados. Una ejecución independiente de la skill completó también el flujo con una lección Vue sintética, incluida instalación junto al original temporal; sus observaciones se corrigieron en el generador. No se instalaron ni sobrescribieron guías de bibliotecas reales en esa validación. Se mantiene la distinción entre comprobación mecánica y fidelidad del análisis; ninguna ejecución del script interpreta el código por el agente.

Para invocar el piloto en un futuro chat, señalar el archivo SKILL.md local por su ruta; no se modificó AGENTS.md ni se aseguró descubrimiento automático desde skills/. Solo considerar una instalación global más adelante, tras su uso real con Vue y una nueva petición del usuario.

## Continuidad final acordada: reconstruir también desde los cursos Vue

**Pendiente para una etapa posterior:** repetir con Vue el procedimiento riguroso usado con Astro. Consultar los dos cursos complementarios, **Vue con Pinia y Testing** y **Vue 3 con TypeScript y Quasar**, localizar todas las lecciones pertinentes a esta etapa visual/auth y reconstruir tantas como hagan falta, sin límite arbitrario. Realizar esta investigación antes de los cambios Vue que necesiten esa evidencia.

Cada lección tendrá su propia guía junto a la transcripción, con estado inicial, pasajes y símbolos verificables, fases acumulativas, experimentos descartados y código final completo dentro de lo recuperable. Reutilizar primero las guías 31 y 209 ya citadas en las [fuentes actuales](../fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md), sin tratarlas como cobertura suficiente de todo el recorrido ni sobrescribirlas automáticamente.

Buscar según necesidad real: componentes/props, Composition API y TypeScript, estado y ciclo de vida, formularios, peticiones y errores, presentación de espera, estilos y pruebas relevantes. Un curso puede aportar un mecanismo sin enseñar Google/Firebase o el contrato Go: identificar esos vacíos, no atribuirle una integración que no contiene ni incorporar Pinia/Quasar por el nombre del curso.

### Archivos de entrada del futuro recorrido Vue

Primero leer [fonts/01-catalogo-cursos-astro-y-ui.md](../fonts/01-catalogo-cursos-astro-y-ui.md), fichas **F-C02 y F-C03**, «Pasajes que delimitan la adaptación de auth» y «Cómo continuar con la elección vigente». Ahí se conservan las dos raíces reales de cursos. Leer después [fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md](../fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md) para no confundir una referencia ya aplicada con una reconstrucción futura.

Las dos guías existentes que hay que revisar antes de generar más son:

| Original y guía que ya existen | Apartados y comprensión requerida |
| --- | --- |
| [31. Composable functions - useCharacters con estado local, original](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 3 Técnicas para peticiones HTTP/31. Composable functions - useCharacters con estado local.md>) y [guía 31](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 3 Técnicas para peticiones HTTP/31. Composable functions - useCharacters con estado local - Reconstrucción guiada.md>) | Leer fuente/punto de partida, certeza, mapa de procedencia y fases «Extraer la carga», «Exponer carga y total reactivo», «Consumir desde la vista» y código final. Comprender estado local, exposición de datos/carga y separación vista/composable. El título del original y los nombres del ejemplo no coinciden del todo; atender la advertencia de la guía y consultar el contexto 27/28 que esta identifica. |
| [209. Login Action - Autenticación, original](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 15 Autenticación y Autorización/209. Login Action - Autenticación.md>) y [guía 209](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 15 Autenticación y Autorización/209. Login Action - Autenticación - Reconstrucción guiada.md>) | Leer fuente/punto de partida, certeza, procedencia y fases «Crear acción y respuesta», «Separar rechazo esperado y fallo inesperado», «Tipar ambos resultados» y código final. Comprender contrato HTTP independiente y errores tipados; distinguir su backend contraseña/JWT del Bearer Firebase que usa Go. Leer la 208 como contexto si hace falta, sin trasladar automáticamente su router SPA. |

Para ampliar el recorrido, quedan localizados estos **candidatos por nombre y ruta**. Sus originales existen, pero su lectura completa, pertinencia y reconstrucción siguen pendientes. No afirmar que ya fundamentan una implementación ni generar una guía de todos automáticamente:

| Necesidad por investigar | Markdown original candidato |
| --- | --- |
| Props con TypeScript en el primer curso | [17. defineProps - Script Setup](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/17. defineProps - Script Setup.md>) y [18. Tipos específicos de datos en Props](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue 3 con TypeScript y Quasar/Sección 2 Vue.js + Composition API + TypeScript - Primeros Pasos/18. Tipos específicos de datos en Props.md>). |
| Contrastar componentes y props en el segundo curso | [43. Define Props - Recibir Properties](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 4 Vue + Vite - Single-File Components/43. Define Props - Recibir Properties.md>). |
| Complementar extracción de estado/lógica | [48. Composable Functions](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 4 Vue + Vite - Single-File Components/48. Composable Functions.md>) y, si su mecanismo resulta necesario, la 31 del primer curso ya reconstruida. |
| Investigar montaje/desmontaje si se toca la isla | [132. Ciclo de vida de los componentes](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 9 Vue Router - SPA - Single Page Applications/132. Ciclo de vida de los componentes.md>). Evaluar el mecanismo sin adoptar el router de esa sección. |
| Revisar pruebas si se modifica un composable | [73. Probar composables - useCounter](</Users/benji/Documents/chrome-extencions/trancripciones/Vue/Vue con Pinia y Testing/Sección 6 Introducción a las pruebas unitarias y de integración/73. Probar composables - useCounter.md>). Comparar con las pruebas auth existentes antes de añadir otras. |

Si estos candidatos no cubren estilos, formularios, cancelación, restauración u otra necesidad concreta, buscar más originales en **ambos** cursos según la skill, leerlos y reconstruir los pertinentes. El inventario inicial no es una lista cerrada ni prueba de cobertura. Conservar qué se leyó completo, qué se descartó y qué sigue pendiente en la futura ficha fonts.

Reutilizar la skill local y sus scripts con recetas nuevas escritas desde los originales Vue. **Se reutiliza el procedimiento; no se traduce automáticamente el código Astro a Vue.** Mantener separadas la reconstrucción fiel del instructor y la adaptación a nuestra app. Al terminar ese futuro recorrido, crear una ficha numerada en docs/fonts con todos los originales, guías, símbolos aplicables y límites, como se hizo con Astro. Si el piloto funciona bien con esas fuentes reales y el usuario lo solicita, se podrá convertir en skill global; por ahora permanece local y el recorrido Vue no se inicia.
