import { Pressable, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { AppText } from "@ui/components/AppText";

export function SiteHeader({
  wide,
  spacious,
  onAccess,
  onHome,
}: {
  wide: boolean;
  spacious: boolean;
  onAccess: () => void;
  onHome: () => void;
}) {
  return (
    <View
      className="flex-row items-center justify-between gap-4 border-b border-line"
      style={{ height: wide ? 112 : 82 }}
    >
      <Pressable
        onPress={onHome}
        accessibilityRole="button"
        accessibilityLabel="Navigate, inicio"
        className="min-h-11 flex-row items-center gap-2.5"
      >
        <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
          <Rect width={32} height={32} rx={9} fill="#2d4731" />
          <Path
            d="m9 22 5-12 4 8 5-12"
            stroke="#e9f0e2"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M18 6h5v5"
            stroke="#c0d6a5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <AppText className="font-body-semibold text-[25px] tracking-[-1.2px] text-ink">
          navigate<AppText className="text-[#78905d]">.</AppText>
        </AppText>
      </Pressable>
      {spacious && (
        <AppText className="text-[9px] tracking-[1.4px] text-[#75816c]">
          UNA PERSPECTIVA MÁS CLARA
        </AppText>
      )}
      <Pressable
        onPress={onAccess}
        accessibilityRole="button"
        className="min-h-11 flex-row items-center gap-2 rounded-md border border-[#d5ddcc] px-3 py-2.5"
      >
        <View className="h-[5px] w-[5px] rounded-full bg-[#7b965e]" />
        <AppText className="text-[10px] text-ink">Acceso personal</AppText>
        {wide && (
          <AppText className="ml-2 text-[16px] text-ink" accessible={false}>
            ↗
          </AppText>
        )}
      </Pressable>
    </View>
  );
}
