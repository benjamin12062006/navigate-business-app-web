# 02 — Integrar Firebase y SurrealDB respetando la arquitectura existente

Fecha de creación: 2026-10-17
Estado: Implementado y verificado técnicamente; aceptación desde cliente pendiente
Ámbito: Adaptación aditiva de auth a `feature/first-steps`
Relacionada con: [plan anterior de usuarios](01-migrar-usuarios-postgresql-surrealdb.md), [contrato auth](03-auth-firebase-surrealdb.md), [migraciones](04-esquema-y-migraciones-surrealkit.md), [bitácora](../../bitacora-construccion/03-integrar-auth-sin-retirar-backend-existente.md)
Revisión de partida: `14d8cc496b203a79872268cef0262c848816a7e7`.
Punto de restauración: rama `backup/first-steps-antes-integrar-auth`, mismo commit.
Referencia funcional: `feature/auth@b73acb2`.

## Restricción principal

La arquitectura del usuario manda. No borrar ni mover archivos existentes.
No eliminar, desactivar ni reescribir los tests antiguos para hacer pasar auth.
Conservar módulos de usuarios, bcrypt, repositorios SQLx, Qdrant, DTO,
políticas, puertos, servicios y documentación. Extender solamente puntos de
configuración, recursos, composición y rutas que necesitan conectar auth.
La adaptación anterior en `backup/auth-hexagonal-e299bc0` NO es la base de este
incremento: sustituyó módulos y queda solo como antecedente recuperable.

## Fuente → interpretación → adaptación

| Necesidad y evidencia | Decisión para esta arquitectura | Límite |
| --- | --- | --- |
| [Firebase: firma y claims](../fonts/auth/01-firebase-auth-y-verificacion-rust.md) | Puerto de verificación en auth_ports/out; adaptador Firebase aislado en infraestructura. | ADC no representa una sesión de usuario. |
| [Go: sync/current y composición](../fonts/auth/02-patron-auth-del-backend-go.md) | IAuthUseCase → AuthService → casos individuales → IAccountRepository. | No trasladar estados, baneo ni Admin SDK Go. |
| [SurrealDB: tipos y unicidad](../fonts/auth/03-surrealdb-cuentas-identidad-y-transacciones.md) | AccountDataStore → AccountEntity → StoredAccountRecord → dominio/DTO; queries solo en infraestructura. | Sin copiar SQL PostgreSQL. |
| [SurrealKit beta.6](../fonts/auth/04-surrealkit-version-y-comandos-verificados.md) | Reutilizar rollout inicial, SQL congelado y snapshots de feature/auth, sin volver a generarlos. | Git no revierte datos. |
| Código actual UserService/IUserUseCase/IUserRepository | Repetir sus límites y carpetas para auth; HTTP depende del puerto inbound. | No reemplazar el backend por una app paralela. |

No se atribuye esta adaptación a un curso: las fuentes primarias son código
propio y documentación oficial ya consultada, además de las skills del proveedor.

## Piezas y dependencias

- `backend_domain`: identidad Firebase validada y cuenta, sin SDK ni HTTP.
- `backend_application/auth_ports/in`: IAuthUseCase.
- `backend_application/auth_ports/out`: ITokenVerifier e IAccountRepository,
  con records de entrada/salida neutrales.
- `backend_application/auth_application`: DTO, casos authenticate/sync/current
  y AuthService como fachada del puerto inbound, igual que UserService.
- `backend_infrastructure/auth_infrastructure`: verificador Firebase y
  repositorio/data store/entidad SurrealDB.
- `backend_http/auth_http`: controlador, DTO, rutas y rechazo auth;
  reutiliza middleware y servidor existentes.
- `backend_config/configuration`: extender tipos y loaders actuales;
  Firebase no exige clave privada para verificar certificados públicos.
- `backend_bootstrap/bootstrap`: recursos, ServiceResources, constructor
  auth y composición dentro de app existente.

## Compatibilidad y configuración

Se conserva el contrato de usuarios y todos sus tests. Su código sigue
compilado, disponible en `http_server::routes(Services)` y en el constructor
legado de Server. El runtime Firebase se compone en el mismo servidor;
LEGACY_USER_API_ENABLED habilita explícitamente las rutas antiguas en desarrollo.
No se usan como login Firebase ni se publica por defecto el listado de usuarios.
PostgreSQL y Qdrant son recursos opcionales de ejecución, sin retirar sus
adaptadores. QDRANT_ENABLED permite reconectar Qdrant cuando se necesite.

El cliente SurrealDB conserva selección de protocolo con el SDK remoto
`Any`, admitiendo HTTP(S) y WS(S). Se explicita auth root/namespace/database;
la cuenta local ya configurada usa database. Configuración se lee sin mutar
variables globales después de crear el runtime Tokio. Se preservan nombres
antiguos mediante aliases hacia SURREALDB_HOST/NAME/USER.

Las dependencias de motores embebidos SurrealDB no se necesitan para este
backend remoto. La prueba inicial offline encontró `diskann` no disponible
por kv-mem; ajustar las features del SDK remoto no retira código ni tests.
SQLx, Qdrant y bcrypt permanecen en el grafo.

## Orden y aceptación

1. Asegurar checkpoint y registrar inventario original de archivos/tests.
2. Incorporar fuentes, este plan y entrada En curso antes de escribir auth.
3. Añadir dominio, puertos inbound/outbound, records, DTO, casos y fachada.
4. Añadir adaptadores con la verificación criptográfica y concurrencia ya
   comprobadas en feature/auth, adaptadas a data store y entidad existentes.
5. Extender configuración, recursos, constructores y servidor actuales.
6. Incorporar sin regenerar el rollout, wrapper y skills locales Firebase.
7. Ejecutar los tests antiguos intactos más los nuevos, Cargo check/Clippy,
   ensayos opt-in de base y certificados, y arranque real con SurrealDB.
8. Verificar cero archivos eliminados, cero cambios en tests originales,
   documentación coherente y secretos excluidos; guardar el incremento.

Las 42 pruebas históricas siguen siendo parte del criterio. No afirmar
que las nuevas sustituyen su cobertura. El ensayo de login desde cliente con
ID token real sigue separado; no se debilita la verificación para simularlo.
