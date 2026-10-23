import { afterEach, describe, expect, it, vi } from "vitest";
import { createSharedRuntime } from "@bootstrap/app/create-shared-runtime";
import { createHttpClient } from "@shared/http/http-client";
import { ok } from "@shared/result/result";
import { createHttpAccountGatewayAdapter } from "../infrastructure/adapters/http-account-gateway.adapter";
import { toFirebaseFailure } from "../infrastructure/mappers/firebase-failure.mapper";
import { createAuthModule } from "@composition/auth/create-auth-module";
import type { SessionPort } from "../domain/ports/outbound/session.port";
import type { SessionUser } from "../domain/entities/session-user.entity";

afterEach(() => {
  vi.useRealTimers();
});

describe("lifecycle independiente de Vue", () => {
  it("dos consumidores comparten controlador y solo el último libera la sesión", () => {
    const create = vi.fn(() => ({
      start: vi.fn(async () => {}),
      dispose: vi.fn(),
    }));
    const runtime = createSharedRuntime(create);
    const vue = runtime.acquire();
    const script = runtime.acquire();
    expect(vue.value).toBe(script.value);
    expect(vue.value.start).toHaveBeenCalledTimes(1);
    vue.release();
    vue.release();
    expect(script.value.dispose).not.toHaveBeenCalled();
    script.release();
    expect(script.value.dispose).toHaveBeenCalledTimes(1);
    const next = runtime.acquire();
    expect(next.value).not.toBe(script.value);
    next.release();
  });

  it("suscribe consumidores TS sin entregar capacidades del token y permite desuscribir", async () => {
    const user: SessionUser = {
      uid: "alice",
      displayName: "Alice",
      email: null,
      getIdToken: async () => ok("token-prueba"),
    };
    const stop = vi.fn();
    const session: SessionPort = {
      initialize: async () => ok(undefined),
      observe: ({ next }) => {
        next(null);
        return ok(stop);
      },
      login: async () => ok(user),
      logout: async () => ok(undefined),
    };
    const controller = createAuthModule({
      configured: true,
      session,
      accountGateway: {
        current: vi.fn(),
        sync: async () => ok({ id: "id" as never, status: "active" }),
      },
    }).controller;
    const subscriber = vi.fn();
    const unsubscribe = controller.subscribe(subscriber);
    await controller.start();
    await controller.login();
    expect(controller.getSnapshot().phase).toBe("ready");
    expect(controller.getSnapshot().user).toEqual({
      uid: "alice",
      displayName: "Alice",
      email: null,
    });
    expect(controller.getSnapshot().user).not.toHaveProperty("getIdToken");
    // Un consumidor JS tampoco puede alterar el snapshot que comparte otra isla.
    expect(Reflect.set(controller.getSnapshot(), "phase", "signed-out")).toBe(
      false,
    );
    expect(Object.isFrozen(controller.getSnapshot().user)).toBe(true);
    expect(Object.isFrozen(controller.getSnapshot().account)).toBe(true);
    unsubscribe();
    const calls = subscriber.mock.calls.length;
    await controller.logout();
    expect(subscriber).toHaveBeenCalledTimes(calls);
    controller.dispose();
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it("traduce errores del SDK a códigos independientes sin filtrar el objeto", () => {
    const raw = {
      code: "auth/user-token-expired",
      message: "dato-del-proveedor",
      extra: "dato",
    };
    expect(toFirebaseFailure(raw)).toEqual({
      kind: "AUTH_FAILURE",
      code: "invalid_token",
    });
    expect(
      toFirebaseFailure({ code: "auth/popup-closed-by-user" }),
    ).toMatchObject({ code: "login_cancelled" });
  });
});

describe("plazo de espera integral", () => {
  it.each(["token", "body"])(
    "vence incluso con señal externa y %s pendiente",
    async (pending) => {
      vi.useFakeTimers();
      const request = vi.fn<typeof fetch>().mockResolvedValue({
        status: 200,
        ok: true,
        json: () => new Promise(() => {}),
      } as unknown as Response);
      const gateway = createHttpAccountGatewayAdapter(
        createHttpClient({ baseUrl: "https://example.test/api/v1", request }),
        50,
      );
      const promise = gateway.current(
        {
          getIdToken: () =>
            pending === "token"
              ? new Promise(() => {})
              : Promise.resolve(ok("token-prueba")),
        },
        new AbortController().signal,
      );
      await vi.advanceTimersByTimeAsync(51);
      expect(await promise).toMatchObject({
        _tag: "Err",
        failure: { kind: "TIMEOUT" },
      });
      if (pending === "token") expect(request).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    },
  );
});
