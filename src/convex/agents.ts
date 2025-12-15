import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate a unique referral code
function createRandomReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Get agent tier based on total sales
function calculateAgentTier(totalSales: number): "bronze" | "silver" | "gold" | "platinum" {
  if (totalSales >= 50000) return "platinum";
  if (totalSales >= 20000) return "gold";
  if (totalSales >= 5000) return "silver";
  return "bronze";
}

// Get commission percentage based on tier
export function getCommissionRate(tier: "bronze" | "silver" | "gold" | "platinum"): number {
  const rates = {
    bronze: 0.10,    // 10%
    silver: 0.15,    // 15%
    gold: 0.20,      // 20%
    platinum: 0.25,  // 25%
  };
  return rates[tier];
}

// Verify referral code exists
export const verifyReferralCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", args.code))
      .first();
    
    return agent ? { valid: true, agentName: agent.name || "Agent" } : { valid: false };
  },
});

// Initialize new agent with referral code
export const initializeAgent = mutation({
  args: {
    referralCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Check if already initialized
    if (user.referralCode) {
      return { success: false, message: "Agent already initialized" };
    }

    // Find referrer
    const referrer = await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", args.referralCode))
      .first();

    if (!referrer) {
      throw new Error("Invalid referral code");
    }

    // Generate unique referral code for new agent
    let newReferralCode = createRandomReferralCode();
    let existing = await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", newReferralCode))
      .first();
    
    while (existing) {
      newReferralCode = createRandomReferralCode();
      existing = await ctx.db
        .query("users")
        .withIndex("by_referral_code", (q) => q.eq("referralCode", newReferralCode))
        .first();
    }

    // Update user to agent
    await ctx.db.patch(userId, {
      role: "agent",
      referralCode: newReferralCode,
      referredBy: referrer._id,
      agentTier: "bronze",
      totalSales: 0,
      totalCommission: 0,
      pendingPayout: 0,
    });

    // Create network entry
    const referrerNetwork = await ctx.db
      .query("agentNetwork")
      .withIndex("by_agent", (q) => q.eq("agentId", referrer._id))
      .first();

    await ctx.db.insert("agentNetwork", {
      agentId: userId,
      parentAgentId: referrer._id,
      level: referrerNetwork ? referrerNetwork.level + 1 : 1,
      totalDownline: 0,
      directReferrals: 0,
    });

    // Update referrer's network stats
    if (referrerNetwork) {
      await ctx.db.patch(referrerNetwork._id, {
        directReferrals: referrerNetwork.directReferrals + 1,
        totalDownline: referrerNetwork.totalDownline + 1,
      });
    }

    return { success: true, referralCode: newReferralCode };
  },
});

// Generate referral code for existing user who doesn't have one yet
export const generateReferralCode = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Check if already has a referral code
    if (user.referralCode) {
      return { success: false, message: "Referral code already exists", referralCode: user.referralCode };
    }

    // Generate unique referral code
    let newReferralCode = createRandomReferralCode();
    let existing = await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", newReferralCode))
      .first();
    
    while (existing) {
      newReferralCode = createRandomReferralCode();
      existing = await ctx.db
        .query("users")
        .withIndex("by_referral_code", (q) => q.eq("referralCode", newReferralCode))
        .first();
    }

    // Update user with new referral code and initialize as agent if not already
    await ctx.db.patch(userId, {
      role: user.role || "agent",
      referralCode: newReferralCode,
      agentTier: user.agentTier || "bronze",
      totalSales: user.totalSales || 0,
      totalCommission: user.totalCommission || 0,
      pendingPayout: user.pendingPayout || 0,
    });

    // Create network entry if doesn't exist
    const existingNetwork = await ctx.db
      .query("agentNetwork")
      .withIndex("by_agent", (q) => q.eq("agentId", userId))
      .first();

    if (!existingNetwork) {
      await ctx.db.insert("agentNetwork", {
        agentId: userId,
        parentAgentId: user.referredBy,
        level: 0,
        totalDownline: 0,
        directReferrals: 0,
      });
    }

    return { success: true, referralCode: newReferralCode };
  },
});

// Get agent dashboard data
export const getDashboardData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "agent") return null;

    // Get network stats
    const network = await ctx.db
      .query("agentNetwork")
      .withIndex("by_agent", (q) => q.eq("agentId", userId))
      .first();

    // Get direct referrals
    const directReferrals = await ctx.db
      .query("users")
      .withIndex("by_referrer", (q) => q.eq("referredBy", userId))
      .collect();

    // Get commission history
    const commissions = await ctx.db
      .query("commissions")
      .withIndex("by_agent", (q) => q.eq("agentId", userId))
      .order("desc")
      .take(10);

    // Get recent orders
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);

    return {
      agent: {
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        tier: user.agentTier,
        totalSales: user.totalSales || 0,
        totalCommission: user.totalCommission || 0,
        pendingPayout: user.pendingPayout || 0,
      },
      network: {
        directReferrals: network?.directReferrals || 0,
        totalDownline: network?.totalDownline || 0,
        level: network?.level || 0,
      },
      referrals: directReferrals.map((r) => ({
        id: r._id,
        name: r.name || "Agent",
        tier: r.agentTier || "bronze",
        totalSales: r.totalSales || 0,
        joinedAt: r._creationTime,
      })),
      recentCommissions: commissions,
      recentOrders: orders,
    };
  },
});

