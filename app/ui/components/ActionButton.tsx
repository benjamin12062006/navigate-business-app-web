import { Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { AppText } from "./AppText";

export function ActionButton({
  label,
  disabled = false,
  google = false,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  google?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`min-h-[53px] w-full flex-row items-center justify-center gap-3 rounded-[9px] border border-action bg-action px-4 py-[13px] active:bg-action-hover ${disabled ? "opacity-50" : ""}`}
    >
      {google && (
        <View className="rounded-full bg-white p-0.5" accessible={false}>
          <Svg width={19} height={19} viewBox="0 0 24 24">
            <Path
              fill="#4285F4"
              d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
            />
            <Path
              fill="#34A853"
              d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.76-5.6-4.13H3.06v2.59A10 10 0 0 0 12 22Z"
            />
            <Path
              fill="#FBBC05"
              d="M6.4 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.31.32-1.92V7.49H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.51l3.34-2.59Z"
            />
            <Path
              fill="#EA4335"
              d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.34 2.59A5.96 5.96 0 0 1 12 5.95Z"
            />
          </Svg>
        </View>
      )}
      <AppText className="font-body-semibold text-[13px] text-white">
        {label}
      </AppText>
      <AppText
        className={`${google ? "ml-auto" : ""} text-[19px] text-white`}
        accessible={false}
      >
        ↗
      </AppText>
    </Pressable>
  );
}
