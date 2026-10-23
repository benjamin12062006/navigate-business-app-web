export interface AuthConfig {
  apiBaseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
  };
}

export type ConfigResult =
  { ok: true; value: AuthConfig } | { ok: false; missing: string[] };

const requiredFields = [
  'PUBLIC_API_BASE_URL',
  'PUBLIC_FIREBASE_API_KEY',
  'PUBLIC_FIREBASE_AUTH_DOMAIN',
  'PUBLIC_FIREBASE_PROJECT_ID',
  'PUBLIC_FIREBASE_APP_ID',
];

export function readAuthConfig(env: Record<string, unknown>): ConfigResult {
  const missing = requiredFields.filter(
    (key) => typeof env[key] !== 'string' || !String(env[key]).trim(),
  );
  if (missing.length) return { ok: false, missing };

  try {
    const url = new URL(String(env.PUBLIC_API_BASE_URL));
    const invalidUrl =
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash;
    if (invalidUrl) {
      return {
        ok: false,
        missing: ['PUBLIC_API_BASE_URL (URL HTTP/HTTPS válida)'],
      };
    }
    if (!url.pathname.replace(/\/$/, '').endsWith('/api/v1')) {
      return {
        ok: false,
        missing: ['PUBLIC_API_BASE_URL (debe terminar en /api/v1)'],
      };
    }

    const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(
      url.hostname,
    );
    if (url.protocol === 'http:' && !isLocalhost) {
      return {
        ok: false,
        missing: ['PUBLIC_API_BASE_URL (HTTPS fuera de localhost)'],
      };
    }

    return {
      ok: true,
      value: {
        apiBaseUrl: url.href.replace(/\/$/, ''),
        firebase: {
          apiKey: String(env.PUBLIC_FIREBASE_API_KEY).trim(),
          authDomain: String(env.PUBLIC_FIREBASE_AUTH_DOMAIN).trim(),
          projectId: String(env.PUBLIC_FIREBASE_PROJECT_ID).trim(),
          appId: String(env.PUBLIC_FIREBASE_APP_ID).trim(),
        },
      },
    };
  } catch {
    return {
      ok: false,
      missing: ['PUBLIC_API_BASE_URL (URL HTTP/HTTPS válida)'],
    };
  }
}
