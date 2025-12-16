import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const promoteToAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return { success: false, message: "User not found. Please sign up first." };
    }

    await ctx.db.patch(user._id, {
      role: "admin",
      agentTier: "double_diamond", // Give them a high tier too
    });

    return { success: true, message: `User ${args.email} promoted to admin.` };
  },
});
