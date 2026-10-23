import { createHttpClient } from '@shared/http/http-client';
import { readAuthConfig } from './env/client-env';

/** Solo recursos genéricos y configuración pública; no conoce módulos. */
export function createClientRuntime(
  env: Record<string, unknown>,
  request: typeof fetch,
) {
  const config = readAuthConfig(env);
  return {
    config,
    httpClient: config.ok
      ? createHttpClient({ baseUrl: config.value.apiBaseUrl, request })
      : null,
  };
}
