import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      variant: v.string(),
      priceUsd: v.number(),
      priceEth: v.number(),
    })),
    totalUsd: v.number(),
    totalEth: v.number(),
    shippingAddress: v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      country: v.string(),
      postalCode: v.string(),
    }),
    transactionHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const orderId = await ctx.db.insert("orders", {
      userId,
      items: args.items,
      totalUsd: args.totalUsd,
      totalEth: args.totalEth,
      status: "pending",
      shippingAddress: args.shippingAddress,
      transactionHash: args.transactionHash,
    });

    return orderId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== userId) {
      throw new Error("Order not found");
    }

    return order;
  },
});
