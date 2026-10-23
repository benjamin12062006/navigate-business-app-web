import { describe, expect, it, vi } from "vitest";
import { createHttpClient } from "@shared/http/http-client";
import { ok } from "@shared/result/result";
import { createHttpAccountGatewayAdapter } from "../infrastructure/adapters/http-account-gateway.adapter";
import { readAuthConfig } from "@bootstrap/env/client-env";

const account = {
  account_id: "9ca9241f-03ea-4894-994a-17fc42cf6702",
  status: "active",
};
const base = "http://127.0.0.1:8080/api/v1";
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });
const gateway = (request: typeof fetch, timeoutMs?: number) =>
  createHttpAccountGatewayAdapter(
    createHttpClient({ baseUrl: base, request }),
    timeoutMs,
  );

describe("contrato HTTP de cuenta", () => {
  it("envía sync sin body y con un ID token actual; solo renueva una vez ante 401", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(response({ error: "invalid_token" }, 401))
      .mockResolvedValueOnce(response(account));
    const getIdToken = vi
      .fn()
      .mockResolvedValueOnce(ok("id-token-prueba"))
      .mockResolvedValueOnce(ok("id-token-renovado-prueba"));
    expect(
      await gateway(request).sync({ getIdToken }, new AbortController().signal),
    ).toEqual(ok({ id: account.account_id, status: "active" }));
    expect(getIdToken.mock.calls).toEqual([[false], [true]]);
    expect(request.mock.calls[0]?.[0]).toBe(base + "/auth/sync");
    expect(request.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      credentials: "omit",
      cache: "no-store",
    });
    expect(request.mock.calls[0]?.[1]?.body).toBeUndefined();
    expect(request.mock.calls[1]?.[1]?.headers).toMatchObject({
      Authorization: "Bearer id-token-renovado-prueba",
    });
  });

  it("termina después del segundo 401", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockImplementation(async () =>
        response({ error: "invalid_token" }, 401),
      );
    const getIdToken = vi.fn().mockResolvedValue(ok("token-prueba"));
    expect(
      await gateway(request).current(
        { getIdToken },
        new AbortController().signal,
      ),
    ).toMatchObject({
      _tag: "Err",
      failure: { status: 401, code: "invalid_token" },
    });
    expect(request).toHaveBeenCalledTimes(2);
  });

  it.each([403, 503])(
    "no renueva ni repite frente a HTTP %i",
    async (status) => {
      const request = vi.fn<typeof fetch>().mockResolvedValue(
        response(
          {
            error: status === 403 ? "account_suspended" : "storage_unavailable",
          },
          status,
        ),
      );
      expect(
        await gateway(request).current(
          { getIdToken: async () => ok("token-prueba") },
          new AbortController().signal,
        ),
      ).toMatchObject({ _tag: "Err", failure: { status } });
      expect(request).toHaveBeenCalledTimes(1);
    },
  );

  it("rechaza JSON mal formado y cuentas ajenas al contrato", async () => {
    for (const value of [
      new Response("<html>Error</html>"),
      response({ id: 1 }),
      response({ ...account, status: "suspended" }),
    ]) {
      expect(
        await gateway(async () => value).current(
          { getIdToken: async () => ok("token-prueba") },
          new AbortController().signal,
        ),
      ).toMatchObject({ _tag: "Err", failure: { kind: "PARSE_ERROR" } });
    }
  });

  it("no envía una petición si se cancela mientras se recupera el token", async () => {
    const request = vi.fn<typeof fetch>();
    const controller = new AbortController();
    const promise = gateway(request).current(
      { getIdToken: () => new Promise(() => {}) },
      controller.signal,
    );
    controller.abort();
    expect(await promise).toMatchObject({
      _tag: "Err",
      failure: { kind: "CANCELLED" },
    });
    expect(request).not.toHaveBeenCalled();
  });
});

describe("configuración pública", () => {
  const env = {
    EXPO_PUBLIC_ALLOW_LOCAL_HTTP: "true",
    EXPO_PUBLIC_API_BASE_URL: base,
    EXPO_PUBLIC_FIREBASE_API_KEY: "prueba",
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: "example",
    EXPO_PUBLIC_FIREBASE_APP_ID: "prueba",
  };
  it("informa campos ausentes sin inicializar Firebase", () => {
    expect(readAuthConfig({})).toMatchObject({ ok: false });
    expect(
      readAuthConfig(env, { platform: "web", development: true }),
    ).toMatchObject({ ok: true });
  });
  it.each([
    "http://example.com/api/v1",
    "https://example.com",
    "https://user:pass@example.com/api/v1",
    "https://example.com/api/v1?token=prueba",
  ])("rechaza una base insegura o ambigua: %s", (url) => {
    expect(readAuthConfig({ ...env, EXPO_PUBLIC_API_BASE_URL: url }).ok).toBe(
      false,
    );
  });
});
