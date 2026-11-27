import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/native-file";

/** Botón "atrás" de Android: vuelve a la pantalla anterior; en la primera, cierra la app. */
export function setupNativeBackButton(): void {
  if (!isNativeApp()) return;
  void App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) window.history.back();
    else void App.exitApp();
  });
}
