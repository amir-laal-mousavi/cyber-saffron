import { query } from "./_generated/server";

export const checkEnv = query({
  args: {},
  handler: async (ctx) => {
    const key = process.env.JWT_PRIVATE_KEY || "";
    const url = process.env.CONVEX_SITE_URL || "";
    return {
      keyLength: key.length,
      keyStart: key.substring(0, 20),
      keyEnd: key.substring(key.length - 20),
      isMultiline: key.includes("\n"),
      url: url,
    };
  },
});
