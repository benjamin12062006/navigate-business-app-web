import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { AppText } from "@ui/components/AppText";

export function AuthPrivacyNote() {
  return (
    <View>
      <View className="mb-[22px] mt-[29px] flex-row items-center gap-2">
        <View className="h-px flex-1 bg-[#e9ece5]" />
        <AppText className="text-[7px] tracking-[0.7px] text-[#70796d]">
          FÁCIL. PERSONAL. SIN CONTRASEÑAS.
        </AppText>
        <View className="h-px flex-1 bg-[#e9ece5]" />
      </View>
      <View className="flex-row items-center gap-3 px-1">
        <Svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6f816b"
          strokeWidth={1.5}
        >
          <Rect x={5} y={10} width={14} height={11} rx={3} />
          <Path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
        </Svg>
        <AppText className="flex-1 text-[11px] leading-[20px] text-[#71786c]">
          Accede con tu cuenta de Google.{"\n"}Solo tú tienes acceso a tu
          espacio personal.
        </AppText>
      </View>
    </View>
  );
}
