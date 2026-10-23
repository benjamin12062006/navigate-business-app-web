import type { AccountGatewayPort } from "@modules/auth/domain/ports/outbound/account-gateway.port";
import type { SessionPort } from "@modules/auth/domain/ports/outbound/session.port";
import { createLoadAccountUseCase } from "@modules/auth/application/use-cases/load-account.use-case";
import { createSessionUseCases } from "@modules/auth/application/use-cases/session.use-cases";
import { createAuthController } from "@modules/auth/presentation/controllers/auth.controller";

export interface AuthModuleDependencies {
  readonly configured: boolean;
  readonly session: SessionPort;
  readonly accountGateway: AccountGatewayPort;
  readonly restoreTimeoutMs?: number;
}

/** Factory explícita: el módulo también se puede montar con adaptadores de prueba. */
export function createAuthModule(deps: AuthModuleDependencies) {
  const controller = createAuthController({
    configured: deps.configured,
    session: createSessionUseCases(deps.session),
    loadAccount: createLoadAccountUseCase(deps.accountGateway),
    restoreTimeoutMs: deps.restoreTimeoutMs,
  });
  return { controller };
}
