import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireUser } from "./model/access";
import { recordAudit } from "./model/audit";
import { requestSchema } from "../src/modules/meals/domain/schema.mjs";
const feedbackValidator = v.object({
  day: v.number(),
  slot: v.union(
    v.literal("breakfast"),
    v.literal("lunch"),
    v.literal("dinner"),
  ),
  reason: v.union(
    v.literal("not familiar"),
    v.literal("too difficult"),
    v.literal("try something similar"),
    v.literal("other"),
  ),
  text: v.string(),
});
export const start = mutation({
  args: {
    request: v.any(),
    requestId: v.string(),
    householdId: v.optional(v.id("households")),
    parentId: v.optional(v.id("mealPlans")),
    feedback: v.optional(feedbackValidator),
  },
  returns: v.id("mealPlans"),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (!/^[a-zA-Z0-9-]{10,70}$/.test(args.requestId))
      throw new ConvexError("INVALID_REQUEST_ID");
    const existing = await ctx.db
      .query("mealPlans")
      .withIndex("by_ownerId_and_requestId", (q) =>
        q.eq("ownerId", user._id).eq("requestId", args.requestId),
      )
      .unique();
    if (existing) return existing._id;
    let source = args.request,
      parent = null;
    if (args.parentId) {
      parent = await ctx.db.get(args.parentId);
      if (!parent || parent.ownerId !== user._id || !parent.result)
        throw new ConvexError("PLAN_NOT_FOUND");
      source = parent.requestPayload;
      if (!args.feedback) throw new ConvexError("FEEDBACK_REQUIRED");
    }
    const parsed = requestSchema.safeParse(source);
    if (!parsed.success) throw new ConvexError("INVALID_PLAN_REQUEST");
    if (
      args.feedback &&
      (!args.parentId ||
        !Number.isInteger(args.feedback.day) ||
        args.feedback.day < 1 ||
        args.feedback.day > parsed.data.days ||
        !parsed.data.slots.includes(args.feedback.slot) ||
        args.feedback.text.length > 400)
    )
      throw new ConvexError("INVALID_FEEDBACK");
    let revision = 0;
    if (args.householdId) {
      const h = await ctx.db.get(args.householdId);
      if (!h || h.ownerId !== user._id)
        throw new ConvexError("HOUSEHOLD_NOT_FOUND");
      revision = h.revision;
    }
    const recent = await ctx.db
      .query("mealPlans")
      .withIndex("by_ownerId", (q) =>
        q.eq("ownerId", user._id).gte("_creationTime", Date.now() - 3600000),
      )
      .take(7);
    const hourlyKey = `plans:${user._id}:${Math.floor(Date.now() / 3600000)}`;
    const hourly = await ctx.db
      .query("usageBuckets")
      .withIndex("by_key", (q) => q.eq("key", hourlyKey))
      .unique();
    if ((hourly?.count || 0) >= 6) throw new ConvexError("PLAN_RATE_LIMIT");
    if (
      recent.some(
        (p) =>
          (p.status === "queued" || p.status === "running") &&
          (p.leaseUntil ?? p._creationTime + 180000) > Date.now(),
      )
    )
      throw new ConvexError("PLAN_ALREADY_RUNNING");
    const key = `plans:${new Date().toISOString().slice(0, 10)}`;
    const bucket = await ctx.db
      .query("usageBuckets")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if ((bucket?.count || 0) >= 200)
      throw new ConvexError("DAILY_SERVICE_LIMIT");
    if (bucket) await ctx.db.patch(bucket._id, { count: bucket.count + 1 });
    else await ctx.db.insert("usageBuckets", { key, count: 1 });
    if (hourly) await ctx.db.patch(hourly._id, { count: hourly.count + 1 });
    else await ctx.db.insert("usageBuckets", { key: hourlyKey, count: 1 });
    const id = await ctx.db.insert("mealPlans", {
      ownerId: user._id,
      ...(args.householdId ? { householdId: args.householdId } : {}),
      householdRevision: revision,
      requestId: args.requestId,
      status: "queued",
      days: parsed.data.days,
      summary: "Preparing your plan.",
      requestPayload: parsed.data,
      phase: "Queued",
      leaseUntil: Date.now() + 180000,
      ...(args.parentId
        ? {
            parentPlanId: args.parentId,
            parentSnapshot: parent!.result,
            feedback: args.feedback,
          }
        : {}),
    });
    await recordAudit(ctx, {
      actorId: user._id,
      action: args.parentId ? "plan.revision.requested" : "plan.requested",
      module: "planning",
      outcome: "success",
      target: id,
      requestId: args.requestId,
      summary: `Requested ${parsed.data.days} days; ${parsed.data.slots.length} meal slots per day. Profile contents excluded.`,
    });
    await ctx.scheduler.runAfter(0, internal.planWorker.run, { id });
    await ctx.scheduler.runAfter(185000, internal.plansStore.expire, { id });
    return id;
  },
});
export const get = query({
  args: { id: v.id("mealPlans") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const plan = await ctx.db.get(args.id);
    if (!plan || plan.ownerId !== user._id)
      throw new ConvexError("PLAN_NOT_FOUND");
    return plan;
  },
});
export const list = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.id("mealPlans"),
      createdAt: v.number(),
      status: v.string(),
      days: v.number(),
      summary: v.string(),
    }),
  ),
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rows = await ctx.db
      .query("mealPlans")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .take(20);
    return rows.map((p) => ({
      id: p._id,
      createdAt: p._creationTime,
      status: p.status,
      days: p.days,
      summary: p.summary,
    }));
  },
});
export const remove = mutation({
  args: { id: v.id("mealPlans") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const row = await ctx.db.get(args.id);
    if (!row || row.ownerId !== user._id)
      throw new ConvexError("PLAN_NOT_FOUND");
    if (row.status === "queued" || row.status === "running")
      throw new ConvexError("PLAN_RUNNING");
    await ctx.db.delete(row._id);
    await recordAudit(ctx, {
      actorId: user._id,
      action: "plan.deleted",
      module: "planning",
      outcome: "success",
      target: row._id,
      summary: "Saved plan deleted.",
    });
    return null;
  },
});
