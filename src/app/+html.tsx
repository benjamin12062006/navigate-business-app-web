import type { ReactNode } from "react";
import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Accede a tu espacio personal en Navigate. Claridad y contexto para construir tu propia perspectiva de inversión."
        />
        <meta name="theme-color" content="#f4f5ef" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
