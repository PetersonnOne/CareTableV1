import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { can, canDelegate } from "../src/modules/identity/permissions";
import { recipes } from "../src/modules/meals/domain/catalog.mjs";
import { checkRecipe } from "../src/modules/meals/domain/checks.mjs";
const modules = import.meta.glob("../convex/**/*.ts");
async function setup() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async (ctx) => {
    const owner = await ctx.db.insert("users", {
      name: "Owner",
      email: "owner@example.test",
    });
    const a = await ctx.db.insert("users", {
      name: "Member A",
      email: "a@example.test",
    });
    const b = await ctx.db.insert("users", {
      name: "Member B",
      email: "b@example.test",
    });
    return { owner, a, b };
  });
  await t.mutation(internal.administration.bootstrapOwner, {
    userId: ids.owner,
  });
  return {
    t,
    ids,
    owner: t.withIdentity({ subject: ids.owner }),
    a: t.withIdentity({ subject: ids.a }),
    b: t.withIdentity({ subject: ids.b }),
  };
}
const household = {
  label: "Test table",
  mode: "individual" as const,
  members: [
    {
      id: "one",
      name: "Person",
      favorites: ["rice"],
      exclusions: ["peanuts"],
      texture: "any" as const,
    },
  ],
  region: "",
  currency: "USD",
  units: "metric" as const,
};
describe("server authorization and persistence", () => {
  it("denies guests and ordinary members access to private admin data", async () => {
    const { t, a } = await setup();
    await expect(
      t.query(api.administration.members, {
        paginationOpts: { cursor: null, numItems: 10 },
      }),
    ).rejects.toThrow();
    await expect(
      a.query(api.administration.audits, {
        paginationOpts: { cursor: null, numItems: 10 },
      }),
    ).rejects.toThrow();
  });
  it("prevents cross-account profile reads and edits", async () => {
    const { a, b } = await setup();
    const id = await a.mutation(api.households.save, household);
    expect(await b.query(api.households.list)).toEqual([]);
    await expect(
      b.mutation(api.households.save, { ...household, id }),
    ).rejects.toThrow("NOT_FOUND");
    await expect(b.mutation(api.households.remove, { id })).rejects.toThrow(
      "NOT_FOUND",
    );
    expect(await a.query(api.households.list)).toHaveLength(1);
  });
  it("atomically writes household events without storing sensitive profile content", async () => {
    const { a, owner } = await setup();
    await a.mutation(api.households.save, household);
    const audit = await owner.query(api.administration.audits, {
      paginationOpts: { cursor: null, numItems: 10 },
    });
    expect(audit.page.some((e) => e.action === "household.created")).toBe(true);
    expect(JSON.stringify(audit)).not.toContain("peanuts");
  });
  it("limits normal admins to the permissions they hold", async () => {
    const { owner, a, ids } = await setup();
    await owner.mutation(api.administration.setAdmin, {
      userId: ids.a,
      permissions: ["members.manage"],
      enabled: true,
    });
    await expect(
      a.mutation(api.administration.setAdmin, {
        userId: ids.b,
        permissions: ["audit.read"],
        enabled: true,
      }),
    ).rejects.toThrow("CANNOT_DELEGATE_PERMISSION");
    await owner.mutation(api.administration.setAdmin, {
      userId: ids.b,
      permissions: ["audit.read"],
      enabled: true,
    });
    await expect(
      a.mutation(api.administration.setAdmin, {
        userId: ids.b,
        permissions: [],
        enabled: false,
      }),
    ).rejects.toThrow("CANNOT_MANAGE_HIGHER_SCOPE");
  });
  it("does not let normal admins change the site default or owner account", async () => {
    const { owner, a, ids } = await setup();
    await owner.mutation(api.administration.setAdmin, {
      userId: ids.a,
      permissions: ["members.manage", "themes.manage"],
      enabled: true,
    });
    await expect(
      a.mutation(api.appearance.setSite, { theme: "midnight" }),
    ).rejects.toThrow("FORBIDDEN");
    await expect(
      a.mutation(api.administration.setAdmin, {
        userId: ids.owner,
        permissions: [],
        enabled: false,
      }),
    ).rejects.toThrow("PROTECTED_ROLE");
  });
  it("persists a personal override separately from the reactive site default", async () => {
    const { owner, a, b } = await setup();
    await a.mutation(api.appearance.setMine, { theme: "garden" });
    await owner.mutation(api.appearance.setSite, { theme: "midnight" });
    expect(await b.query(api.appearance.site)).toEqual({
      theme: "midnight",
      version: 1,
    });
    expect(await a.query(api.appearance.mine)).toBe("garden");
    expect(await b.query(api.appearance.mine)).toBe("site");
    await a.mutation(api.appearance.setMine, { theme: "site" });
    expect(await a.query(api.appearance.mine)).toBe("site");
  });
  it("treats identical theme requests as a no-op and prevents second bootstrap", async () => {
    const { t, owner, ids } = await setup();
    await owner.mutation(api.appearance.setSite, { theme: "midnight" });
    await owner.mutation(api.appearance.setSite, { theme: "midnight" });
    expect((await owner.query(api.appearance.site)).version).toBe(1);
    await expect(
      t.mutation(internal.administration.bootstrapOwner, { userId: ids.b }),
    ).rejects.toThrow("OWNER_ALREADY_BOOTSTRAPPED");
  });
  it("enforces profile counts even when bypassing the interface", async () => {
    const { a } = await setup();
    await expect(
      a.mutation(api.households.save, { ...household, mode: "partner" }),
    ).rejects.toThrow("INVALID_HOUSEHOLD");
  });
});
describe("permission policies and recipe guardrails", () => {
  it("denies unknown and undelegated permission paths", () => {
    expect(can("member", [], "audit.read")).toBe(false);
    expect(canDelegate("admin", ["members.manage"], ["audit.read"])).toBe(
      false,
    );
    expect(canDelegate("superadmin", [], ["made.up"])).toBe(false);
  });
  it("fails a matching exclusion for any intended eater", () => {
    const recipe = recipes.find((r) => r.id === "tomato-pasta")!;
    const req = {
      members: [
        { id: "a", exclusions: [], texture: "any" },
        { id: "b", exclusions: ["wheat"], texture: "any" },
      ],
      maxMinutes: 45,
      equipment: ["hob"],
      budget: null,
    };
    expect(checkRecipe(recipe, req).status).toBe("fail");
  });
  it("keeps unsupported broad restrictions unverified", () => {
    const recipe = recipes[0];
    const req = {
      members: [{ id: "a", exclusions: ["legumes"], texture: "any" }],
      maxMinutes: 45,
      equipment: ["hob"],
      budget: null,
    };
    expect(checkRecipe(recipe, req).status).toBe("unknown");
  });
});
