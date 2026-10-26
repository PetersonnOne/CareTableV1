# Qloo contribution: reproducible development evaluation

Run 26 October 2026 against the development backend. Operator command: `npm run evaluate:qloo` after deploying the corresponding Convex functions. The action is internal-only; it cannot be called by anonymous visitors to spend the shared key.

## What was measured

Nine fictional scenarios use the same 26-recipe catalog, time/equipment/exclusion constraints and deterministic selection policy with and without **real returned Qloo dining affinities**. The ranking comparison isolates Qloo's contribution without LLM randomness. Three dinner slots are selected with a least-used-first control, breaking ties by score, time and recipe ID. This is not a generic-LLM benchmark, a study of enjoyment, or a clinical result. The final baseline recognizes the same authored cuisine mappings as the grounded variant, as well as direct recipe tags.

The raw sanitized reports retain every scenario, including unchanged/unsupported cases, returned seed/connection IDs, timestamps, candidate ranks and plan selections. Qloo's data remains governed by its applicable terms, not relicensed as MIT with the application code. No real person, credentials or medical record is included.

## Iterations retained

- [First run](qloo-comparison-2026-10-26T08-22-04-016Z.json): 9/9 completed; top-three ordering changed in 2 scenarios, with 5 changed slots. It exposed unmapped provider vocabulary including North Indian, Thai Local and Nigerian Cuisine.
- [Intermediate reviewed-mapping run](qloo-comparison-2026-10-26T08-27-26-632Z.json): 9/9 completed; top-three ordering changed in 6 scenarios, with 17 changed slots. This predates the stronger baseline below and is not the headline final result.
- [Rejected query experiment](qloo-comparison-2026-10-26T08-40-02-463Z.json): an over-specific restaurant namespace produced zero retained connections and no changes. It was rejected. The Qloo tag object identifies its actual type as `urn:tag:genre:place`, even when its ID includes `restaurant`. [Official taste-analysis guide](https://github.com/qloo/docs-public/blob/main/reference/taste-analysis.md) documents namespace filtering.
- **[Final stronger-baseline run](qloo-comparison-2026-10-26T08-43-51-567Z.json): 9/9 completed, six top-three order changes and 12 changed meal slots.** Both variants recognize the same recipe/cuisine mappings. Place-genre filtering returns up to 40 tags; the app retains only dining/cuisine IDs. Eligible sets were preserved in all cases, with zero failed hard checks in selections. Catalog/mapping hashes and ranking/query policies are recorded.

The final policy uses the strongest mapped affinity per recipe. Multiple synonymous returned tags do not multiply a cuisine's score. All iterations are preserved; these results are not presented as the unchanged original implementation. The table below describes only the final run.

| Scenario | Top-three order changed | Changed dinner slots | Result |
| --- | --- | --- | --- |
| Italian | Yes | 1 | Two directly preferred choices retained; a related choice enters the control plan |
| Chinese; wheat excluded | Yes | 1 | Directly preferred rice choices retained; a related choice changes |
| Indian; dairy excluded | Yes | 2 | Broader returned dining affinities alter two selections |
| Thai; soy excluded | Yes | 2 | Coconut rice retained; tofu stays excluded |
| Mexican; eggs excluded | Yes | 3 | Explicitly reviewed cuisine mappings affect order |
| Nigerian; peanuts excluded | No | 0 | Directly mapped choices retained; evidence does not change the control plan |
| Mixed partner | Yes | 3 | Pooled cultural signals alter the control plan |
| Unsupported cuisine input | No | 0 | Input stays unresolved; no Qloo mapping is invented |
| No equipment | No | 0 | Three empty slots; requirements are not relaxed |

## How to interpret the result

Qloo changes the application's choices under controlled conditions. A changed choice is **not automatically a better meal**, and this evaluation does not prove superiority over an LLM or preference by real caregivers. All scenarios, including negative cases, are in the denominators. There are 27 requested slots, including three deliberately unfilled no-equipment slots. The next human review should assess clarity and usefulness rather than assume that a score increase means satisfaction.

New saved live meals carry their own candidate-rank and resolved-seed snapshot. The UI calls it a comparison of candidate rankings before Luna's variety choices; a rank that stays the same is explicitly shown as unchanged. Historical meals without a receipt remain readable without inventing a retrospective ranking.
