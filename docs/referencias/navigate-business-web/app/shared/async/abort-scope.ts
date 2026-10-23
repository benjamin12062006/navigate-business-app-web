/** Un plazo cubre token, transporte y cuerpo, incluso con señal externa. */
export function createAbortScope(
  signal: AbortSignal | undefined,
  timeoutMs: number,
) {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), timeoutMs);
  return {
    signal: signal ? AbortSignal.any([signal, timeout.signal]) : timeout.signal,
    timedOut: () => timeout.signal.aborted,
    dispose: () => clearTimeout(timer),
  };
}

export function withAbort<T>(
  promise: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
    const cleanup = () => signal.removeEventListener('abort', abort);
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error: unknown) => {
        cleanup();
        reject(error);
      },
    );
  });
}
