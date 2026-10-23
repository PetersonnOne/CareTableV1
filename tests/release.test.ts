import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";
import { requestSchema } from "../src/modules/meals/domain/schema.mjs";
import { previewPlan } from "../src/modules/meals/domain/planning";
const modules = import.meta.glob("../convex/**/*.ts");
const member = { id: "one", name: "Fictional person", favorites: ["Italian"], dislikes: [], exclusions: ["peanuts"], texture: "any" };
const input = { mode: "individual", members: [member], region: "", currency: "USD", units: "metric", days: 3, slots: ["dinner"], maxMinutes: 45, equipment: ["hob"], budget: null, confirmed: true };
async function setup() {
  const t = convexTest(schema, modules);
  const userId = await t.run(ctx => ctx.db.insert("users", { name: "Release QA" }));
  return { t, a: t.withIdentity({ subject: userId }) };
}
describe("release acceptance boundaries", () => {
  it("supports each household size and duration without failing an exclusion or losing recipients", () => {
    for (const [mode, size] of [["individual", 1], ["partner", 2], ["family", 8]] as const) {
      for (const days of [3, 7, 14]) {
        const request = requestSchema.parse({ ...input, mode, days, units: "imperial", slots: ["breakfast", "lunch", "dinner"], members: Array.from({ length: size }, (_, i) => ({ ...member, id: `person-${i}`, exclusions: i % 2 ? ["dairy", "fish"] : ["peanuts", "egg"] })) });
        const plan = previewPlan(request);
        expect(plan.meals).toHaveLength(days * 3);
        for (const meal of plan.meals) {
          expect(meal.recipe).not.toBeNull();
          expect(meal.checks.results.some(c => c.status === "fail")).toBe(false);
          expect(meal.recipientIds).toEqual(request.members.map(m => m.id));
          expect(meal.alternatives.every(a => a.checks.status !== "fail")).toBe(true);
        }
      }
    }
  });
  it("explains every unfilled slot when no equipment can support the recipe catalog", () => {
    const plan = previewPlan(requestSchema.parse({ ...input, equipment: [], days: 14, slots: ["breakfast", "lunch", "dinner"] }));
    expect(plan.status).toBe("partial");
    expect(plan.meals).toHaveLength(42);
    expect(plan.meals.every(m => !m.recipe && m.reason)).toBe(true);
  });
  it("keeps broad ingredient restrictions explicitly unverified", () => {
    const plan = previewPlan(requestSchema.parse({ ...input, members: [{ ...member, exclusions: ["all allergens"] }] }));
    expect(plan.status).toBe("unresolved");
    expect(plan.meals.every(m => m.checks.results.some(c => c.rule === "Avoid all allergens" && c.status === "unknown"))).toBe(true);
  });
  it("uses Midnight by default and saves all four themes without changing other accounts", async () => {
    const { t, a } = await setup();
    expect((await t.query(api.appearance.site)).theme).toBe("midnight");
    for (const theme of ["garden", "midnight", "dark", "white"] as const) {
      await a.mutation(api.appearance.setMine, { theme });
      expect(await a.query(api.appearance.mine)).toBe(theme);
      expect((await t.query(api.appearance.site)).theme).toBe("midnight");
    }
  });
  it("expires overdue jobs and rejects a late successful worker result", async () => {
    const { t, a } = await setup();
    const id = await a.mutation(api.plans.start, { request: input, requestId: "release-timeout-123" });
    await t.mutation(internal.plansStore.claim, { id });
    await t.run(ctx => ctx.db.patch(id, { leaseUntil: Date.now() - 1 }));
    await t.mutation(internal.plansStore.expire, { id });
    await t.mutation(internal.plansStore.finish, { id, result: previewPlan(requestSchema.parse(input)) });
    const plan = await a.query(api.plans.get, { id });
    expect(plan.status).toBe("failed");
    expect(plan.errorCode).toBe("TIMEOUT");
    expect(plan.result).toBeUndefined();
    expect(plan.requestPayload.members[0].exclusions).toEqual(["peanuts"]);
  });
  it("refuses to start paid provider work for an already expired queued job", async () => {
    const { t, a } = await setup();
    const id = await a.mutation(api.plans.start, { request: input, requestId: "release-expired-queue" });
    await t.run(ctx => ctx.db.patch(id, { leaseUntil: Date.now() - 1 }));
    expect(await t.mutation(internal.plansStore.claim, { id })).toBeNull();
    expect((await a.query(api.plans.get, { id })).errorCode).toBe("TIMEOUT");
  });
  it("restores a revision snapshot through a fresh query even after its parent is deleted", async () => {
    const { t, a } = await setup();
    const id = await a.mutation(api.plans.start, { request: input, requestId: "release-parent-123" });
    await t.mutation(internal.plansStore.claim, { id });
    const result = previewPlan(requestSchema.parse(input));
    await t.mutation(internal.plansStore.finish, { id, result });
    const revision = await a.mutation(api.plans.start, { request: {}, requestId: "release-revision-123", parentId: id, feedback: { day: 1, slot: "dinner", reason: "other", text: "Keep the rice" } });
    await a.mutation(api.plans.remove, { id });
    expect((await a.query(api.plans.get, { id: revision })).parentSnapshot).toEqual(result);
    await t.mutation(internal.plansStore.fail, { id: revision, code: "TIMEOUT" });
    expect((await a.query(api.plans.get, { id: revision })).parentSnapshot).toEqual(result);
  });
  it("closes a late provider attachment after the user stops during connection", async () => {
    const { t, a } = await setup();
    const id = await a.mutation(internal.voice.reserve, { requestId: "release-voice-123", mode: "interactive", context: "fictional context" });
    await a.mutation(api.voice.stop, { id });
    expect(await t.mutation(internal.voice.attach, { id, providerId: "late-session" })).toBe(false);
    expect((await a.query(api.voice.state, { id }))?.status).toBe("closing");
  });
  it("returns a safe empty subscription after deletion without disclosing another account's plan", async () => {
    const { t, a } = await setup();
    const otherId = await t.run(ctx => ctx.db.insert("users", { name: "Other" }));
    const other = t.withIdentity({ subject: otherId });
    const id = await a.mutation(api.plans.start, { request: input, requestId: "release-subscription" });
    expect(await other.query(api.plans.find, { id })).toBeNull();
    await t.mutation(internal.plansStore.fail, { id, code: "TIMEOUT" });
    await a.mutation(api.plans.remove, { id });
    expect(await a.query(api.plans.find, { id })).toBeNull();
  });
});
