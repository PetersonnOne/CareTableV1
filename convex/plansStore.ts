import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { recordAudit } from "./model/audit";
export const claim = internalMutation({
  args: { id: v.id("mealPlans") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row || row.status !== "queued") return null;
    if ((row.leaseUntil ?? row._creationTime + 180000) <= Date.now()) {
      await ctx.db.patch(row._id, {
        status: "failed", errorCode: "TIMEOUT", phase: "Timed out",
        summary: "The planning deadline was reached before work began. Your profile is preserved.",
      });
      await recordAudit(ctx, { actorId: row.ownerId, action: "plan.expired", module: "planning", outcome: "failure", target: row._id, summary: "Queued job expired before provider calls began." });
      return null;
    }
    await ctx.db.patch(row._id, {
      status: "running",
      phase: "Discovering cultural taste connections",
    });
    const parent = row.parentPlanId ? await ctx.db.get(row.parentPlanId) : null;
    return {
      ...row,
      parentResult: row.parentSnapshot || parent?.result || null,
    };
  },
});
export const phase = internalMutation({
  args: { id: v.id("mealPlans"), phase: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const p = await ctx.db.get(args.id);
    if (p?.status === "running")
      await ctx.db.patch(p._id, { phase: args.phase.slice(0, 100) });
    return null;
  },
});
export const finish = internalMutation({
  args: { id: v.id("mealPlans"), result: v.any() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const p = await ctx.db.get(args.id);
    if (!p || p.status !== "running") return null;
    await ctx.db.patch(p._id, {
      status: args.result.status === "partial" ? "partial" : "complete",
      result: args.result,
      summary: args.result.summary.slice(0, 500),
      phase: "Ready to review",
    });
    await recordAudit(ctx, {
      actorId: p.ownerId,
      action: "plan.completed",
      module: "planning",
      outcome: "success",
      target: p._id,
      requestId: p.requestId,
      summary: `Plan finished: ${args.result.status}. Input/output tokens: ${args.result.usage.input}/${args.result.usage.output}.`,
    });
    return null;
  },
});
export const fail = internalMutation({
  args: { id: v.id("mealPlans"), code: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const p = await ctx.db.get(args.id);
    if (!p || !["running", "queued"].includes(p.status)) return null;
    await ctx.db.patch(p._id, {
      status: "failed",
      errorCode: args.code,
      summary:
        "Planning could not finish. Your previous plan and profile are preserved.",
      phase: "Needs attention",
    });
    await recordAudit(ctx, {
      actorId: p.ownerId,
      action: "plan.failed",
      module: "planning",
      outcome: "failure",
      target: p._id,
      requestId: p.requestId,
      summary: `Planning failed: ${args.code}. No provider payload logged.`,
    });
    return null;
  },
});
export const expire = internalMutation({
  args: { id: v.id("mealPlans") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const p = await ctx.db.get(args.id);
    if (
      p &&
      ["queued", "running"].includes(p.status) &&
      (p.leaseUntil || 0) < Date.now()
    ) {
      await ctx.db.patch(p._id, {
        status: "failed",
        errorCode: "TIMEOUT",
        phase: "Timed out",
        summary:
          "The planning deadline was reached. Your previous plan is preserved.",
      });
      await recordAudit(ctx, {
        actorId: p.ownerId,
        action: "plan.expired",
        module: "planning",
        outcome: "failure",
        target: p._id,
        summary: "Planning deadline exceeded.",
      });
    }
    return null;
  },
});
