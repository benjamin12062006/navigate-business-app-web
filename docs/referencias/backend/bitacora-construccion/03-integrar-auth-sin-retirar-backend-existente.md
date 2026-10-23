# 03 — Integrar auth conservando backend y pruebas existentes

Fecha de creación: 2026-10-17
Estado: Implementado y verificado técnicamente; aceptación desde cliente Firebase pendiente
Ámbito: Adaptación a arquitectura hexagonal existente
Relacionada con: [plan de adaptación](../docs/plans/02-integrar-auth-respetando-arquitectura-existente.md), [contrato auth](../docs/plans/03-auth-firebase-surrealdb.md), [migraciones](../docs/plans/04-esquema-y-migraciones-surrealkit.md)
Revisión de partida y respaldo: `14d8cc4`, `backup/first-steps-antes-integrar-auth`.
Fuente funcional: `feature/auth@b73acb2`.

## Necesidad y límites

El usuario autoriza encajar las piezas nuevas en su arquitectura y prohíbe
eliminar archivos o tests existentes. Este incremento conserva el flujo de
usuarios y sus contratos, y añade auth con puertos, servicios, casos de uso,
DTO, records, repositorios, data stores, entidades y composición equivalentes.

## Evidencia y decisión

[Firebase](../docs/fonts/auth/01-firebase-auth-y-verificacion-rust.md) fundamenta
firma/claims y claves públicas; [Go propio](../docs/fonts/auth/02-patron-auth-del-backend-go.md)
aporta el flujo sync/current; [SurrealDB](../docs/fonts/auth/03-surrealdb-cuentas-identidad-y-transacciones.md)
aporta unicidad y tipos; [SurrealKit](../docs/fonts/auth/04-surrealkit-version-y-comandos-verificados.md)
aporta rollouts externos. La forma concreta de las piezas proviene de los
módulos actuales UserService/IUserUseCase/IUserRepository, no de copiar la
estructura simplificada ni la sustitución anterior.

## Comprobaciones iniciales

- Rama limpia en `14d8cc4`; respaldo con nombre creado antes de cambios.
- Inventario original recuperable en ese commit; ningún archivo debe desaparecer.
- `cargo test --workspace --locked --offline` no arrancó los tests por ausencia
  de `diskann`, dependencia del motor embebido activado por kv-mem. No se
  presenta esa ejecución como un fallo de los tests ni como una prueba pasada.
- El código de auth y el rollout ya están guardados en feature/auth; la base
  local no se reinicializa al adaptar la organización de Rust.

## Implementación y funcionamiento

| Fuente / restricción | Piezas implementadas |
| --- | --- |
| Arquitectura original A1/A2 en [ficha 05](../docs/fonts/auth/05-arquitectura-original-y-adaptacion-aditiva.md) | [IAuthUseCase](../crates/backend_application/src/auth_ports/in/auth_use_case.rs), [AuthService](../crates/backend_application/src/auth_application/auth_service.rs) y casos separados authenticate/sync/current. |
| Ports/records y dominio propios | [IAccountRepository](../crates/backend_application/src/auth_ports/out/account/account_repository.rs), records neutrales y [VerifiedIdentity](../crates/backend_domain/src/auth/verified_identity.rs), no deserializable desde el cliente. |
| Firebase, identidad verificada antes de persistir | [FirebaseVerifier](../crates/backend_infrastructure/src/auth_infrastructure/firebase/firebase_token_verifier.rs), firma/claims/proveedor y caché con renovación única y enfriamiento. |
| SurrealDB y patrón existente repository/data store/entity | [AccountRepository](../crates/backend_infrastructure/src/auth_infrastructure/repositories/account_repository.rs), [AccountDataStore](../crates/backend_infrastructure/src/auth_infrastructure/repositories/account_data_store.rs) y [AccountEntity](../crates/backend_infrastructure/src/auth_infrastructure/repositories/account_entity.rs). |
| Frontera HTTP consume inbound | [auth_controller](../crates/backend_http/src/auth_http/auth_controller.rs), DTO y middleware auth; no SQL ni SDK de proveedor en HTTP. |
| Configuración, recursos y composición existentes | Extensiones de los loaders, [DatabaseResources](../crates/backend_bootstrap/src/bootstrap/resources/databases/mod.rs), [constructor auth](../crates/backend_bootstrap/src/bootstrap/services/auth.rs), ServiceResources y Server existentes. |

El flujo es Bearer → IAuthUseCase::authenticate → caso authenticate →
ITokenVerifier → VerifiedIdentity → caso sync/current → IAccountRepository →
AccountDataStore → AccountEntity → StoredAccountRecord → Account de dominio →
AccountOutput → DTO HTTP. El cliente nunca elige UID ni cuenta por el body.
La cuenta propia es idempotente y el índice compuesto impide duplicados.

