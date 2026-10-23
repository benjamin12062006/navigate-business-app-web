import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { err, ok, tryCatch } from "@shared/result/result";
import type { SessionUser } from "../../domain/entities/session-user.entity";
import type { SessionPort } from "../../domain/ports/outbound/session.port";
import { authFailure } from "../../domain/failures/auth-failure";
import { toFirebaseFailure } from "../mappers/firebase-failure.mapper";
import type * as GoogleSdkModule from "react-native-nitro-google-signin";

type GoogleSdk = typeof GoogleSdkModule;
const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  displayName: user.displayName,
  email: user.email,
  getIdToken: (refresh) =>
    tryCatch(() => user.getIdToken(refresh), toFirebaseFailure),
});

export function createFirebaseSessionAdapter(
  config: FirebaseOptions,
  googleConfig: { webClientId: string; iosClientId?: string },
): SessionPort {
  let auth: Auth | undefined;
  let sdk: GoogleSdk | undefined;
  let initialized = false;
  return {
    initialize: () =>
      tryCatch(
        async () => {
          if (initialized) return;
          const app = getApps().length ? getApp() : initializeApp(config);
          try {
            auth = initializeAuth(app, {
              persistence: getReactNativePersistence(AsyncStorage),
            });
          } catch (error) {
            if (
              error &&
              typeof error === "object" &&
              "code" in error &&
              error.code === "auth/already-initialized"
            )
              auth = getAuth(app);
            else throw error;
          }
          auth.languageCode = "es";
          // Loaded lazily: an unavailable custom native module becomes a configuration state.
          sdk = await import("react-native-nitro-google-signin");
          sdk.GoogleOneTapSignIn.configure({
            webClientId: googleConfig.webClientId,
            iosClientId: googleConfig.iosClientId,
            offlineAccess: false,
          });
          initialized = true;
        },
        () => authFailure("invalid_configuration"),
      ),
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
    async login() {
      if (!auth || !sdk) return err(authFailure("invalid_configuration"));
      try {
        await sdk.GoogleOneTapSignIn.checkPlayServices();
        const response = await sdk.GoogleOneTapSignIn.presentExplicitSignIn();
        if (sdk.isCancelledResponse(response))
          return err(authFailure("login_cancelled"));
        if (!sdk.isSuccessResponse(response) || !response.data.idToken)
          return err(authFailure("unknown"));
        const result = await signInWithCredential(
          auth,
          GoogleAuthProvider.credential(response.data.idToken),
        );
        return ok(toSessionUser(result.user));
      } catch (error) {
        if (sdk.isErrorWithCode(error)) {
          if (error.code === sdk.statusCodes.SIGN_IN_CANCELLED)
            return err(authFailure("login_cancelled"));
          if (error.code === sdk.statusCodes.DEVELOPER_ERROR)
            return err(authFailure("invalid_configuration"));
        }
        return err(toFirebaseFailure(error));
      }
    },
    logout: () =>
      tryCatch(async () => {
        if (auth) await signOut(auth);
        if (sdk) await sdk.GoogleOneTapSignIn.signOut();
      }, toFirebaseFailure),
  };
}
