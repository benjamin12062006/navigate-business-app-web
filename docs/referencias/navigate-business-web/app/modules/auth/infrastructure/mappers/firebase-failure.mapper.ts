import {
  authFailure,
  type AuthFailure,
  type AuthFailureCode,
} from '../../domain/failures/auth-failure';

const codes: Readonly<Record<string, AuthFailureCode>> = {
  'auth/popup-closed-by-user': 'login_cancelled',
  'auth/cancelled-popup-request': 'login_cancelled',
  'auth/popup-blocked': 'popup_blocked',
  'auth/network-request-failed': 'provider_network',
  'auth/unauthorized-domain': 'unauthorized_domain',
  'auth/operation-not-allowed': 'operation_not_allowed',
  'auth/invalid-api-key': 'invalid_configuration',
  'auth/user-token-expired': 'invalid_token',
  'auth/invalid-user-token': 'invalid_token',
  'auth/user-disabled': 'invalid_token',
};

/** No filtra errores, usuarios ni tokens del SDK hacia application/presentation. */
export function toFirebaseFailure(error: unknown): AuthFailure {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : '';
  return authFailure(codes[code] ?? 'unknown');
}
