# 01 — Documentación del frontend y orden de construcción

Fecha de creación: 2026-10-16
Última actualización: 2026-10-16
Estado: Investigación y preparación documental
Ámbito: `navigate-business-web`, frontend de la plataforma de análisis de inversiones.
Relacionada con: [producto compartido](../../docs/product/README.md), [catálogo de cursos](fonts/01-catalogo-cursos-astro-y-ui.md), [configuración inicial](plans/01-configuracion-antes-de-construir.md), [plan de autenticación](plans/auth/01-google-firebase-y-api-go.md).
Revisión de referencia: frontend `e52268ae9daa83ea820c3d65cbd5783968c083e8`; API `fbb1bc0ba80e8f454a8e299bbc0688790cdf5d2d`, con cambios locales preexistentes.

## Alcance de esta etapa

Preparar directorios, fuentes verificables y planes antes de reconstruir lecciones o implementar pantallas. El usuario ya eligió **Vue.js como opción habitual para casi todo el frontend**, con sus dos cursos como referencias principales y complementarias. El orden de apoyo será React, Svelte de forma excepcional y otros cursos. Astro es la base existente y su curso local conserva la referencia para los mecanismos de Astro. La [filosofía vigente](plans/02-filosofia-vue-y-prioridad-de-fuentes.md) detalla esta decisión para desarrollo y arquitectura.

Se adapta el procedimiento documental del proyecto Flutter: [catálogo de fuentes](</Users/benji/Documents/FLUTTER-APP/estadistica_forms/docs/fonts/01-fuentes-cursos-flutter.md>), [contrato del backend](</Users/benji/Documents/FLUTTER-APP/estadistica_forms/docs/fonts/auth/01-estado-backend-y-contrato-auth.md>) y [plan de auth](</Users/benji/Documents/FLUTTER-APP/estadistica_forms/docs/plans/auth/01-plan-autenticacion-descope.md>). La adaptación toma la trazabilidad, el análisis del contrato y los incrementos comprobables. Aquí el proveedor es Firebase, el backend es Go y el destino es el navegador; la configuración móvil y Descope del ejemplo no se trasladan.

## Dónde se conserva cada cosa

```text
navigate-business-web/
├── bitacora-construccion/       # Incrementos cuando se implemente código
└── docs/
    ├── 01-guia-documental-y-orden-de-trabajo.md
    ├── fonts/
    │   ├── 01-catalogo-cursos-astro-y-ui.md
    │   ├── astro/              # Mecanismos de Astro y documentación oficial
    │   └── auth/               # Contrato Go y proveedor Firebase
    └── plans/
        ├── 01-configuracion-antes-de-construir.md
        ├── 02-filosofia-vue-y-prioridad-de-fuentes.md
        └── auth/              # Integración de identidad y cuenta
```

`fonts` significa archivo de fuentes de evidencia. La documentación de producto permanece en el [directorio compartido](../../docs/README.md); la [documentación backend](../../navigate-business-api/docs/) conserva las decisiones y reconstrucciones de Go. Se enlazan desde aquí para evitar duplicarlas.

La preparación inicial dejó la bitácora vacía. El [incremento auth 01](../bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md) registra ahora configuración, UI y lógica implementadas, con verificación Google real pendiente.

## Orden acordado

1. Identificar fuentes y leer el contrato real: **realizado en esta investigación**.
2. Aplicar la prioridad de fuentes: **Vue elegido con ambos cursos**, React como segundo apoyo, Svelte excepcional y otros cursos en cuarto lugar, según la [filosofía de trabajo](plans/02-filosofia-vue-y-prioridad-de-fuentes.md).
3. Configurar y comprobar entorno, app web Firebase, origen, variables y conectividad: [plan de configuración](plans/01-configuracion-antes-de-construir.md). La configuración Astro/Vue y las sondas Go están ejecutadas; completar Firebase público y el recorrido real sigue pendiente en el incremento auth 01.
4. Reconstruir las lecciones necesarias para cada incremento, una guía por original, junto a su transcripción. Reutilizar las guías existentes tras comprobar su procedencia. La cantidad depende del mecanismo que necesitemos comprender.
5. Construir auth y luego capacidades del producto, por incrementos pequeños. Abrir y completar una entrada de bitácora por incremento aplicado.

Cadena que se conservará: necesidad → original y pasaje → reconstrucción y símbolo, cuando exista → adaptación → código del proyecto → comprobación ejecutada. La [ficha aplicada de auth](fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md) enlaza ya tres originales, sus guías R1/R2/R3 y su adaptación al código.

## Convenciones y continuidad

Numerar cada carpeta directa por su máximo más uno, comenzando en `01`; conservar fecha de creación y añadir última actualización cuando cambie sustancialmente el documento. Enlazar antecedentes mediante `Relacionada con:` y conservar la revisión Git cuando ayude a recuperar el estado.

La primera lectura de cada incremento debe volver al código y al estado Git. Los nombres `estadistica-forms-web` y las referencias históricas a formularios, tiendas o Expo son residuos observados en README/planes anteriores. El producto vigente que guía este frontend es el de inversiones; solo se documentan como implementadas las rutas que existen en Go. [F-B1/F-B5](fonts/auth/01-contrato-real-api-go.md).

En la etapa documental inicial no se instalaron integraciones ni se reconstruyeron lecciones. El incremento auth 01 integra ahora Vue/Firebase y tres guías; no cambia credenciales ni recursos Firebase. La [bitácora](../bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md) distingue comprobaciones locales y pendientes de integración real.

## Comprobación de esta entrega

En la preparación inicial se verificaron los siete Markdown creados: fecha, relaciones, prefijos por carpeta, ausencia de números duplicados y fences balanceados. Los 95 enlaces locales comprobados resolvían a rutas existentes. Los inventarios de `docs/` y `bitacora-construccion/` no detectaron colisiones. La actualización posterior del mismo día registra la elección de Vue en el plan 02 y sincroniza las referencias que antes dejaban la selección abierta.

La comparación de contenido de 92 archivos previamente versionados confirmó que permanecieron intactos, incluidos los cambios locales preexistentes de la API. No se ejecutaron build, API, preflight, Firebase ni pruebas funcionales: su comprobación pertenece a los incrementos pendientes.
