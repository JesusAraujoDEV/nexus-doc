import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePassword, ApiError } from "@/lib/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-6 pb-4 border-b border-border bg-card sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />Volver
        </button>
        <h1 className="text-lg font-bold text-foreground mt-2">Cambiar contraseña</h1>
      </div>

      <div className="flex-1 p-4 max-w-sm w-full mx-auto">
        <form onSubmit={handleSubmit} className="medical-card p-5 space-y-4 mt-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <KeyRound size={18} />
            <span className="text-sm font-semibold">Actualizar credenciales</span>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contraseña actual</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="h-11 rounded-xl bg-muted border-0 text-sm"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nueva contraseña</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="h-11 rounded-xl bg-muted border-0 text-sm"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirmar nueva contraseña</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="h-11 rounded-xl bg-muted border-0 text-sm"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && (
            <p className="flex items-center gap-1.5 text-xs text-primary">
              <CheckCircle2 size={14} />Contraseña actualizada.
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl gradient-primary text-white font-semibold">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Guardar cambios"}
          </Button>
        </form>
      </div>
    </div>
  );
}
