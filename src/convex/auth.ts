// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      const user = await ctx.db.get(args.userId);
      
      // Auto-promote the super admin on login/signup
      if (user?.email === "amirmoosavi9020@gmail.com" && user.role !== "admin") {
        await ctx.db.patch(args.userId, { role: "admin", agentTier: "double_diamond" });
      }
    },
  },
});