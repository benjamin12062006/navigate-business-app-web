import { useCallback, useSyncExternalStore } from "react";
import type { AuthController } from "../controllers/auth.controller";

export function useAuth(controller: AuthController) {
  const subscribe = useCallback(
    (notify: () => void) => controller.subscribe(() => notify()),
    [controller],
  );
  return useSyncExternalStore(
    subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
}
