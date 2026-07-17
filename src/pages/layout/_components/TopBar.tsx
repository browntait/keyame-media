import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Bell, Sun, Moon, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { useTheme } from "@/components/providers/theme.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const { signout } = useAuth();
  const navigate = useNavigate();
  const notifications = useQuery(api.notifications.getMyNotifications);
  const markRead = useMutation(api.notifications.markNotificationRead);
  const markAllRead = useMutation(api.notifications.markAllNotificationsRead);
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6 flex-shrink-0">
      <div className="ml-10 md:ml-0" />
      <div className="flex items-center gap-2">
        <Button size="sm" className="hidden sm:flex gap-2 text-xs" onClick={() => navigate("/clients/register")}>
          <UserPlus className="w-3.5 h-3.5" /> New Client
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && <button onClick={() => markAllRead()} className="text-xs text-primary hover:underline">Mark all read</button>}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {notifications?.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">No notifications</p>}
              {notifications?.slice(0, 10).map((n) => (
                <div key={n._id} className={cn("px-3 py-2.5 hover:bg-muted cursor-pointer border-b border-border last:border-0", !n.isRead && "bg-primary/5")} onClick={() => markRead({ notificationId: n._id })}>
                  <p className={cn("text-xs font-medium", !n.isRead && "text-primary")}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{format(new Date(n._creationTime), "MMM d, h:mm a")}</p>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { signout(); toast.success("Signed out"); }}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