// Get network tree for visualization
export const getNetworkTree = query({
  args: { depth: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const maxDepth = args.depth || 3;

    async function buildTree(agentId: string, currentDepth: number): Promise<any> {
      if (currentDepth > maxDepth) return null;

      const agent = await ctx.db.get(agentId as any);
      if (!agent || !("email" in agent)) return null;

      const children = await ctx.db
        .query("users")
        .withIndex("by_referrer", (q) => q.eq("referredBy", agentId as any))
        .collect();

      const childNodes = await Promise.all(
        children.map((child) => buildTree(child._id, currentDepth + 1))
      );

      return {
        id: agent._id,
        name: agent.name || "Agent",
        tier: agent.agentTier || "bronze",
        totalSales: agent.totalSales || 0,
        children: childNodes.filter(Boolean),
      };
    }

    return await buildTree(userId, 0);
  },
});

// Seed test network data for visualization
export const seedTestNetwork = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Ensure current user has agent setup
    if (!user.referralCode) {
      const code = createRandomReferralCode();
      await ctx.db.patch(userId, {
        role: "agent",
        referralCode: code,
        agentTier: "platinum",
        totalSales: 15000,
        totalCommission: 3750,
        pendingPayout: 500,
      });

      // Create network entry for root
      await ctx.db.insert("agentNetwork", {
        agentId: userId,
        parentAgentId: undefined,
        level: 0,
        totalDownline: 0,
        directReferrals: 0,
      });
    }

    // Create test sub-agents (Level 1)
    const level1Agents = [
      { name: "John Smith", tier: "gold" as const, sales: 8500 },
      { name: "Sarah Lee", tier: "silver" as const, sales: 4200 },
      { name: "Mike Johnson", tier: "gold" as const, sales: 7800 },
    ];

    for (const agentData of level1Agents) {
      // Check if already exists
      const existing = await ctx.db
        .query("users")
        .filter((q) => q.and(
          q.eq(q.field("name"), agentData.name),
          q.eq(q.field("referredBy"), userId)
        ))
        .first();

      if (!existing) {
        const code = createRandomReferralCode();
        const agentId = await ctx.db.insert("users", {
          name: agentData.name,
          email: `${agentData.name.toLowerCase().replace(" ", ".")}@test.com`,
          role: "agent",
          referralCode: code,
          referredBy: userId,
          agentTier: agentData.tier,
          totalSales: agentData.sales,
          totalCommission: agentData.sales * getCommissionRate(agentData.tier),
          pendingPayout: 0,
        });

        await ctx.db.insert("agentNetwork", {
          agentId,
          parentAgentId: userId,
          level: 1,
          totalDownline: 0,
          directReferrals: 0,
        });

        // Create Level 2 sub-agents for first two Level 1 agents
        if (agentData.name === "John Smith" || agentData.name === "Sarah Lee") {
          const level2Count = agentData.name === "John Smith" ? 3 : 2;
          const level2Names = agentData.name === "John Smith" 
            ? ["Emily Davis", "Robert Brown", "Lisa Wilson"]
            : ["Tom Anderson", "Jessica White"];

          for (let i = 0; i < level2Count; i++) {
            const l2Code = createRandomReferralCode();
            const l2Sales = 1000 + Math.floor(Math.random() * 2000);
            const l2Tier = l2Sales > 1500 ? "silver" : "bronze";
            
            const l2AgentId = await ctx.db.insert("users", {
              name: level2Names[i],
              email: `${level2Names[i].toLowerCase().replace(" ", ".")}@test.com`,
              role: "agent",
              referralCode: l2Code,
              referredBy: agentId,
              agentTier: l2Tier as "bronze" | "silver",
              totalSales: l2Sales,
              totalCommission: l2Sales * getCommissionRate(l2Tier as "bronze" | "silver"),
              pendingPayout: 0,
            });

            await ctx.db.insert("agentNetwork", {
              agentId: l2AgentId,
              parentAgentId: agentId,
              level: 2,
              totalDownline: 0,
              directReferrals: 0,
            });
          }
        }
      }
    }

    return { success: true, message: "Test network data seeded" };
  },
});