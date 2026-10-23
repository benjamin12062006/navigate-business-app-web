# Guía para entender auth

Fecha de creación: 2026-10-17
Última actualización: 2026-10-18
Relacionada con: [mapa de la arquitectura (`app/`)](../../README.md), [mapa de Astro (`src/`)](../../../src/README.md), [separación `src`/`app`](../../../bitacora-construccion/auth/05-separar-src-astro-y-app-arquitectura.md), [migración](../../../bitacora-construccion/auth/04-migracion-clean-e-islas-independientes.md).

## Sigue una intención del usuario

```text
AuthIsland (montaje cliente, lease compartido)
  → AuthPageView → useAuth → AuthSurface y componentes (props/eventos)
  → AuthController (estado y coordinación neutral)
  → casos de uso → puertos outbound
  → FirebaseSessionAdapter / HttpAccountGatewayAdapter
  → SDK Firebase / HttpClient → Go
```

[AuthPageView](presentation/views/AuthPageView.vue) recibe el controlador. [useAuth](presentation/composables/use-auth.ts) adapta su suscripción a una referencia Vue y se desuscribe al desmontar. [AuthSurface](presentation/views/AuthSurface.vue) recibe solo datos y emite `login`, `retry` y `logout`. Los componentes de account, sign-in y status conservan textos, accesibilidad y clases Tailwind.

El [controlador](presentation/controllers/auth.controller.ts) conserva el estado de UI, la identidad privada, generaciones y cancelación. No importa Vue, Firebase, fetch ni DOM. Su snapshot expone un perfil copiado, nunca `getIdToken`. Los errores esperados viajan como `Result`; el [presenter](presentation/presenters/auth-failure.presenter.ts) los convierte en mensajes y acciones. Internamente, `AsyncState` distingue cuenta sin cargar, cargando, disponible y fallida.

## Qué hace cada capa

| Capa                | Archivos principales y responsabilidad                                                                                                                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| domain              | [Account](domain/entities/account.entity.ts), [SessionUser](domain/entities/session-user.entity.ts), [AuthFailure](domain/failures/auth-failure.ts), [SessionPort](domain/ports/outbound/session.port.ts) y [AccountGatewayPort](domain/ports/outbound/account-gateway.port.ts); contratos sin SDK    |
| application         | [load-account](application/use-cases/load-account.use-case.ts) decide cuándo consultar/sincronizar; [session.use-cases](application/use-cases/session.use-cases.ts) expone intenciones sobre el puerto; DTOs y mapper definen datos de salida                                                         |
| infrastructure      | [Firebase](infrastructure/adapters/firebase-session.adapter.ts) traduce usuarios/errores; [gateway HTTP](infrastructure/adapters/http-account-gateway.adapter.ts) prepara Bearer y renueva una vez; [mapper de cuenta](infrastructure/mappers/account.mapper.ts) valida UUID/estado y crea la entidad |
| presentation        | Controlador observable, view model/presenter, composable y componentes Vue; no instancia adaptadores                                                                                                                                                                                                  |
| composition externa | [createAuthModule](../../composition/auth/create-auth-module.ts) conecta dependencias; [auth-client](../../composition/auth/auth-client.ts) elige los adaptadores reales y comparte su controlador en cliente                                                                                         |

## Restauración, entrada y salida

- Al montar el primer consumidor se inicializa Firebase con persistencia de sesión. Un evento restaurado consulta `GET /auth/me`. Solo `404 account_not_synced` permite después `POST /auth/sync`.
- El login explícito usa Google popup y `POST /auth/sync` sin cuerpo antes de declarar la cuenta lista. El ID token se obtiene para cada intento y se renueva una sola vez ante 401; 403/503 no se repiten automáticamente.
- Una caída de Go conserva la identidad y permite reintentar. Una cuenta suspendida impide continuar. Un token inválido pide verificar la sesión de nuevo.
- La salida oculta inmediatamente la cuenta, cancela la operación e ignora eventos/respuestas antiguos. Las generaciones también protegen frente a transportes que resuelven después del abort.
- El último consumidor libera el observer y las operaciones. Desmontar una isla no destruye la sesión que otra sigue utilizando. Liberar un recurso no equivale a ejecutar logout en Firebase.

Los adaptadores conservan un límite de 12 segundos por intento que incluye token y cuerpo. Configuración inválida produce el estado de preparación sin inicializar Firebase; no reaparece la ayuda de configuración local retirada.

## Otra isla o un script TypeScript

Otra entrada Vue puede usar el mismo mecanismo que [AuthIsland](../../../src/islands/AuthIsland.vue): adquirir en `onMounted`, pasar `lease.value` como prop de `AuthPageView` y llamar `lease.release()` al desmontar. No se pasa el controlador desde el frontmatter Astro porque contiene funciones.

Un consumidor TypeScript no necesita Vue:

```ts
import { acquireAuthClient } from '@composition/auth/auth-client';

// Ejecutar en el montaje cliente del consumidor.
const lease = acquireAuthClient();
const controller = lease.value;
const unsubscribe = controller.subscribe((state) => {
  // Actualizar la presentación propia con state, sin acceder a SDKs o tokens.
  console.log(state.phase);
});

// Conectar controller.login/logout/retry a las intenciones del consumidor.
// Al desmontar ese consumidor:
unsubscribe();
lease.release();
```

El ejemplo muestra el contrato de integración y no agrega una ruta ni un segundo login. La suscripción entrega inmediatamente el snapshot actual. El consumidor conserva y ejecuta ambos cleanups al finalizar su propio ciclo de vida. Un script procesado por Astro puede importar esta entrada; no usar `is:inline` para un archivo que necesita resolución de módulos/TypeScript.

Para probar o reutilizar con otro proveedor, [createAuthModule](../../composition/auth/create-auth-module.ts) recibe `SessionPort` y `AccountGatewayPort`. Esa factory no se importa desde las vistas ni desde domain/application. [Las pruebas](tests/) ejercitan el controlador sin montar Vue ni abrir navegador.
