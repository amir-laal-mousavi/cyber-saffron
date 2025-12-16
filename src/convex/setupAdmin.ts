import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const createAdminUser = action({
  args: {},
  handler: async (ctx) => {
    const email = "amirmoosavi9020@gmail.com";
    const password = "123456789";

    console.log("Attempting to create admin user via auth.signIn...");

    try {
      // Use the official auth action to create the user (signUp flow)
      // This ensures the password is hashed correctly by the provider
      // @ts-ignore
      await ctx.runAction(api.auth.signIn, {
        provider: "password",
        params: {
          email,
          password,
          flow: "signUp",
        },
      });
      return { success: true, message: "Admin user created successfully with correct password hash." };
    } catch (e: any) {
      console.error("Error creating admin user:", e);
      // If user already exists, we might want to try signing in or just return success if it's the same user
      // But for now, let's just report the error. The fixAdmin:resetAdminUser should have cleared it.
      return { success: false, error: e.message };
    }
  },
});