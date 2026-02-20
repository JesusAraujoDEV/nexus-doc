import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Settings, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Inicio", icon: LayoutDashboard, end: true },
  { to: "/admin/patients", label: "Pacientes", icon: Users },
  { to: "/admin/schedule", label: "Horarios", icon: Calendar },
  { to: "/admin/settings", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:flex-col w-64 min-h-screen bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
          <Stethoscope size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">MediCare</p>
          <p className="text-xs text-muted-foreground">Panel Admin</p>
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

      {/* Doctor info */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
            DG
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">Dra. García</p>
            <p className="text-[10px] text-muted-foreground">Médico General</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
