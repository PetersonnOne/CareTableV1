import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestSchema } from "../src/modules/meals/domain/schema.mjs";
const mocks = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("openai", () => ({
  default: class {
    responses = { create: mocks.create };
  },
}));
vi.mock("../convex/services/taste", () => ({
  discoverTaste: vi.fn(async () => ({
    provider: "Qloo",
    mode: "live",
    seeds: [],
    unresolved: [],
    connections: [],
    fetchedAt: new Date().toISOString(),
    message: "Test fixture",
  })),
}));
import { buildPlan } from "../convex/services/planner";
const request = requestSchema.parse({
  mode: "individual",
  members: [
    {
      id: "one",
      name: "Private name",
      favorites: ["Italian"],
      exclusions: ["peanuts"],
      texture: "any",
    },
  ],
  region: "",
  currency: "USD",
  units: "metric",
  days: 14,
  slots: ["breakfast", "lunch", "dinner"],
  maxMinutes: 45,
  equipment: ["hob"],
  budget: null,
  confirmed: true,
});
const response = (meals: unknown[]) => ({
  output: [
    {
      type: "function_call",
      name: "select_meals",
      arguments: JSON.stringify({ meals, summary: "Test plan." }),
    },
  ],
  usage: { input_tokens: 100, output_tokens: 10 },
});
beforeEach(() => {
  vi.stubEnv("OPENAI_API_KEY", "test-key");
  mocks.create.mockReset();
});
describe("agent boundary", () => {
  it("enforces a quicker alternative for too-difficult feedback even when the model chooses a slower meal", async () => {
    mocks.create.mockResolvedValueOnce(
      response([{ day: 1, slot: "dinner", recipeId: "fish-potato" }]),
    );
    const parent = await buildPlan(request, { onPhase: async () => {} });
    mocks.create.mockResolvedValueOnce(
      response([{ day: 1, slot: "dinner", recipeId: "chicken-rice" }]),
    );
    const plan = await buildPlan(request, {
      parent,
      feedback: { day: 1, slot: "dinner", reason: "too difficult", text: "" },
      onPhase: async () => {},
    });
    const meal = plan.meals.find((m) => m.day === 1 && m.slot === "dinner");
    expect(meal?.recipe?.minutes).toBeLessThan(35);
    expect(meal?.reason).toContain("shorter estimated cooking time");
    expect(plan.request.maxMinutes).toBe(45);
    expect(plan.request.members).toEqual(request.members);
  });
  it("preserves the original when no quicker eligible alternative exists, without another model call", async () => {
    mocks.create.mockResolvedValueOnce(
      response([{ day: 1, slot: "dinner", recipeId: "basil-white-beans" }]),
    );
    const parent = await buildPlan(request, { onPhase: async () => {} });
    await expect(
      buildPlan(request, {
        parent,
        feedback: { day: 1, slot: "dinner", reason: "too difficult", text: "" },
        onPhase: async () => {},
      }),
    ).rejects.toThrow("REVISION_NO_EASIER_MATCH");
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
  it("repairs invalid or missing choices across 42 slots without a second model call or exposing names", async () => {
    mocks.create.mockResolvedValue(
      response([{ day: 1, slot: "dinner", recipeId: "fabricated" }]),
    );
    const plan = await buildPlan(request, { onPhase: async () => {} });
    expect(plan.meals).toHaveLength(42);
    expect(
      plan.meals.every((m) => m.recipe && m.checks.status !== "fail"),
    ).toBe(true);
    expect(plan.meals.every((m) => m.reason?.includes("repaired"))).toBe(true);
    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.create.mock.calls[0][0].input).not.toContain("Private name");
    expect(mocks.create.mock.calls[0][0].store).toBe(false);
  });
  it("keeps other days unchanged and supplies previous recipe context on revision", async () => {
    mocks.create.mockResolvedValue(response([]));
    const parent = await buildPlan(request, { onPhase: async () => {} });
    mocks.create.mockResolvedValue(
      response([{ day: 1, slot: "dinner", recipeId: "fabricated" }]),
    );
    const plan = await buildPlan(request, {
      parent,
      feedback: {
        day: 1,
        slot: "dinner",
        reason: "try something similar",
        text: "",
      },
      onPhase: async () => {},
    });
    expect(
      plan.meals.filter((m) => m.day !== 1 || m.slot !== "dinner"),
    ).toEqual(parent.meals.filter((m) => m.day !== 1 || m.slot !== "dinner"));
    expect(
      plan.meals.find((m) => m.day === 1 && m.slot === "dinner")?.recipe?.id,
    ).not.toBe(
      parent.meals.find((m) => m.day === 1 && m.slot === "dinner")?.recipe?.id,
    );
    expect(
      JSON.parse(mocks.create.mock.calls[1][0].input).previousMeals[0].tags
        .length,
    ).toBeGreaterThan(0);
  });
});
