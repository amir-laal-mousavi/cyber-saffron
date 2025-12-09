import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return;

    const products = [
      {
        name: "Genesis Saffron Pack",
        description: "Entry level premium saffron with digital twin.",
        weight: "1 Gram",
        tier: "Entry Level",
        priceEth: 0.05,
        priceUsd: 120,
        image: "https://harmless-tapir-303.convex.cloud/api/storage/8b1fca36-0300-4b54-a4f2-f29abd5e0fe4",
        features: ["Standard blister pack", "Digital QR twin", "Blockchain verified"],
      },
      {
        name: "Cyber Elite Box",
        description: "Mid-tier luxury experience with NFT access.",
        weight: "5 Grams",
        tier: "Mid Tier",
        priceEth: 0.2,
        priceUsd: 450,
        image: "https://harmless-tapir-303.convex.cloud/api/storage/fbf4ef29-e069-4cd4-b719-1c0688bb7f0a",
        features: ["Luxury hard-shell box", "Velvet interior", "NFT access card"],
      },
      {
        name: "Infinity Reserve",
        description: "The ultimate saffron experience for collectors.",
        weight: "10 Grams + Gift",
        tier: "High End",
        priceEth: 0.5,
        priceUsd: 1100,
        image: "https://harmless-tapir-303.convex.cloud/api/storage/8b1fca36-0300-4b54-a4f2-f29abd5e0fe4",
        features: ["Limited edition metal briefcase", "Embedded NFC chip", "Full traceability"],
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }
  },
});
