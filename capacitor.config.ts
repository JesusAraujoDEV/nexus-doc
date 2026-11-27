import type { CapacitorConfig } from "@capacitor/cli";

// ponytail: la app carga el sitio en vivo, así cada deploy del frontend llega a la app
// sin reinstalar el APK. Solo hace falta un APK nuevo si cambian plugins nativos.
const config: CapacitorConfig = {
  appId: "lat.jesusaraujo.nexusdoc",
  appName: "NexusDoc",
  webDir: "dist",
  server: {
    url: "https://nexusdoc.jesusaraujo.lat",
    androidScheme: "https",
  },
};

export default config;
