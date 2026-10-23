import { createClientRuntime } from '@bootstrap/client';
import { createSharedRuntime } from '@bootstrap/app/create-shared-runtime';
import { err } from '@shared/result/result';
import { authFailure } from '@modules/auth/domain/failures/auth-failure';
import type { SessionPort } from '@modules/auth/domain/ports/outbound/session.port';
import type { AccountGatewayPort } from '@modules/auth/domain/ports/outbound/account-gateway.port';
import { createFirebaseSessionAdapter } from '@modules/auth/infrastructure/adapters/firebase-session.adapter';
import { createHttpAccountGatewayAdapter } from '@modules/auth/infrastructure/adapters/http-account-gateway.adapter';
import { createAuthModule } from './create-auth-module';

function createClientController() {
  const { config, httpClient } = createClientRuntime(import.meta.env, fetch);
  // Configuración incompleta: puertos inertes; no se instancia Firebase ni hay IO.
  const unavailable = () => err(authFailure('invalid_configuration'));
  const session: SessionPort = config.ok
    ? createFirebaseSessionAdapter(config.value.firebase)
    : {
        initialize: async () => unavailable(),
        observe: unavailable,
        login: async () => unavailable(),
        logout: async () => unavailable(),
      };
  const accountGateway: AccountGatewayPort = httpClient
    ? createHttpAccountGatewayAdapter(httpClient)
    : { current: async () => unavailable(), sync: async () => unavailable() };
  return createAuthModule({ configured: config.ok, session, accountGateway })
    .controller;
}

// No se crea ningún controlador al importar durante SSR: la factory es diferida.
const runtime = createSharedRuntime(createClientController);

/** Entrada común para islas Vue y scripts TS. Llamar en montaje y liberar al salir. */
export function acquireAuthClient() {
  if (import.meta.env.SSR)
    throw new Error(
      'La sesión de acceso se adquiere exclusivamente en cliente.',
    );
  return runtime.acquire();
}
