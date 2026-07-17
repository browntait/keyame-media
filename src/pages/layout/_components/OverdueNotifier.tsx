import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";

export default function OverdueNotifier() {
  const data = useQuery(api.notifications.checkOverdueDeliveries);
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!data) return;
    for (const client of data.overdue) {
      if (!notifiedRef.current.has(client._id + "_overdue")) {
        notifiedRef.current.add(client._id + "_overdue");
        toast.error(`Overdue Delivery: ${client.fullName}`, {
          description: `Expected: ${client.expectedDeliveryDate.split("T")[0]} — Invoice: ${client.invoiceNumber}`,
          duration: 8000,
        });
      }
    }
    for (const client of data.dueTomorrow) {
      if (!notifiedRef.current.has(client._id + "_tomorrow")) {
        notifiedRef.current.add(client._id + "_tomorrow");
        toast.warning(`Delivery Due Tomorrow: ${client.fullName}`, {
          description: `Invoice: ${client.invoiceNumber} — Please prepare files`,
          duration: 6000,
        });
      }
    }
  }, [data]);

  return null;
}
