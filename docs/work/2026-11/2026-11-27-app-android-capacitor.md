# 2026-11-27 — App de Android (Capacitor)

## What changed
- Proyecto `android/` con Capacitor 7 (`lat.jesusaraujo.nexusdoc`) que carga https://nexusdoc.jesusaraujo.lat; ícono y splash con el logo de la doctora.
- `src/lib/native-file.ts`: en la app, PDFs y adjuntos se guardan en caché y se abren con el visor del teléfono.
- `src/lib/open-pdf-tab.ts`: rama nativa que descarga el PDF con el token corto y lo abre con ese visor.
- `src/lib/native-back-button.ts`: el botón atrás de Android navega el historial.
- APK debug: `android/app/build/outputs/apk/debug/app-debug.apk` (copia en Descargas como NexusDoc.apk).

## Why
La doctora pidió usar NexusDoc como app en su Android. Se eligió Capacitor sobre React Native/Flutter para no reescribir (ADR 0002).

## How
`npx cap add android`, plugins filesystem/app/file-opener, build con el JDK de Android Studio (`JAVA_HOME=.../Android Studio/jbr`) y `gradlew assembleDebug`. Ícono y splash generados con PIL desde `nexus-doc-back/assets/logo.jpg`.

## Promoted knowledge
- Con `server.url`, un deploy del frontend llega a la app sin reinstalar; solo hay que regenerar el APK si cambian plugins nativos o el ícono.
- El WebView no abre blobs ni `window.open` de PDFs: todo lo descargable pasa por `openFileNative`.

## Follow-ups
- Prueba en emulador y revisión de código en curso (subagentes).
- APK firmado con keystore propio si se publica en Play Store; iPhone requiere Mac + cuenta Apple.

## Ajustes tras revisión de código
- Botón "Abrir" de adjuntos: pasa por `useAttachmentActions().openNative` (errores en toast) y usa el blob ya cacheado.
- Sin `contentType` genérico: el plugin deduce el tipo por extensión (Word/Excel).
- `android:allowBackup="false"`: el token de sesión del WebView no se sube al respaldo de Google.
- Archivos abiertos en `cache/abiertos/`, que se vacía al iniciar la app.
- `native-file.ts` dividido en `is-native-app.ts`, `open-file-native.ts`, `content-disposition.ts` (+ tests).
- Atrás de Android cierra el diálogo abierto antes de cambiar de pantalla.
