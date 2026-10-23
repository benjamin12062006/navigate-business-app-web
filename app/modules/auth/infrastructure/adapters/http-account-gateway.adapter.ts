import {
  createAbortScope,
  withAbort,
  throwIfAborted,
} from "@shared/async/abort-scope";
import { ApplicationFailure } from "@shared/failures/application-failure";
import { InfrastructureFailure } from "@shared/failures/infrastructure-failure";
import { err, isErr, type Result } from "@shared/result/result";
import type { HttpClientPort, HttpFailure } from "@shared/http/http-types";
import type { Account } from "../../domain/entities/account.entity";
import type { TokenSource } from "../../domain/entities/session-user.entity";
import type { AccountGatewayPort } from "../../domain/ports/outbound/account-gateway.port";
import {
  authFailure,
  type AuthFailure,
  type AuthFailureCode,
} from "../../domain/failures/auth-failure";
import { toAccount } from "../mappers/account.mapper";

const apiCodes = new Set<AuthFailureCode>([
  "invalid_token",
  "account_not_synced",
  "account_suspended",
  "auth_unavailable",
  "storage_unavailable",
]);

function toAccountFailure(failure: HttpFailure): AuthFailure {
  if (failure.kind !== "HTTP_ERROR") return failure;
  if (failure.status === 401) return authFailure("invalid_token", 401);
  const body = failure.body;
  const code =
    body &&
    typeof body === "object" &&
    "error" in body &&
    typeof body.error === "string"
      ? body.error
      : "unexpected_response";
  return authFailure(
    apiCodes.has(code as AuthFailureCode)
      ? (code as AuthFailureCode)
      : "unexpected_response",
    failure.status,
  );
}

export function createHttpAccountGatewayAdapter(
  http: HttpClientPort,
  timeoutMs = 12_000,
): AccountGatewayPort {
  async function call(
    path: "/auth/me" | "/auth/sync",
    user: TokenSource,
    signal: AbortSignal,
  ): Promise<Result<Account, AuthFailure>> {
    for (let attempt = 0; attempt < 2; attempt++) {
      const scope = createAbortScope(signal, timeoutMs);
      try {
        throwIfAborted(scope.signal);
        const token = await withAbort(
          user.getIdToken(attempt === 1),
          scope.signal,
        );
        if (isErr(token)) return token;
        throwIfAborted(scope.signal);
        const response = await http.request({
          method: path === "/auth/sync" ? "POST" : "GET",
          url: path,
          headers: { Authorization: `Bearer ${token.value}` },
          signal: scope.signal,
          timeoutMs,
        });
        // La señal puede vencer durante el cuerpo o en un transporte inyectado.
        throwIfAborted(scope.signal);
        if (isErr(response)) {
          if (
            response.failure.kind === "HTTP_ERROR" &&
            response.failure.status === 401 &&
            attempt === 0
          )
            continue;
          return err(toAccountFailure(response.failure));
        }
        return toAccount(response.value.data);
      } catch {
        if (signal.aborted) return err(ApplicationFailure.cancelled());
        if (scope.timedOut())
          return err(ApplicationFailure.timeout("account-request", timeoutMs));
        return err(InfrastructureFailure.network());
      } finally {
        scope.dispose();
      }
    }
    return err(authFailure("invalid_token", 401));
  }

  return {
    current: (user, signal) => call("/auth/me", user, signal),
    sync: (user, signal) => call("/auth/sync", user, signal),
  };
}
