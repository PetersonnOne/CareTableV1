"use client";
import type { PlanResult } from "./domain/planning";

export function PlanSnapshot({ result }: { result: PlanResult | null }) {
  const meals = result?.meals.filter(m => m.recipe) || [];
  const expected = result ? result.request.days * result.request.slots.length : 0;
  const filled = result ? new Set(meals.map(m=>`${m.day}:${m.slot}`)).size : 0;
  const checks = result?.meals.flatMap(m => m.checks.results) || [];
  const pass = checks.filter(c=>c.status === "pass").length;
  const fail = checks.filter(c=>c.status === "fail").length;
  const unknown = checks.filter(c=>c.status === "unknown").length;
  const average = meals.length ? Math.round(meals.reduce((sum,m)=>sum+(m.recipe?.minutes||0),0)/meals.length) : null;
  return (
    <section className="panel companion-dashboard" aria-labelledby="plan-snapshot-title">
      <span className="eyebrow">AT A GLANCE</span><h3 id="plan-snapshot-title">Your table, in numbers.</h3>
      <dl className="companion-stats">
        <div className="stat-blue"><dt>Meal slots filled</dt><dd>{filled}<small> / {expected}</small></dd></div>
        <div className="stat-violet"><dt>Average cook time</dt><dd>{average ?? "—"}<small> min · estimate</small></dd></div>
        <div className="stat-green"><dt>Passed checks</dt><dd>{pass}</dd></div>
        <div className="stat-amber"><dt>Unverified checks</dt><dd>{unknown}</dd></div>
        {fail > 0 && <div className="stat-red"><dt>Failed checks</dt><dd>{fail}</dd></div>}
        <div className="stat-blue"><dt>Saved revisions</dt><dd>{result?.feedback?.length || 0}</dd></div>
      </dl>
      <p className="fine">Counts cover all plan days and recipients. Passed checks are catalog checks, not a safety certification. Prices and nutrition are not verified.</p>
    </section>
  );
}
