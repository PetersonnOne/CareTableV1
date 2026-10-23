import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { permission, theme } from "./validators";

export default defineSchema({
  ...authTables,
  staffGrants: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("superadmin"), v.literal("admin")),
    permissions: v.array(permission),
    grantedBy: v.optional(v.id("users")),
  }).index("by_userId", ["userId"]),
  siteSettings: defineTable({
    key: v.literal("appearance"),
    theme,
    version: v.number(),
    updatedBy: v.optional(v.id("users")),
  }).index("by_key", ["key"]),
  userPreferences: defineTable({
    userId: v.id("users"),
    theme: v.union(theme, v.literal("site")),
    locale: v.string(),
  }).index("by_userId", ["userId"]),
  auditEvents: defineTable({
    actorId: v.optional(v.id("users")),
    action: v.string(),
    module: v.string(),
    outcome: v.union(v.literal("success"), v.literal("failure")),
    target: v.optional(v.string()),
    requestId: v.string(),
    summary: v.string(),
  })
    .index("by_module", ["module"])
    .index("by_actorId", ["actorId"]),
  households: defineTable({
    ownerId: v.id("users"),
    label: v.string(),
    mode: v.union(
      v.literal("individual"),
      v.literal("partner"),
      v.literal("family"),
    ),
    members: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        favorites: v.array(v.string()),
        exclusions: v.array(v.string()),
        dislikes: v.optional(v.array(v.string())),
        texture: v.union(v.literal("any"), v.literal("soft")),
      }),
    ),
    region: v.string(),
    currency: v.string(),
    units: v.union(v.literal("metric"), v.literal("imperial")),
    revision: v.number(),
  }).index("by_ownerId", ["ownerId"]),
  mealPlans: defineTable({
    ownerId: v.id("users"),
    householdId: v.optional(v.id("households")),
    householdRevision: v.number(),
    requestId: v.string(),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("complete"),
      v.literal("partial"),
      v.literal("failed"),
    ),
    days: v.union(v.literal(3), v.literal(7), v.literal(14)),
    summary: v.string(),
    result: v.optional(v.any()),
    requestPayload: v.optional(v.any()),
    feedback: v.optional(v.any()),
    parentPlanId: v.optional(v.id("mealPlans")),
    parentSnapshot: v.optional(v.any()),
    phase: v.optional(v.string()),
    errorCode: v.optional(v.string()),
    leaseUntil: v.optional(v.number()),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_ownerId_and_requestId", ["ownerId", "requestId"]),
  usageBuckets: defineTable({ key: v.string(), count: v.number() }).index(
    "by_key",
    ["key"],
  ),
  voiceConnections: defineTable({
    ownerId: v.id("users"), requestId: v.string(),
    mode: v.union(v.literal("interactive"), v.literal("discussion")),
    context: v.string(),
    status: v.union(v.literal("starting"), v.literal("active"), v.literal("closing"), v.literal("uncertain"), v.literal("closed")),
    providerId: v.optional(v.string()), expiresAt: v.number(),
  }).index("by_ownerId", ["ownerId"]).index("by_ownerId_and_requestId", ["ownerId", "requestId"]),
});
