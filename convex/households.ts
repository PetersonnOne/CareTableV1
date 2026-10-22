import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./model/access";
import { recordAudit } from "./model/audit";
const member = v.object({
  id: v.string(),
  name: v.string(),
  favorites: v.array(v.string()),
  exclusions: v.array(v.string()),
  dislikes: v.optional(v.array(v.string())),
  texture: v.union(v.literal("any"), v.literal("soft")),
});
const fields = {
  label: v.string(),
  mode: v.union(
    v.literal("individual"),
    v.literal("partner"),
    v.literal("family"),
  ),
  members: v.array(member),
  region: v.string(),
  currency: v.string(),
  units: v.union(v.literal("metric"), v.literal("imperial")),
};
const document = v.object({
  _id: v.id("households"),
  _creationTime: v.number(),
  ownerId: v.id("users"),
  ...fields,
  revision: v.number(),
});
export const list = query({
  args: {},
  returns: v.array(document),
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return ctx.db
      .query("households")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .take(20);
  },
});
export const save = mutation({
  args: { id: v.optional(v.id("households")), ...fields },
  returns: v.id("households"),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const { id, ...data } = args;
    const n = data.members.length;
    if (
      !data.label.trim() ||
      data.label.length > 80 ||
      data.region.length > 80 ||
      !/^[A-Z]{3}$/.test(data.currency) ||
      n < 1 ||
      n > 8 ||
      (data.mode === "individual" && n !== 1) ||
      (data.mode === "partner" && n !== 2) ||
      (data.mode === "family" && n < 2) ||
      new Set(data.members.map((m) => m.id)).size !== n
    )
      throw new ConvexError("INVALID_HOUSEHOLD");
    for (const m of data.members) {
      if (
        !m.name.trim() ||
        m.name.length > 80 ||
        m.id.length > 60 ||
        m.favorites.length > 12 ||
        m.exclusions.length > 12 ||
        (m.dislikes?.length || 0) > 12 ||
        [...m.favorites, ...m.exclusions, ...(m.dislikes || [])].some(
          (s) => !s.trim() || s.length > 90,
        )
      )
        throw new ConvexError("INVALID_MEMBER");
    }
    let saved;
    if (id) {
      const row = await ctx.db.get(id);
      if (!row || row.ownerId !== user._id) throw new ConvexError("NOT_FOUND");
      await ctx.db.patch(id, { ...data, revision: row.revision + 1 });
      saved = id;
    } else {
      const existing = await ctx.db
        .query("households")
        .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
        .take(20);
      if (existing.length >= 20) throw new ConvexError("HOUSEHOLD_LIMIT");
      saved = await ctx.db.insert("households", {
        ...data,
        ownerId: user._id,
        revision: 1,
      });
    }
    await recordAudit(ctx, {
      actorId: user._id,
      action: id ? "household.updated" : "household.created",
      module: "households",
      outcome: "success",
      target: saved,
      summary: `${data.mode} profile saved with ${n} members. Preferences excluded from audit metadata.`,
    });
    return saved;
  },
});
export const remove = mutation({
  args: { id: v.id("households") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const row = await ctx.db.get(args.id);
    if (!row || row.ownerId !== user._id) throw new ConvexError("NOT_FOUND");
    await ctx.db.delete(row._id);
    await recordAudit(ctx, {
      actorId: user._id,
      action: "household.deleted",
      module: "households",
      outcome: "success",
      target: row._id,
      summary: "Household profile deleted.",
    });
    return null;
  },
});
