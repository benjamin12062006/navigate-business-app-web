# 01 — Configuración del frontend antes de construir funcionalidades

Fecha de creación: 2026-10-16
Última actualización: 2026-10-16
Estado: Plan en ejecución; Astro/Vue y cliente auth implementados, configuración pública Firebase y recorrido real pendientes.
Ámbito: Astro, app web Firebase y comunicación HTTP con Go.
Relacionada con: [guía documental](../01-guia-documental-y-orden-de-trabajo.md), [catálogo de cursos](../fonts/01-catalogo-cursos-astro-y-ui.md), [Astro](../fonts/astro/01-renderizado-islas-y-configuracion.md), [contrato Go](../fonts/auth/01-contrato-real-api-go.md), [Firebase](../fonts/auth/02-firebase-web-y-limites-del-cliente.md), [incrementos auth](auth/01-google-firebase-y-api-go.md).
Revisión de referencia: web `e52268ae9daa83ea820c3d65cbd5783968c083e8`; API `fbb1bc0ba80e8f454a8e299bbc0688790cdf5d2d`, con cambios locales preservados.

## Objetivo y punto de partida

Preparar una conexión comprensible antes de desarrollar el producto. Se considerará cerrada esta fase cuando el navegador pueda obtener una identidad válida y consultar la cuenta en Go con el contrato existente. Crear documentos no alcanza ese criterio.

Al preparar este plan existía una página mínima, Astro 7.3.3 instalado, Node v24.2.0 y pnpm 12.5.1. Faltan SDK Firebase, configuración pública, cliente HTTP y experiencia auth. CORS ya contempla los dos orígenes locales del puerto 4321. La URL efectiva de Go y el estado de su base no se comprobaron por red. [F-B1/F-B4](../fonts/auth/01-contrato-real-api-go.md)

## Decisiones propuestas y su fundamento

La [filosofía de trabajo vigente](02-filosofia-vue-y-prioridad-de-fuentes.md), establecida por el usuario, fija **Vue primero para desarrollo y arquitectura**, consultando los dos cursos Vue como complementos. React es el segundo apoyo; Svelte se reserva para casos excepcionales y muy minoritarios; otros cursos son el cuarto recurso. Astro se consulta para sus mecanismos propios y la documentación oficial para verificar las herramientas utilizadas.

| Necesidad | Evidencia | Decisión y alternativa |
| --- | --- | --- |
| Consumir datos privados | Contrato F-B2/F-B3; Astro F-OA3 | Peticiones desde navegador a Go. Si se exige SSR privado, diseñar sesión y adaptador antes de adoptarlo. |
| Iniciar Google | Firebase F-F1/F-F2; curso F-A4/F-A5 | SDK web Firebase del mismo proyecto; Go mantiene su verificador. No añadir otro proveedor de sesiones. |
| Interacción UI | Decisión del usuario en el plan 02; Astro F-A2/F-A3/F-OA1; catálogo F-C02/F-C03 | Vue como implementación habitual dentro de Astro, con sus dos cursos como referencias principales. React y Svelte solo según la prioridad y justificación del plan 02. |
| Separar entornos | Astro F-OA2; Go F-B4 | Configuración pública cliente y configuración privada backend separadas; validar las obligatorias al integrarlas. |

Los identificadores remiten a las fichas enlazadas arriba. El [incremento auth 01](../../bitacora-construccion/auth/01-acceso-google-vue-y-cuenta-go.md) y su [ficha aplicada](../fonts/auth/03-cursos-vue-y-adaptacion-del-acceso.md) enlazan tres reconstrucciones y el código implementado. Se verificaron build, tipos, pruebas y sondas Go; el login real aún requiere configurar Firebase.

## Incremento 0 — Comprobar base y elegir fuentes

Releer estado y diffs, confirmar versión del lockfile y compilación base. Resolver los nombres heredados del proyecto cuando se aplique la configuración. Mantener el gestor pnpm. Partir de Vue y los dos cursos ya elegidos; seleccionar sus lecciones según la necesidad. Consultar React, Svelte u otros cursos siguiendo el plan 02, sin instalar frameworks adicionales por anticipado.

Comprobación prevista: `pnpm build` desde la raíz web antes y después del primer cambio de configuración. Si se necesita servidor de desarrollo, seguir el [AGENTS.md del frontend](../../AGENTS.md) y fijar el puerto 4321; confirmar que no se desplazó a otro puerto ocupado. El incremento auth 01 inició la vista de desarrollo y verificó HTTP 200; registrar sus comprobaciones de runtime en esa entrada.

## Incremento 1 — Preparar app Firebase y variables

