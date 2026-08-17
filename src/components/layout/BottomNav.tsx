import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, BookOpen, Clock, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearToken } from "@/lib/api";

// ponytail: la papelera y "cambiar contraseña" quedan fuera del bottom nav (ya
// era así antes de este cambio) — el resto sí, flex-1 reparte el ancho entre
// los items sin desbordar a 375px.
const navItems = [
  { to: "/admin", label: "Inicio", icon: LayoutDashboard, end: true },
  { to: "/admin/patients", label: "Pacientes", icon: Users },
  { to: "/admin/calendar", label: "Calendario", icon: Calendar },
  { to: "/admin/catalogs", label: "Catálogos", icon: BookOpen },
  { to: "/admin/schedule", label: "Horarios", icon: Clock },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <nav className="bottom-nav md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.end
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn("bottom-nav-item", isActive && "active")}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-[10px]">{item.label}</span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
            )}
          </NavLink>
        );
      })}
      <button onClick={logout} className="bottom-nav-item">
        <LogOut size={20} strokeWidth={1.8} />
        <span className="text-[10px]">Salir</span>
      </button>
    </nav>
  );
}
