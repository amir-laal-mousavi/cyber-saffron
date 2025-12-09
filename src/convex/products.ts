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
        image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&q=80",
        features: ["Standard blister pack", "Digital QR twin", "Blockchain verified"],
      },
      {
        name: "Cyber Elite Box",
        description: "Mid-tier luxury experience with NFT access.",
        weight: "5 Grams",
        tier: "Mid Tier",
        priceEth: 0.2,
        priceUsd: 450,
        image: "https://images.unsplash.com/photo-1596040033229-a0b3b83b2e4d?w=800&q=80",
        features: ["Luxury hard-shell box", "Velvet interior", "NFT access card"],
      },
      {
        name: "Infinity Reserve",
        description: "The ultimate saffron experience for collectors.",
        weight: "10 Grams + Gift",
        tier: "High End",
        priceEth: 0.5,
        priceUsd: 1100,
        image: "https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=800&q=80",
        features: ["Limited edition metal briefcase", "Embedded NFC chip", "Full traceability"],
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }
  },
});
