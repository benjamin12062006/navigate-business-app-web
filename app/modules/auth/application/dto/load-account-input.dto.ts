import type { SessionUser } from "../../domain/entities/session-user.entity";

export type AccountLoadMode = "current" | "sync";

export interface LoadAccountInputDto {
  readonly user: SessionUser;
  readonly mode: AccountLoadMode;
  readonly signal: AbortSignal;
}
