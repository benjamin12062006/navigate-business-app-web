# Backend hexagonal

La arquitectura original de siete crates y sus módulos de usuarios se conserva.
Firebase y SurrealDB están integrados siguiendo los mismos puertos, casos de
uso, servicios, records, DTO, data stores, entidades y composición.

| Crate | Piezas auth incorporadas |
| --- | --- |
| `backend_domain` | `auth/` (identidad validada y errores), `account/` (cuenta). |
| `backend_application` | `auth_ports/in`, `auth_ports/out/account/records`, `auth_application/dto`, `use_cases` y `auth_service`. |
| `backend_infrastructure` | `auth_infrastructure/firebase`, `repositories/account_repository`, `account_data_store`, `account_entity`. |
| `backend_http` | `auth_http`, middleware auth y extensión del servidor existente. |
| `backend_config` | Extensiones de `configuration`, `database` y loaders existentes. |
| `backend_bootstrap` | Recursos opcionales y constructor auth dentro de `bootstrap/services`. |
| `backend_common` | Utilidades y errores anteriores conservados. |

El [plan específico](docs/plans/02-integrar-auth-respetando-arquitectura-existente.md)
y la [bitácora](bitacora-construccion/03-integrar-auth-sin-retirar-backend-existente.md)
registran decisiones, comprobaciones y límites.

## Configuración y ejecución

El entorno local ya usa `business-managment-rs`. Para otra instalación, copiar
`.env.example` y `.env.migrations.example` a sus nombres privados y sustituir
placeholders. Esos archivos privados y backups están ignorados por Git.
Las variables del proceso tienen prioridad sobre `.env`; el loader no muta
el entorno global después de iniciar Tokio.

- API: `AUTH_PROVIDER=firebase`, `FIREBASE_PROJECT_ID`, puerto, bind y CORS.
- API/SurrealDB: HOST, NAMESPACE, NAME, USER, PASSWORD y AUTH_LEVEL.
- `.env`: usuario de API limitado a database, ya configurado localmente.
- `.env.migrations`: credencial de esquema y bootstrap; no se pasa al proceso API.
- Los nombres antiguos SURREALDB_URL/DATABASE/USERNAME siguen como aliases.
- Producción exige HTTPS/WSS y usuario con alcance; no permite API legacy.

```bash
docker compose --env-file .env.migrations up -d surrealdb
make tools
make db-lint
make db-status
# Para una base nueva, revisar y aplicar el rollout:
make db-up
# Completar solo tras verificar el ID que esté pendiente:
make db-complete ROLLOUT=20261018023549__initial_firebase_account
cargo run --locked
```

El rollout inicial ya figura completed en el entorno local. El API comprueba
la tabla requerida al arrancar y no aplica DDL automáticamente. SurrealKit
1.0.0-beta.6 se instala dentro de `.tools/` con checksum, sin instalación global.
Versionar manifest, SQL congelado y snapshots; no modificar rollouts aplicados.
`baseline` no certifica por sí solo que el esquema real coincida con archivos.
Leer el [plan operativo](docs/plans/04-esquema-y-migraciones-surrealkit.md).

## Login y endpoints

El cliente inicia sesión con Google mediante Firebase, obtiene
`user.getIdToken()` y envía ese Firebase ID token como `Authorization: Bearer`.
ADC de gcloud sirve para herramientas administrativas; no representa esa sesión.
El backend verifica certificados públicos, firma RS256, proyecto, issuer,
fechas y proveedor Google. No necesita una clave privada Admin.

| Ruta | Resultado |
| --- | --- |
| `GET /health` | Liveness público. |
| `POST /v1/auth/sync` | Cuenta propia nueva 201 o existente 200, con UUID estable. |
| `GET /v1/auth/me` | Cuenta propia 200; 404 antes del primer sync. No crea registros. |

Respuestas: `account_id` y `created_at`. El UID proviene del token verificado,
nunca del body. Los errores auth usan códigos estables y no exponen detalles
del SDK. CORS usa orígenes concretos y OPTIONS no exige token.

No se implementan estados de usuario, baneo, roles ni contraseñas nuevas.
La comprobación no consulta revocación/deshabilitación por cada petición;
un token emitido puede seguir aceptándose hasta expirar. No se aceptan tenants
ni tokens sin firma del emulador. La aceptación desde un cliente con sesión
Firebase real sigue pendiente; las pruebas técnicas no sustituyen ese paso.

## Módulos y pruebas originales

Los módulos user_application, user_ports, user_http, user_infrastructure,
políticas, DTO y pruebas siguen en sus rutas originales. SQLx, PostgreSQL y
Qdrant permanecen disponibles. Sus servicios Docker usan el perfil `legacy`.
El constructor/rutas originales de usuarios sigue disponible para sus pruebas.

El runtime Firebase no activa por defecto el antiguo CRUD. En desarrollo,
`LEGACY_USER_API_ENABLED=true` con DATABASE_URL lo conecta al mismo servidor
mediante su constructor existente y exige Bearer Firebase. QDRANT_ENABLED=true
crea su recurso cuando se necesite. No confundir el CRUD de usuarios con el
login Firebase ni con una migración de perfiles/cuentas ya completada.
Las migraciones SQLx históricas se ejecutan solo al inicializar PostgreSQL
para ese recorrido; no se ejecutan contra SurrealDB.

```bash
make check
make test
# Opt-in: DB de prueba aislada, fila sintética propia y certificados Google.
make test-auth-live
```

El test PostgreSQL histórico mantiene su condición RUN_DB_TESTS=true;
se conserva intacto y no demuestra conectividad si esa variable no se activa.
Las pruebas nuevas verifican aplicación sin SDK, composición HTTP con el fake
original de usuarios, firma/claims/caché, concurrencia real e índices SurrealDB.

`make fmt-check` también informa diferencias históricas de formato de archivos
originales que se conservaron intactos. El código añadido y modificado fue
formateado con Cargo sin reescribir esos tests por una cuestión de estilo.

## Restauración

Punto anterior a la integración: `backup/first-steps-antes-integrar-auth` →
`14d8cc4`. `feature/auth` conserva la variante simplificada. La adaptación
anterior queda separada en `backup/auth-hexagonal-e299bc0`.
Volver al código no revierte datos ni migraciones de una base.
