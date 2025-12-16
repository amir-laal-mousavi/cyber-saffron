import { internalQuery } from "./_generated/server";

export const checkAdminStatus = internalQuery({
  args: {},
  handler: async (ctx) => {
    const email = "amirmoosavi9020@gmail.com";
    const user = await ctx.db.query("users").withIndex("email", q => q.eq("email", email)).first();
    if (!user) return { status: "User not found" };
    
    const authAccount = await ctx.db.query("authAccounts")
      .withIndex("userIdAndProvider", q => q.eq("userId", user._id).eq("provider", "password"))
      .first();
      
    if (!authAccount) return { status: "User found but no password set" };
    
    return { 
      status: "OK", 
      user: { role: user.role, email: user.email, id: user._id },
      hasPassword: true 
    };
  }
});
