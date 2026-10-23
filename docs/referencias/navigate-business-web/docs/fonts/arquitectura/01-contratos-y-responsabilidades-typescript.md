# 01 — Contratos y responsabilidades del TypeScript de acceso

Fecha de creación: 2026-10-17
Última actualización: 2026-10-18
Tipo de fuente: Transcripciones locales y adaptación al código propio.
Origen: Clean Architecture - Fundamentos, NodeJS Clean Architecture y cursos TypeScript indicados por el usuario.
Fecha de consulta: 2026-10-17, America/New_York.
Relacionada con: [fuentes Vue](../auth/04-recorrido-vue-y-organizacion-del-acceso.md), [incremento](../../../bitacora-construccion/01-organizacion-astro-tailwind-y-contratos-typescript.md).
Revisión de partida: `71fecfaff3cd7e207036b105de4b4e53d66733f6`.


> Continuidad (2026-10-18): esta descripción corresponde a su etapa histórica. Los enlaces de código apuntan a sucesores tras la [migración Clean](../../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md) y la [separación `src`/`app`](../../../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md); responsabilidades, nombres de factories y contratos actuales se explican allí.

## Evidencia y lectura

Los títulos/curso/sección/clase están en los metadatos 1/3/5/7 de cada original. Las rutas conservan la posición relativa a la biblioteca `trancripciones`. Se leen los originales Node de esta tabla completos; los pasajes SOLID se usan como criterio conceptual. No se reconstruye el proyecto C# de cervezas ni el proyecto de logs Node para trasladar sus contratos de almacenamiento al navegador.

| ID | Original y localizador recuperable | Evidencia e interpretación |
| --- | --- | --- |
| F-A1 | [36. ¿Qué son los Principios SOLID](</Users/benji/Documents/chrome-extencions/trancripciones/Arquitectura/Clean Architecture - Fundamentos/Sección 5 Principios SOLID/36. ¿Qué son los Principios SOLID.md>); línea 13, buscar «cinco principios» | Introducción conceptual; por sí sola no demuestra la estructura de nuestro frontend. |
| F-A2 | [37. Principio de responsabilidad única (Single responsibility principle)](</Users/benji/Documents/chrome-extencions/trancripciones/Arquitectura/Clean Architecture - Fundamentos/Sección 5 Principios SOLID/37. Principio de responsabilidad única (Single responsibility principle).md>); línea 13, buscar «una responsabilidad» | Separar presentación, obtención de datos y transformación de errores. |
| F-A3 | [41. Principio de inversión de la dependencia (Dependency inversion principle)](</Users/benji/Documents/chrome-extencions/trancripciones/Arquitectura/Clean Architecture - Fundamentos/Sección 5 Principios SOLID/41. Principio de inversión de la dependencia (Dependency inversion principle).md>); línea 15, buscar «más pragmáticos» | Depender de contratos donde cambia la implementación, sin interfaces para cada utilidad. |
| F-A4 | [83. Clean Architecture - Use Cases](</Users/benji/Documents/chrome-extencions/trancripciones/NodeJS/NodeJS Clean Architecture/Sección 6 Aplicación de consola - Clean Architecture - Primeros Pasos/83. Clean Architecture - Use Cases.md>); línea 19, buscar «todavía no necesita entidades» | El alcance decide qué capas se necesitan; no exigir entidades por el diagrama. |
| F-A5 | [122. Datasources y Repositorios - Abstractos](</Users/benji/Documents/chrome-extencions/trancripciones/NodeJS/NodeJS Clean Architecture/Sección 9 Clean Architecture - Repository Pattern/122. Datasources y Repositorios - Abstractos.md>); línea 15, buscar «también pueden ser interfaces» | Definir las operaciones esperadas antes de su implementación. |
| F-A6 | [126. LogRepository - Implementation](</Users/benji/Documents/chrome-extencions/trancripciones/NodeJS/NodeJS Clean Architecture/Sección 9 Clean Architecture - Repository Pattern/126. LogRepository - Implementation.md>); línea 21, buscar «inyección de dependencias» | Recibir el colaborador y delegar según su contrato. |
| F-A7 | [127. Inyectar repositorio en caso de uso](</Users/benji/Documents/chrome-extencions/trancripciones/NodeJS/NodeJS Clean Architecture/Sección 9 Clean Architecture - Repository Pattern/127. Inyectar repositorio en caso de uso.md>); línea 15, buscar «no es el de» | El consumidor usa la abstracción, no el tipo de implementación. |

