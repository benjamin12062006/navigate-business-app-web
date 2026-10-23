import { AsyncState } from "@shared/types/async-state";
import type { AccountOutputDto } from "../../application/dto/account-output.dto";
import type { SessionProfile } from "../../domain/entities/session-user.entity";
import type { AuthFailure } from "../../domain/failures/auth-failure";
import { describeAuthFailure } from "../presenters/auth-failure.presenter";

export type AuthPhase =
  | "starting"
  | "signed-out"
  | "signing-in"
  | "loading-account"
  | "ready"
  | "error"
  | "configuration";

export interface AuthState {
  readonly phase: AuthPhase;
  readonly user: SessionProfile | null;
  readonly accountState: AsyncState<AccountOutputDto, AuthFailure>;
  readonly canLogin: boolean;
  readonly notice: string;
}

export interface AuthViewModel {
  readonly phase: AuthPhase;
  readonly user: SessionProfile | null;
  readonly account: AccountOutputDto | null;
  readonly busy: boolean;
  readonly message: string;
  readonly mustSignIn: boolean;
  readonly suspended: boolean;
  readonly canLogin: boolean;
}

export function initialAuthState(configured = true): AuthState {
  return {
    phase: configured ? "starting" : "configuration",
    user: null,
    accountState: AsyncState.idle(),
    canLogin: false,
    notice: "",
  };
}

export function toAuthViewModel(state: AuthState): AuthViewModel {
  const failure = AsyncState.isFailure(state.accountState)
    ? describeAuthFailure(state.accountState.failure)
    : null;
  return Object.freeze({
    phase: state.phase,
    user: state.user ? Object.freeze({ ...state.user }) : null,
    account: AsyncState.isSuccess(state.accountState)
      ? Object.freeze({ ...state.accountState.data })
      : null,
    busy: ["starting", "signing-in", "loading-account"].includes(state.phase),
    message: state.notice || failure?.message || "",
    mustSignIn: failure?.mustSignIn ?? false,
    suspended: failure?.suspended ?? false,
    canLogin: state.canLogin,
  });
}
