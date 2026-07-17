import { cn } from "@/lib/utils.ts";

type StatusVariant =
  | "pending" | "editing" | "ready" | "delivered"
  | "unpaid" | "partial" | "paid"
  | "scheduled" | "in_progress" | "completed" | "failed" | "cancelled"
  | "active" | "inactive"
  | "admin" | "manager" | "staff"
  | "sent" | "overdue";

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  editing: { label: "Editing", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  ready: { label: "Ready", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  unpaid: { label: "Unpaid", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  partial: { label: "Partial", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  paid: { label: "Paid", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  scheduled: { label: "Scheduled", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  in_progress: { label: "In Progress", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  active: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  inactive: { label: "Inactive", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  admin: { label: "Admin", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  manager: { label: "Manager", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  staff: { label: "Staff", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  sent: { label: "Sent", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as StatusVariant] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
}
