import { internalMutation } from "./_generated/server";
import { calculateAgentTier } from "./agents";
import { AgentTier } from "./schema";

export const migrateAgentData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Cap network levels at 7
    const networkNodes = await ctx.db.query("agentNetwork").collect();
    let networkUpdates = 0;
    for (const node of networkNodes) {
      if (node.level > 7) {
        await ctx.db.patch(node._id, { level: 7 });
        networkUpdates++;
      }
    }

    // 2. Recalculate agent tiers
    const agents = await ctx.db.query("users")
      .withIndex("by_role", (q) => q.eq("role", "agent"))
      .collect();

    let tierUpdates = 0;
    for (const agent of agents) {
      const newTier = calculateAgentTier(agent.totalSales || 0);
      if (agent.agentTier !== newTier) {
        await ctx.db.patch(agent._id, { agentTier: newTier });
        tierUpdates++;
      }
    }
    
    return {
      success: true,
      networkUpdates,
      tierUpdates,
      message: `Migration complete. Updated ${networkUpdates} network nodes and ${tierUpdates} agent tiers.`
    };
  },
});
