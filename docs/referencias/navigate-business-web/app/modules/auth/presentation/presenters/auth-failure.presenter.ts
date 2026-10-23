import type { AuthFailure } from '../../domain/failures/auth-failure';

const messages: Readonly<Record<string, string>> = {
  NETWORK_ERROR:
    'No pudimos conectar con tu cuenta. Comprueba tu conexión e inténtalo de nuevo.',
  TIMEOUT:
    'La conexión está tardando más de lo esperado. Puedes volver a intentarlo.',
  account_suspended: 'Tu cuenta está suspendida. El acceso no está disponible.',
  auth_unavailable:
    'El servicio de acceso no está disponible por ahora. Inténtalo en unos minutos.',
  storage_unavailable:
    'No pudimos cargar tu cuenta en este momento. Tu sesión sigue abierta; puedes reintentar.',
  PARSE_ERROR:
    'No pudimos comprobar la respuesta del servicio. Inténtalo de nuevo más tarde.',
  invalid_response:
    'No pudimos comprobar la respuesta del servicio. Inténtalo de nuevo más tarde.',
  popup_blocked:
    'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
  provider_network:
    'No pudimos conectar con Google. Comprueba tu conexión e inténtalo de nuevo.',
  unauthorized_domain:
    'El acceso con Google todavía no está habilitado para este sitio.',
  operation_not_allowed: 'El acceso con Google todavía no está habilitado.',
  invalid_configuration: 'El acceso todavía no está configurado correctamente.',
};

export function describeAuthFailure(failure: AuthFailure) {
  const code = failure.kind === 'AUTH_FAILURE' ? failure.code : failure.kind;
  const mustSignIn = code === 'invalid_token';
  return {
    mustSignIn,
    suspended: code === 'account_suspended',
    message: mustSignIn
      ? 'Tu sesión necesita verificarse de nuevo. Vuelve a entrar con Google.'
      : failure.kind === 'TIMEOUT' && failure.operation === 'restore-session'
        ? 'No pudimos recuperar tu sesión. Puedes volver a comprobarla.'
        : (messages[code] ??
          'No pudimos completar el acceso. Inténtalo de nuevo.'),
  };
}
