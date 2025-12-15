"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const resetPassword = action({
  args: {
    email: v.string(),
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Hash the new password using the same method as signup
    const crypto = await import("crypto");
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(args.newPassword, salt, 100000, 64, "sha512")
      .toString("hex");

    // Call the internal mutation to reset the password
    const result: any = await ctx.runMutation(
      "auth/passwordReset:resetPassword" as any,
      {
        email: args.email,
        token: args.token,
        newPassword: `${salt}:${hash}`,
      }
    );

    return result;
  },
});

