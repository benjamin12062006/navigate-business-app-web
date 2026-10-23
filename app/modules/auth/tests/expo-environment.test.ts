import { describe, expect, it } from "vitest";
import { readAuthConfig } from "@bootstrap/env/client-env";

const env = {
  EXPO_PUBLIC_API_BASE_URL: "http://127.0.0.1:8085/api/v1",
  EXPO_PUBLIC_ANDROID_API_BASE_URL: "http://10.0.2.2:8085/api/v1",
  EXPO_PUBLIC_FIREBASE_API_KEY: "public-config",
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: "example",
  EXPO_PUBLIC_FIREBASE_APP_ID: "web-app",
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: "web.apps.googleusercontent.com",
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: "ios.apps.googleusercontent.com",
  EXPO_PUBLIC_ALLOW_LOCAL_HTTP: "true",
};

describe("configuración del cliente Expo y contrato web", () => {
  it("elige el loopback del emulador Android sin cambiar la URL web", () => {
    expect(
      readAuthConfig(env, { platform: "android", development: true }),
    ).toMatchObject({
      ok: true,
      value: { apiBaseUrl: "http://10.0.2.2:8085/api/v1" },
    });
    expect(
      readAuthConfig(env, { platform: "web", development: true }),
    ).toMatchObject({
      ok: true,
      value: { apiBaseUrl: "http://127.0.0.1:8085/api/v1" },
    });
  });
  it("permite LAN de desarrollo explícita y exige HTTPS en producción", () => {
    const mobile = {
      ...env,
      EXPO_PUBLIC_IOS_API_BASE_URL: "http://mac.local:8085/api/v1",
    };
    expect(
      readAuthConfig(mobile, { platform: "ios", development: true }).ok,
    ).toBe(true);
    expect(
      readAuthConfig(mobile, { platform: "ios", development: false }).ok,
    ).toBe(false);
    expect(
      readAuthConfig(
        { ...mobile, EXPO_PUBLIC_ALLOW_LOCAL_HTTP: "false" },
        { platform: "ios", development: true },
      ).ok,
    ).toBe(false);
  });
  it("no acepta otra ruta de API ni un servidor HTTP público", () => {
    for (const url of ["https://example.test/v1", "http://example.test/v1"]) {
      expect(
        readAuthConfig(
          { ...env, EXPO_PUBLIC_API_BASE_URL: url },
          { platform: "web", development: true },
        ).ok,
      ).toBe(false);
    }
  });
  it("un cliente móvil incompleto no crea una sesión ficticia", () => {
    expect(
      readAuthConfig(
        { ...env, EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: "" },
        { platform: "android", development: true },
      ).ok,
    ).toBe(false);
  });
});
