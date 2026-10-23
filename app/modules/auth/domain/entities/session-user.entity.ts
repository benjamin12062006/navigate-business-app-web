import type { Result } from "@shared/result/result";
import type { AuthFailure } from "../failures/auth-failure";

export interface SessionProfile {
  readonly uid: string;
  readonly displayName: string | null;
  readonly email: string | null;
}

/** Capacidad opaca: el dominio no conoce Firebase ni almacena el token. */
export interface TokenSource {
  getIdToken(forceRefresh?: boolean): Promise<Result<string, AuthFailure>>;
}

export interface SessionUser extends SessionProfile, TokenSource {}
