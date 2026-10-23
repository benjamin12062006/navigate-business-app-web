import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { err, ok, tryCatch } from "@shared/result/result";
import type { SessionUser } from "../../domain/entities/session-user.entity";
import type { SessionPort } from "../../domain/ports/outbound/session.port";
import { authFailure } from "../../domain/failures/auth-failure";
import { toFirebaseFailure } from "../mappers/firebase-failure.mapper";

function toSessionUser(user: User): SessionUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    getIdToken: (refresh) =>
      tryCatch(() => user.getIdToken(refresh), toFirebaseFailure),
  };
}

/** Firebase se inicializa únicamente al ejecutar start en cliente. */
export function createFirebaseSessionAdapter(
  config: FirebaseOptions,
  ..._nativeConfig: unknown[]
): SessionPort {
  let auth: Auth | undefined;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  return {
    initialize: () =>
      tryCatch(async () => {
        auth ??= getAuth(getApps().length ? getApp() : initializeApp(config));
        auth.languageCode = "es";
        await setPersistence(auth, browserSessionPersistence);
      }, toFirebaseFailure),
    observe(observer) {
      if (!auth) return err(authFailure("invalid_configuration"));
      try {
        return ok(
          onAuthStateChanged(
            auth,
            (user) => observer.next(user ? toSessionUser(user) : null),
            (error) => observer.failure(toFirebaseFailure(error)),
          ),
        );
      } catch (error) {
        return err(toFirebaseFailure(error));
      }
    },
    login: () => {
      const initialized = auth;
      if (!initialized)
        return Promise.resolve(err(authFailure("invalid_configuration")));
      return tryCatch(
        async () =>
          toSessionUser((await signInWithPopup(initialized, provider)).user),
        toFirebaseFailure,
      );
    },
    logout: () => {
      const initialized = auth;
      return initialized
        ? tryCatch(() => signOut(initialized), toFirebaseFailure)
        : Promise.resolve(ok(undefined));
    },
  };
}
