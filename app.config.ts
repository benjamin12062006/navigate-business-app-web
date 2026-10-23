import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ExpoConfig } from "expo/config";

const localHttp =
  process.env.APP_VARIANT !== "production" &&
  process.env.EXPO_PUBLIC_ALLOW_LOCAL_HTTP === "true";
const androidConfig = "./config/firebase/google-services.json";
const iosConfig = "./config/firebase/GoogleService-Info.plist";
const hasAndroid = existsSync(join(__dirname, androidConfig));
const hasIos = existsSync(join(__dirname, iosConfig));
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
if (hasAndroid) {
  const android = JSON.parse(
    readFileSync(join(__dirname, androidConfig), "utf8"),
  );
  if (android.project_info?.project_id !== projectId)
    throw new Error(
      "El JSON Android debe pertenecer al mismo proyecto Firebase que .env.local.",
    );
}
if (hasIos) {
  const plist = readFileSync(join(__dirname, iosConfig), "utf8");
  const appleProject = plist.match(
    /<key>PROJECT_ID<\/key>\s*<string>([^<]+)<\/string>/,
  )?.[1];
  if (appleProject !== projectId)
    throw new Error(
      "El plist iOS debe pertenecer al mismo proyecto Firebase que .env.local.",
    );
}
const iosClient = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
const iosUrlScheme = iosClient?.endsWith(".apps.googleusercontent.com")
  ? `com.googleusercontent.apps.${iosClient.slice(0, -".apps.googleusercontent.com".length)}`
  : undefined;
const googlePlugin: NonNullable<ExpoConfig["plugins"]> = iosUrlScheme
  ? [["react-native-nitro-google-signin", { iosUrlScheme }]]
  : hasAndroid || hasIos
    ? ["react-native-nitro-google-signin"]
    : [];

const config: ExpoConfig = {
  name: "Navigate Business App & Web",
  slug: "navigate-business-app-web",
  version: "1.0.0",
  scheme: "navigatebusiness",
  orientation: "default",
  userInterfaceStyle: "light",
  icon: "./assets/images/navigate-icon.png",
  backgroundColor: "#f4f5ef",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.navigatebusiness.app",
    ...(hasIos ? { googleServicesFile: iosConfig } : {}),
    infoPlist: localHttp
      ? { NSAppTransportSecurity: { NSAllowsLocalNetworking: true } }
      : {},
  },
  android: {
    package: "com.navigatebusiness.app",
    ...(hasAndroid ? { googleServicesFile: androidConfig } : {}),
    adaptiveIcon: {
      foregroundImage: "./assets/images/navigate-adaptive.png",
      backgroundColor: "#f4f5ef",
    },
  },
  web: {
    favicon: "./assets/favicon.svg",
    bundler: "metro",
    output: "single",
    name: "Navigate",
    themeColor: "#f4f5ef",
  },
  plugins: [
    ["expo-router", { root: "./src/app" }],
    "expo-dev-client",
    ...googlePlugin,
    "./plugins/with-google-redirect.cjs",
    ["expo-build-properties", { android: { usesCleartextTraffic: localHttp } }],
  ],
};
export default config;
