import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTicket = mutation({
  args: {
    sessionId: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .first();
      userId = user?._id;
    }

    // Check for existing open ticket
    let existingTicket;
    if (userId) {
      existingTicket = await ctx.db
        .query("supportTickets")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("status"), "open"))
        .first();
    } else if (args.sessionId) {
      existingTicket = await ctx.db
        .query("supportTickets")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .filter((q) => q.eq(q.field("status"), "open"))
        .first();
    }

    if (existingTicket) return existingTicket._id;

    const ticketId = await ctx.db.insert("supportTickets", {
      userId,
      sessionId: args.sessionId,
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add initial system message
    await ctx.db.insert("supportMessages", {
      ticketId,
      sender: "system",
      content: "Welcome to Cyber Saffron Support. How can we help you today?",
      read: false,
      createdAt: Date.now(),
    });

    return ticketId;
  },
});

export const sendMessage = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    content: v.string(),
    sender: v.string(), // "user"
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("supportMessages", {
      ticketId: args.ticketId,
      sender: args.sender,
      content: args.content,
      createdAt: Date.now(),
      read: false,
    });

    await ctx.db.patch(args.ticketId, {
      updatedAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { ticketId: v.optional(v.id("supportTickets")) },
  handler: async (ctx, args) => {
    if (!args.ticketId) return [];
    const ticketId = args.ticketId;
    return await ctx.db
      .query("supportMessages")
      .withIndex("by_ticket", (q) => q.eq("ticketId", ticketId))
      .order("asc")
      .collect();
  },
});

export const getActiveTicket = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .first();
      userId = user?._id;
    }

    if (userId) {
      return await ctx.db
        .query("supportTickets")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("status"), "open"))
        .order("desc") // Get most recent
        .first();
    } else if (args.sessionId) {
      return await ctx.db
        .query("supportTickets")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .filter((q) => q.eq(q.field("status"), "open"))
        .order("desc")
        .first();
    }
    return null;
  },
});

export const resolveTicket = mutation({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.ticketId, {
      status: "resolved",
      updatedAt: Date.now(),
    });
  },
});