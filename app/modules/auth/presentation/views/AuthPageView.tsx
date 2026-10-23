import type { AuthController } from "../controllers/auth.controller";
import { useAuth } from "../hooks/use-auth";
import { AuthSurface } from "./AuthSurface";

export function AuthPageView({ controller }: { controller: AuthController }) {
  const state = useAuth(controller);
  return (
    <AuthSurface
      state={state}
      onLogin={() => void controller.login()}
      onRetry={() => void controller.retry()}
      onLogout={() => void controller.logout()}
    />
  );
}