F-A4 advierte el coste de multiplicar archivos; F-A3 pide pragmatismo. **Propuesta propia:** mantener una sola feature auth con archivos enfocados; no crear directorios domain/application/infrastructure vacíos, contenedores DI, clases base o repositorios/datasources que solo repitan una llamada HTTP. Este incremento aplica separación y contratos; no afirma una migración completa de la aplicación a Clean Architecture.

## Adaptación aplicada

| Necesidad → fuente | Decisión propia | Archivo/símbolo |
| --- | --- | --- |
| Cambiar proveedor sin importar tipos Firebase en consumidores → F-A3/F-A5 | Extraer SessionPort/SessionUser y explicitar el retorno del adaptador. | [contracts.ts](../../../app/modules/auth/domain/ports/outbound/session.port.ts); [createFirebaseSession](../../../app/modules/auth/infrastructure/adapters/firebase-session.adapter.ts). |
| Separar el contrato de cuenta del transporte → F-A5/F-A7 | AccountGateway conoce current/sync; sus tipos no importan Vue ni Firebase. | [contracts.ts](../../../app/modules/auth/domain/ports/outbound/session.port.ts); [createAccountApi](../../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts). |
| Poder leer la regla de restauración sin recorrer la vista → F-A4/F-A7 | resolveAccount recibe el gateway, usa el modo pedido y hace sync solo ante el 404 específico. | [resolve-account.ts](../../../app/modules/auth/application/use-cases/load-account.use-case.ts). |
| Mantener el controlador de UI comprensible → F-A2 y las reconstrucciones Vue enlazadas | El composable coordina estado/cancelación; la traducción de errores queda en funciones sin efectos. | [useAuth](../../../app/modules/auth/presentation/composables/use-auth.ts); [describeAuthFailure](../../../app/modules/auth/presentation/presenters/auth-failure.presenter.ts). |
| Leer y mantener el contrato HTTP → F-A2 y contrato Go existente | Extraer readJson/isAccount sin cambiar respuesta, UUID, métodos ni renovación acotada. | [account-api.ts](../../../app/modules/auth/infrastructure/adapters/http-account-gateway.adapter.ts). |

useAuth conserva un punto pequeño de composición: sus valores por defecto conectan Firebase y HTTP; los colaboradores de pruebas siguen inyectándose mediante makeSession/request. resolveAccount es independiente de Vue y Firebase, pero usa AccountApiError como contrato de error compartido. No hay un contenedor DI ni persistencia frontend adicional. La cuenta de negocio y su suspensión siguen perteneciendo a Go.

La forma de Account/SessionUser es readonly en TypeScript; al recibir una respuesta se crea el objeto de cuenta permitido por el contrato y se reemplaza la referencia. Esto no congela objetos en runtime, no convierte todo el estado Vue en inmutable ni incorpora un historial undo/redo.

## Complementos TypeScript y límites

Se consultaron los originales 79 Introducing Interfaces y 84 Implementing Interfaces del curso TypeScript largo: interfaces como forma de objeto y contrato, no validación de JSON en ejecución. También se consultó el ejemplo 24 de inmutabilidad con copia; su historial y copyWith no son necesarios para este acceso. La lección 185 de organización se revisó como apoyo de agrupación por responsabilidad; no se trasladan sus namespaces/referencias triples a los módulos ESM de Astro.

Los originales CreateTable/SaveFile de Node se consultaron como contraste: generar datos y guardar archivos son responsabilidades distintas; la clase 85 reconoce explícitamente que aún acopla file system. No se copian clases ni código de esas lecciones a nuestro cliente. Sus proyectos completos no son dependencias de esta implementación.

