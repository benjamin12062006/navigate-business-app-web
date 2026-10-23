# Configuración móvil Firebase

Fecha de creación: 2026-10-22
Relacionada con: [pasos completos](../../README.md).

El frontend actual usa expo-city-bol. Registra Android/iOS en ese mismo proyecto y coloca aquí `google-services.json` y `GoogleService-Info.plist`.

Los archivos disponibles en KOTLIN-APP pertenecen a business-managment-rs; no se reutilizan porque sus tokens/configuración no corresponden a la sesión actual de la web. app.config.ts rechaza archivos de otro proyecto.

Identificadores propuestos para registrar: `com.navigatebusiness.app` en Android e iOS. Si eliges otros, actualiza app.config.ts y registra los correspondientes. No guardes claves Admin ni credenciales de servicio en esta carpeta.
