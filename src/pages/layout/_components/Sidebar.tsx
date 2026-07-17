import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { useCurrentUser } from "@/hooks/use-user-role.ts";
import { LayoutDashboard, Users, UserCog, Briefcase, Camera, TrendingUp, FileText, ScrollText, PackageOpen, ArrowLeftRight, X, Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "staff"] },
  { to: "/clients", label: "Clients", icon: Users, roles: ["admin", "manager", "staff"] },
  { to: "/delivery", label: "Delivery", icon: PackageOpen, roles: ["admin", "manager", "staff"] },
  { to: "/shoots", label: "Shoots", icon: Camera, roles: ["admin", "manager", "staff"] },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight, roles: ["admin", "manager", "staff"] },
  { to: "/commissions", label: "Commissions", icon: TrendingUp, roles: ["admin", "manager", "staff"] },
  { to: "/staff", label: "Team", icon: UserCog, roles: ["admin"] },
  { to: "/services", label: "Services", icon: Briefcase, roles: ["admin", "manager"] },
  { to: "/reports", label: "Reports", icon: FileText, roles: ["admin", "manager"] },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText, roles: ["admin", "manager"] },
] as const;

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <button className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-sidebar text-sidebar-foreground" onClick={() => setMobileOpen(true)}>
        <Menu className="w-5 h-5" />
      </button>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}
      <div className={cn("fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 md:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>
      <div className="hidden md:flex w-64 flex-shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const user = useCurrentUser();
  const role = user?.role ?? "staff";
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-white">K</span>
          </div>
          <div>
            <p className="font-bold text-sm text-sidebar-foreground">Keyame Media</p>
            <p className="text-xs text-sidebar-foreground/50">Studio Manager</p>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="text-sidebar-foreground/50 hover:text-sidebar-foreground"><X className="w-4 h-4" /></button>}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems
          .filter((item) => item.roles.includes(role as "admin"))
          .map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={onClose}
              className={({ isActive }) => cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary text-white" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground")}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
      </nav>
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{user?.name?.charAt(0).toUpperCase() ?? "U"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name ?? "Loading..."}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
