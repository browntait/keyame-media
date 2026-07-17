import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";

export function useCurrentUser() {
  return useQuery(api.users.getCurrentUserProfile);
}

export function useIsAdmin() {
  const user = useCurrentUser();
  return user?.role === "admin";
}

export function useIsAdminOrManager() {
  const user = useCurrentUser();
  return user?.role === "admin" || user?.role === "manager";
}

export function useHasRole(roles: Array<"admin" | "manager" | "staff">) {
  const user = useCurrentUser();
  return user ? roles.includes(user.role) : false;
}
