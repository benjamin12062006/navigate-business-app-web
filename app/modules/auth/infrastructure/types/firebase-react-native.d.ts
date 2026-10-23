import "firebase/auth";
import type { Persistence } from "firebase/auth";

// Firebase 13.1's public declaration omits this RN-only export. Its installed
// dist/src/platform_react_native/persistence/react_native.d.ts defines this API.
// This augments types only; Metro must still select Firebase's react-native entry.
declare module "firebase/auth" {
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
