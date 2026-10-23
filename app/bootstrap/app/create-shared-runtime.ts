export interface RuntimeResource {
  start(): Promise<void>;
  dispose(): void;
}

/** Propietario común: una isla libera su lease, el último consumidor libera el recurso. */
export function createSharedRuntime<T extends RuntimeResource>(
  create: () => T,
) {
  let resource: T | undefined;
  let consumers = 0;
  return {
    acquire() {
      const value = (resource ??= create());
      consumers++;
      if (consumers === 1) void value.start();
      let released = false;
      return {
        value,
        release() {
          if (released) return;
          released = true;
          consumers--;
          if (consumers === 0) {
            resource = undefined;
            value.dispose();
          }
        },
      };
    },
  };
}
