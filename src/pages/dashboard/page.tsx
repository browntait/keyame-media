import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Users, UserCheck, Clock, CheckCircle, TrendingUp, DollarSign, AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge.tsx";
import { useCurrentUser } from "@/hooks/use-user-role.ts";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const stats = useQuery(api.clients.getDashboardStats);
  const revenueData = useQuery(api.payments.getRevenueStats, { period: "monthly" });
  const user = useCurrentUser();
  const navigate = useNavigate();

  if (!stats) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    </div>
  );

  const statCards = [
    { title: "Total Clients", value: stats.totalClients, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Today's Clients", value: stats.todayClients, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "Pending Delivery", value: stats.pendingDeliveries, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { title: "Completed", value: stats.completedDeliveries, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { title: "Total Revenue", value: `KES ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { title: "Monthly Revenue", value: `KES ${stats.monthlyRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { title: "My Commission", value: `KES ${stats.totalCommission.toLocaleString()}`, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/20" },
    { title: "Overdue", value: stats.overdueCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good {getGreeting()}, {user?.name?.split(" ")[0] ?? "there"} \u{1F44B}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{card.title}</p>
                  <p className="text-xl font-bold mt-1 text-foreground">{card.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData ?? []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#285fcc" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#285fcc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="amount" stroke="#285fcc" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" />Upcoming Deliveries</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.upcomingDeliveries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming deliveries</p>
            ) : stats.upcomingDeliveries.map((client) => (
              <div key={client._id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted" onClick={() => navigate(`/clients/${client._id}`)}>                <div className="min-w-0"><p className="text-xs font-medium truncate">{client.fullName}</p><p className="text-[10px] text-muted-foreground">{client.expectedDeliveryDate.split("T")[0]}</p></div>
                <StatusBadge status={client.deliveryStatus} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Clients</CardTitle>
            <button onClick={() => navigate("/clients")} className="text-xs text-primary hover:underline">View all</button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border">
                {["Client","Invoice","Service","Amount","Delivery","Payment"].map((h) => <th key={h} className="text-left py-2 text-muted-foreground font-medium">{h}</th>)}
              </tr></thead>
              <tbody>{stats.recentClients.map((client) => (
                <tr key={client._id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/clients/${client._id}`)}>
                  <td className="py-2.5 font-medium">{client.fullName}</td>
                  <td className="py-2.5 text-muted-foreground font-mono text-[10px]">{client.invoiceNumber}</td>
                  <td className="py-2.5 text-muted-foreground">{client.serviceName}</td>
                  <td className="py-2.5 font-semibold">KES {client.totalAmount.toLocaleString()}</td>
                  <td className="py-2.5"><StatusBadge status={client.deliveryStatus} /></td>
                  <td className="py-2.5"><StatusBadge status={client.paymentStatus} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
