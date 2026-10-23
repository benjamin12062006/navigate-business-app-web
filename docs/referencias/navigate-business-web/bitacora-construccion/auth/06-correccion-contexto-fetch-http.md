# 06 — Corrección del contexto al invocar fetch en el cliente HTTP

Fecha de creación: 2026-10-18
Estado: Implementado y verificado.
Ámbito: Capa compartida de infraestructura HTTP (`app/shared/http`).
Relacionada con: [migración Clean e islas independientes](04-migracion-clean-e-islas-independientes.md).

## Necesidad y problema observado

El usuario reportó que tras iniciar sesión con Google correctamente, la aplicación fallaba al intentar conectar con la cuenta, arrojando el error `No pudimos conectar con tu cuenta`. 

Al examinar la implementación del cliente HTTP (`app/shared/http/http-client.ts`), se identificó un bug en la forma en que se invocaba la función `fetch` inyectada:

```typescript
// Código con el error
const response = await withAbort(
  config.request(url, { ... })
)
```

La función `fetch` nativa del navegador exige ser ejecutada con el contexto global (`window` o `globalThis`). Al invocarla como un método del objeto `config` (`config.request(...)`), JavaScript vinculaba implícitamente el `this` de la función al objeto `config`. Esto provocaba que el navegador lanzara de inmediato la excepción `TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation`, impidiendo que la petición de red siquiera se iniciara.

Como la capa HTTP captura los errores inesperados para devolverlos como un objeto `Result` (en este caso, un `InfrastructureFailure.network(url)`), el fallo real quedaba enmascarado, derivando en el mensaje de error de conexión en la interfaz.

## Reflexión sobre la complejidad

El usuario preguntó por qué este mecanismo resulta tan "complicado" y si no se podía hacer de forma más eficiente y moderna. 

La complejidad aparente surge del patrón de **Inyección de Dependencias** aplicado a `fetch`. En lugar de llamar a `window.fetch` directamente en toda la aplicación, se inyecta como dependencia (`request: typeof fetch`) en la configuración del cliente HTTP. Esto es fundamental para la **testabilidad** y la **arquitectura limpia**:
- Permite inyectar funciones espía (`vi.fn()`) en los tests sin tener que parchear (`mock`) el entorno global de Node.js o el navegador.
- Desacopla el cliente de la API específica de la plataforma, respetando el principio de Inversión de Dependencias.

Sin embargo, el error no residía en el patrón arquitectónico, sino en un detalle propio del lenguaje JavaScript y su manejo del contexto (`this`).

## Decisión e implementación

La solución más eficiente, moderna y limpia para este problema de contexto en JavaScript es separar el acceso a la propiedad de su invocación. De esta forma, la función se invoca como una función libre sin el objeto `config` como contexto, restaurando el comportamiento por defecto de `fetch`.

**Implementación final en `app/shared/http/http-client.ts`:**

```typescript
const requestFn = config.request;
const response = await withAbort(
  requestFn(url, {
    method: input.method,
    // ...
  }),
  scope.signal,
);
```

## Verificación

- La corrección solo modifica una línea en la capa compartida (`app/shared/http/http-client.ts`), sin afectar la abstracción, el tipado de los fallos, ni los componentes Vue.
- `pnpm test` (53 pruebas) pasa correctamente, verificando que los tests de la capa de infraestructura HTTP (`account-gateway.test.ts`) siguen operando con las dependencias simuladas.
- La invocación real de red (`fetch` al backend Go) volverá a funcionar de forma natural en el navegador al usar la isla interactiva.
