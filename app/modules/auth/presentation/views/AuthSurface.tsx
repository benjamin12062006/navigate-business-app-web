import { Pressable, View } from "react-native";
import { AppText } from "@ui/components/AppText";
import { ActionButton } from "@ui/components/ActionButton";
import { AuthStatus } from "../components/status/AuthStatus";
import { AuthAccount } from "../components/account/AuthAccount";
import { AuthPrivacyNote } from "../components/sign-in/AuthPrivacyNote";
import type { AuthViewModel } from "../view-models/auth-view-model";

export function AuthSurface({
  state,
  onLogin,
  onLogout,
  onRetry,
}: {
  state: AuthViewModel;
  onLogin: () => void;
  onLogout: () => void;
  onRetry: () => void;
}) {
  const showGoogle =
    state.phase !== "error" ||
    (state.canLogin && (state.mustSignIn || !state.user));
  return (
    <View
      nativeID="acceso"
      accessibilityState={{ busy: state.busy }}
      className="w-full rounded-[22px] border border-[#e1e5dd] bg-white px-[23px] py-7 sm:p-10"
    >
      <View className="mb-[30px] flex-row items-center gap-[9px]">
        <View
          className="h-[22px] w-[22px] items-center justify-center rounded-md bg-[#eaf0e7]"
          accessible={false}
        >
          <AppText className="text-[17px] text-[#41583e]">↗</AppText>
        </View>
        <AppText className="font-body-bold text-[10px] tracking-[1.3px] text-[#626f60]">
          TU ESPACIO PERSONAL
        </AppText>
      </View>
      {state.phase === "ready" && state.account ? (
        <AuthAccount state={state} onLogout={onLogout} />
      ) : (
        <View>
          <AppText
            accessibilityRole="header"
            className="mb-[18px] font-body-medium text-[32px] leading-[38px] tracking-[-1.4px] text-[#1f3024]"
          >
            Un buen punto{"\n"}de partida.
          </AppText>
          <AppText className="mb-[30px] text-sm leading-[24px] text-[#73796f]">
            Entra a tu cuenta y empieza a construir una perspectiva propia.
          </AppText>
          <AuthStatus state={state} />
          {!state.busy &&
            (showGoogle ? (
              <ActionButton
                google
                label={
                  state.mustSignIn
                    ? "Volver a entrar con Google"
                    : "Continuar con Google"
                }
                disabled={state.phase === "configuration" || !state.canLogin}
                onPress={onLogin}
              />
            ) : (
              !state.suspended && (
                <ActionButton label="Volver a intentar" onPress={onRetry} />
              )
            ))}
          {!state.busy &&
            state.phase === "error" &&
            state.canLogin &&
            !state.user &&
            !state.mustSignIn && (
              <TextAction label="Comprobar sesión de nuevo" onPress={onRetry} />
            )}
          {(!!state.user ||
            state.phase === "error" ||
            state.phase === "loading-account") && (
            <TextAction
              label={
                state.user
                  ? "Salir y usar otra cuenta"
                  : "Cerrar sesión en este dispositivo"
              }
              onPress={onLogout}
            />
          )}
          <AuthPrivacyNote />
          <AppText className="mt-7 text-center text-[10px] leading-[17px] text-[#7d8378]">
            Si es tu primera vez, prepararemos tu cuenta al entrar.
          </AppText>
        </View>
      )}
    </View>
  );
}

function TextAction({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="min-h-11 items-center justify-center px-2 pt-2"
    >
      <AppText className="text-center text-xs text-[#4a6549] underline">
        {label}
      </AppText>
    </Pressable>
  );
}
