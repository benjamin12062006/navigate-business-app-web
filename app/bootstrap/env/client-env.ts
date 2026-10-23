export interface AuthConfig {
  apiBaseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
  };
  google: { webClientId: string; iosClientId?: string };
}
export type ConfigResult =
  { ok: true; value: AuthConfig } | { ok: false; missing: string[] };
export interface EnvironmentOptions {
  platform: string;
  development: boolean;
}

export function readAuthConfig(
  env: Record<string, unknown>,
  options: EnvironmentOptions = { platform: "web", development: false },
): ConfigResult {
  const value = (key: string) =>
    typeof env[key] === "string" ? String(env[key]).trim() : "";
  const fields = [
    "EXPO_PUBLIC_API_BASE_URL",
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ];
  if (options.platform !== "web")
    fields.push("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");
  if (options.platform === "ios")
    fields.push("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID");
  const missing = fields.filter((key) => !value(key));
  if (missing.length) return { ok: false, missing };
  const platformUrl =
    options.platform === "android"
      ? value("EXPO_PUBLIC_ANDROID_API_BASE_URL")
      : options.platform === "ios"
        ? value("EXPO_PUBLIC_IOS_API_BASE_URL")
        : "";
  try {
    const url = new URL(platformUrl || value("EXPO_PUBLIC_API_BASE_URL"));
    const host = url.hostname;
    const privateHost =
      ["localhost", "127.0.0.1", "[::1]"].includes(host) ||
      host.endsWith(".local") ||
      /^10\.\d+\.\d+\.\d+$/.test(host) ||
      /^192\.168\.\d+\.\d+$/.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(host);
    const localHttp =
      options.development &&
      value("EXPO_PUBLIC_ALLOW_LOCAL_HTTP") === "true" &&
      privateHost;
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.protocol === "http:" && !localHttp) ||
      !url.pathname.replace(/\/$/, "").endsWith("/api/v1")
    ) {
      return {
        ok: false,
        missing: [
          "API: HTTPS (HTTP local solo en desarrollo) y ruta /api/v1 de la API actual",
        ],
      };
    }
    return {
      ok: true,
      value: {
        apiBaseUrl: url.href.replace(/\/$/, ""),
        firebase: {
          apiKey: value("EXPO_PUBLIC_FIREBASE_API_KEY"),
          authDomain: value("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
          projectId: value("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
          appId: value("EXPO_PUBLIC_FIREBASE_APP_ID"),
        },
        google: {
          webClientId: value("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),
          iosClientId: value("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID") || undefined,
        },
      },
    };
  } catch {
    return { ok: false, missing: ["API: URL HTTP/HTTPS válida"] };
  }
}
