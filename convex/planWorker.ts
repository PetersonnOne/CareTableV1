"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { buildPlan } from "./services/planner";
export const run = internalAction({
  args: { id: v.id("mealPlans") },
  returns: v.null(),
  handler: async (ctx, args): Promise<null> => {
    const job = await ctx.runMutation(internal.plansStore.claim, args);
    if (!job) return null;
    try {
      const result = await buildPlan(job.requestPayload, {
        feedback: job.feedback,
        parent: job.parentResult,
        onPhase: async (phase) => {
          await ctx.runMutation(internal.plansStore.phase, {
            id: args.id,
            phase,
          });
        },
      });
      await ctx.runMutation(internal.plansStore.finish, {
        id: args.id,
        result,
      });
    } catch (error) {
      const e = error as { status?: number; message?: string; name?: string };
      const message = e.message || "";
      const code = message.startsWith("QLOO_")
        ? message
        : e.status === 401
          ? "OPENAI_AUTH"
          : e.status === 429
            ? "OPENAI_QUOTA"
            : e.status === 404
              ? "OPENAI_MODEL"
              : e.name === "TimeoutError" || e.name === "AbortError"
                ? "TIMEOUT"
                : [
                      "OPENAI_NOT_CONFIGURED",
                      "REVISION_NO_MATCH",
                      "REVISION_NO_EASIER_MATCH",
                    ].includes(message)
                  ? message
                  : "PLANNING_ERROR";
      await ctx.runMutation(internal.plansStore.fail, { id: args.id, code });
    }
    return null;
  },
});
