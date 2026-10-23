import {
  createAbortScope,
  withAbort,
  throwIfAborted,
} from "../async/abort-scope";
import { ApplicationFailure } from "../failures/application-failure";
import { InfrastructureFailure } from "../failures/infrastructure-failure";
import { err, ok } from "../result/result";
import type {
  HttpClientPort,
  HttpHeaders,
  HttpRequestConfig,
  HttpResponse,
  HttpFailure,
} from "./http-types";
import type { Result } from "../result/result";

export interface HttpClientConfig {
  readonly baseUrl: string;
  readonly request: typeof fetch;
  readonly defaultHeaders?: HttpHeaders;
  readonly defaultTimeoutMs?: number;
}

export function createHttpClient(config: HttpClientConfig): HttpClientPort {
  async function request(
    input: HttpRequestConfig,
  ): Promise<Result<HttpResponse, HttpFailure>> {
    const scope = createAbortScope(
      input.signal,
      input.timeoutMs ?? config.defaultTimeoutMs ?? 12_000,
    );
    const url = /^https?:\/\//.test(input.url)
      ? input.url
      : `${config.baseUrl.replace(/\/$/, "")}/${input.url.replace(/^\//, "")}`;
    try {
      throwIfAborted(scope.signal);
      const requestFn = config.request;
      const response = await withAbort(
        requestFn(url, {
          method: input.method,
          headers: {
            Accept: "application/json",
            ...(input.body === undefined
              ? {}
              : { "Content-Type": "application/json" }),
            ...config.defaultHeaders,
            ...input.headers,
          },
          ...(input.body === undefined
            ? {}
            : { body: JSON.stringify(input.body) }),
          cache: "no-store",
          credentials: "omit",
          signal: scope.signal,
        }),
        scope.signal,
      );

      // Un 401 permite renovar aunque el proxy haya devuelto HTML.
      if (response.status === 401) {
        void response.body?.cancel?.().catch(() => {});
        return err(InfrastructureFailure.http(401, url));
      }
      let body: unknown;
      try {
        body = await withAbort(response.json(), scope.signal);
      } catch {
        throwIfAborted(scope.signal);
        return err(InfrastructureFailure.parse("http-json"));
      }
      throwIfAborted(scope.signal);
      return response.ok
        ? ok({
            status: response.status,
            url,
            headers: Object.fromEntries(response.headers),
            data: body,
          })
        : err(InfrastructureFailure.http(response.status, url, body));
    } catch {
      if (input.signal?.aborted) return err(ApplicationFailure.cancelled());
      if (scope.timedOut())
        return err(ApplicationFailure.timeout("http-request"));
      return err(InfrastructureFailure.network(url));
    } finally {
      scope.dispose();
    }
  }
  return {
    request,
    get: (url, options) => request({ ...options, method: "GET", url }),
    post: (url, body, options) =>
      request({ ...options, method: "POST", url, body }),
    put: (url, body, options) =>
      request({ ...options, method: "PUT", url, body }),
    patch: (url, body, options) =>
      request({ ...options, method: "PATCH", url, body }),
    delete: (url, options) => request({ ...options, method: "DELETE", url }),
  };
}
