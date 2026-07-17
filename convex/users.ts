import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireAdmin, requireAdminOrManager } from "./helpers.ts";

export const updateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: identity.name ?? existing.name,
        email: identity.email ?? existing.email,
      });
      return existing._id;
    }

    const userCount = await ctx.db.query("users").take(1);
    const role = userCount.length === 0 ? "admin" : "staff";

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name,
      email: identity.email,
      role,
      isActive: true,
    });
  },
});

export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminOrManager(ctx);
    return await ctx.db.query("users").collect();
  },
});

export const createStaffMember = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("staff")),
    commissionRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) {
      throw new ConvexError({ message: "User with this email already exists", code: "CONFLICT" });
    }
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: `pending:${args.email}`,
      name: args.name,
      email: args.email,
      phone: args.phone,
      role: args.role,
      isActive: true,
      commissionRate: args.commissionRate,
    });
    const currentUser = await getCurrentUser(ctx);
    await ctx.db.insert("auditLogs", {
      userId: currentUser._id,
      action: "staff_created",
      resourceType: "users",
      resourceId: userId,
      description: `Created staff member: ${args.name} (${args.role})`,
    });
    return userId;
  },
});

export const updateStaffMember = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("manager"), v.literal("staff"))),
    isActive: v.optional(v.boolean()),
    commissionRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { userId, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(userId, cleanUpdates);
    const currentUser = await getCurrentUser(ctx);
    await ctx.db.insert("auditLogs", {
      userId: currentUser._id,
      action: "staff_updated",
      resourceType: "users",
      resourceId: userId,
      description: `Updated staff member: ${userId}`,
    });
  },
});

export const deleteStaffMember = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await requireAdmin(ctx);
    if (currentUser._id === args.userId) {
      throw new ConvexError({ message: "Cannot delete yourself", code: "BAD_REQUEST" });
    }
    await ctx.db.delete(args.userId);
    await ctx.db.insert("auditLogs", {
      userId: currentUser._id,
      action: "staff_deleted",
      resourceType: "users",
      resourceId: args.userId,
      description: `Deleted staff member: ${args.userId}`,
    });
  },
});

export const getStaffById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdminOrManager(ctx);
    return await ctx.db.get(args.userId);
  },
});
