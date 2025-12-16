import { internalMutation } from "./_generated/server";

export const resetAdminUser = internalMutation({
  args: {},
  handler: async (ctx) => {
    const email = "amirmoosavi9020@gmail.com";
    
    // Find the user
    const user = await ctx.db.query("users")
      .withIndex("email", q => q.eq("email", email))
      .first();
      
    if (user) {
      // Delete auth accounts associated with this user
      const authAccounts = await ctx.db.query("authAccounts")
        .withIndex("userIdAndProvider", q => q.eq("userId", user._id))
        .collect();
        
      for (const account of authAccounts) {
        await ctx.db.delete(account._id);
      }
      
      // Delete the user to allow fresh signup
      await ctx.db.delete(user._id);
      return { success: true, message: "Admin user reset. Please sign up again." };
    }
    
    return { success: true, message: "User not found, ready for signup." };
  }
});
