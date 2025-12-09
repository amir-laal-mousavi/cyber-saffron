import { query } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});
