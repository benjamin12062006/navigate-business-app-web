# 04 — Arquitectura completa para módulos e islas Astro

Fecha de creación: 2026-10-18
Estado: Ejecutado y verificado por comandos; revisión de navegador pendiente del usuario.
Ámbito: Frontend Astro + Vue; migración del acceso existente.
Relacionada con: [etapa anterior](03-organizacion-astro-estilos-y-reconstruccion-vue.md), [fuentes de esta migración](../fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md), [implementación](../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md), [plan de separación `src`/`app`](05-separar-src-astro-y-app-arquitectura.md).
Revisión de partida: `71fecfaff3cd7e207036b105de4b4e53d66733f6` más los cambios locales previos, incluidos componentes separados y retirada de ayuda local. Se preserva el índice Git.

## Objetivo y contrato conservado

Aplicar todos los mecanismos de `template-clean-architecture` a la lógica actual: módulos con domain, application, infrastructure y presentation; puertos de entrada/salida; DTOs y mappers; composición explícita; bootstrap de recursos; Result, fallos tipados, AsyncState; aliases y límites verificables con ESLint. La vista Vue y un consumidor TypeScript deben poder usar el mismo controlador sin importar Firebase, fetch ni la composición.

Conservar Tailwind, textos y comportamiento: Google popup, persistencia de sesión por pestaña, GET `/auth/me` al restaurar, POST `/auth/sync` sin cuerpo al entrar, fallback exclusivamente ante `404 account_not_synced`, renovación única ante 401, ningún reintento automático de 403/503, cancelación y descarte de respuestas antiguas. No cambiar Go.

## Fuentes y adaptación

La [ficha de evidencia](../fonts/arquitectura/02-plantilla-clean-y-adaptacion-astro.md) distingue código observado, adaptación y propuesta propia. Se utiliza la plantilla completa como modelo arquitectónico; las dependencias y utilidades específicas de React/Next se adaptan a Astro/Vue. No se copian sus defectos de timeout ni validaciones permisivas. Los puertos inbound conservan la excepción de la plantilla: pueden importar únicamente tipos DTO de application.

Astro no serializa controladores con funciones hacia componentes hidratados. Una entrada Vue en `src/islands` adquiere el módulo en cliente y pasa el controlador al árbol Vue por props. El bootstrap solo prepara entorno y recursos genéricos; composition conecta implementaciones. Un propietario de runtime por documento comparte la sesión y libera recursos cuando termina el último consumidor. No se crea estado autenticado global durante SSR.

## Incrementos y comprobación

- [x] Registrar fuentes, plan y bitácora; comprobar estado de partida.
- [x] Trasladar contratos a domain y DTOs/casos de uso a application, sin Vue/Firebase.
- [x] Implementar shared Result/failures/AsyncState/HTTP y adaptadores Firebase/Go con traducción de fallos y validación de respuesta.
- [x] Extraer controlador neutral y adaptar composable/vistas; conectar composition, bootstrap e isla cliente con suscripción y liberación compartidas.
- [x] Configurar aliases, ESLint para TS/Vue/Astro, límites por rutas resueltas, formato y comandos reproducibles.
- [x] Migrar las 18 comprobaciones existentes y comprobar cancelación, aislamiento de capas, SSR y consumidores compartidos.
- [x] Ejecutar lint, tipos, pruebas y build; completar documentación de uso y trazabilidad.

La línea base ejecutada es: 18 pruebas correctas, `pnpm check` sin errores/advertencias/hints y `pnpm build` correcto. La comprobación de navegador corresponde al usuario; no se abre ni automatiza navegador. El cierre separará resultados por comandos del recorrido real de Google pendiente.

## Resultado

Los incrementos están implementados. La [bitácora](../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md#verificación-final) conserva los comandos, resultados, adaptaciones y mapa de traslado. El acceso real Google y la revisión visual corresponden al usuario.
