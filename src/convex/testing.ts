"use node";
import { action } from "./_generated/server";
// import { api } from "./_generated/api"; // Removing api import to avoid type issues
import { v } from "convex/values";

export const testSupportChat = action({
  args: {},
  handler: async (ctx) => {
    console.log("Starting support chat test...");

    // 1. Create a ticket
    const sessionId = "test-session-" + Date.now();
    // Use string reference cast to any to avoid TS2589
    const ticketId = await ctx.runMutation("support:createTicket" as any, {
      sessionId,
      subject: "Test Ticket",
    });
    console.log("Created ticket:", ticketId);

    // 2. Send a message
    await ctx.runMutation("support:sendMessage" as any, {
      ticketId,
      content: "Hello, this is a test message",
      sender: "user",
    });
    console.log("Sent message");

    // 3. Get messages
    const messages: any = await ctx.runQuery("support:getMessages" as any, {
      ticketId,
    });
    console.log("Retrieved messages:", messages.length);

    // Expecting 2 messages: 1 system welcome message + 1 user message
    if (messages.length < 2) {
        throw new Error(`Expected at least 2 messages (system welcome + user message), found ${messages.length}`);
    }

    const userMsg = messages.find((m: any) => m.content === "Hello, this is a test message");
    if (!userMsg) {
        throw new Error("User message not found");
    }
    
    const systemMsg = messages.find((m: any) => m.sender === "system");
    if (!systemMsg) {
        throw new Error("System welcome message not found");
    }

    console.log("Test passed successfully!");
    return "Success";
  },
});