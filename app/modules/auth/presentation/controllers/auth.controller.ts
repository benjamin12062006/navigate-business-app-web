import { ApplicationFailure } from "@shared/failures/application-failure";
import { isErr } from "@shared/result/result";
import { AsyncState } from "@shared/types/async-state";
import type { AccountLoadMode } from "../../application/dto/load-account-input.dto";
import type { SessionUser } from "../../domain/entities/session-user.entity";
import {
  authFailure,
  type AuthFailure,
} from "../../domain/failures/auth-failure";
import type { LoadAccountUseCasePort } from "../../domain/ports/inbound/load-account-use-case.port";
import type { SessionUseCasesPort } from "../../domain/ports/inbound/session-use-cases.port";
import {
  initialAuthState,
  toAuthViewModel,
  type AuthState,
  type AuthViewModel,
} from "../view-models/auth-view-model";

export interface AuthController {
  getSnapshot(): AuthViewModel;
  subscribe(listener: (state: AuthViewModel) => void): () => void;
  start(): Promise<void>;
  login(): Promise<void>;
  logout(): Promise<void>;
  retry(): Promise<void>;
  dispose(): void;
}

export interface AuthControllerDependencies {
  readonly configured: boolean;
  readonly session: SessionUseCasesPort;
  readonly loadAccount: LoadAccountUseCasePort;
  readonly restoreTimeoutMs?: number;
}

