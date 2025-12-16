import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// Agent tier system for commission structure
export const AGENT_TIERS = {
  MEMBER: "member",
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
  PLATINUM: "platinum",
  DIAMOND: "diamond",
  DOUBLE_DIAMOND: "double_diamond",
  TRIPLE_DIAMOND: "triple_diamond",
} as const;

export const agentTierValidator = v.union(
  v.literal(AGENT_TIERS.MEMBER),
  v.literal(AGENT_TIERS.BRONZE),
  v.literal(AGENT_TIERS.SILVER),
  v.literal(AGENT_TIERS.GOLD),
  v.literal(AGENT_TIERS.PLATINUM),
  v.literal(AGENT_TIERS.DIAMOND),
  v.literal(AGENT_TIERS.DOUBLE_DIAMOND),
  v.literal(AGENT_TIERS.TRIPLE_DIAMOND),
);
export type AgentTier = Infer<typeof agentTierValidator>;

// default user roles
export const ROLES = {
  ADMIN: "admin",
  SUB_ADMIN: "sub_admin",
  AGENT: "agent",
  USER: "user",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.SUB_ADMIN),
  v.literal(ROLES.AGENT),
  v.literal(ROLES.USER),
);
export type Role = Infer<typeof roleValidator>;

// Admin Permissions Validator
export const permissionsValidator = v.object({
  users: v.array(v.string()), // "view", "edit", "delete", "ban"
  products: v.array(v.string()), // "view", "edit", "create", "delete"
  financials: v.array(v.string()), // "view", "approve", "reject"
  cms: v.array(v.string()), // "view", "edit", "publish"
});

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
      
      // Admin Permissions (for sub_admins)
      permissions: v.optional(permissionsValidator),

      // Agent-specific fields
      referralCode: v.optional(v.string()), // Unique referral code for this agent
      referredBy: v.optional(v.id("users")), // ID of the agent who referred this user
      agentTier: v.optional(agentTierValidator), // Current tier level
      totalSales: v.optional(v.number()), // Total sales volume in USD
      totalCommission: v.optional(v.number()), // Total commission earned
      pendingPayout: v.optional(v.number()), // Pending commission payout
      
      billingAddress: v.optional(v.object({
        name: v.string(),
        address: v.string(),
        city: v.string(),
        country: v.string(),
        postalCode: v.string(),
      })),
      isBanned: v.optional(v.boolean()),
    })
      .index("email", ["email"]) // index for the email. do not remove or modify
      .index("by_referral_code", ["referralCode"])
      .index("by_referrer", ["referredBy"])
      .index("by_role", ["role"]),

    products: defineTable({
      name: v.string(),
      description: v.string(),
      priceEth: v.number(),
      priceUsd: v.number(),
      weight: v.string(),
      tier: v.string(),
      image: v.string(),
      features: v.array(v.string()),
      stock: v.optional(v.number()),
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
      status: v.string(), // "pending", "paid", "rejected"
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

    // Password reset tokens
    passwordResetTokens: defineTable({
      userId: v.id("users"),
      token: v.string(),
      expiresAt: v.number(),
      used: v.boolean(),
    })
      .index("by_user", ["userId"])
      .index("by_token", ["token"]),

    courses: defineTable({
      title: v.string(),
      description: v.string(),
      content: v.string(),
      category: v.string(),
      image: v.string(),
    }),

    // Support System
    supportTickets: defineTable({
      userId: v.optional(v.id("users")),
      sessionId: v.optional(v.string()), // For anonymous users
      status: v.string(), // "open", "closed", "resolved"
      priority: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_session", ["sessionId"])
      .index("by_status", ["status"]),

    supportMessages: defineTable({
      ticketId: v.id("supportTickets"),
      sender: v.string(), // "user", "support", "system"
      content: v.string(),
      read: v.boolean(),
      createdAt: v.number(),
    }).index("by_ticket", ["ticketId"]),

    // CMS Content
    cmsContent: defineTable({
      section: v.string(), // "hero", "about", "loading", "navigation"
      content: v.any(), // Flexible JSON content
      updatedBy: v.optional(v.id("users")),
      updatedAt: v.number(),
    }).index("by_section", ["section"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;