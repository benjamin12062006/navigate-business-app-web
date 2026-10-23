# Arquitectura de Navigate App & Web

Fecha de creación: 2026-10-22
Relacionada con: [ejecución](../README.md), [incremento Expo](../bitacora-construccion/01-replicar-acceso-en-expo.md), [arquitectura web copiada](../docs/referencias/navigate-business-web/app/README.md).

La organización de la web se conserva físicamente. `src/app` contiene rutas Expo; `app` contiene la arquitectura. El plugin Expo Router fija explícitamente `src/app` como raíz de rutas: los archivos de arquitectura no se convierten en páginas.

| Área                        | Responsabilidad                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| modules/auth/domain         | Cuenta, identidad, fallos y puertos neutrales.                                                  |
| modules/auth/application    | Casos de uso y DTO de salida. Restauración consulta me y solo crea ante 404 account_not_synced. |
| modules/auth/infrastructure | Firebase web/nativo, HTTP y mapper del contrato de la web.                                      |
| modules/auth/presentation   | Controlador neutral, presenter/view model, hook useSyncExternalStore y vistas React Native.     |
| shared                      | Result, fallos, AsyncState, cancelación y transporte HTTP.                                      |
| bootstrap                   | Lectura explícita de variables EXPO_PUBLIC y factory de recursos.                               |
| composition                 | Construcción de adaptadores/casos de uso/controlador y lease compartido por consumidores.       |
| ui                          | Texto y botones reutilizables, sin SDK ni IO.                                                   |

Recorrido: ruta index → lease del controlador → AuthPageView/useAuth → controlador/casos de uso → puertos → adaptadores Firebase y HTTP. El último consumidor libera el recurso y sus listeners; el remontaje StrictMode adquiere un recurso vivo.

Metro selecciona `firebase-session.adapter.native.ts` en Android/iOS y `.web.ts` en web. El archivo sin sufijo sirve a herramientas Node. La implementación móvil canjea Google por Firebase y delega la persistencia al SDK usando AsyncStorage. La web mantiene browserSessionPersistence y popup.

El gateway conserva `account_id`/`status: active` y /api/v1 de la API Go configurada en la web. No se sustituye por el contrato distinto del backend Rust archivado. Tokens y capacidades getIdToken se mantienen fuera de snapshots/props de presentación. Firebase no aparece en dominio, casos de uso o UI; ESLint verifica esos límites y evita dependencias desde app hacia src.

El typecheck, enlace nativo y revisión visual están pendientes de ejecución por el usuario. El [README](../README.md) distingue pruebas con dobles, configuración y recorrido real.
