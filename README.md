# Navigate Business · App & Web

Equivalente del frontend actual con **Expo SDK 58, React Native 0.88, React 19.3 y pnpm 12.5.1**, creado con el instalador oficial `create-expo-app@latest --template default@sdk-58`.

Conserva la arquitectura `app/modules`, el sistema de sesión y la conexión que usa la web: Google → Firebase **expo-city-bol** → API **Go** en `http://127.0.0.1:8085/api/v1`. Incluye restauración, sincronización, renovación acotada de token, reintento, cancelación y salida. El diseño adapta los mismos textos, papel/verde, tipografías, ilustración y marca a vistas React Native; no usa un WebView.

La carpeta solicitada es `navigate-business-app&web`. El paquete/slug se llama `navigate-business-app-web`: Expo/npm exigen un identificador sin `&`. La web Astro y el backend existentes se conservaron.

## 1. Antes de arrancar

```bash
cd '/Users/benji/Documents/HANDLE-BUSINESS/navigate-business-app&web'
node --version
pnpm --version
pnpm install --frozen-lockfile
```

**Usa Node 24.3+ de la línea 24**, 22.13+ de la línea 22 o 26+. El Node observado al instalar fue 24.2.0, fuera del rango de Expo 58: actualízalo con tu gestor habitual y abre otra terminal antes de arrancar. El rango exacto queda en package.json.

