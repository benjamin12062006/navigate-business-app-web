import { View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { AppText } from "@ui/components/AppText";

export function PerspectiveArt() {
  return (
    <View
      className="mt-9 w-full max-w-[520px]"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <AppText className="text-[7px] tracking-[1px] text-[#7c8a70]">
        ● ENCUENTRA TU NORTE
      </AppText>
      <Svg width="100%" height={195} viewBox="0 0 530 195" fill="none">
        <Defs>
          <LinearGradient
            id="line-fade"
            x1={0}
            x2={530}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#a6b596" stopOpacity={0.1} />
            <Stop offset={0.5} stopColor="#a6b596" />
            <Stop offset={1} stopColor="#a6b596" stopOpacity={0.1} />
          </LinearGradient>
        </Defs>
        <Path
          d="M0 150H530M0 105H530M0 60H530M50 30V190M145 30V190M240 30V190M335 30V190M430 30V190"
          stroke="#e0e5d7"
          strokeWidth={0.7}
          strokeDasharray="3 5"
        />
        <Path
          d="M4 160c49-4 40-50 90-50s39 30 77 17 46-65 90-60 62 17 91-6 61-24 95-32 50-16 77-15"
          stroke="url(#line-fade)"
          strokeWidth={2}
        />
        <Circle
          cx={330}
          cy={98}
          r={70}
          fill="#f4f5ef"
          fillOpacity={0.75}
          stroke="#d0dac6"
        />
        <Circle
          cx={330}
          cy={98}
          r={56}
          stroke="#d7dfce"
          strokeDasharray="1 5"
        />
        <Path d="M330 21v13m0 128v13m-77-77h13m128 0h13" stroke="#a5b597" />
        <SvgText x={326} y={48} fill="#7d8d6e" fontSize={9}>
          N
        </SvgText>
        <Path d="m351 65-12 41-30 24 12-42 30-23Z" fill="#3d593a" />
        <Path d="m339 106-30 24 12-42 18 18Z" fill="#b8caa8" />
        <Circle
          cx={330}
          cy={98}
          r={5}
          fill="#f4f5ef"
          stroke="#3d593a"
          strokeWidth={2}
        />
        <Circle
          cx={95}
          cy={110}
          r={4}
          fill="#f4f5ef"
          stroke="#98ad83"
          strokeWidth={1.5}
        />
        <Circle
          cx={447}
          cy={29}
          r={4}
          fill="#f4f5ef"
          stroke="#98ad83"
          strokeWidth={1.5}
        />
      </Svg>
      <View className="flex-row justify-between border-b border-[#dce3d3] pb-[14px]">
        <AppText className="text-[7px] tracking-[1px] text-[#8a9580]">
          MENOS RUIDO.
        </AppText>
        <AppText className="text-[7px] tracking-[1px] text-[#8a9580]">
          MÁS CONTEXTO. ↗
        </AppText>
      </View>
    </View>
  );
}
