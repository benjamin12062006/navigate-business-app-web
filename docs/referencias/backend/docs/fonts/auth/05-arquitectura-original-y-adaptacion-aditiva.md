# 05 — Arquitectura original y adaptación aditiva

Fecha de creación: 2026-10-17
Estado: Evidencia de código e interpretación aplicada
Tipo de fuente: Código propio versionado y código publicado del SDK
Fecha de consulta: 2026-10-17, America/New_York
Relacionada con: [plan de adaptación](../../plans/02-integrar-auth-respetando-arquitectura-existente.md), [bitácora](../../../bitacora-construccion/03-integrar-auth-sin-retirar-backend-existente.md)

## Evidencia consultada

| ID | Revisión, archivo y símbolo | Mecanismo observado |
| --- | --- | --- |
| A1 | `14d8cc4`, [UserService](../../../crates/backend_application/src/user_application/user_service.rs), `impl IUserUseCase` | Fachada inbound que delega en casos individuales. |
| A2 | `14d8cc4`, [IUserRepository](../../../crates/backend_application/src/user_ports/out/user/user_repository.rs) | Puerto outbound con records neutrales. |
| A3 | `14d8cc4`, [UserRepository](../../../crates/backend_infrastructure/src/user_infrastructure/repositories/user_repository.rs), [UserDataStore](../../../crates/backend_infrastructure/src/user_infrastructure/repositories/user_data_store.rs), [UserEntity](../../../crates/backend_infrastructure/src/user_infrastructure/repositories/user_entity.rs) | SDK/query en data store, mapeo a record en adaptador. |
| A4 | `14d8cc4`, [recursos](../../../crates/backend_bootstrap/src/bootstrap/resources/mod.rs), [ServiceResources](../../../crates/backend_bootstrap/src/bootstrap/services/service_resources.rs) y [constructor user](../../../crates/backend_bootstrap/src/bootstrap/services/user.rs) | Creación e inyección en bootstrap, fuera de handlers. |
| A5 | `14d8cc4`, [middleware genérico](../../../crates/backend_http/src/middleware/service.rs), `with_service` y [rutas](../../../crates/backend_http/src/http_server/mod.rs), `routes(Services)` | HTTP consume el puerto inbound; es comprobable sin DB. |
| A6 | `feature/auth@b73acb2`, `src/auth/firebase.rs`, `src/auth/surreal.rs`, `database/rollouts/` | Comportamiento Firebase y cuenta SurrealDB; se adapta su mecanismo, no su organización de un crate. |
| A7 | SDK publicado `surrealdb` 3.3.4, `src/engine/any/mod.rs`, `connect` / `IntoEndpoint` | Any recibe URL con protocolo; el router remoto selecciona HTTP(S)/WS(S) según URL y features. |

A1–A5 están en el checkpoint y se releyeron antes de editar. A6 se consultó
mediante `git show feature/auth:<ruta>`; no se atribuye al checkpoint original.
A7 corresponde al paquete publicado del SDK, commit
`1ac2b1dba7cd177621a4cf5d507caebeb2414395` según su `.cargo_vcs_info.json`.
La documentación oficial de [connect](https://surrealdb.com/docs/reference/rust/methods/connect)
respalda la conexión y autenticación posteriores. No se copian fuentes del
registry ni credenciales al proyecto.

## Interpretación y adaptación

A1/A2 → crear IAuthUseCase, AuthService, casos authenticate/sync/current,
ITokenVerifier e IAccountRepository con records. A3 → separar AccountDataStore,
AccountEntity y AccountRepository. A4/A5 → extender los constructores y el
servidor existentes, sin sustituir los módulos de usuarios.

El tipo domain VerifiedIdentity no se deserializa desde HTTP; el servicio
resuelve verificación mediante un puerto de salida. HTTP consume solo inbound,
convierte AccountOutput a su DTO y nunca ejecuta SurrealQL. Son adaptaciones
propias que encajan el [mecanismo Firebase](01-firebase-auth-y-verificacion-rust.md)
y [las reglas SurrealDB](03-surrealdb-cuentas-identidad-y-transacciones.md).
No se atribuye este diseño a un curso ni al proveedor Firebase.

La selección Any conserva el cliente compartido en DatabaseResources y
ServiceResources y permite mantener health checks y constructores existentes.
Las features son remotas: no hace falta compilar un motor embebido para usar
una instancia Docker. Los adaptadores SQLx/Qdrant y bcrypt siguen disponibles.
