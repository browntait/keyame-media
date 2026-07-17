import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireAdmin } from "./helpers.ts";

export const getMyCommissions = query({
  args: { startDate: v.optional(v.string()), endDate: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    let commissions = await ctx.db.query("commissions").withIndex("by_staff", (q) => q.eq("staffId", currentUser._id)).collect();
    if (args.startDate) commissions = commissions.filter((c) => new Date(c._creationTime).toISOString() >= args.startDate!);
    if (args.endDate) commissions = commissions.filter((c) => new Date(c._creationTime).toISOString() <= args.endDate! + "T23:59:59");
    const result = await Promise.all(commissions.map(async (c) => {
      const client = await ctx.db.get(c.clientId);
      return { ...c, clientName: client?.fullName ?? "Unknown" };
    }));
    return result;
  },
});

export const getAllCommissions = query({
  args: { staffId: v.optional(v.id("users")), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    let commissions = await ctx.db.query("commissions").collect();
    if (args.staffId) commissions = commissions.filter((c) => c.staffId === args.staffId);
    if (args.status && args.status !== "all") commissions = commissions.filter((c) => c.status === args.status);
    const result = await Promise.all(commissions.map(async (c) => {
      const staff = await ctx.db.get(c.staffId);
      const client = await ctx.db.get(c.clientId);
      return { ...c, staffName: staff?.name ?? "Unknown", clientName: client?.fullName ?? "Unknown" };
    }));
    return result;
  },
});

export const markCommissionPaid = mutation({
  args: { commissionIds: v.array(v.id("commissions")) },
  handler: async (ctx, args) => {
    const currentUser = await requireAdmin(ctx);
    const now = new Date().toISOString();
    for (const id of args.commissionIds) {
      await ctx.db.patch(id, { status: "paid", paidAt: now, paidBy: currentUser._id });
    }
    await ctx.db.insert("auditLogs", { userId: currentUser._id, action: "commission_paid", description: `Marked ${args.commissionIds.length} commissions as paid` });
  },
});

export const getCommissionSettings = query({
  args: {},
  handler: async (ctx) => {
    await getCurrentUser(ctx);
    return await ctx.db.query("commissionSettings").first();
  },
});

export const updateCommissionSettings = mutation({
  args: { globalRate: v.number() },
  handler: async (ctx, args) => {
    const currentUser = await requireAdmin(ctx);
    const existing = await ctx.db.query("commissionSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, { globalRate: args.globalRate, updatedBy: currentUser._id });
    } else {
      await ctx.db.insert("commissionSettings", { globalRate: args.globalRate, updatedBy: currentUser._id });
    }
    await ctx.db.insert("auditLogs", { userId: currentUser._id, action: "settings_updated", description: `Updated global commission rate to ${args.globalRate}%` });
  },
});
