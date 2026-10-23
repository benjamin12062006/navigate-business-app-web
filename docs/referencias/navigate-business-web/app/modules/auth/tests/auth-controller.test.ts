import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAuthModule } from '@composition/auth/create-auth-module';
import { createHttpClient } from '@shared/http/http-client';
import { ok, err } from '@shared/result/result';
import { authFailure } from '../domain/failures/auth-failure';
import { createHttpAccountGatewayAdapter } from '../infrastructure/adapters/http-account-gateway.adapter';
import type { AuthController } from '../presentation/controllers/auth.controller';
import type { SessionPort } from '../domain/ports/outbound/session.port';
import type { SessionUser } from '../domain/entities/session-user.entity';

const base = 'http://127.0.0.1:8080/api/v1';
const alice: SessionUser = {
  uid: 'alice',
  displayName: 'Alice',
  email: 'alice@example.test',
  getIdToken: async () => ok('id-alice-prueba'),
};
const bob: SessionUser = {
  ...alice,
  uid: 'bob',
  displayName: 'Bob',
  email: 'bob@example.test',
  getIdToken: async () => ok('id-bob-prueba'),
};
const aliceAccount = {
  account_id: '9ca9241f-03ea-4894-994a-17fc42cf6702',
  status: 'active',
};
const bobAccount = {
  ...aliceAccount,
  account_id: '79d996e3-bf68-4b40-a58e-a282bf612654',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });
const models: AuthController[] = [];

function setup(request: typeof fetch, initial: SessionUser | null = null) {
  let next: (identity: SessionUser | null) => void = () => {};
  const session: SessionPort = {
    initialize: vi.fn(async () => ok(undefined)),
    observe: (observer) => {
      next = observer.next;
      observer.next(initial);
      return ok(() => {});
    },
    login: vi.fn(async () => ok(alice)),
    logout: vi.fn(async () => {
      next(null);
      return ok(undefined);
    }),
  };
  const accountGateway = createHttpAccountGatewayAdapter(
    createHttpClient({ baseUrl: base, request }),
  );
  const model = createAuthModule({
    configured: true,
    session,
    accountGateway,
  }).controller;
  models.push(model);
  return {
    model,
    session,
    emit: (identity: SessionUser | null) => next(identity),
  };
}
afterEach(() => {
  for (const model of models.splice(0)) model.dispose();
});

describe('estado de autenticación', () => {
  it('restaura con GET y sincroniza únicamente account_not_synced', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ error: 'account_not_synced' }, 404))
      .mockResolvedValueOnce(json(aliceAccount, 201));
    const { model } = setup(request, alice);
    await model.start();
    await vi.waitFor(() => expect(model.getSnapshot().phase).toBe('ready'));
    expect(
      request.mock.calls.map(([url]) => String(url).split('/').pop()),
    ).toEqual(['me', 'sync']);
    expect(model.getSnapshot().account).toEqual(aliceAccount);
  });

  it('un 404 de una ruta equivocada no genera POST sync', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(json({ error: 'route_missing' }, 404));
    const { model } = setup(request, alice);
    await model.start();
    await vi.waitFor(() => expect(model.getSnapshot().phase).toBe('error'));
    expect(request).toHaveBeenCalledTimes(1);
    expect(model.getSnapshot().account).toBeNull();
  });

  it('login explícito prepara la cuenta con POST antes de declarar acceso', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(json(aliceAccount, 201));
    const { model } = setup(request);
    await model.start();
    expect(model.getSnapshot().phase).toBe('signed-out');
    await model.login();
    expect(model.getSnapshot().phase).toBe('ready');
    expect(request.mock.calls[0]?.[1]?.method).toBe('POST');
  });

  it('mantiene la sesión y permite recuperar la cuenta tras 503', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ error: 'storage_unavailable' }, 503))
      .mockResolvedValueOnce(json(aliceAccount));
    const { model, session } = setup(request, alice);
    await model.start();
    await vi.waitFor(() => expect(model.getSnapshot().phase).toBe('error'));
    expect(model.getSnapshot().user?.uid).toBe('alice');
    expect(model.getSnapshot().account).toBeNull();
    await model.retry();
    expect(model.getSnapshot().phase).toBe('ready');
    expect(session.login).not.toHaveBeenCalled();
  });

  it('una respuesta tardía de Alice no reemplaza la cuenta de Bob', async () => {
    let resolveAlice!: (response: Response) => void;
    const pending = new Promise<Response>((resolve) => {
      resolveAlice = resolve;
    });
    const request = vi
      .fn<typeof fetch>()
      .mockReturnValueOnce(pending)
      .mockResolvedValueOnce(json(bobAccount));
    const { model, emit, session } = setup(request, alice);
    await model.start();
    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    await model.logout();
    expect(model.getSnapshot().account).toBeNull();
    // Un evento tardío del SDK no debe reabrir una cuenta que se acaba de cerrar.
    emit(alice);
    expect(model.getSnapshot().user).toBeNull();
    // El siguiente acceso es explícito; una respuesta vieja de Alice sigue pendiente.
    session.login = async () => ok(bob);
    await model.login();
    expect(model.getSnapshot().phase).toBe('ready');
    resolveAlice(json(aliceAccount));
    await pending;
    await Promise.resolve();
    expect(model.getSnapshot().user?.uid).toBe('bob');
    expect(model.getSnapshot().account).toEqual(bobAccount);
  });

  it('la cancelación del popup vuelve a la entrada sin una cuenta ficticia', async () => {
    const request = vi.fn<typeof fetch>();
    const { model, session } = setup(request);
    session.login = async () => err(authFailure('login_cancelled'));
    await model.start();
    await model.login();
    expect(model.getSnapshot().phase).toBe('signed-out');
    expect(model.getSnapshot().account).toBeNull();
    expect(request).not.toHaveBeenCalled();
  });

  it('configuración incompleta no inicializa el SDK ni hace peticiones', async () => {
    const { session } = setup(vi.fn<typeof fetch>());
    const current = vi.fn();
    const sync = vi.fn();
    const model = createAuthModule({
      configured: false,
      session,
      accountGateway: { current, sync },
    }).controller;
    await model.start();
    expect(model.getSnapshot().phase).toBe('configuration');
    expect(session.initialize).not.toHaveBeenCalled();
    expect(current).not.toHaveBeenCalled();
    expect(sync).not.toHaveBeenCalled();
    model.dispose();
  });
});
