"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const setAdminPassword = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const crypto = await import("crypto");
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(args.password, salt, 100000, 64, "sha512")
      .toString("hex");
    
    const secret = `${salt}:${hash}`;

    // Use string reference to avoid type issues before generation
    await ctx.runMutation("adminAuthMutation:updatePasswordInternal" as any, {
      email: args.email,
      secret: secret,
    });

    return { success: true, message: "Password updated successfully" };
  },
});