"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import axios from "axios";

export const sendResetEmail = action({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Generate reset token
    const result: any = await ctx.runMutation(
      "auth/passwordReset:createResetToken" as any,
      { email: args.email }
    );

    if (!result.success || !result.token) {
      return { success: true }; // Don't reveal if email exists
    }

    // Send email with reset code
    try {
      await axios.post(
        "https://email.vly.ai/send_otp",
        {
          to: args.email,
          otp: result.token,
          appName: "Cyber Saffron - Password Reset",
        },
        {
          headers: {
            "x-api-key": "vlytothemoon2025",
          },
        }
      );
      return { success: true };
    } catch (error) {
      console.error("Failed to send reset email:", error);
      throw new Error("Failed to send reset email");
    }
  },
});