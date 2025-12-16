import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const updatePasswordInternal = internalMutation({
  args: {
    email: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    let user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      // Create user if not exists
      const userId = await ctx.db.insert("users", {
        email: email,
        name: "Super Admin",
        role: "admin",
        agentTier: "double_diamond",
        isAnonymous: false,
        emailVerificationTime: Date.now(), // Mark as verified
      });
      user = await ctx.db.get(userId);
    } else {
        // Ensure they are admin
        if (user.role !== "admin") {
            await ctx.db.patch(user._id, { 
              role: "admin", 
              agentTier: "double_diamond",
              emailVerificationTime: user.emailVerificationTime || Date.now() 
            });
        }
    }

    if (!user) throw new Error("Failed to get/create user");

    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) =>
        q.eq("userId", user._id).eq("provider", "password")
      )
      .first();

    if (authAccount) {
      await ctx.db.patch(authAccount._id, {
        secret: args.secret,
      });
    } else {
      await ctx.db.insert("authAccounts", {
        userId: user._id,
        provider: "password",
        secret: args.secret,
        providerAccountId: email,
      });
    }

    return { success: true };
  },
});