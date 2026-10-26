import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";
import { requestSchema } from "../src/modules/meals/domain/schema.mjs";
import {
  assemble,
  candidates,
  previewPlan,
} from "../src/modules/meals/domain/planning";
const modules = import.meta.glob("../convex/**/*.ts");
const input = {
  mode: "individual",
  members: [
    {
      id: "one",
      name: "Fictional person",
      favorites: ["Italian"],
      exclusions: ["peanuts"],
      texture: "any",
    },
  ],
  region: "",
  currency: "USD",
  units: "metric",
  days: 3,
  slots: ["dinner"],
  maxMinutes: 45,
  equipment: ["hob"],
  budget: null,
  confirmed: true,
};
describe("planning guarantees", () => {
  it("fills requested 3/7/14-day slots in a local preview with checked alternatives", () => {
    for (const days of [3, 7, 14]) {
      const request = requestSchema.parse({
        ...input,
        days,
        slots: ["breakfast", "lunch", "dinner"],
      });
      const result = previewPlan(request);
      expect(result.meals).toHaveLength(days * 3);
      expect(
        result.meals.every((m) => m.recipe && m.checks.status !== "fail"),
      ).toBe(true);
      expect(result.meals.every((m) => m.alternatives.length > 0)).toBe(true);
      expect(result.taste).toBe(null);
      expect(result.mode).toBe("preview");
    }
  });
  it("cultural evidence changes the same candidate ranking", () => {
    const request = requestSchema.parse({
      ...input,
      members: [{ ...input.members[0], favorites: [] }],
    });
    const plain = candidates(request, "dinner", []);
    const grounded = candidates(request, "dinner", [
      {
        id: "urn:tag:genre:place:restaurant:mediterranean_italian",
        name: "Mediterranean Italian",
        affinity: 0.95,
      },
    ]);
    expect(plain.map(c=>c.recipe.id)).not.toEqual(grounded.map(c=>c.recipe.id));
    expect(grounded[0].tasteLinks.length).toBeGreaterThan(0);
    expect(grounded[0].tasteLinks[0].id).toContain("mediterranean_italian");
  });
  it("never lets a fabricated recipe ID pass into a final plan", () => {
    const request = requestSchema.parse(input);
    const meals = assemble(request, null, [
      { day: 1, slot: "dinner", recipeId: "invented-by-model" },
    ]);
    expect(meals[0].recipe).toBeNull();
  });
  it("does not treat missing prices or physical texture as passing", () => {
    const request = requestSchema.parse({
      ...input,
      budget: 100,
      members: [{ ...input.members[0], texture: "soft" }],
    });
    const result = previewPlan(request);
    expect(result.status).toBe("unresolved");
    expect(
      result.meals[0].checks.results.find((r) => r.rule === "Budget")?.status,
    ).toBe("unknown");
  });
  it("makes independently checked member portions when no shared meal exists", () => {
    const request = requestSchema.parse({
      ...input,
      mode: "partner",
      members: [
        {
          ...input.members[0],
          exclusions: [
            "rice",
            "potato",
            "sweet potato",
            "tomato",
            "lentils",
            "pumpkin",
            "coconut",
            "chickpeas",
            "beans",
          ],
        },
        {
          ...input.members[0],
          id: "two",
          name: "Person two",
          exclusions: ["fish", "egg", "pasta"],
        },
      ],
      slots: ["dinner"],
    });
    const meals = assemble(request, null, []);
    expect(meals.every((m) => m.recipientIds.length === 1)).toBe(true);
    expect(meals.some((m) => m.recipientIds.includes("two"))).toBe(true);
    expect(
      meals.filter((m) => m.recipe).every((m) => m.checks.status !== "fail"),
    ).toBe(true);
  });
});
describe("saved jobs, boundaries, and recovery", () => {
  async function setup() {
    const t = convexTest(schema, modules);
    const [a, b] = await t.run(async (ctx) => [
      await ctx.db.insert("users", { name: "A" }),
      await ctx.db.insert("users", { name: "B" }),
    ]);
    return {
      t,
      a: t.withIdentity({ subject: a }),
      b: t.withIdentity({ subject: b }),
    };
  }
  it("requires identity and is idempotent for the same request ID", async () => {
    const { t, a, b } = await setup();
    await expect(
      t.mutation(api.plans.start, {
        request: input,
        requestId: "test-request-123",
      }),
    ).rejects.toThrow();
    const id = await a.mutation(api.plans.start, {
      request: input,
      requestId: "test-request-123",
    });
    expect(
      await a.mutation(api.plans.start, {
        request: input,
        requestId: "test-request-123",
      }),
    ).toBe(id);
    await expect(b.query(api.plans.get, { id })).rejects.toThrow(
      "PLAN_NOT_FOUND",
    );
    await expect(b.mutation(api.plans.remove, { id })).rejects.toThrow(
      "PLAN_NOT_FOUND",
    );
  });
  it("rejects concurrent jobs and records failure without losing the profile", async () => {
    const { t, a } = await setup();
    const id = await a.mutation(api.plans.start, {
      request: input,
      requestId: "test-request-001",
    });
    await expect(
      a.mutation(api.plans.start, {
        request: input,
        requestId: "test-request-002",
      }),
    ).rejects.toThrow("PLAN_ALREADY_RUNNING");
    await t.mutation(internal.plansStore.fail, { id, code: "QLOO_HTTP_429" });
    expect((await a.query(api.plans.get, { id })).status).toBe("failed");
    expect(
      (await a.query(api.plans.get, { id })).requestPayload.members[0]
        .exclusions,
    ).toEqual(["peanuts"]);
  });
  it("derives revision constraints from the saved plan, not the client", async () => {
    const { t, a } = await setup();
    const id = await a.mutation(api.plans.start, {
      request: input,
      requestId: "test-request-003",
    });
    await t.mutation(internal.plansStore.claim, { id });
    const request = requestSchema.parse(input);
    await t.mutation(internal.plansStore.finish, {
      id,
      result: previewPlan(request),
    });
    const revision = await a.mutation(api.plans.start, {
      request: { ...input, members: [] },
      requestId: "test-request-004",
      parentId: id,
      feedback: { day: 1, slot: "dinner", reason: "not familiar", text: "" },
    });
    expect(
      (await a.query(api.plans.get, { id: revision })).requestPayload.members[0]
        .exclusions,
    ).toEqual(["peanuts"]);
    await a.mutation(api.plans.remove, { id });
    const claimed = await t.mutation(internal.plansStore.claim, {
      id: revision,
    });
    expect(claimed?.parentResult.meals).toHaveLength(3);
  });
  it("retains planning usage limits after plan deletion", async () => {
    const { t, a } = await setup();
    for (let i = 0; i < 6; i++) {
      const id = await a.mutation(api.plans.start, {
        request: input,
        requestId: `deleted-request-${i}`,
      });
      await t.mutation(internal.plansStore.fail, { id, code: "TIMEOUT" });
      await a.mutation(api.plans.remove, { id });
    }
    await expect(
      a.mutation(api.plans.start, {
        request: input,
        requestId: "deleted-request-7",
      }),
    ).rejects.toThrow("PLAN_RATE_LIMIT");
  });
});