Las dependencias ya están instaladas. El instalador oficial creó el commit inicial de su plantilla; la adaptación se guarda en la rama `master` del [repositorio privado de GitHub](https://github.com/benjamin12062006/navigate-business-app-web). El entorno local está excluido del repositorio.

Por tu instrucción, no se ejecutaron `tsc`, Metro, prebuild, export, Gradle, Xcode, builds EAS ni servidores. No se abrió navegador, app o simulador. Sí se hicieron las comprobaciones no visuales registradas en la [bitácora](bitacora-construccion/01-replicar-acceso-en-expo.md).

## 2. Entorno copiado y API actual

`.env.local` ya contiene los valores públicos reales de la web, renombrados de `PUBLIC_` a `EXPO_PUBLIC_`. Conserva su proyecto Firebase y URL API. Está ignorado por Git. No se copió el `.env` privado del backend, contraseñas SQL, ADC o claves Admin.

| Destino | URL inicial |
| --- | --- |
| Web en el Mac | `EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8085/api/v1` |
| Emulador Android | `EXPO_PUBLIC_ANDROID_API_BASE_URL=http://10.0.2.2:8085/api/v1` |
| Simulador iOS | Usa la base del Mac; admite sobrescribir `EXPO_PUBLIC_IOS_API_BASE_URL` |
| Teléfono físico | Cambia la variable de su plataforma por una dirección del Mac accesible en la misma red |

El contrato conservado es el de la web: `POST /auth/sync` y `GET /auth/me` sobre esa base, con `account_id` y `status: active`. El cliente envía **Firebase ID tokens**, no tokens Google directamente al servidor.

El backend Rust archivado en este workspace tiene otro contrato (`/v1`, `created_at`) y otro proyecto Firebase (`business-managment-rs`). Su bitácora se copió como contexto; no se cambió a esa API porque la petición es replicar el frontend actual. Los archivos móviles de Kotlin pertenecen también a ese otro proyecto y no se reutilizan.

Arranca o utiliza **la misma API Go que ya usa tu web**, en el puerto indicado por su entorno. No se arrancó ni reinició ningún backend. Para la nueva web, añade `http://localhost:8082` y `http://127.0.0.1:8082` a los orígenes CORS permitidos de esa API y reiníciala tú si cambias su configuración.

Para un teléfono físico, la API debe escuchar en una interfaz accesible desde la red, no solo en 127.0.0.1. Android puede usar `http://IP-DEL-MAC:8085/api/v1`. En iOS usa HTTPS o un nombre local como `http://NOMBRE-DEL-MAC.local:8085/api/v1`, sujeto a resolución en tu red. Obtén el nombre local con `scutil --get LocalHostName`. Actualiza la variable de plataforma correspondiente.

HTTP privado se admite solo en desarrollo con `EXPO_PUBLIC_ALLOW_LOCAL_HTTP=true`. iOS permite red local mediante ATS y Android habilita cleartext en desarrollo. Para publicar usa API HTTPS y `APP_VARIANT=production` con variables de producción. Tras cambiar el entorno, recarga la app; cambios de plugins/identificadores requieren reconstruir el cliente nativo.

## 3. Ejecutar la web

```bash
cd '/Users/benji/Documents/HANDLE-BUSINESS/navigate-business-app&web'
pnpm web
```

Abre la URL indicada, normalmente `http://localhost:8082`. Comprueba que Google esté habilitado y localhost/tu dominio autorizados en **expo-city-bol**. Permite la ventana emergente Google. La persistencia web mantiene `browserSessionPersistence`, igual que la web original.

Metro y web usan **8082**. Ejecuta una sola instancia Metro. Para exportar/publicar después, configura primero una API HTTPS y ejecuta tú `pnpm exec expo export --platform web`; este comando no se ejecutó aquí.

## 4. Completar Google para Android/iOS

**La configuración web no contiene los client IDs/registros de las apps móviles.** Debes registrarlas en el mismo proyecto Firebase **expo-city-bol**. No sirve copiar el JSON/plist de KOTLIN-APP porque pertenecen a business-managment-rs.

1. En Firebase Console → Configuración del proyecto → Tus apps, registra Android con paquete **`com.navigatebusiness.app`** y Apple con Bundle ID **`com.navigatebusiness.app`**, los valores de app.config.ts.
2. Descarga `google-services.json` y `GoogleService-Info.plist` a **`config/firebase/`**. El código comprueba que pertenezcan al proyecto indicado en `.env.local`.
3. Revisa Google habilitado en Authentication. En Google Cloud/Firebase, toma el OAuth client ID de tipo **Web** del proyecto y completa `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` en `.env.local`. No es el Firebase APP_ID ni un OAuth ID Android.
4. Completa `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` con el CLIENT_ID del plist iOS. El plugin registra su esquema invertido de retorno.
5. Para Android registra SHA-1 y SHA-256 de la firma **del build Expo**, incluido el keystore que uses en EAS/Play si publicas. No asumas que coincide con otras apps. Tras generar Android, consulta las huellas con `./gradlew signingReport` dentro de `android/`.
6. Si eliges otros identificadores, actualiza app.config.ts y descarga los archivos de esos registros exactos. Regenera el development build al cambiar configuración nativa.

La web puede ejecutarse con su configuración ya copiada. En móvil, mientras falten los client IDs, la pantalla indica que el acceso está en preparación: no simula una cuenta ni usa otro proyecto Firebase.

## 5. Ejecutar Android

Google nativo utiliza Credential Manager mediante Nitro Google Sign-In y requiere un **development build**: no funciona dentro de Expo Go.

Abre tú Android Studio y prepara un emulador con Google Play Services, o conecta un teléfono con depuración USB. Luego:

```bash
cd '/Users/benji/Documents/HANDLE-BUSINESS/navigate-business-app&web'
pnpm android
```

Expo genera `android/` cuando falta, compila, instala y conecta Metro en 8082. Si el development build ya está instalado y solo cambió JavaScript, usa `pnpm start` y abre la app instalada.

Para consultar la firma después de generar Android:

```bash
cd android
./gradlew signingReport
cd ..
```

## 6. Ejecutar iOS

Comprueba que tu Xcode/CocoaPods sean compatibles con SDK 58 y su ciclo de escenas actual. Consulta las [notas oficiales SDK 58](https://expo.dev/changelog/sdk-58) antes de construir si tienes una versión antigua de Xcode.

```bash
cd '/Users/benji/Documents/HANDLE-BUSINESS/navigate-business-app&web'
pnpm ios
```

Expo genera `ios/`, instala pods y construye el cliente. Para trabajar después desde Xcode, abre el `.xcworkspace` generado dentro de `ios/`, selecciona el destino y configura tu equipo de firma si usas iPhone físico. `ios/` y `android/` quedan ignorados por Git.

El plugin local `plugins/with-google-redirect.cjs` conecta `GIDSignIn.handle(url)` al AppDelegate sin quitar otros handlers. Expo 58 reenvía allí los eventos de escenas; `+native-intent.tsx` conserva el acceso al regresar Google. No tienes que pegar esos handlers a mano. El esquema/archivos Google se activan cuando completas la configuración del apartado 4.

## 7. Verificaciones que debes ejecutar

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm exec expo install --check
```

`typecheck` queda para ti por la instrucción de no ejecutar compiladores. Las pruebas con dobles no sustituyen el enlace nativo ni un login real. La validación final de versiones contra los metadatos de Expo fue correcta; un primer intento sin red utilizó el mapa local.

Comprueba personalmente:

1. Acceso en teléfono/escritorio: marca, tipografías, ilustración y tarjeta.
2. Cancelar Google y volver a intentar.
3. Completar Google y esperar a que la API confirme la cuenta.
4. Recargar/reabrir: consultar me; hacer sync solo ante 404 account_not_synced.
5. Salir/cambiar de cuenta: no reaparecen datos anteriores.
6. Interrumpir la API y reintentar sin repetir Google cuando la sesión siga válida.

Envíame captura/error concreto y plataforma. La presentación, compilación y conexión real quedan pendientes de esa ejecución.

## Código y documentación

- [Arquitectura `app/`](app/README.md): módulos, dominio/casos de uso, infraestructura, controlador, React hooks/vistas, composición, bootstrap y shared.
- [Rutas/página `src/`](src/README.md): Expo Router, layout y componentes React Native.
- NativeWind 4.2.7 + Tailwind 3.4 mantienen estilos compartidos. La web Astro usa Tailwind 4; se adapta la configuración porque NativeWind estable usa Tailwind 3.
- [Fuente y decisiones actuales](docs/fonts/01-expo-y-adaptacion-del-frontend.md), [bitácora](bitacora-construccion/01-replicar-acceso-en-expo.md).
- [Copia documental/código web](docs/referencias/navigate-business-web/README.md), [bitácora web](docs/referencias/navigate-business-web/bitacora-construccion/), [bitácora backend completa](docs/referencias/backend/bitacora-construccion/), [documentación backend](docs/referencias/backend/README.md), [manifiesto de 146 copias](docs/referencias/manifest.json).

El archivo `docs/referencias` conserva textos/fechas/verificaciones originales, incluidas menciones Astro, Vue, Angular, Go o Rust. Está excluido de rutas, Tailwind, tipos y pruebas activas. Sus comprobaciones históricas no acreditan esta app nueva. Algunos enlaces antiguos ya apuntaban a proyectos ausentes; se conservaron sin inventar fuentes. No hay dashboard adicional al alcance de la web original.
