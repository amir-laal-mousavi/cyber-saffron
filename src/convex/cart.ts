import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!cart) return { items: [] };

    // Fetch product details for each cart item
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return {
      _id: cart._id,
      items: itemsWithDetails,
    };
  },
});

export const addItem = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    variant: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingCart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingCart) {
      // Check if item already exists
      const existingItemIndex = existingCart.items.findIndex(
        (item) => item.productId === args.productId && item.variant === args.variant
      );

      if (existingItemIndex >= 0) {
        // Update quantity
        const updatedItems = [...existingCart.items];
        updatedItems[existingItemIndex].quantity += args.quantity;
        await ctx.db.patch(existingCart._id, { items: updatedItems });
      } else {
        // Add new item
        await ctx.db.patch(existingCart._id, {
          items: [...existingCart.items, args],
        });
      }
    } else {
      // Create new cart
      await ctx.db.insert("carts", {
        userId,
        items: [args],
      });
    }
  },
});

export const updateQuantity = mutation({
  args: {
    productId: v.id("products"),
    variant: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!cart) throw new Error("Cart not found");

    const updatedItems = cart.items.map((item) =>
      item.productId === args.productId && item.variant === args.variant
        ? { ...item, quantity: args.quantity }
        : item
    );

    await ctx.db.patch(cart._id, { items: updatedItems });
  },
});

export const removeItem = mutation({
  args: {
    productId: v.id("products"),
    variant: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!cart) throw new Error("Cart not found");

    const updatedItems = cart.items.filter(
      (item) => !(item.productId === args.productId && item.variant === args.variant)
    );

    await ctx.db.patch(cart._id, { items: updatedItems });
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (cart) {
      await ctx.db.patch(cart._id, { items: [] });
    }
  },
});
