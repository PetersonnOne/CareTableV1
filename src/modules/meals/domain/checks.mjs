export const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const aliases = {
  milk: ["milk", "dairy", "butter", "cheese", "yogurt", "cream"],
  dairy: ["milk", "butter", "cheese", "yogurt", "cream"],
  egg: ["egg", "eggs"],
  eggs: ["egg", "eggs"],
  wheat: ["wheat", "pasta", "couscous", "semolina"],
  gluten: ["wheat", "pasta", "barley", "rye", "rolled oats"],
  fish: ["fish", "salmon", "tuna", "cod"],
  seafood: ["fish", "salmon", "tuna", "cod", "shrimp", "prawn", "shellfish"],
  soy: ["soy", "soya", "tofu", "tempeh"],
  soya: ["soy", "soya", "tofu", "tempeh"],
  peanut: ["peanut", "peanuts", "groundnut", "groundnuts"],
  peanuts: ["peanut", "peanuts", "groundnut", "groundnuts"],
  groundnut: ["peanut", "peanuts", "groundnut", "groundnuts"],
  nuts: [
    "peanut",
    "groundnut",
    "almond",
    "walnut",
    "cashew",
    "hazelnut",
    "pecan",
    "pistachio",
    "brazil nut",
    "macadamia",
  ],
  "tree nuts": [
    "almond",
    "walnut",
    "cashew",
    "hazelnut",
    "pecan",
    "pistachio",
    "brazil nut",
    "macadamia",
  ],
  sesame: ["sesame", "tahini"],
  meat: ["chicken", "beef", "pork", "lamb", "turkey"],
};
const known = new Set([
  "carrot",
  "onion",
  "olive oil",
  "water",
  "red lentils",
  "rice",
  "tomato",
  "cooked chickpeas",
  "spinach",
  "boneless chicken",
  "sweet potato",
  "cooked white beans",
  "wheat pasta",
  "basil",
  "potato",
  "peas",
  "boneless white fish",
  "lemon juice",
  "ginger",
  "pumpkin",
  "coconut milk",
  "egg",
  "rolled oats",
  "banana",
  "cinnamon",
  "apple",
  "pear",
  "fine cornmeal",
]);
const result = (rule, status, reason, memberId = null) => ({
  rule,
  status,
  reason,
  memberId,
});
export function checkRecipe(recipe, request) {
  const results = [];
  const ingredients = recipe.ingredients.map((i) => normalize(i.name));
  for (const member of request.members) {
    for (const restriction of member.exclusions) {
      const exclusion = normalize(restriction);
      const terms = aliases[exclusion] || [
        exclusion,
        exclusion.replace(/s$/, ""),
      ];
      const matches = ingredients.filter((i) =>
        terms.some((t) => t && ` ${i} `.includes(` ${t} `)),
      );
      // Coconut milk is not dairy. Mixed milks require additional evidence.
      const filtered = ["milk", "dairy"].includes(exclusion)
        ? matches.filter((i) => i !== "coconut milk")
        : matches;
      const unsupportedGroup =
        !Object.hasOwn(aliases, exclusion) &&
        !known.has(exclusion) &&
        ![...known].some((i) => ` ${i} `.includes(` ${exclusion} `));
      results.push(
        result(
          `Avoid ${restriction}`,
          filtered.length
            ? "fail"
            : unsupportedGroup || ingredients.some((i) => !known.has(i))
              ? "unknown"
              : "pass",
          filtered.length
            ? `Listed ingredient match: ${filtered.join(", ")}.`
            : unsupportedGroup
              ? "This broad restriction requires more specific ingredient requirements."
              : ingredients.some((i) => !known.has(i))
                ? "Ingredient composition is incomplete."
                : "No match in the listed ingredients and supported aliases. Product labels and cross-contact are not verified.",
          member.id,
        ),
      );
    }
    if (member.texture === "soft")
      results.push(
        result(
          "Soft preparation",
          "unknown",
          "Recipe suggests a soft preparation; actual texture and personal suitability need checking.",
          member.id,
        ),
      );
  }
  results.push(
    result(
      "Cooking time",
      recipe.minutes == null
        ? "unknown"
        : recipe.minutes <= request.maxMinutes
          ? "pass"
          : "fail",
      recipe.minutes == null
        ? "Time unavailable."
        : `Recipe estimate ${recipe.minutes} min; limit ${request.maxMinutes} min.`,
    ),
  );
  const missing = recipe.equipment.filter(
    (e) => !request.equipment.includes(e),
  );
  results.push(
    result(
      "Equipment",
      missing.length ? "fail" : "pass",
      missing.length
        ? `Requires: ${missing.join(", ")}.`
        : `Uses: ${recipe.equipment.join(", ")}.`,
    ),
  );
  if (request.budget != null)
    results.push(
      result(
        "Budget",
        "unknown",
        `No regional prices are verified for the ${request.currency} ${request.budget} whole-plan budget.`,
      ),
    );
  return {
    results,
    status: results.some((r) => r.status === "fail")
      ? "fail"
      : results.some((r) => r.status === "unknown")
        ? "unknown"
        : "pass",
  };
}
export function eligibleFor(recipe, request, slot) {
  return (
    recipe.slots.includes(slot) &&
    checkRecipe(recipe, request).status !== "fail"
  );
}
