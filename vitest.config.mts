import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import tsconfig from "./tsconfig.json" with { type: "json" };

// Metro usa tsconfig; las pruebas reciben los mismos aliases explícitos.
const alias = Object.entries(tsconfig.compilerOptions.paths).map(
  ([find, [target]]) => ({
    find: find.endsWith("/*")
      ? new RegExp(`^${find.slice(0, -2)}/(.*)$`)
      : new RegExp(`^${find}$`),
    replacement: fileURLToPath(
      new URL(target!.replace("*", "$1"), import.meta.url),
    ),
  }),
);

export default defineConfig({
  resolve: { alias },
  test: {
    environment: "node",
    include: ["app/**/*.test.ts", "src/**/*.test.ts", "tooling/**/*.test.mjs"],
  },
});