/** Coordinación observable neutral: ningún import de Vue, Firebase, fetch o DOM. */
export function createAuthController(
  deps: AuthControllerDependencies,
): AuthController {
  let state: AuthState = initialAuthState(deps.configured);
  let snapshot = toAuthViewModel(state);
  const listeners = new Set<(state: AuthViewModel) => void>();
  let identity: SessionUser | null = null;
  let stopObserving: (() => void) | undefined;
  let operation: AbortController | undefined;
  let initialization: Promise<void> | undefined;
  let lastMode: AccountLoadMode = "current";
  let generation = 0;
  let observation = 0;
  let loggingIn = false;
  let locallySignedOut = false;
  let disposed = false;

  function update(patch: Partial<AuthState>) {
    if (disposed) return;
    state = { ...state, ...patch };
    snapshot = toAuthViewModel(state);
    for (const listener of listeners) listener(snapshot);
  }

  function invalidate() {
    generation++;
    operation?.abort();
  }

  function fail(failure: AuthFailure) {
    update({
      phase: "error",
      accountState: AsyncState.failure(failure),
      notice: "",
    });
  }

  async function loadAccount(user: SessionUser, mode: AccountLoadMode) {
    if (disposed) return;
    invalidate();
    const version = generation;
    const current = new AbortController();
    operation = current;
    identity = user;
    lastMode = mode;
    // Se expone una copia de perfil; getIdToken nunca llega a las vistas.
    update({
      user: { uid: user.uid, displayName: user.displayName, email: user.email },
      phase: "loading-account",
      accountState: AsyncState.loading(),
      notice: "",
    });
    try {
      const result = await deps.loadAccount.execute({
        user,
        mode,
        signal: current.signal,
      });
      if (disposed || version !== generation || current.signal.aborted) return;
      if (isErr(result)) fail(result.failure);
      else
        update({
          phase: "ready",
          accountState: AsyncState.success(result.value),
        });
    } catch {
      if (!disposed && version === generation && !current.signal.aborted)
        fail(authFailure("unknown"));
    }
  }

  function start(force = false): Promise<void> {
    if (!deps.configured || disposed) return Promise.resolve();
    if (initialization) return initialization;
    if (stopObserving && !force) return Promise.resolve();
    update({ phase: "starting", accountState: AsyncState.idle(), notice: "" });
    initialization = (async () => {
      try {
        const initialized = await deps.session.start.execute();
        if (disposed) return;
        if (isErr(initialized)) {
          fail(initialized.failure);
          return;
        }
        update({ canLogin: true });
        stopObserving?.();
        const observerVersion = ++observation;
        let restored = false;
        const timer = setTimeout(() => {
          if (
            !restored &&
            !disposed &&
            !locallySignedOut &&
            observerVersion === observation
          ) {
            fail(
              ApplicationFailure.timeout(
                "restore-session",
                deps.restoreTimeoutMs ?? 12_000,
              ),
            );
          }
        }, deps.restoreTimeoutMs ?? 12_000);

        const observed = deps.session.observe.execute({
          next(user) {
            restored = true;
            clearTimeout(timer);
            if (
              disposed ||
              observerVersion !== observation ||
              loggingIn ||
              locallySignedOut
            )
              return;
            if (
              user?.uid === identity?.uid &&
              ["loading-account", "ready"].includes(state.phase)
            )
              return;
            if (user) void loadAccount(user, "current");
            else {
              invalidate();
              identity = null;
              update({
                user: null,
                phase: "signed-out",
                accountState: AsyncState.idle(),
                notice: "",
              });
            }
          },
          failure(failure) {
            clearTimeout(timer);
            if (
              !disposed &&
              observerVersion === observation &&
              !locallySignedOut
            ) {
              invalidate();
              fail(failure);
            }
          },
        });
        if (isErr(observed)) {
          clearTimeout(timer);
          fail(observed.failure);
          return;
        }
        stopObserving = () => {
          clearTimeout(timer);
          observed.value();
        };
      } catch {
        if (!disposed) fail(authFailure("unknown"));
      }
    })().finally(() => {
      initialization = undefined;
    });
    return initialization;
  }

  async function login() {
    if (snapshot.busy || disposed || !state.canLogin) return;
    invalidate();
    const version = generation;
    loggingIn = true;
    locallySignedOut = false;
    update({
      phase: "signing-in",
      accountState: AsyncState.idle(),
      notice: "",
    });
    try {
      const result = await deps.session.login.execute();
      if (disposed || version !== generation) return;
      loggingIn = false;
      if (isErr(result)) {
        if (
          result.failure.kind === "AUTH_FAILURE" &&
          result.failure.code === "login_cancelled"
        ) {
          locallySignedOut = true;
          identity = null;
          update({
            user: null,
            phase: "signed-out",
            notice:
              "Se canceló el acceso. Puedes volver a intentarlo cuando quieras.",
          });
        } else fail(result.failure);
      } else await loadAccount(result.value, "sync");
    } catch {
      if (!disposed && version === generation) fail(authFailure("unknown"));
    } finally {
      if (version === generation) loggingIn = false;
    }
  }

  async function logout() {
    if (disposed) return;
    locallySignedOut = true;
    loggingIn = false;
    invalidate();
    const version = generation;
    identity = null;
    update({
      user: null,
      phase: "signed-out",
      accountState: AsyncState.idle(),
      notice: "",
    });
    const failed = () => {
      if (!disposed && version === generation)
        update({
          phase: "error",
          notice:
            "Ocultamos tu cuenta, pero no pudimos cerrar la sesión en este dispositivo. Vuelve a intentar salir.",
        });
    };
    try {
      if (isErr(await deps.session.logout.execute())) failed();
    } catch {
      failed();
    }
  }

  async function retry() {
    if (snapshot.busy || disposed) return;
    if (identity && !snapshot.mustSignIn) await loadAccount(identity, lastMode);
    else await start(true);
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (disposed) return () => {};
      listeners.add(listener);
      listener(snapshot);
      return () => {
        listeners.delete(listener);
      };
    },
    start: () => start(),
    login,
    logout,
    retry,
    dispose() {
      if (disposed) return;
      invalidate();
      observation++;
      stopObserving?.();
      identity = null;
      state = initialAuthState(deps.configured);
      snapshot = toAuthViewModel(state);
      disposed = true;
      listeners.clear();
    },
  };
}
