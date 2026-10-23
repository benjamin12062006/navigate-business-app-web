import type { Result } from "@shared/result/result";
import type { SessionUser } from "../../entities/session-user.entity";
import type { AuthFailure } from "../../failures/auth-failure";

export interface SessionObserver {
  readonly next: (user: SessionUser | null) => void;
  readonly failure: (failure: AuthFailure) => void;
}

export interface SessionPort {
  initialize(): Promise<Result<void, AuthFailure>>;
  observe(observer: SessionObserver): Result<() => void, AuthFailure>;
  login(): Promise<Result<SessionUser, AuthFailure>>;
  logout(): Promise<Result<void, AuthFailure>>;
}
