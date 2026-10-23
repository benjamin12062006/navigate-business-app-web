import { onUnmounted, shallowRef } from 'vue';
import type { AuthController } from '../controllers/auth.controller';

/** Solo adapta suscripciones a reactividad Vue; no construye ni destruye el módulo. */
export function useAuth(controller: AuthController) {
  const state = shallowRef(controller.getSnapshot());
  const unsubscribe = controller.subscribe((value) => {
    state.value = value;
  });
  onUnmounted(unsubscribe);
  return {
    state,
    login: controller.login,
    logout: controller.logout,
    retry: controller.retry,
  };
}
