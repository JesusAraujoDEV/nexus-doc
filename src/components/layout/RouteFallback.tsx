import { Loader2 } from "lucide-react";

/** Mientras baja el chunk de una ruta cargada con React.lazy. */
export function RouteFallback() {
  return (
    <div className="flex-1 py-16 flex justify-center text-muted-foreground" role="status" aria-label="Cargando">
      <Loader2 size={22} className="animate-spin" />
    </div>
  );
}
