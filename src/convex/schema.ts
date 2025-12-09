import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
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
      
      billingAddress: v.optional(v.object({
        name: v.string(),
        address: v.string(),
        city: v.string(),
        country: v.string(),
        postalCode: v.string(),
      })),
    }).index("email", ["email"]), // index for the email. do not remove or modify

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
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;