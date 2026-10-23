import { Platform } from "react-native";
import { createClientRuntime } from "@bootstrap/client";
import { publicEnv } from "@bootstrap/env/public-env";
import { createSharedRuntime } from "@bootstrap/app/create-shared-runtime";
import { err } from "@shared/result/result";
import { authFailure } from "@modules/auth/domain/failures/auth-failure";
import type { SessionPort } from "@modules/auth/domain/ports/outbound/session.port";
import type { AccountGatewayPort } from "@modules/auth/domain/ports/outbound/account-gateway.port";
import { createFirebaseSessionAdapter } from "@modules/auth/infrastructure/adapters/firebase-session.adapter";
import { createHttpAccountGatewayAdapter } from "@modules/auth/infrastructure/adapters/http-account-gateway.adapter";
import { createAuthModule } from "./create-auth-module";

function createClientController() {
  const { config, httpClient } = createClientRuntime(publicEnv, fetch, {
    platform: Platform.OS,
    development: __DEV__,
  });
  const unavailable = () => err(authFailure("invalid_configuration"));
  const session: SessionPort = config.ok
    ? createFirebaseSessionAdapter(config.value.firebase, config.value.google)
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

// Created only from the React effect. StrictMode's remount gets a new live lease.
const runtime = createSharedRuntime(createClientController);
export const acquireAuthClient = () => runtime.acquire();
