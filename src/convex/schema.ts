import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// Agent tier system based on network depth (User Level)
// Gold = Level 14 (Highest), Silver = Level 13, Bronze = Levels 5-12, Starter = Levels 0-4
export const AGENT_TIERS = {
  GOLD: "gold",      // Level 14
  SILVER: "silver",  // Level 13
  BRONZE: "bronze",  // Levels 5-12
  STARTER: "starter", // Levels 0-4
} as const;

export const agentTierValidator = v.union(
  v.literal(AGENT_TIERS.GOLD),
  v.literal(AGENT_TIERS.SILVER),
  v.literal(AGENT_TIERS.BRONZE),
  v.literal(AGENT_TIERS.STARTER),
);
export type AgentTier = Infer<typeof agentTierValidator>;

// default user roles
export const ROLES = {
  ADMIN: "admin",
  AGENT: "agent",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.AGENT),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Agent-specific fields
      referralCode: v.optional(v.string()), // Unique referral code for this agent
      referredBy: v.optional(v.id("users")), // ID of the agent who referred this user
      agentTier: v.optional(agentTierValidator), // Current tier level
      totalSales: v.optional(v.number()), // Total sales volume in USD
      totalCommission: v.optional(v.number()), // Total commission earned
      pendingPayout: v.optional(v.number()), // Pending commission payout
      
      // User Level Tracking (Affiliate Network Depth)
      userLevel: v.optional(v.number()), // Max depth of downline (0-14), default 0
      
      billingAddress: v.optional(v.object({
        name: v.string(),
        address: v.string(),
        city: v.string(),
        country: v.string(),
        postalCode: v.string(),
      })),
    })
      .index("email", ["email"]) // index for the email. do not remove or modify
      .index("by_referral_code", ["referralCode"])
      .index("by_referrer", ["referredBy"]),

    products: defineTable({
      name: v.string(),
      description: v.string(),
      priceEth: v.number(),
      priceUsd: v.number(),
      weight: v.string(),
      tier: v.string(),
      image: v.string(),
      features: v.array(v.string()),
    }),

    carts: defineTable({
      userId: v.id("users"),
      items: v.array(v.object({
        productId: v.id("products"),
        quantity: v.number(),
        variant: v.string(), // "1g", "5g", "10g"
      })),
    }).index("by_user", ["userId"]),

    orders: defineTable({
      userId: v.id("users"),
      items: v.array(v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        variant: v.string(),
        priceUsd: v.number(),
        priceEth: v.number(),
      })),
      totalUsd: v.number(),
      totalEth: v.number(),
      status: v.string(), // "pending", "confirmed", "shipped", "delivered"
      shippingAddress: v.optional(v.object({
        name: v.string(),
        address: v.string(),
        city: v.string(),
        country: v.string(),
        postalCode: v.string(),
      })),
      transactionHash: v.optional(v.string()),
      commissionPaid: v.optional(v.boolean()), // Track if commission has been distributed
    }).index("by_user", ["userId"]),

    // Commission tracking for each sale
    commissions: defineTable({
      orderId: v.id("orders"),
      agentId: v.id("users"), // Agent who earned the commission
      amount: v.number(), // Commission amount in USD
      percentage: v.number(), // Commission percentage applied
      tier: agentTierValidator, // Tier at time of commission
      status: v.string(), // "pending", "paid"
      paidAt: v.optional(v.number()),
    })
      .index("by_agent", ["agentId"])
      .index("by_order", ["orderId"])
      .index("by_status", ["status"]),

    // Network relationships for visualization
    agentNetwork: defineTable({
      agentId: v.id("users"),
      parentAgentId: v.optional(v.id("users")), // Direct upline
      level: v.number(), // Depth in the network (0 = top level)
      totalDownline: v.number(), // Total agents in downline
      directReferrals: v.number(), // Direct referrals count
    })
      .index("by_agent", ["agentId"])
      .index("by_parent", ["parentAgentId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;