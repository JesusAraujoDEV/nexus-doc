import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, setToken } from "@/lib/api";
import { ApiError } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await login(email, password);
      setToken(token);
      navigate("/admin/patients", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? "Correo o contraseña incorrectos" : "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-primary mb-3">
            <Stethoscope size={26} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">NexusDoc</h1>
          <p className="text-xs text-muted-foreground">Panel Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="medical-card p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Correo</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl bg-muted border-0 text-sm"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl bg-muted border-0 text-sm"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl gradient-primary text-white font-semibold">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
