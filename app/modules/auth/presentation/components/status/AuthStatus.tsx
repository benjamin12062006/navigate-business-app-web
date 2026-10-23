import { ActivityIndicator, View } from "react-native";
import { AppText } from "@ui/components/AppText";
import type { AuthViewModel } from "../../view-models/auth-view-model";

export function AuthStatus({ state }: { state: AuthViewModel }) {
  if (state.busy) {
    const label =
      state.phase === "starting"
        ? "Comprobando tu sesión…"
        : state.phase === "signing-in"
          ? "Continúa con Google…"
          : "Preparando tu espacio…";
    return (
      <View
        className="mb-5 min-h-[53px] flex-row items-center justify-center gap-[11px] rounded-lg bg-[#eff3ec] p-[13px]"
        accessibilityLiveRegion="polite"
      >
        <ActivityIndicator size="small" color="#476444" />
        <AppText className="flex-shrink text-xs leading-[19px] text-[#475f43]">
          {label}
        </AppText>
      </View>
    );
  }
  if (state.phase === "configuration")
    return (
      <View
        className="mb-5 rounded-lg border border-[#e9e4d1] bg-[#f7f5ed] p-[13px]"
        accessibilityLiveRegion="polite"
      >
        <AppText className="mb-1 font-body-semibold text-[11px] text-[#6e6135]">
          Estamos preparando el acceso.
        </AppText>
        <AppText className="text-xs leading-[19px] text-[#6e6135]">
          El inicio de sesión estará disponible cuando termine la configuración.
        </AppText>
      </View>
    );
  if (state.phase === "error")
    return (
      <View
        className="mb-5 rounded-lg border border-[#f0d9d2] bg-[#fcf1ee] p-[13px]"
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        <AppText className="text-xs leading-[19px] text-[#913e32]">
          {state.message}
        </AppText>
      </View>
    );
  return state.message ? (
    <AppText
      accessibilityLiveRegion="polite"
      className="mb-4 text-xs leading-[19px] text-[#64725f]"
    >
      {state.message}
    </AppText>
  ) : null;
}
