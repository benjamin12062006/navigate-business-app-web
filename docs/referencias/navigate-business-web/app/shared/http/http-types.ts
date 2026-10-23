import type { Result } from '../result/result';
import type { ApplicationFailure } from '../failures/application-failure';
import type { InfrastructureFailure } from '../failures/infrastructure-failure';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type HttpHeaders = Readonly<Record<string, string>>;
export type HttpFailure = InfrastructureFailure | ApplicationFailure;
export interface HttpRequestConfig {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers?: HttpHeaders;
  readonly body?: unknown;
  readonly timeoutMs?: number;
  readonly signal?: AbortSignal;
}

export interface HttpResponse {
  readonly status: number;
  readonly url: string;
  readonly headers: HttpHeaders;
  readonly data: unknown;
}

type HttpOptions = Omit<HttpRequestConfig, 'url' | 'method' | 'body'>;

/** JSON desconocido: cada adaptador valida su DTO antes de construir entidades. */
export interface HttpClientPort {
  request(
    config: HttpRequestConfig,
  ): Promise<Result<HttpResponse, HttpFailure>>;
  get(
    url: string,
    options?: HttpOptions,
  ): Promise<Result<HttpResponse, HttpFailure>>;
  post(
    url: string,
    body?: unknown,
    options?: HttpOptions,
  ): Promise<Result<HttpResponse, HttpFailure>>;
  put(
    url: string,
    body?: unknown,
    options?: HttpOptions,
  ): Promise<Result<HttpResponse, HttpFailure>>;
  patch(
    url: string,
    body?: unknown,
    options?: HttpOptions,
  ): Promise<Result<HttpResponse, HttpFailure>>;
  delete(
    url: string,
    options?: HttpOptions,
  ): Promise<Result<HttpResponse, HttpFailure>>;
}
