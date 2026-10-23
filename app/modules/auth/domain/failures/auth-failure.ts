import type { ApplicationFailure } from "@shared/failures/application-failure";
import type { InfrastructureFailure } from "@shared/failures/infrastructure-failure";

export type AuthFailureCode =
  | "invalid_token"
  | "account_not_synced"
  | "account_suspended"
  | "auth_unavailable"
  | "storage_unavailable"
  | "unexpected_response"
  | "invalid_response"
  | "login_cancelled"
  | "popup_blocked"
  | "provider_network"
  | "unauthorized_domain"
  | "operation_not_allowed"
  | "invalid_configuration"
  | "unknown";

export type AuthFailure =
  | Readonly<{ kind: "AUTH_FAILURE"; code: AuthFailureCode; status?: number }>
  | ApplicationFailure
  | InfrastructureFailure;

export function authFailure(
  code: AuthFailureCode,
  status?: number,
): AuthFailure {
  return { kind: "AUTH_FAILURE", code, status };
}
