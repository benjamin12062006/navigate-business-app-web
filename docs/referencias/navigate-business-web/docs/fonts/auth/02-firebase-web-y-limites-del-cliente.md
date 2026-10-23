# 02 — Firebase web: identidad, sesión y límites del cliente

Fecha de creación: 2026-10-16
Estado: Investigación
Tipo de fuente: Documentación oficial vigente.
Origen: Firebase Authentication y Firebase para web.
Fecha de consulta: 2026-10-16.
Relacionada con: [contrato Go](01-contrato-real-api-go.md), [curso Astro](../astro/01-renderizado-islas-y-configuracion.md), [configuración](../../plans/01-configuracion-antes-de-construir.md), [plan auth](../../plans/auth/01-google-firebase-y-api-go.md).

## Fuentes y localización

| ID | Fuente y sección consultada | Evidencia |
| --- | --- | --- |
| F-F1 | [Add Firebase to your JavaScript project](https://firebase.google.com/docs/web/setup), «Register your app» y «Access Firebase in your app» | Registrar la app web y usar imports modulares por producto. |
| F-F2 | [Authenticate Using Google with JavaScript](https://firebase.google.com/docs/auth/web/google-signin), «Before you begin» y «Handle the sign-in flow with the Firebase SDK» | Habilitar Google; el SDK ofrece popup y redirect. El access token de Google sirve para APIs de Google. |
| F-F3 | [Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens), «Retrieve ID tokens on clients» y «Verify ID tokens using the Firebase Admin SDK» | Recuperar el ID token del usuario Firebase y enviarlo al backend para verificarlo. |
| F-F4 | [Get Started with Firebase Authentication](https://firebase.google.com/docs/auth/web/start), «Set an authentication state observer and get user data» | Observar restauración y cambios de identidad con `onAuthStateChanged`. |
| F-F5 | [Authentication State Persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence), «Supported types» y «Modifying the Auth state persistence» | Hay persistencia local, de sesión y en memoria; se configura explícitamente. |
| F-F6 | [Best practices for using signInWithRedirect](https://firebase.google.com/docs/auth/web/redirect-best-practices), introducción y opciones por hosting | El redirect requiere considerar las restricciones de almacenamiento de terceros y el dominio de autenticación. |
| F-F7 | [Learn about and manage API keys for Firebase](https://firebase.google.com/docs/projects/api-keys), «API keys for Firebase are different» | La API key Firebase identifica proyecto/app; no autoriza por sí misma el acceso a datos. Revisar sus restricciones. |

## Aplicación al contrato del proyecto

**Adaptación:** navegador → Google mediante Firebase → ID token Firebase → `Authorization: Bearer` → Go → cuenta SQL. La verificación y la suspensión corresponden a Go. No se reenvía `credential.accessToken` como identidad de nuestra API. [F-F2, F-F3; contrato F-B2](01-contrato-real-api-go.md)

**Propuesta inicial:** popup desde un gesto del usuario para comprobar el primer acceso web. Cancelación y bloqueo deben tener resultados recuperables. Si se incorpora redirect, aplicar F-F6 y comprobar su retorno en el hosting elegido antes de darlo por soportado.

**Propuesta de sesión:** fijar conscientemente la persistencia antes de iniciar sesión; para el primer incremento se propone `browserSessionPersistence`. Comprobar recarga, cierre de pestaña y otra cuenta. El SDK administra la sesión; la aplicación no mantendrá una segunda copia manual de refresh/ID tokens. [F-F5]

Esperar la restauración inicial antes de decidir entre entrada pública y preparación de cuenta. Obtener un ID token actual mediante el SDK antes de llamar a Go. Limpiar perfil y operaciones pendientes al salir o cambiar de identidad. Estas reglas son adaptación del proyecto sobre los eventos de sesión del proveedor. [F-F3, F-F4]

## Configuración necesaria y aspectos sin verificar

Se necesita una app web del mismo proyecto que verifica Go, Google habilitado, dominio autorizado y su configuración pública. Se copiarán los valores desde la app registrada; no se inventan en esta investigación. [F-F1, F-F2]

La configuración web pública y la API key Firebase viajan al navegador. Las credenciales Admin/ADC, contraseñas SQL y claves de otros proveedores permanecen en Go; no se convierten en variables `PUBLIC_`. [F-F7; contrato F-B4](01-contrato-real-api-go.md)

No se consultó la consola Firebase ni se confirmó la existencia de la app web, dominios o proveedor Google del entorno. No se creó otro proyecto Firebase, ni se configuró Hosting, Analytics, Firestore o SQL Connect para el navegador. Las versiones del SDK y su integración con Astro se resolverán al implementar; esta ficha no declara un login probado.
