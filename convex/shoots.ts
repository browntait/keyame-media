import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./helpers.ts";

export const getShoots = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    let shoots = await ctx.db.query("shoots").collect();
    if (currentUser.role === "staff") {
      shoots = shoots.filter((s) => s.photographerId === currentUser._id || s.createdBy === currentUser._id);
    }
    if (args.status && args.status !== "all") {
      shoots = shoots.filter((s) => s.status === args.status);
    }
    const result = await Promise.all(shoots.map(async (shoot) => {
      const client = await ctx.db.get(shoot.clientId);
      const photographer = await ctx.db.get(shoot.photographerId);
      return { ...shoot, clientName: client?.fullName ?? "Unknown", photographerName: photographer?.name ?? "Unknown" };
    }));
    return result.sort((a, b) => new Date(b.shootDate).getTime() - new Date(a.shootDate).getTime());
  },
});

export const createShoot = mutation({
  args: { clientId: v.id("clients"), photographerId: v.id("users"), shootDate: v.string(), location: v.string(), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    const shootId = await ctx.db.insert("shoots", { ...args, status: "scheduled", createdBy: currentUser._id });
    await ctx.db.insert("auditLogs", { userId: currentUser._id, action: "shoot_created", resourceType: "shoots", resourceId: shootId, description: `Scheduled shoot for client ${args.clientId}` });
    return shootId;
  },
});

export const updateShootStatus = mutation({
  args: {
    shootId: v.id("shoots"),
    status: v.union(v.literal("scheduled"), v.literal("in_progress"), v.literal("editing"), v.literal("ready"), v.literal("delivered")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    const { shootId, ...updates } = args;
    const cleanUpdates = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(shootId, cleanUpdates);
    await ctx.db.insert("auditLogs", { userId: currentUser._id, action: "shoot_updated", resourceType: "shoots", resourceId: shootId, description: `Updated shoot status to ${args.status}` });
  },
});
