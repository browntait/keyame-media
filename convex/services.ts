import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireAdmin, requireAdminOrManager } from "./helpers.ts";

export const getServices = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);
    const services = await ctx.db.query("services").collect();
    if (args.activeOnly) return services.filter((s) => s.isActive);
    return services;
  },
});

export const createService = mutation({
  args: {
    name: v.string(),
    category: v.union(v.literal("indoor_shoot"), v.literal("outdoor_shoot"), v.literal("events"), v.literal("passport_photos"), v.literal("still_photos"), v.literal("cv_generation"), v.literal("printing"), v.literal("framing"), v.literal("other")),
    price: v.number(),
    estimatedDeliveryDays: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireAdminOrManager(ctx);
    const serviceId = await ctx.db.insert("services", { ...args, isActive: true });
    await ctx.db.insert("auditLogs", { userId: currentUser._id, action: "service_created", resourceType: "services", resourceId: serviceId, description: `Created service: ${args.name}` });
    return serviceId;
  },
});

export const updateService = mutation({
  args: {
    serviceId: v.id("services"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    estimatedDeliveryDays: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireAdminOrManager(ctx);
    const { serviceId, ...updates } = args;
    const cleanUpdates = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(serviceId, cleanUpdates);
    await ctx.db.insert("auditLogs", { userId: currentUser._id, action: "service_updated", resourceType: "services", resourceId: serviceId, description: `Updated service: ${serviceId}` });
  },
});

export const deleteService = mutation({
  args: { serviceId: v.id("services") },
  handler: async (ctx, args) => {
    const currentUser = await requireAdmin(ctx);
    await ctx.db.delete(args.serviceId);
    await ctx.db.insert("auditLogs", { userId: currentUser._id, action: "service_updated", resourceType: "services", resourceId: args.serviceId, description: `Deleted service: ${args.serviceId}` });
  },
});
