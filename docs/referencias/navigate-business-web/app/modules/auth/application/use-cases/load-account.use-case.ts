import { ApplicationFailure } from '@shared/failures/application-failure';
import { err, isErr, map } from '@shared/result/result';
import type { AccountGatewayPort } from '../../domain/ports/outbound/account-gateway.port';
import type { LoadAccountUseCasePort } from '../../domain/ports/inbound/load-account-use-case.port';
import { toAccountOutput } from '../mappers/account-output.mapper';

export function createLoadAccountUseCase(
  gateway: AccountGatewayPort,
): LoadAccountUseCasePort {
  return {
    async execute({ user, mode, signal }) {
      if (signal.aborted) return err(ApplicationFailure.cancelled());
      let result = await gateway[mode](user, signal);
      const needsSync =
        mode === 'current' &&
        isErr(result) &&
        result.failure.kind === 'AUTH_FAILURE' &&
        result.failure.status === 404 &&
        result.failure.code === 'account_not_synced';

      if (needsSync) {
        if (signal.aborted) return err(ApplicationFailure.cancelled());
        result = await gateway.sync(user, signal);
      }
      return map(result, toAccountOutput);
    },
  };
}
