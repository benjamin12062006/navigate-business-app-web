import { Text, type TextProps } from "react-native";

export function AppText({
  className = "",
  ...props
}: TextProps & { className?: string }) {
  return <Text {...props} className={`font-sans ${className}`} />;
}
