import { View } from "react-native";
import { AppText } from "@ui/components/AppText";
import { ActionButton } from "@ui/components/ActionButton";
import type { AuthViewModel } from "../../view-models/auth-view-model";

export function AuthAccount({
  state,
  onLogout,
}: {
  state: AuthViewModel;
  onLogout: () => void;
}) {
  const name = state.user?.displayName?.trim().split(/\s+/)[0] || "de nuevo";
  return (
    <View>
      <View
        className="mb-5 h-[42px] w-[42px] items-center justify-center rounded-full bg-[#e8f0e3]"
        accessible={false}
      >
        <AppText className="text-[23px] text-[#3d653b]">✓</AppText>
      </View>
      <AppText
        accessibilityRole="header"
        className="mb-[18px] font-body-medium text-[32px] leading-[38px] tracking-[-1.4px] text-[#1f3024]"
      >
        Hola, {name}.
      </AppText>
      <AppText className="mb-[30px] text-sm leading-[24px] text-[#73796f]">
        Tu cuenta está lista. Este es el comienzo de tu espacio en Navigate.
      </AppText>
      <View className="mb-[25px] rounded-[10px] border border-[#e3e9de] bg-[#fafbf8] p-[18px]">
        <AppText className="font-body-semibold text-[10px] tracking-[0.6px] text-[#466143]">
          ● CUENTA ACTIVA
        </AppText>
        {state.user?.email && (
          <AppText selectable className="my-[14px] text-[13px] text-[#354c36]">
            {state.user.email}
          </AppText>
        )}
        <AppText className="mt-2 text-[10px] text-[#737d6d]">
          Identificador de cuenta
        </AppText>
        <AppText
          selectable
          className="mt-[7px] text-[10px] leading-[16px] text-[#55614e]"
        >
          {state.account?.account_id}
        </AppText>
      </View>
      <ActionButton label="Cerrar sesión" onPress={onLogout} />
      <AppText className="mt-7 text-center text-[10px] leading-[17px] text-[#7d8378]">
        Tus datos de acceso son personales.
      </AppText>
    </View>
  );
}
