import { recipes } from "./catalog.mjs";
import { checkRecipe, normalize } from "./checks.mjs";
import { requestSchema } from "./schema.mjs";
import type { z } from "zod";
import type {
  TasteConnection,
  TasteEvidence,
} from "../../../../convex/services/taste";
export type PlanRequest = z.infer<typeof requestSchema>;
export type Recipe = {
  id: string;
  name: string;
  tags: string[];
  minutes: number;
  texture: string;
  ingredients: { name: string; amount: number; unit: string }[];
  steps: string[];
  slots: string[];
  equipment: string[];
  servings: number;
  source: { type: string; label: string; license: string; verified: boolean };
};
export type Check = {
  rule: string;
  status: "pass" | "fail" | "unknown";
  reason: string;
  memberId: string | null;
};
export type Meal = {
  day: number;
  slot: string;
  recipe: Recipe | null;
  recipientIds: string[];
  checks: { status: string; results: Check[] };
  tasteLinks: TasteConnection[];
  selectionEvidence?: {
    baselineRank: number;
    groundedRank: number;
    candidateCount: number;
    qlooContribution: number;
    mappings: string[];
    fetchedAt: string;
    seedNames: string[];
    seedSignals?: {id:string;name:string}[];
  };
  alternatives: {
    recipe: Recipe;
    checks: { status: string; results: Check[] };
  }[];
  reason?: string;
};
export type PlanResult = {
  request: PlanRequest;
  mode: "live" | "preview";
  model: string | null;
  taste: TasteEvidence | null;
  meals: Meal[];
  status: "checked" | "unresolved" | "partial";
  summary: string;
  usage: { input: number; output: number };
  createdAt: string;
  feedback?: { day: number; slot: string; reason: string }[];
};
export const mappings: Record<string, string[]> = {
  "tomato-pasta": ["italian", "mediterranean italian", "mediterranean"],
  "chickpea-spinach": ["mediterranean", "middle eastern", "vegetarian"],
  "ginger-congee": ["chinese", "asian", "east asian"],
  "carrot-rice": ["chinese", "asian"],
  "lentil-coconut": ["indian", "south indian", "sri lankan"],
  "tomato-rice": ["nigerian", "west african", "rice", "nigerian cuisine", "traditional nigerian", "nigerian inspired"],
  "bean-tomato": ["mexican", "mediterranean", "vegetarian", "local mexican"],
  "lentil-pot": ["vegetarian", "mediterranean"],
  "coconut-rice": ["thai", "southeast asian", "thai local"],
  "basil-white-beans": ["italian", "mediterranean italian", "mediterranean"],
  "ginger-pea-rice": ["chinese", "asian", "east asian"],
  "tomato-lentil-dal": ["indian", "north indian"],
  "coconut-ginger-tofu": ["thai", "southeast asian", "thai local"],
  "cumin-bean-rice": ["mexican", "tex mex", "modern mexican", "local mexican"],
  "tomato-sweet-potato": ["nigerian", "west african", "nigerian cuisine", "traditional nigerian", "nigerian inspired"],
};
// One strongest observed affinity per recipe: synonymous tags do not get extra votes.
export function tasteContribution(links: TasteConnection[]) {
  return 2 * Math.max(0, ...links.map(link => link.affinity ?? 0));
}
export function linksFor(recipe: Recipe, connections: TasteConnection[]) {
  return connections.filter((c) =>
    [...recipe.tags, ...(mappings[recipe.id] || [])].some(
      (t) => normalize(t) === normalize(c.name),
    ),
  );
}
export function candidates(
  request: PlanRequest,
  slot: string,
  connections: TasteConnection[],
  excluded: string[] = [],
) {
  return (recipes as Recipe[])
    .filter((r) => r.slots.includes(slot) && !excluded.includes(r.id))
    .map((recipe) => {
      const checks = checkRecipe(recipe, request);
      const tasteLinks = linksFor(recipe, connections);
      const favorites = request.members
        .flatMap((m) => m.favorites)
        .map(normalize);
      // The no-Qloo control gets the same known cuisine mappings, not a weaker catalog.
      const direct = [...new Set([...recipe.tags, ...(mappings[recipe.id] || [])].map(normalize))].filter((t) =>
        favorites.includes(normalize(t)),
      ).length;
      return {
        recipe,
        checks,
        tasteLinks,
        score:
          direct +
          tasteContribution(tasteLinks) -
          request.members
            .flatMap((m) => m.dislikes || [])
            .filter(
              (d) =>
                recipe.tags.some((t) => normalize(t) === normalize(d)) ||
                normalize(recipe.name).includes(normalize(d)),
            ).length *
            3,
      };
    })
    .filter((c) => c.checks.status !== "fail")
    .sort((a, b) => b.score - a.score || a.recipe.minutes - b.recipe.minutes);
}
function selectionEvidence(request: PlanRequest, slot: string, recipeId: string, taste: TasteEvidence | null, excluded: string[]) {
  if (!taste) return undefined;
  const baseline = candidates(request, slot, [], excluded);
  const grounded = candidates(request, slot, taste.connections, excluded);
  const selected = grounded.find(c => c.recipe.id === recipeId);
  if (!selected) return undefined;
  return {
    baselineRank: baseline.findIndex(c => c.recipe.id === recipeId) + 1,
    groundedRank: grounded.findIndex(c => c.recipe.id === recipeId) + 1,
    candidateCount: grounded.length,
    qlooContribution: tasteContribution(selected.tasteLinks),
    mappings: selected.tasteLinks.map(link => link.name),
    fetchedAt: taste.fetchedAt,
    seedNames: taste.seeds.map(seed => seed.name),
    seedSignals: taste.seeds.map(seed => ({id:seed.id,name:seed.name})),
  };
}
export function assemble(
  request: PlanRequest,
  taste: TasteEvidence | null,
  choices: { day: number; slot: string; recipeId: string }[],
  exclude: string[] = [],
  target?: { day: number; slot: string },
): Meal[] {
  const specs = target
    ? [target]
    : Array.from({ length: request.days }, (_, i) =>
        request.slots.map((slot) => ({ day: i + 1, slot })),
      ).flat();
  return specs.flatMap((spec): Meal[] => {
    const options = candidates(
      request,
      spec.slot,
      taste?.connections || [],
      exclude,
    );
    if (!options.length && request.members.length > 1) {
      return request.members.map((member) => {
        const individual = {
          ...request,
          mode: "individual" as const,
          members: [member],
        };
        const choices = candidates(
          individual,
          spec.slot,
          taste?.connections || [],
          exclude,
        );
        const selected = choices[0];
        return {
          ...spec,
          recipe: selected?.recipe || null,
          recipientIds: [member.id],
          checks: selected?.checks || { status: "unknown", results: [] },
          tasteLinks: selected?.tasteLinks || [],
          ...(selected && taste ? { selectionEvidence: selectionEvidence(individual, spec.slot, selected.recipe.id, taste, exclude) } : {}),
          alternatives: choices
            .slice(1, 3)
            .map((c) => ({ recipe: c.recipe, checks: c.checks })),
          reason:
            "No shared recipe satisfied every member. This portion was independently selected and checked for its named recipient.",
        };
      });
    }
    const choice = choices.find(
      (c) => c.day === spec.day && c.slot === spec.slot,
    );
    const selected = options.find((o) => o.recipe.id === choice?.recipeId);
    if (!selected)
      return [
        {
          ...spec,
          recipe: null,
          recipientIds: request.members.map((m) => m.id),
          checks: { status: "unknown", results: [] },
          tasteLinks: [],
          alternatives: [],
          reason:
            "No eligible selection was returned. Requirements were not relaxed.",
        },
      ];
    return [
      {
        ...spec,
        recipe: selected.recipe,
        recipientIds: request.members.map((m) => m.id),
        checks: selected.checks,
        tasteLinks: selected.tasteLinks,
        ...(taste ? { selectionEvidence: selectionEvidence(request, spec.slot, selected.recipe.id, taste, exclude) } : {}),
        alternatives: options
          .filter((o) => o.recipe.id !== selected.recipe.id)
          .slice(0, 2)
          .map((o) => ({ recipe: o.recipe, checks: o.checks })),
      },
    ];
  });
}
export function resultStatus(meals: Meal[]): PlanResult["status"] {
  return meals.some((m) => !m.recipe)
    ? "partial"
    : meals.some((m) => m.checks.status === "unknown")
      ? "unresolved"
      : "checked";
}
export function previewPlan(request: PlanRequest): PlanResult {
  const used = new Map<string, number>();
  const choices = [];
  for (let day = 1; day <= request.days; day++)
    for (const slot of request.slots) {
      const options = candidates(request, slot, []).sort(
        (a, b) =>
          (used.get(a.recipe.id) || 0) - (used.get(b.recipe.id) || 0) ||
          b.score - a.score,
      );
      if (options[0]) {
        choices.push({ day, slot, recipeId: options[0].recipe.id });
        used.set(
          options[0].recipe.id,
          (used.get(options[0].recipe.id) || 0) + 1,
        );
      }
    }
  const meals = assemble(request, null, choices);
  return {
    request,
    mode: "preview",
    model: null,
    taste: null,
    meals,
    status: resultStatus(meals),
    summary:
      "Local preview of original recipe suggestions. No Qloo or OpenAI request was made. Review all unresolved checks before use.",
    usage: { input: 0, output: 0 },
    createdAt: new Date().toISOString(),
  };
}
