import { View } from "react-native";
import { AppText } from "@ui/components/AppText";
import { PerspectiveArt } from "./PerspectiveArt";

export function AccessIntroduction({
  wide,
  width,
}: {
  wide: boolean;
  width: number;
}) {
  const size = wide
    ? Math.min(64, Math.max(39, width * 0.047))
    : width <= 420
      ? 37
      : 46;
  return (
    <View
      className="w-full"
      style={wide ? { flex: 1.2 } : { maxWidth: 470, alignSelf: "center" }}
    >
      <View className="mb-[23px] flex-row items-center gap-2.5">
        <View className="h-px w-[25px] bg-[#82976c]" />
        <AppText className="font-body-medium text-[9px] tracking-[1.5px] text-[#708160]">
          CLARIDAD ANTES DE ACTUAR
        </AppText>
      </View>
      <AppText
        accessibilityRole="header"
        className="font-body-medium text-ink"
        style={{
          fontSize: size,
          lineHeight: size * 1.08,
          letterSpacing: -size * 0.055,
        }}
      >
        Tu próxima decisión{wide ? "\n" : " "}empieza con
      </AppText>
      <AppText
        className="font-display text-accent"
        style={{
          fontSize: size * 1.28,
          lineHeight: size * 1.48,
          letterSpacing: -size * 0.04,
        }}
      >
        perspectiva.
      </AppText>
      <AppText
        className="mt-[18px] text-[13px] leading-[24px] text-[#75806c]"
        style={!wide ? { maxWidth: 360 } : undefined}
      >
        Un lugar para ordenar tus ideas, encontrar contexto y construir tu
        propia mirada sobre las inversiones.
      </AppText>
      {wide && <PerspectiveArt />}
    </View>
  );
}
