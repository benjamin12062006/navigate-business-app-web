/** Un plazo cubre token, transporte y cuerpo, incluso con señal externa. */
export function createAbortScope(
  signal: AbortSignal | undefined,
  timeoutMs: number,
) {
  const timeout = new AbortController();
  const combined = new AbortController();
  const externalAbort = () => combined.abort();
  const timeoutAbort = () => combined.abort();
  signal?.addEventListener("abort", externalAbort, { once: true });
  timeout.signal.addEventListener("abort", timeoutAbort, { once: true });
  if (signal?.aborted) combined.abort();
  const timer = setTimeout(() => timeout.abort(), timeoutMs);
  return {
    signal: combined.signal,
    timedOut: () => timeout.signal.aborted,
    dispose: () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", externalAbort);
      timeout.signal.removeEventListener("abort", timeoutAbort);
    },
  };
}

export function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw new Error("Operation cancelled");
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
    signal.addEventListener("abort", abort, { once: true });
    const cleanup = () => signal.removeEventListener("abort", abort);
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
