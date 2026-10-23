import type { Result } from "@shared/result/result";
import type { AuthFailure } from "../../failures/auth-failure";
import type { SessionUser } from "../../entities/session-user.entity";
import type { SessionObserver } from "../outbound/session.port";

export interface SessionUseCasesPort {
  readonly start: { execute(): Promise<Result<void, AuthFailure>> };
  readonly observe: {
    execute(observer: SessionObserver): Result<() => void, AuthFailure>;
  };
  readonly login: { execute(): Promise<Result<SessionUser, AuthFailure>> };
  readonly logout: { execute(): Promise<Result<void, AuthFailure>> };
}
