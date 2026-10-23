import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";
import architecture from "./tooling/eslint/architecture.mjs";

export default [
  {
    ignores: [
      "node_modules/**",
      "docs/**",
      "dist/**",
      ".expo/**",
      "ios/**",
      "android/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, __DEV__: "readonly" },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    plugins: { architecture },
    rules: { "architecture/boundaries": "error" },
  },
  {
    files: [
      "app/modules/**/domain/**/*.ts",
      "app/modules/**/application/**/*.ts",
      "app/modules/**/presentation/{controllers,presenters,view-models}/**/*.ts",
    ],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        "fetch",
        "window",
        "document",
        "localStorage",
        "sessionStorage",
        "process",
        "globalThis",
      ],
    },
  },
  { files: ["**/*.test.ts"], rules: { "architecture/boundaries": "off" } },
  prettier,
];
