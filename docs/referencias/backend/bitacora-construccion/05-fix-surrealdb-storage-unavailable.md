# Corrección del error `storage_unavailable` en SurrealDB

**Fecha de creación:** 2026-10-19
**Relacionada con:** `03-integrar-auth-sin-retirar-backend-existente.md`
**Estado:** Implementado y verificado

## Contexto y Objetivo
El endpoint `/v1/auth/sync` estaba fallando sistemáticamente con un error HTTP 503 (`{"error":"storage_unavailable"}`) al intentar sincronizar cuentas de Firebase que posiblemente ya existían en la base de datos o bajo condiciones de concurrencia. El objetivo fue identificar la raíz del error y corregir el comportamiento para que la sincronización de cuentas fuera exitosa en lugar de bloquear al usuario.

## Proceso de Depuración (Evidencia)

Al rastrear el código, se identificó que el backend retornaba `AuthError::StorageUnavailable` desde `crates/backend_infrastructure/src/auth_infrastructure/repositories/account_repository.rs`. 

Para obtener visibilidad de lo que realmente estaba devolviendo SurrealDB, agregué temporalmente logs de depuración (`println!("{:?}", error)`) en las funciones `find` y `create` del repositorio y escribí un binario de prueba (`bin_test.rs`) para ejecutar consultas aisladas.

Al intentar registrar un usuario duplicado que violaba el índice único `firebase_identity_unique`, SurrealDB generaba el siguiente error:

```text
Error: Error { 
    code: -32000, 
    message: "Database index `firebase_identity_unique` already contains ['test2', 'test_uid2'], with record `account:6e1hy6cfk36svhjoy3iz`", 
    details: Internal, 
    cause: None 
}
is_already_exists: false
query_details: None
```

## Interpretación
El SDK de SurrealDB estaba devolviendo un error interno (`details: Internal`) en lugar de marcarlo explícitamente como una colisión de registro (`is_already_exists() == false` y `query_details` vacío).

En el código original, la función que determinaba si se trataba de una creación competitiva (una colisión normal esperada al hacer upsert) estaba implementada así:

```rust
fn is_competing_creation(error: &surrealdb::Error) -> bool {
    matches!(
        error.query_details(),
        Some(surrealdb::types::QueryError::TransactionConflict)
    ) || error.is_already_exists()
}
```

Al no cumplirse ninguna de estas dos condiciones para el error emitido, la función retornaba `false`. Como resultado, el método `sync` en `AccountRepository` asumía que el almacenamiento no estaba disponible (`AuthError::StorageUnavailable`) y cortaba el flujo, en lugar de manejar la colisión silenciosamente y devolver el registro existente.

## Implementación y Adaptación

Se ajustó la validación en `crates/backend_infrastructure/src/auth_infrastructure/repositories/account_repository.rs` para que inspeccione también el texto del mensaje de error, capturando así los escenarios donde SurrealDB reporta violaciones de índices con las frases "already contains" o "already exists".

El código quedó así:

```rust
fn is_competing_creation(error: &surrealdb::Error) -> bool {
    let msg = error.to_string();
    matches!(
        error.query_details(),
        Some(surrealdb::types::QueryError::TransactionConflict)
    ) || error.is_already_exists() 
      || msg.contains("already contains") 
      || msg.contains("already exists")
}
```

*Nota: Los `println!` temporales utilizados durante la depuración fueron revertidos para mantener limpio el código de producción.*

## Comprobaciones ejecutadas
1. **Prueba local simulada:** Ejecución del binario `bin_test.rs` forzando violaciones del índice, validando que se captura correctamente.
2. **Prueba E2E local:** Se levantó el servidor y se enviaron peticiones a `/v1/auth/sync` mediante `curl`.
   - La primera petición retornó `201 Created`.
   - La segunda petición (simulando que el usuario ya existe) retornó exitosamente `200 OK`, resolviendo el falso error `503`.
