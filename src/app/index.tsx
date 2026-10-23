import { useEffect, useRef, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { acquireAuthClient } from "@composition/auth/auth-client";
import type { AuthController } from "@modules/auth";
import { AuthPageView } from "@modules/auth/presentation/views/AuthPageView";
import { AuthSurface } from "@modules/auth/presentation/views/AuthSurface";
import {
  initialAuthState,
  toAuthViewModel,
} from "@modules/auth/presentation/view-models/auth-view-model";
import { AppText } from "@ui/components/AppText";
import { AccessIntroduction } from "../components/home/AccessIntroduction";
import { SiteHeader } from "../components/layout/SiteHeader";

const initial = toAuthViewModel(initialAuthState());
const noop = () => {};

export default function AccessPage() {
  const [controller, setController] = useState<AuthController | null>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);
  const [mainY, setMainY] = useState(0);
  const [accessY, setAccessY] = useState(0);
  const wide = width > 760;
  const padding = width > 1050 ? 70 : wide ? 40 : width > 420 ? 25 : 20;

  useEffect(() => {
    const lease = acquireAuthClient();
    setController(lease.value);
    return () => lease.release();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <Stack.Screen options={{ title: "Accede a tu espacio · Navigate" }} />
      <ScrollView
        ref={scroll}
        className="flex-1"
        contentContainerStyle={{
          minHeight: Math.max(0, height - insets.top - insets.bottom),
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 1440,
            paddingHorizontal: padding,
            alignSelf: "center",
            flex: 1,
          }}
        >
          <SiteHeader
            wide={wide}
            spacious={width > 1050}
            onHome={() => scroll.current?.scrollTo({ y: 0, animated: true })}
            onAccess={() =>
              scroll.current?.scrollTo({
                y: Math.max(0, mainY + accessY - 24),
                animated: true,
              })
            }
          />
          <View
            onLayout={(event) => setMainY(event.nativeEvent.layout.y)}
            style={{
              flex: 1,
              flexDirection: wide ? "row" : "column",
              alignItems: "center",
              gap: wide ? Math.min(110, Math.max(40, width * 0.07)) : 40,
              paddingTop: wide ? 65 : 43,
              paddingBottom: wide ? 70 : 45,
            }}
          >
            <AccessIntroduction wide={wide} width={width} />
            <View
              onLayout={(event) => setAccessY(event.nativeEvent.layout.y)}
              style={{
                width: "100%",
                maxWidth: wide ? 425 : 470,
                ...(wide ? { flex: 1 } : {}),
              }}
            >
              <View className="mb-4 flex-row items-center gap-4 px-[3px]">
                <AppText className="text-[8px] tracking-[1.2px] text-[#819074]">
                  01 / ACCESO
                </AppText>
                <View className="h-px flex-1 bg-[#d9e0d0]" />
                <AppText
                  className="text-[15px] text-[#819074]"
                  accessible={false}
                >
                  ↗
                </AppText>
              </View>
              {controller ? (
                <AuthPageView controller={controller} />
              ) : (
                <AuthSurface
                  state={initial}
                  onLogin={noop}
                  onRetry={noop}
                  onLogout={noop}
                />
              )}
              <AppText className="mt-5 text-center text-[7px] tracking-[1px] text-[#7c8971]">
                ◈ TU PUNTO DE VISTA. TU ESPACIO.
              </AppText>
            </View>
          </View>
          <View className="min-h-[70px] flex-row items-center justify-between gap-3 border-t border-line">
            <AppText className="text-[9px] text-[#7d8874]">
              © {new Date().getFullYear()} Navigate
            </AppText>
            {wide && (
              <AppText className="text-[7px] tracking-[1px] text-[#7d8874]">
                PENSADO PARA VER MÁS ALLÁ.
              </AppText>
            )}
            <AppText className="text-[9px] text-[#7d8874]">
              Análisis de inversiones ↗
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
