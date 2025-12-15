import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const total = await ctx.db.query("courses").collect();
    if (total.length > 0) return;

    const courses = [
      {
        title: "Saffron 101: The Red Gold",
        description: "Master the fundamentals of the world's most expensive spice. Learn about its history, cultivation, and grading standards.",
        category: "Product Knowledge",
        level: "Beginner",
        duration: "45 min",
        rating: 4.9,
        students: 1234,
        image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop",
        modules: [
          { title: "The History of Saffron", duration: "10 min", type: "video" },
          { title: "Cultivation & Harvesting", duration: "15 min", type: "video" },
          { title: "Grading Standards (Sargol, Negin)", duration: "12 min", type: "reading" },
          { title: "Identifying Authentic Saffron", duration: "8 min", type: "quiz" }
        ]
      },
      {
        title: "Blockchain Verification",
        description: "Understanding how we use blockchain technology to guarantee provenance and transparency in the supply chain.",
        category: "Technology",
        level: "Intermediate",
        duration: "60 min",
        rating: 4.8,
        students: 856,
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
        modules: [
          { title: "Introduction to Web3 & Supply Chain", duration: "15 min", type: "video" },
          { title: "How Provenance Works", duration: "20 min", type: "video" },
          { title: "Verifying Products on Chain", duration: "15 min", type: "interactive" },
          { title: "Smart Contracts Explained", duration: "10 min", type: "reading" }
        ]
      },
      {
        title: "Agent Success Masterclass",
        description: "Advanced strategies to grow your network, maximize commissions, and become a top-tier Cyber Saffron agent.",
        category: "Business",
        level: "Advanced",
        duration: "90 min",
        rating: 5.0,
        students: 2100,
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
        modules: [
          { title: "The Commission Model Deep Dive", duration: "20 min", type: "video" },
          { title: "Building Your Network", duration: "25 min", type: "video" },
          { title: "Marketing Strategies for Luxury Goods", duration: "30 min", type: "reading" },
          { title: "Managing Your Dashboard", duration: "15 min", type: "interactive" }
        ]
      },
      {
        title: "Culinary Arts with Saffron",
        description: "Explore the culinary applications of saffron. Learn recipes and techniques from top chefs.",
        category: "Lifestyle",
        level: "Beginner",
        duration: "30 min",
        rating: 4.7,
        students: 540,
        image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?q=80&w=1000&auto=format&fit=crop",
        modules: [
          { title: "Flavor Profiling", duration: "5 min", type: "video" },
          { title: "Infusion Techniques", duration: "10 min", type: "video" },
          { title: "Signature Recipes", duration: "15 min", type: "reading" }
        ]
      }
    ];

    for (const course of courses) {
      await ctx.db.insert("courses", course);
    }
  },
});
