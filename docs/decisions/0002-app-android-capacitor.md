# 0002 — App de Android con Capacitor cargando el sitio en vivo

- Estado: aceptada (2026-11-27)

## Contexto
La doctora necesita NexusDoc como app en su teléfono Android. Opciones: reescribir en React Native o Flutter, o envolver la app React existente.

## Decisión
Capacitor 7 envolviendo el mismo frontend, con `server.url` apuntando a https://nexusdoc.jesusaraujo.lat. Cada deploy del frontend llega a la app sin reinstalar; solo se regenera el APK si cambian plugins nativos.
Puentes nativos mínimos: PDFs y adjuntos se guardan en caché y se abren con el visor del teléfono (`src/lib/native-file.ts`), y el botón atrás de Android navega el historial (`src/lib/native-back-button.ts`).

## Consecuencias
- Un solo código para web y app; sin segunda base que mantener.
- La app necesita internet (igual que la web: los datos están en el servidor).
- iPhone quedaría con el mismo enfoque, pero requiere Mac + cuenta Apple Developer.
