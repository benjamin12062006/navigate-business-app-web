# 01 — Contrato real de la API Go para el frontend

Fecha de creación: 2026-10-16
Estado: Investigación
Tipo de fuente: Código propio, documentación de producto e historial local.
Origen: `navigate-business-web` y `navigate-business-api`.
Fecha de consulta: 2026-10-16, America/New_York.
Relacionada con: [configuración inicial](../../plans/01-configuracion-antes-de-construir.md), [plan de auth](../../plans/auth/01-google-firebase-y-api-go.md), [Firebase oficial](02-firebase-web-y-limites-del-cliente.md).
Revisiones de referencia: web `e52268ae9daa83ea820c3d65cbd5783968c083e8`; API `fbb1bc0ba80e8f454a8e299bbc0688790cdf5d2d`.

## F-B1 — Producto y estado inicial

El [producto, RF-01 y RNF-01](../../../../docs/product/04-requisitos-y-recorridos.md) pide acceso al espacio personal y comprobación de permisos en la API. Las listas, análisis y dashboard son requisitos futuros: el [router actual](../../../../navigate-business-api/internal/httpapi/router.go), `NewRouter`, líneas 13–32, solo publica las dos rutas auth de abajo.

El frontend conserva una [página inicial](../../../src/pages/index.astro) con un encabezado, [configuración Astro vacía](../../../astro.config.mjs) y [package.json](../../../package.json) con Astro `^7.3.3`, sin Firebase ni React/Vue/Svelte. La dependencia instalada consultada es Astro `7.3.3`. `node --version` informó `v24.2.0` y `pnpm --version`, `12.5.1`; esto no sustituye una compilación.

El árbol web estaba limpio antes de esta documentación. En la API había cambios locales en `docs/understand/auth.md` e `internal/auth/postgres/account_repository.go`; se leyeron como contexto y no se modificaron.

## F-B2 — Qué autentica Go

- [Verificador Firebase](../../../../navigate-business-api/internal/auth/firebase/verifier.go), `Verify` y `googleUID`, líneas 29–44: usa `VerifyIDTokenAndCheckRevoked`, exige UID y proveedor `google.com`.
- [Middleware HTTP](../../../../navigate-business-api/internal/auth/http/middleware.go), `RequireGoogle`, líneas 22–50: exige una sola cabecera `Authorization: Bearer <token>` y obtiene el UID del verificador.
- [Servicio](../../../../navigate-business-api/internal/auth/service.go), `Sync` y `Current`, líneas 18–37: relaciona la identidad Firebase con la cuenta interna y rechaza `suspended`.

**Evidencia:** Go verifica una identidad existente; no hay endpoint para introducir correo/contraseña ni para iniciar Google OAuth. **Interpretación:** hace falta iniciar sesión con el SDK web de Firebase y enviar su ID token. No sirve enviar el UID como prueba de identidad, ni sustituirlo por un access token de Google. La distinción de tokens se contrasta en [F-F3](02-firebase-web-y-limites-del-cliente.md).

## F-B3 — Peticiones y respuestas

Fuentes: [handlers](../../../../navigate-business-api/internal/auth/http/handler.go), `Sync`, `Current`, `writeAccountError` y `writeAuthError`, líneas 19–62; [Account](../../../../navigate-business-api/internal/auth/account.go), líneas 17–21; middleware anterior.

| Petición o condición | Respuesta actual |
| --- | --- |
| `POST /api/v1/auth/sync`, identidad nueva válida | `201`, `{ "account_id": "<uuid>", "status": "active" }` |
| Mismo POST, identidad ya sincronizada | `200`, misma forma de cuenta |
| `GET /api/v1/auth/me`, cuenta existente | `200`, misma forma de cuenta |
| GET antes de sincronizar | `404`, `{ "error": "account_not_synced" }` |
| Cuenta suspendida | `403`, `{ "error": "account_suspended" }` |
| Bearer ausente o rechazado como identidad inválida | `401`, `{ "error": "invalid_token" }` |
| Verificación indisponible u otro error del verificador | `503`, `{ "error": "auth_unavailable" }` |
| Error de persistencia | `503`, `{ "error": "storage_unavailable" }` |

`POST /sync` no lee cuerpo: la identidad viene del token. `GET /me` no crea cuentas. Las respuestas de estos handlers y del middleware usan `Cache-Control: no-store`. El contrato mínimo no expone correo, avatar, roles ni portafolios. La UI puede leer presentación del usuario Firebase, pero la cuenta autorizada de aplicación viene de Go.

**Límite del verificador observado:** el código enumera algunas clases de errores Firebase como `401` y envía las restantes a `503`. No se afirma que todos los casos de revocación/expiración reciban hoy el código deseado: hay que comprobarlos con la versión instalada y tokens reales al integrar.

## F-B4 — Orígenes, red y configuración

[NewRouter](../../../../navigate-business-api/internal/httpapi/router.go), líneas 20–24, permite exactamente `http://localhost:4321` y `http://127.0.0.1:4321`; métodos GET/POST/OPTIONS; cabeceras Accept/Content-Type/Authorization. Es configuración leída, no un preflight ya ejecutado. No configura cookies con credenciales CORS.

[Config.Load](../../../../navigate-business-api/internal/config/config.go), líneas 25–45, usa por defecto `127.0.0.1:8080` si no hay `HTTP_ADDR`. Por tanto `http://127.0.0.1:8080/api/v1` es una **base candidata local**, no una prueba de servidor levantado. No existe sonda `/health` en el router consultado. La conexión debe comprobarse contra una ruta real, por ejemplo `/auth/me` sin token.

Los valores `FIREBASE_PROJECT_ID`, ADC, instancia SQL y contraseña de base son del backend. El cliente necesitará configuración pública de una app web del mismo proyecto Firebase y una URL de API. No se abrieron archivos privados de entorno para completar valores.

## F-B5 — Historia, límites y adaptación

El [plan backend](../../../../navigate-business-api/docs/plans/01-autenticacion-firebase-y-cuenta-interna.md) y la [entrada inicial auth](../../../../navigate-business-api/bitacora-construccion/auth/01-google-firebase-y-cuenta-sql.md) contienen referencias históricas a Expo/tiendas. La [conexión Cloud SQL](../../../../navigate-business-api/bitacora-construccion/config/02-conexion-cloud-sql-go-adc.md), sección final, registra conexión de runtime verificada y migración/recorrido autenticado pendientes en ese momento. Nada de ello demuestra que hoy el login completo esté operativo.

**Propuesta propia para este frontend:** conservar las rutas existentes, autenticar en el navegador y dejar identidad verificada, cuenta y persistencia en Go. No duplicar tablas ni introducir Auth.js, Better Auth, SQL Connect web o Firebase Admin en Astro por copiar un curso. Este informe es una inspección estática; no ejecutó API, migraciones ni autenticación real.