Comprobar en el proyecto que utiliza Go si ya existe una app web aprovechable; registrarla solo si falta. Obtener su configuración pública y verificar Google/dominios autorizados. Confirmar el project ID con el responsable/configuración de Go sin copiar sus credenciales. El dominio autorizado de Firebase es independiente del origen permitido por CORS. [F-F1/F-F2](../fonts/auth/02-firebase-web-y-limites-del-cliente.md), [F-B4](../fonts/auth/01-contrato-real-api-go.md)

Contrato aplicado en `.env.example` y en el archivo ignorado `.env.local`. Go usa 8081 porque 8080 pertenece a otra API local; faltan los valores públicos Firebase:

```dotenv
# Incluye /api/v1 una sola vez. Candidata local, confirmar servidor.
PUBLIC_API_BASE_URL=http://127.0.0.1:8081/api/v1
PUBLIC_FIREBASE_API_KEY=REEMPLAZAR_DESDE_APP_WEB
PUBLIC_FIREBASE_AUTH_DOMAIN=REEMPLAZAR_DESDE_APP_WEB
PUBLIC_FIREBASE_PROJECT_ID=REEMPLAZAR_DESDE_APP_WEB
PUBLIC_FIREBASE_APP_ID=REEMPLAZAR_DESDE_APP_WEB
```

Los nombres son una propuesta nuestra. Agregar otros campos de la configuración Firebase solo si el servicio elegido los necesita. No solicitar contraseña SQL, ADC ni service-account JSON al frontend. La sustitución de variables públicas ocurre al construir: cambiar un archivo en el hosting después del build no reconfigura automáticamente el bundle. [F-OA2](../fonts/astro/01-renderizado-islas-y-configuracion.md)

El `.gitignore` ya ignora `.env.*` y permite `.env.example`. `git check-ignore .env.local` confirmó la exclusión del archivo local. No guardar tokens de prueba en Markdown.

Comprobación prevista: variables obligatorias y URL válidas; project ID coherente; ejemplo sin valores reales y archivo local ignorado. La documentación actual no afirma que esos valores estén disponibles.

## Incremento 2 — Comprobar transporte antes del login completo

Fijar un origen local, propuesto `http://localhost:4321`, y comprobar la base efectiva de API. Con Go ya iniciado, usar una ruta existente:

```bash
# Sondas sin identidad: ejecutar después, con la API local disponible.
curl -i http://127.0.0.1:8081/api/v1/auth/me
curl -i -X OPTIONS http://127.0.0.1:8081/api/v1/auth/me \
  -H 'Origin: http://localhost:4321' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: authorization'
```

Esperado: GET `401 invalid_token`; preflight con origen permitido y cabecera Authorization admitida. Después comprobar el POST desde el navegador. Un curl exitoso por sí solo no verifica CORS del navegador. Si hay conexión rechazada o `503`, resolver servicio/identidad/base según el resultado antes de pasar a pantallas. No agregar una sonda inventada `/health`. [F-B3/F-B4](../fonts/auth/01-contrato-real-api-go.md)

## Incremento 3 — Login y cuenta mínimos

Aplicar el [plan auth](auth/01-google-firebase-y-api-go.md): Google → ID token → sync/me → cuenta lista → logout. Introducir el SDK necesario y la integración Vue para la UI, según el incremento. El runtime auth del navegador debe cargarse en ejecución cliente, sin recuperar datos privados en un build estático. [Astro](../fonts/astro/01-renderizado-islas-y-configuracion.md)

Antes de implementar cada mecanismo se analizarán y reconstruirán las lecciones pertinentes usando `construir-con-evidencia` y `reconstruir-codigo-curso`. Las reconstrucciones fieles vivirán junto a los originales; los ajustes específicos Go quedan en el proyecto y su bitácora.

Se podrá repetir `reconstruir-codigo-curso` tantas veces como haga falta, sin máximo arbitrario de lecciones ni guías, incluyendo todas las pertinentes de una sección o curso. Cada original conserva una guía independiente. Aplicar la [regla de reconstrucción del plan 02](02-filosofia-vue-y-prioridad-de-fuentes.md) y la prioridad de fuentes vigente.

## Despliegue y continuidad

Para producción se resolverán hosting del frontend, URL HTTPS de Go, orígenes CORS, dominios Firebase y restricciones de las claves públicas. El acceso desde otro dispositivo requiere una API alcanzable: el `127.0.0.1` del cliente es ese dispositivo. No cambiar a `0.0.0.0` ni publicar un túnel por una necesidad aún inexistente.

El modelo inicial permite HTML estático más sesión cliente. Si se requiere proteger el HTML con cookies en servidor, o usar redirect en un entorno con restricciones de almacenamiento, ampliar este plan con evidencia del destino real. No seleccionar un adaptador ni crear una segunda sesión por anticipado.

Las funcionalidades RF-02 en adelante esperarán sus contratos backend y su incremento propio. El [router existente](../../../navigate-business-api/internal/httpapi/router.go) no proporciona aún listas, análisis ni tareas.
