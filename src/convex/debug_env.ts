import { query } from "./_generated/server";

export const checkEnv = query({
  args: {},
  handler: async () => {
    const key = process.env.JWT_PRIVATE_KEY;
    const url = process.env.CONVEX_SITE_URL;
    
    return {
      jwtPrivateKey: {
        exists: !!key,
        length: key ? key.length : 0,
        preview: key ? `${key.substring(0, 20)}...` : "MISSING",
        isMultiline: key ? key.includes("\n") : false,
        hasHeader: key ? key.includes("BEGIN PRIVATE KEY") : false,
      },
      convexSiteUrl: {
        value: url || "MISSING",
      }
    };
  },
});
