import type { SessionPort } from "../../domain/ports/outbound/session.port";
import type { SessionUseCasesPort } from "../../domain/ports/inbound/session-use-cases.port";

/** Las intenciones del acceso dependen exclusivamente del puerto de sesión. */
export function createSessionUseCases(
  session: SessionPort,
): SessionUseCasesPort {
  return {
    start: { execute: () => session.initialize() },
    observe: { execute: (observer) => session.observe(observer) },
    login: { execute: () => session.login() },
    logout: { execute: () => session.logout() },
  };
}
