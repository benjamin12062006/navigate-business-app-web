import type { Result } from '@shared/result/result';
import type { Account } from '../../entities/account.entity';
import type { TokenSource } from '../../entities/session-user.entity';
import type { AuthFailure } from '../../failures/auth-failure';

export interface AccountGatewayPort {
  current(
    user: TokenSource,
    signal: AbortSignal,
  ): Promise<Result<Account, AuthFailure>>;
  sync(
    user: TokenSource,
    signal: AbortSignal,
  ): Promise<Result<Account, AuthFailure>>;
}