Las guías Vue aportan la evidencia de código de presentación. Estas fuentes de arquitectura aportan criterio conceptual; no se inventa una reconstrucción Node/C# que supuestamente contenga nuestro acceso Firebase/Go. El cliente usa funciones y objetos tipados; no necesita clases para aplicar los principios.

Rutas verificadas de los complementos consultados:

- [84. CreateTable - UseCase](</Users/benji/Documents/chrome-extencions/trancripciones/NodeJS/NodeJS Clean Architecture/Sección 6 Aplicación de consola - Clean Architecture - Primeros Pasos/84. CreateTable - UseCase.md>). Curso/sección/URL: metadatos 3/5/7 del original; ruta relativa: `NodeJS/NodeJS Clean Architecture/Sección 6 Aplicación de consola - Clean Architecture - Primeros Pasos/84. CreateTable - UseCase.md`.
- [85. SaveFile - UseCase](</Users/benji/Documents/chrome-extencions/trancripciones/NodeJS/NodeJS Clean Architecture/Sección 6 Aplicación de consola - Clean Architecture - Primeros Pasos/85. SaveFile - UseCase.md>). Curso/sección/URL: metadatos 3/5/7 del original; ruta relativa: `NodeJS/NodeJS Clean Architecture/Sección 6 Aplicación de consola - Clean Architecture - Primeros Pasos/85. SaveFile - UseCase.md`.
- [24. Inmutabilidad con copia - Patrón](</Users/benji/Documents/chrome-extencions/trancripciones/TypeScript/Patrones de Diseño en TypeScript/Sección 8 Inmutabilidad con copia/24. Inmutabilidad con copia - Patrón.md>). Curso/sección/URL: metadatos 3/5/7 del original; ruta relativa: `TypeScript/Patrones de Diseño en TypeScript/Sección 8 Inmutabilidad con copia/24. Inmutabilidad con copia - Patrón.md`.
- [79. Introducing Interfaces](</Users/benji/Documents/chrome-extencions/trancripciones/TypeScript/Boost your JavaScript projects with TypeScript Learn all about core types, generics, TypeScript + React or Node & more!/Sección 6 Classes & Interfaces/79. Introducing Interfaces.md>). Curso/sección/URL: metadatos 3/5/7 del original; ruta relativa: `TypeScript/Boost your JavaScript projects with TypeScript Learn all about core types, generics, TypeScript + React or Node & more!/Sección 6 Classes & Interfaces/79. Introducing Interfaces.md`.
- [84. Implementing Interfaces](</Users/benji/Documents/chrome-extencions/trancripciones/TypeScript/Boost your JavaScript projects with TypeScript Learn all about core types, generics, TypeScript + React or Node & more!/Sección 6 Classes & Interfaces/84. Implementing Interfaces.md>). Curso/sección/URL: metadatos 3/5/7 del original; ruta relativa: `TypeScript/Boost your JavaScript projects with TypeScript Learn all about core types, generics, TypeScript + React or Node & more!/Sección 6 Classes & Interfaces/84. Implementing Interfaces.md`.
- [185. Organizing Files & Folders](</Users/benji/Documents/chrome-extencions/trancripciones/TypeScript/Boost your JavaScript projects with TypeScript Learn all about core types, generics, TypeScript + React or Node & more!/Sección 14 Modules & Namespaces/185. Organizing Files & Folders.md>). Curso/sección/URL: metadatos 3/5/7 del original; ruta relativa: `TypeScript/Boost your JavaScript projects with TypeScript Learn all about core types, generics, TypeScript + React or Node & more!/Sección 14 Modules & Namespaces/185. Organizing Files & Folders.md`.

## Verificación

La comprobación usa tipos, las 18 pruebas auth existentes y build. Se conserva el caso de respuesta tardía Alice → salida → Bob, la restauración/sync selectiva, 401 acotado y ausencia de renovación ante 403/503. El diff del test solo cambia la importación de tipos a contracts.ts. Ninguna de esas pruebas verifica Google real ni apariencia de la página.
