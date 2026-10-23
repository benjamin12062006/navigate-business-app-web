// Google redirects are consumed by the native SDK; keep the auth screen mounted.
export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}) {
  return path.startsWith("com.googleusercontent.apps.") ? "/" : path;
}
