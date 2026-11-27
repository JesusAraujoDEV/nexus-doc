import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/is-native-app";
import { clearOpenedFiles } from "@/lib/open-file-native";

/**
 * Arranque nativo: limpia archivos abiertos antes y conecta el botón "atrás" de Android.
 * Atrás cierra el diálogo abierto si hay uno; si no, vuelve de pantalla o cierra la app.
 */
export function setupNativeBackButton(): void {
  if (!isNativeApp()) return;
  void clearOpenedFiles();
  void App.addListener("backButton", ({ canGoBack }) => {
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      return;
    }
    if (canGoBack) window.history.back();
    else void App.exitApp();
  });
}
