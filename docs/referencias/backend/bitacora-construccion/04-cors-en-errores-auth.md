# 04 — Conservar CORS al responder errores de autenticación

Fecha de creación: 2026-10-18
Estado: Implementado y verificado en pruebas; proceso API 8081 pendiente de reinicio por el usuario
Ámbito: composición HTTP del runtime
Relacionada con: [integración de auth](03-integrar-auth-sin-retirar-backend-existente.md), [implementación frontend](../../frontend/bitacora-construccion/02-pagina-prueba-auth-firebase.md), [plan Angular](../../frontend/docs/plans/auth/02-implementar-pagina-prueba-auth.md)
Revisión de partida: `1c416da8da2e6b0d5970d138ce3d34951ab6eda6`.

## Evidencia y problema

Durante la ejecución del plan Angular, curl contra la API real http://127.0.0.1:8081 comprobó health 200 y OPTIONS permitido para http://localhost:4200. Sin embargo, GET me y POST sync con ese Origin, sin token, devolvieron 401 invalid_token sin Access-Control-Allow-Origin. Un navegador no puede entregar ese status/cuerpo al cliente web aunque el preflight pase; la renovación controlada ante 401 también queda inaccesible.

El código de [runtime_routes](../crates/backend_http/src/http_server/mod.rs) aplicaba CORS antes de recuperar rechazos. Un rechazo de auth escapaba de esa envoltura y la respuesta posterior ya no recibía headers CORS. Se confirmó con la prueba nueva antes de modificar la composición: falló con header None para el POST 401.

## Cambio y razón

Se añadió recuperación de errores **dentro de CORS** para que el wrapper pueda añadir el origen permitido a sus respuestas 401/404/503. Se conserva la recuperación externa para los rechazos que produce CORS mismo. No se acepta cualquier origen, no se cambia la verificación del token ni se tocan cuentas, DB, middleware legacy o contratos JSON.

[Test de regresión auth_cors.rs](../tests/auth_cors.rs): dobles del puerto IAuthUseCase, seis combinaciones de errores/métodos; asegura status original, origen permitido, no-store y WWW-Authenticate para 401. Las cinco pruebas auth_http previas comprueban también preflight, origen prohibido y composición legacy y permanecen intactas.

## Comprobación

- cargo test --locked --offline --test auth_cors: rojo antes del cambio por header ausente.
- cargo test --locked --offline --test auth_cors --test auth_http: seis tests correctos después del cambio, sin DB ni proveedor real.
- cargo fmt --check -p backend_http -- --config skip_children=true crates/backend_http/src/http_server/mod.rs tests/auth_cors.rs: correcto, dirigido a los archivos del cambio.
- cargo check --locked --offline -p backend_http: correcto.
- cargo clippy --locked --offline --all-targets --all-features -- -D warnings: correcto.

Un comando inicial de formato alcanzó once archivos históricos ajenos al cambio. Se revisó su diff de formato/orden de imports y se restauraron byte por byte desde la revisión de partida. El diff funcional final modifica únicamente runtime_routes y añade el test independiente; no se reescribieron pruebas originales. No se presenta formato global del workspace como corregido.

## Operación pendiente

El proceso que el usuario ya tenía levantado en 8081 sigue respondiendo con la versión anterior: curl posterior al cambio todavía mostró 401 sin allow-origin. No se detuvo/reinició ese proceso. Debe reiniciarse con su comando habitual y volver a consultar con Origin para comprobar que el 401 ya es legible desde Angular. Esa comprobación de proceso nuevo y el login real no se presentan como ejecutados.
