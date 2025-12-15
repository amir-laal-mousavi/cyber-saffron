import { v } from "convex/values";
import { internalMutation, query } from "../_generated/server";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

// Store password reset tokens
export const createResetToken = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true };
    }

    // Generate 6-digit reset code
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    const token = generateRandomString(random, alphabet, 6);

    // Store token with 15 minute expiry
    const expiresAt = Date.now() + 15 * 60 * 1000;

    // Delete any existing reset tokens for this user
    const existingTokens = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
    
    for (const existingToken of existingTokens) {
      await ctx.db.delete(existingToken._id);
    }

    // Create new token
    await ctx.db.insert("passwordResetTokens", {
      userId: user._id,
      token,
      expiresAt,
      used: false,
    });

    return { success: true, token }; // Token returned for email sending
  },
});

export const verifyResetToken = query({
  args: { email: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      return { valid: false };
    }

    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("token"), args.token),
          q.eq(q.field("used"), false)
        )
      )
      .first();

    if (!resetToken) {
      return { valid: false };
    }

    if (resetToken.expiresAt < Date.now()) {
      return { valid: false, expired: true };
    }

    return { valid: true };
  },
});

export const resetPassword = internalMutation({
  args: {
    email: v.string(),
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error("Invalid reset token");
    }

    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("token"), args.token),
          q.eq(q.field("used"), false)
        )
      )
      .first();

    if (!resetToken) {
      throw new Error("Invalid reset token");
    }

    if (resetToken.expiresAt < Date.now()) {
      throw new Error("Reset token has expired");
    }

    // Mark token as used
    await ctx.db.patch(resetToken._id, { used: true });

    return { success: true };
  },
});
