import { createHttpClient } from "@shared/http/http-client";
import { readAuthConfig, type EnvironmentOptions } from "./env/client-env";

/** Solo recursos genéricos y configuración pública; no conoce módulos. */
export function createClientRuntime(
  env: Record<string, unknown>,
  request: typeof fetch,
  options?: EnvironmentOptions,
) {
  const config = readAuthConfig(env, options);
  return {
    config,
    httpClient: config.ok
      ? createHttpClient({ baseUrl: config.value.apiBaseUrl, request })
      : null,
  };
}
