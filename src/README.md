# Entradas Expo y presentación de página

Fecha de creación: 2026-10-22
Relacionada con: [arquitectura](../app/README.md), [README](../README.md).

`app/_layout.tsx` carga las tipografías empaquetadas, estilos NativeWind, SafeAreaProvider, StatusBar y Stack. `app/index.tsx` compone cabecera, introducción, ilustración y tarjeta de auth. Adquiere el controlador únicamente al montar; no inicia Firebase durante la importación de una página web.

`app/+html.tsx` define español/metadatos para web. `app/+native-intent.tsx` conserva la ruta de acceso cuando regresa Google. `components/home` y `components/layout` adaptan el Astro original a View/Text/SVG; `styles/global.css` es la entrada Tailwind.

No hay WebView ni islas Vue en el código activo. Las fuentes originales están archivadas bajo docs/referencias y excluidas de rutas y comprobaciones activas.
