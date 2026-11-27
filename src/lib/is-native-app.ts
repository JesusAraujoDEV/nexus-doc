import { Capacitor } from "@capacitor/core";

/** True dentro de la app de Android (Capacitor); false en el navegador. */
export const isNativeApp = (): boolean => Capacitor.isNativePlatform();
