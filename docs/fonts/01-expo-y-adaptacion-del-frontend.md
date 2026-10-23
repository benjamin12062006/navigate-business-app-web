# 01 — Expo, plataforma nativa y adaptación del frontend

Fecha de creación: 2026-10-22
Tipo de fuente: documentación oficial y código local
Fecha de consulta: 2026-10-22
Relacionada con: [implementación](../../bitacora-construccion/01-replicar-acceso-en-expo.md), [manifiesto histórico](../referencias/manifest.json), [ejecución](../../README.md).

## Evidencia consultada

| ID | Fuente y localizador | Decisión respaldada |
| --- | --- | --- |
| E1 | [Expo: crear proyecto](https://docs.expo.dev/get-started/create-a-project/), plantilla default@sdk-58; [release SDK 58](https://expo.dev/changelog/sdk-58), Tool version bumps. | Instalador oficial con pnpm; SDK 58/RN 0.88 y Node 24.3+ en la línea 24. El nombre técnico debe ser válido aunque la carpeta final use &. |
| E2 | [Expo: variables de entorno](https://docs.expo.dev/guides/environment-variables/), Reading environment variables. | Prefijo EXPO_PUBLIC y accesos estáticos process.env.NOMBRE; no copiar secretos del backend. |
| E3 | [Expo: Firebase](https://docs.expo.dev/guides/using-firebase/), Using Firebase JS SDK. | SDK Firebase JS para la sesión en tres plataformas. |
| E4 | [Expo: Google](https://docs.expo.dev/guides/google-authentication/), Choosing a library; [Nitro Expo](https://react-native-nitro-google-sign-in.github.io/docs/setup/expo/), Config plugin; [API](https://react-native-nitro-google-sign-in.github.io/docs/guide/api-reference/), presentExplicitSignIn. | Credential Manager en Android, Google SDK Apple y development build. No usar Expo Go para este módulo. Google se canjea por Firebase antes de hablar con la API. |
| E5 | [NativeWind estable](https://www.nativewind.dev/docs/getting-started/installation), v4.2.7 y configuración Expo. | Tailwind 3, preset Babel, wrapper Metro y declaraciones className. La web Astro usa Tailwind 4; no se traslada su configuración incompatible al runtime nativo. |
| E6 | [Expo: enlaces nativos](https://docs.expo.dev/router/advanced/native-intent/), redirectSystemPath. | El retorno Google conserva la ruta de auth. |
| L1 | [Snapshot web](../referencias/navigate-business-web/app/README.md), controlador, gateway y vistas, revisión 8fbc64cb712970c4d04c42931f67f8481159ce37 con árbol local. | Se conserva la lógica neutral y se sustituyen vistas/composable/adaptador de entorno por React Native/Expo. |
| L2 | [Backend copiado](../referencias/backend/README.md), rutas auth y DTO real AccountResponseDto en backend/crates/backend_http/src/auth_http/, revisión 1c416da8da2e6b0d5970d138ce3d34951ab6eda6 con cambios locales. | Rust usa /v1/auth/me y sync, UUID y created_at. Es referencia histórica; no se usa para sustituir el contrato Go que consume la web actual. |

Se leyeron además las declaraciones y manifiestos instalados de Firebase 13.1.0, Nitro Google 2.3.0 y Expo 58.0.17. Firebase declara getReactNativePersistence en su rama RN, pero su auth-public.d.ts no lo expone; la declaración local de infraestructura completa ese tipo sin modificar el SDK.

El código instalado de Expo 58 en ios/Expo/SceneEventForwarder.swift reenvía los eventos URL de escena al AppDelegate, también al arranque. Esa evidencia fundamenta el plugin local que agrega GIDSignIn.handle(url) y conserva otros handlers; no se reemplaza SceneDelegate ni se copia una plantilla Swift antigua.

## Adaptación propia y límites

El nombre visible App & Web y la selección de plataformas/env son adaptaciones del proyecto. Se conserva el contrato Go del frontend: /api/v1, account_id y status active. La presentación se basa en las vistas locales, no en una captura validada. El icono PNG/adaptativo se rasterizó desde el SVG de marca original, sin diseñar otra identidad.

Los documentos históricos conservan sus afirmaciones originales. El manifiesto identifica las copias byte por byte. No se consultaron cursos nuevos ni se atribuye esta integración a reconstrucciones de lecciones; sus planes/cursos anteriores permanecen en el archivo histórico solicitado.

NativeWind estable documenta su soporte Expo 57 y Nitro incluye una matriz hasta RN 0.87; sus APIs/dependencias se inspeccionaron, pero no hay enlace/ejecución que permita asegurar paridad con SDK 58/RN 0.88. La compilación real de los tres destinos queda para el usuario por instrucción expresa. Las pruebas portadas verifican lógica con dobles.

El .env.local actual de la web contiene expo-city-bol y la API 8085/api/v1. Los archivos públicos móviles disponibles en KOTLIN-APP contienen business-managment-rs, igual que el Rust archivado. Por eso no se mezclan: el cliente replica la configuración web y deja el registro OAuth móvil del mismo proyecto como paso manual documentado.
