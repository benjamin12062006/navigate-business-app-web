import {
  createHttpClient,
  type HttpClientConfig,
} from '@shared/http/http-client';

/** Recursos por petición futura de servidor. Nunca contiene una sesión de usuario global. */
export function createServerRuntime(config: HttpClientConfig) {
  if (!import.meta.env.SSR)
    throw new Error('El runtime de servidor solo puede usarse en servidor.');
  return { httpClient: createHttpClient(config) };
}
