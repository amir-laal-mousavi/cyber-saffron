import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ROLES } from "./schema";

// Helper to check admin permissions
async function checkAdminAccess(ctx: QueryCtx | MutationCtx, requiredModule: string, requiredAction: string) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");

  // Hardcoded Super Admin Access
  if (user.email === "amirmoosavi9020@gmail.com") return user;

  if (user.role === ROLES.ADMIN) return user; // Super Admin has full access

  if (user.role === ROLES.SUB_ADMIN && user.permissions) {
    const modulePermissions = (user.permissions as any)[requiredModule];
    if (modulePermissions && modulePermissions.includes(requiredAction)) {
      return user;
    }
  }

  throw new Error("Unauthorized access");
}

// --- Dashboard Stats ---
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await checkAdminAccess(ctx, "financials", "view");

    const totalUsers = (await ctx.db.query("users").collect()).length;
    const totalOrders = (await ctx.db.query("orders").collect()).length;
    
    // Calculate financials
    const orders = await ctx.db.query("orders").collect();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalUsd, 0);

    const commissions = await ctx.db.query("commissions").collect();
    const totalCommissionLiability = commissions
      .filter(c => c.status === "pending")
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalCommissionPaid = commissions
      .filter(c => c.status === "paid")
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalCommissionLiability,
      totalCommissionPaid,
    };
  },
});

// --- User Management ---
export const listUsers = query({
  args: { role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await checkAdminAccess(ctx, "users", "view");
    
    let q = ctx.db.query("users");
    if (args.role) {
      // @ts-ignore
      q = q.withIndex("by_role", (q) => q.eq("role", args.role));
    }
    
    return await q.order("desc").take(100); // Pagination needed for production
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    role: v.optional(v.string()),
    isBanned: v.optional(v.boolean()),
    agentTier: v.optional(v.string()),
    referralCode: v.optional(v.string()),
    permissions: v.optional(v.object({
      users: v.array(v.string()),
      products: v.array(v.string()),
      financials: v.array(v.string()),
      cms: v.array(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    await checkAdminAccess(ctx, "users", "edit");
    
    const updates: any = {};
    if (args.role !== undefined) updates.role = args.role;
    if (args.isBanned !== undefined) updates.isBanned = args.isBanned;
    if (args.agentTier !== undefined) updates.agentTier = args.agentTier;
    if (args.referralCode !== undefined) updates.referralCode = args.referralCode;
    if (args.permissions !== undefined) updates.permissions = args.permissions;

    await ctx.db.patch(args.userId, updates);
  },
});

// --- Product Management ---
export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    priceUsd: v.optional(v.number()),
    stock: v.optional(v.number()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAdminAccess(ctx, "products", "edit");
    
    const updates: any = {};
    if (args.priceUsd !== undefined) updates.priceUsd = args.priceUsd;
    if (args.stock !== undefined) updates.stock = args.stock;
    if (args.image !== undefined) updates.image = args.image;

    await ctx.db.patch(args.productId, updates);
  },
});

// --- Financials ---
export const getPendingCommissions = query({
  args: {},
  handler: async (ctx) => {
    await checkAdminAccess(ctx, "financials", "view");
    
    return await ctx.db
      .query("commissions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

export const processCommission = mutation({
  args: {
    commissionId: v.id("commissions"),
    action: v.union(v.literal("approve"), v.literal("reject")),
  },
  handler: async (ctx, args) => {
    await checkAdminAccess(ctx, "financials", "approve"); // Simplified permission check
    
    const status = args.action === "approve" ? "paid" : "rejected";
    await ctx.db.patch(args.commissionId, {
      status,
      paidAt: status === "paid" ? Date.now() : undefined,
    });
  },
});

// --- CMS ---
export const getCMSContent = query({
  args: { section: v.string() },
  handler: async (ctx, args) => {
    // Publicly accessible for reading? Or admin only? 
    // Usually CMS content is public read, admin write.
    // But this function is for the admin panel to load current state.
    // We'll allow public read for the frontend to use it, but maybe a separate function for public.
    // For now, let's assume this is for the admin editor.
    await checkAdminAccess(ctx, "cms", "view");
    
    return await ctx.db
      .query("cmsContent")
      .withIndex("by_section", (q) => q.eq("section", args.section))
      .first();
  },
});

export const updateCMSContent = mutation({
  args: {
    section: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    await checkAdminAccess(ctx, "cms", "edit");
    
    const existing = await ctx.db
      .query("cmsContent")
      .withIndex("by_section", (q) => q.eq("section", args.section))
      .first();

    const userId = await getAuthUserId(ctx);

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedBy: userId!,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("cmsContent", {
        section: args.section,
        content: args.content,
        updatedBy: userId!,
        updatedAt: Date.now(),
      });
    }
  },
});