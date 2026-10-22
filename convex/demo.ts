import { v, ConvexError } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireUser } from "./model/access";
export const reset = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    if (!user.isAnonymous) throw new ConvexError("DEMO_ONLY");
    await ctx.scheduler.runAfter(0, internal.demo.purge, { userId: user._id });
    return null;
  },
});
export const purge = internalMutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user?.isAnonymous) return null;
    const plans = await ctx.db
      .query("mealPlans")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .take(100);
    const profiles = await ctx.db
      .query("households")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .take(20);
    for (const p of plans) await ctx.db.delete(p._id);
    for (const h of profiles) await ctx.db.delete(h._id);
    if (plans.length === 100)
      await ctx.scheduler.runAfter(0, internal.demo.purge, args);
    return null;
  },
});
