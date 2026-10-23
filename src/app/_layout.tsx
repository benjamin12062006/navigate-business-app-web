import "../styles/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { InstrumentSerif_400Regular_Italic } from "@expo-google-fonts/instrument-serif";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans: DMSans_400Regular,
    DMSansMedium: DMSans_500Medium,
    DMSansSemibold: DMSans_600SemiBold,
    DMSansBold: DMSans_700Bold,
    InstrumentSerifItalic: InstrumentSerif_400Regular_Italic,
  });
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {!loaded ? (
        <View
          style={{
            flex: 1,
            backgroundColor: "#f4f5ef",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {error ? (
            <Text accessibilityRole="alert">
              No pudimos cargar los recursos. Vuelve a abrir la aplicación.
            </Text>
          ) : (
            <>
              <ActivityIndicator color="#476444" />
              <Text>Preparando Navigate…</Text>
            </>
          )}
        </View>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f4f5ef" },
          }}
        />
      )}
    </SafeAreaProvider>
  );
}