Los errores auth permanecen neutrales hasta HTTP y se traducen a 401/404/503.
La composición legacy queda acotada a /v1/users para que su recuperación de
errores no oculte errores de auth. Sus validaciones, 400/405 y cuerpos antiguos
se conservan al activar el módulo. La prueba nueva reutiliza el fake original
y cubre también ese límite entre recuperaciones.

Ningún archivo original fue eliminado o movido. Los 13 archivos originales de
`tests/` (8 Rust y 5 documentos) se comparan byte por byte con `14d8cc4`.
Las pruebas unitarias originales de DTO/políticas también permanecen.
SQLx, Qdrant y bcrypt siguen en Cargo.lock; los siete crates continúan activos.
El ajuste de Clippy en el data store PostgreSQL quita únicamente una referencia
redundante `.bind(&user_id)` → `.bind(user_id)`, sin alterar SQL ni contrato.
Se mantiene el módulo público `configuration::configuration`; una excepción
local module_inception evita renombrar esa ruta para satisfacer el lint.

## Migraciones y entorno

Esquema, SQL congelado y snapshots coinciden byte por byte con feature/auth.
La lectura del estado muestra `20261018023549__initial_firebase_account`
completed y ninguna migración pendiente. El bootstrap comprueba existencia de
account en infraestructura, sin DDL automático. No se cambiaron usuarios de servicio, contraseñas ni volúmenes, y no se
alteraron datos preexistentes para realizar este traslado.
Las pruebas de DB crean/eliminan su propia base y una fila sintética propia.

El entorno API existente usa Firebase business-managment-rs y usuario
SurrealDB con alcance database. No se leen credenciales ADC desde el runtime;
no se exige clave privada Firebase. Los archivos privados siguen excluidos.

## Comprobación

| Ejecución real | Resultado |
| --- | --- |
| `make check` | Cargo check de workspace/all-targets y Clippy all-targets/all-features con -D warnings correctos. |
| `cargo test --workspace --locked -- --include-ignored` | 64 pruebas correctas: 42 originales y 22 nuevas, sin fallos ni casos marcados ignored. |
| Suite PostgreSQL histórica | Archivo intacto; RUN_DB_TESTS no activado, por lo que su ping real no se ejecutó. No presentarlo como conectividad PostgreSQL verificada. |
| Repositorio SurrealDB real | Base propia aislada, esquema ausente/presente, tipos e índices, proyectos separados, 12 sync concurrentes con una cuenta, parámetros con caracteres de inyección y cleanup correctos. |
| Usuario de servicio configurado | Sync idempotente y current correctos; fila sintética eliminada. |
| Certificados Google | Descarga/decodificación de certificados públicos correcta; no implica login real. |
| Composición usuarios/auth | Mismo fake original, 200 de listado, 400 de validación, 405 y errores auth separados correctos. |
| `python3 scripts/db.py rollout lint` y `rollout status` | Cadena/hashes válidos; rollout inicial completed y sin pendientes. |
| Arranque real del bootstrap adaptado | Health 200, sync/me sin token 401, usuario legado desactivado 404, preflight CORS 200 y no-store correctos. Proceso temporal detenido. |
| `docker compose --env-file .env.migrations config --quiet` | Correcto, sin recrear servicios. |
| Inventario contra 14d8cc4 | Cero archivos originales ausentes; 13 archivos antiguos de tests/documentación idénticos byte por byte. |
| Comparación con feature/auth | Esquema, manifests congelados y snapshots idénticos byte por byte. |

Cargo fmt se aplicó a las piezas añadidas/modificadas, restaurando el contenido
exacto de los archivos originales que no se editaron. El check global informa
11 archivos con diferencias de formato históricas, todos intactos frente al
checkpoint; ninguna pieza nueva/modificada tiene diferencias pendientes.
Se preservaron esos archivos por la restricción de no reescribir tests y por
mantener el alcance. No se presenta el formato global como aprobado.

Cargo también avisó de permisos al intentar limpiar su caché global de otro
paquete (`uv`); las verificaciones finales terminaron correctamente y no se
modificaron permisos globales. El bloqueo inicial offline por diskann se
resolvió seleccionando únicamente los transportes remotos del SDK, sin retirar
ningún archivo del backend ni sus adaptadores SQLx/Qdrant.


## Límites

La sesión Firebase real desde un cliente todavía no se ha ensayado. Las
fixtures firman con una clave ficticia; la consulta de certificados públicos
comprueba su lectura, no una sesión de usuario. No hay consulta de revocación
por petición ni estados/baneo. Tokens ya emitidos pueden durar hasta expirar.
El CRUD histórico no se confunde con el nuevo login ni se declara migrado
por incorporar la tabla account. El plan 01 continúa como trabajo separado.
