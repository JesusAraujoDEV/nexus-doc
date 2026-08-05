import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Stethoscope, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearToken } from "@/lib/api";

const navItems = [
  { to: "/admin", label: "Inicio", icon: LayoutDashboard, end: true },
  { to: "/admin/patients", label: "Pacientes", icon: Users },
  { to: "/admin/schedule", label: "Horarios", icon: Calendar },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <aside className="hidden md:flex md:flex-col w-64 min-h-screen bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
          <Stethoscope size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">NexusDoc</p>
          <p className="text-xs text-muted-foreground">Panel Médico</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
