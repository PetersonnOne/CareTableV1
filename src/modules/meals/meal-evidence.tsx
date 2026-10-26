import type { Meal } from "./domain/planning";

export function MealEvidence({ meal }: { meal: Meal }) {
  const evidence=meal.selectionEvidence;
  const passed=meal.checks.results.filter(c=>c.status==="pass").length;
  const unknown=meal.checks.results.filter(c=>c.status==="unknown").length;
  return <details className="meal-evidence">
    <summary>Why this meal fits your table <span aria-hidden="true">♡</span></summary>
    <ol>
      <li><strong>Your taste signals</strong><p>{evidence?.seedNames.length ? evidence.seedNames.join(", ") : "The preferences and requirements reviewed for this plan."}</p></li>
      <li><strong>{meal.tasteLinks.length ? "Qloo’s dining connections" : "The selection basis"}</strong><p>{meal.tasteLinks.length ? meal.tasteLinks.map(l=>l.name).join(", ") : "This meal was selected from eligible catalog choices. No returned Qloo connection is mapped to it."}</p></li>
      <li><strong>CareTable’s recipe mapping</strong><p>{meal.tasteLinks.length ? `${meal.recipe?.name} is linked to these cuisine tags by CareTable. Qloo supplies the connections; this recipe is our original suggestion.` : "CareTable uses the recipe’s ingredients, tags and practical checks to assess the fit."}</p></li>
      <li><strong>Checked for this meal’s recipients</strong><p>{passed} passed catalog checks · {unknown} need review. Open “See every check” for the individual results.</p></li>
    </ol>
    {evidence && <div className="evidence-ranking"><strong>Compare the candidate ranking</strong><p>Without Qloo: #{evidence.baselineRank} · With Qloo: #{evidence.groundedRank} of {evidence.candidateCount} eligible choices.</p><small>{evidence.baselineRank===evidence.groundedRank?"The rank stayed the same in this selection. ":""}Same constraints and catalog at selection time, before the Meal Guide’s variety choices. This ranking comparison is not a prediction of enjoyment.</small></div>}
    {evidence && <small>Household-level signals · retrieved {new Date(evidence.fetchedAt).toLocaleDateString("en-GB",{timeZone:"UTC"})} (UTC). This receipt stays with the saved meal.</small>}
    {evidence && <details><summary>Inspect the Qloo source</summary>{evidence.seedSignals?.map(seed=><p key={seed.id}><strong>Resolved seed: {seed.name}</strong><br/><code>{seed.id}</code></p>)}{meal.tasteLinks.map(link=><p key={link.id}><strong>Returned connection: {link.name}</strong><br/><code>{link.id}</code><br/><small>Affinity: {link.affinity?.toFixed(3) ?? "unavailable"} · aggregate signal</small></p>)}</details>}
  </details>;
}
