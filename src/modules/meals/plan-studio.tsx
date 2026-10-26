"use client";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { requestSchema } from "./domain/schema.mjs";
import { PlanCompanion, type MealFeedback } from "./plan-companion";
import { MealEvidence } from "./meal-evidence";
import {
  previewPlan,
  type PlanRequest,
  type PlanResult,
  type Meal,
} from "./domain/planning";
type Input = {
  mode: "individual" | "partner" | "family";
  members: {
    id: string;
    name: string;
    favorites: string[];
    exclusions: string[];
    dislikes?: string[];
    texture: "any" | "soft";
  }[];
  region: string;
  currency: string;
  units: "metric" | "imperial";
};
const errors: Record<string, string> = {
  REVISION_NO_EASIER_MATCH:
    "No quicker eligible alternative exists in this catalog. Your previous plan is preserved. Try another feedback option or review your meal settings.",
  QLOO_NOT_CONFIGURED: "Qloo is not configured on the server.",
  QLOO_HTTP_401: "The Qloo credential was rejected.",
  QLOO_HTTP_429: "Qloo rate limit reached. Please try later.",
  OPENAI_AUTH: "OpenAI rejected the configured key.",
  OPENAI_QUOTA: "OpenAI quota or rate limit reached.",
  OPENAI_MODEL: "Luna is unavailable to this API account.",
  TIMEOUT: "Planning took too long. Your previous plan is preserved.",
  REVISION_NO_MATCH:
    "No eligible replacement was found. Return to your previous plan or edit your requirements.",
  PLANNING_ERROR:
    "Planning could not finish. Try again; your profile and previous plan are preserved.",
};
export function PlanStudio({
  household,
  householdId,
  initialPlan,
  interactive = false,
  onResultChange,
}: {
  household: Input;
  householdId?: Id<"households">;
  initialPlan?: {id:Id<"mealPlans">;request:PlanRequest};
  interactive?: boolean;
  onResultChange?: (result: PlanResult | null) => void;
}) {
  const { isAuthenticated } = useConvexAuth();
  const start = useMutation(api.plans.start);
  const remove = useMutation(api.plans.remove);
  const history = useQuery(api.plans.list, isAuthenticated ? {} : "skip");
  const [active, setActive] = useState<Id<"mealPlans"> | null>(initialPlan?.id || null);
  const row = useQuery(
    api.plans.find,
    isAuthenticated && active ? { id: active } : "skip",
  );
  const [local, setLocal] = useState<PlanResult | null>(null);
  const [revisionBase, setRevisionBase] = useState<{ id: Id<"mealPlans">; result: PlanResult } | null>(null);
  const [days, setDays] = useState<3 | 7 | 14>(initialPlan?.request.days || 3);
  const [slots, setSlots] = useState<string[]>(initialPlan?.request.slots || ["dinner"]);
  const [minutes, setMinutes] = useState(initialPlan?.request.maxMinutes || 45);
  const [budget, setBudget] = useState(initialPlan?.request.budget ? String(initialPlan.request.budget) : "");
  const [equipment, setEquipment] = useState<string[]>(initialPlan?.request.equipment || ["hob"]);
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState(false);
  const [conversationKey, setConversationKey] = useState(0);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [feedback, setFeedback] = useState<{
    day: number;
    slot: string;
    reason: string;
    text: string;
  } | null>(null);
  useEffect(() => {
    if (active && row === null) {
      setActive(null);
      setRevisionBase(null);
      localStorage.removeItem("caretable-active-plan");
      setError("This saved plan was removed. Your household draft is kept; open another plan or create a new one.");
    }
  }, [active, row]);
  useEffect(() => {
    setConfirmed(false);
  }, [
    JSON.stringify(household),
    days,
    slots.join(","),
    minutes,
    budget,
    equipment.join(","),
  ]);
  useEffect(() => {
    if (history && active === null && !local) {
      const previous = localStorage.getItem("caretable-active-plan");
      if (previous && history.some((h) => h.id === previous))
        setActive(previous as Id<"mealPlans">);
    }
  }, [history, active, local]);
  const result = (local || (row?.result as PlanResult | undefined) || (row?.parentSnapshot as PlanResult | undefined) || revisionBase?.result) ?? null;
  useEffect(() => { onResultChange?.(result); }, [result, onResultChange]);
  const working =
    pending || row?.status === "running" || row?.status === "queued";
  function request() {
    const input = {
      ...household,
      days,
      slots,
      maxMinutes: minutes,
      budget: budget ? Number(budget) : null,
      equipment,
      confirmed,
    };
    const parsed = requestSchema.safeParse(input);
    if (!parsed.success)
      throw new Error(
        "Review all settings: select meal slots, enter a currency code, use specific bounded inputs, and confirm your requirements.",
      );
    return parsed.data;
  }
  async function generate() {
    setError("");
    setPending(true);
    try {
      const data = request();
      const id = await start({
        request: data,
        requestId: crypto.randomUUID(),
        ...(householdId ? { householdId } : {}),
      });
      setLocal(null);
      setRevisionBase(null);
      setConversationKey(k => k + 1);
      setFeedback(null);
      setActive(id);
      localStorage.setItem("caretable-active-plan", id);
      setSelectedDay(1);
    } catch (e) {
      setError(explain(e));
    } finally {
      setPending(false);
    }
  }
  async function revise(change: MealFeedback) {
    const parentId = row?.result ? active : row?.parentPlanId || revisionBase?.id;
    if (!parentId || !result || working) return null;
    setError("");
    setPending(true);
    try {
      const id = await start({
        request: result.request,
        requestId: crypto.randomUUID(),
        parentId,
        feedback: change,
      });
      setRevisionBase({id: parentId, result});
      setActive(id);
      localStorage.setItem("caretable-active-plan", id);
      return id;
    } catch (e) {
      setError(explain(e));
      return null;
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="plan-studio">
      <div className="page-heading" id="plan-settings" tabIndex={-1}>
        <span className="eyebrow">2 · PLAN YOUR MEALS</span>
        <h2>Let's plan something to look forward to.</h2>
        <p>
          Choose your pace, review the needs above, then let CareTable build and
          check your plan.
        </p>
      </div>
      <section className="panel" hidden={interactive}>
        <div className="form-grid">
          <label>
            Plan duration
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value) as 3 | 7 | 14)}
            >
              {[3, 7, 14].map((n) => (
                <option key={n} value={n}>
                  {n} days
                </option>
              ))}
            </select>
          </label>
          <label>
            Time per meal
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            >
              {[15, 25, 30, 45, 60, 90].map((n) => (
                <option key={n} value={n}>
                  Up to {n} minutes
                </option>
              ))}
            </select>
          </label>
          <label>
            Whole-plan budget (optional)
            <input
              type="number"
              min={1}
              max={10000000}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <small>
              In {household.currency || "your chosen currency"}. Prices are not
              verified; the budget check will remain unknown.
            </small>
          </label>
          <fieldset>
            <legend>Meal slots</legend>
            {["breakfast", "lunch", "dinner"].map((slot) => (
              <label className="checkbox" key={slot}>
                <input
                  type="checkbox"
                  checked={slots.includes(slot)}
                  onChange={(e) =>
                    setSlots(
                      e.target.checked
                        ? [...slots, slot]
                        : slots.filter((s) => s !== slot),
                    )
                  }
                />
                {slot}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Available equipment</legend>
            {["hob", "oven", "blender"].map((v) => (
              <label className="checkbox" key={v}>
                <input
                  type="checkbox"
                  checked={equipment.includes(v)}
                  onChange={(e) =>
                    setEquipment(
                      e.target.checked
                        ? [...equipment, v]
                        : equipment.filter((x) => x !== v),
                    )
                  }
                />
                {v === "hob" ? "Stovetop / hob" : v}
              </label>
            ))}
          </fieldset>
        </div>
        <label className="checkbox confirm">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span>
            I have reviewed every person's preferences and restrictions above,
            and the plan settings.
          </span>
        </label>
        <div className="actions">
          <button
            className="button"
            disabled={!isAuthenticated || !confirmed || working}
            onClick={() => void generate()}
          >
            {working ? "Planning…" : "Create a Qloo + Luna plan"}
            <span>↗</span>
          </button>
          <button
            className="button outline"
            disabled={!confirmed || working}
            onClick={() => {
              try {
                setLocal(previewPlan(request()));
                setActive(null);
                setRevisionBase(null);
                setConversationKey(k => k + 1);
                setFeedback(null);
                setSelectedDay(1);
                setError("");
              } catch (e) {
                setError(explain(e));
              }
            }}
          >
            Local preview
          </button>
        </div>
        {!isAuthenticated && (
          <p className="fine">
            Sign in or load the fictional sample above to use live planning.
            Preview makes no external requests.
          </p>
        )}
        <p className="fine">
          Original prototype recipes. The app does not certify allergy safety,
          actual texture, local availability, or medical suitability. A Qloo
          affinity is not a prediction about an individual.
        </p>
      </section>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {working && (
        <section
          className="panel progress-panel"
          role="status"
          aria-live="polite"
        >
          <span className="spinner" />
          <div>
            <h3>{row?.phase || "Submitting your plan"}</h3>
            <p>
              You can stay here or return later. The job and its status are
              saved in your account.
            </p>
          </div>
        </section>
      )}
      {row?.status === "failed" && (
        <section className="alert" role="alert">
          <strong>
            {errors[row.errorCode || "PLANNING_ERROR"] ||
              "A provider request failed. Please try again later."}
          </strong>
          <p>{row.summary}</p>
          {row.parentPlanId && history?.some(p => p.id === row.parentPlanId) && (
            <button
              className="button outline"
              onClick={() => {
                if (row.parentPlanId) {
                  setActive(row.parentPlanId);
                  localStorage.setItem(
                    "caretable-active-plan",
                    row.parentPlanId,
                  );
                }
              }}
            >
              Return to the previous plan
            </button>
          )}
          {row.parentSnapshot && !history?.some(p => p.id === row.parentPlanId) && (
            <p>The original version is no longer in recent saved history. Its preserved snapshot is shown below. Create a new plan to continue from your current profile.</p>
          )}
        </section>
      )}
      <div className="journey-heading" id="review-plan" tabIndex={-1}><span className="step-medallion" aria-hidden="true">3</span><div><h2>A plan to make your days a little easier.</h2><p>{result ? "Take your time with the meals and checks. There’s room to make changes." : "Your meals, shopping list and checks will appear here after you create a plan."}</p></div></div>
      <div className="studio-workspace"><div className="studio-main">
      {result && (
        <>
          <div className="plan-title">
            <div>
              <span className="eyebrow">
                {result.mode === "live"
                  ? "LIVE QLOO + GPT-6 LUNA"
                  : "LOCAL PREVIEW · NO EXTERNAL REQUESTS"}
              </span>
              <h2>Your {result.request.days}-day table.</h2>
            </div>
            <span className="badge">
              {result.status === "checked"
                ? "Listed checks passed"
                : result.status === "partial"
                  ? "Partial plan"
                  : "Some checks cannot be verified"}
            </span>
          </div>
          <p className="notice">{result.summary}</p>
          <div className="plan-layout">
            <div>
              <div className="day-selector" aria-label="Choose plan day">
                {Array.from({ length: result.request.days }, (_, i) => (
                  <button
                    className={selectedDay === i + 1 ? "selected" : ""}
                    key={i}
                    onClick={() => setSelectedDay(i + 1)}
                  >
                    Day {i + 1}
                  </button>
                ))}
              </div>
              <div className="preview-grid meal-results">
                {result.meals
                  .filter((m) => m.day === selectedDay)
                  .map((meal, i) => (
                    <MealCard
                      key={`${meal.slot}-${i}`}
                      meal={meal}
                      request={result.request}
                      canRevise={!working}
                      onRevise={() =>
                        setFeedback({
                          day: meal.day,
                          slot: meal.slot,
                          reason: "try something similar",
                          text: "",
                        })
                      }
                    />
                  ))}
              </div>
            </div>
            <aside className="panel taste-evidence">
              <span className="eyebrow">WHY THESE CHOICES?</span>
              <h3>A little cultural context.</h3>
              <p>
                {result.taste?.message ||
                  "This local preview uses no Qloo evidence."}
              </p>
              {result.taste && (
                <>
                  <h4>Your resolved taste signals</h4>
                  <div className="chips">
                    {result.taste.seeds.map((s) => (
                      <span className="badge" key={s.id}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                  {result.taste.unresolved.length > 0 && (
                    <p>
                      Unresolved: {result.taste.unresolved.join(", ")}. Try a
                      cuisine name for these preferences.
                    </p>
                  )}
                  <h4>Dining affinities returned by Qloo</h4>
                  <div className="chips">
                    {result.taste.connections.map((c) => (
                      <span key={c.id} className="badge">
                        {c.name}
                      </span>
                    ))}
                  </div>
                  <details>
                    <summary>View source identifiers</summary>
                    <small>Retrieved {result.taste.fetchedAt}</small>
                    {result.taste.connections.map((c) => (
                      <p key={c.id}>
                        <strong>{c.name}</strong>
                        <br />
                        <code>{c.id}</code>
                        <br />
                        Affinity score:{" "}
                        {c.affinity?.toFixed(3) ?? "unavailable"} (aggregate
                        ranking signal)
                      </p>
                    ))}
                  </details>
                </>
              )}
              <p className="fine">
                Recipe tags and mappings are CareTable's interpretation. Recipes
                are original suggestions, not returned by Qloo. Some meals may
                repeat in this small catalog.
              </p>
              <small>
                Model: {result.model || "none"} · Tokens: {result.usage.input}{" "}
                input / {result.usage.output} output
              </small>
            </aside>
          </div>
          {!!result.feedback?.length && (
            <details className="panel">
              <summary>Plan feedback history</summary>
              {result.feedback.map((f, i) => (
                <p key={i}>
                  Day {f.day} {f.slot}: {f.reason}
                </p>
              ))}
            </details>
          )}
        </>
      )}
      {isAuthenticated && (
        <section className="panel history-panel">
          <h3>Your saved plans</h3>
          {history?.length ? (
            <div className="saved-list">
              {history.map((p) => (
                <article className="saved-item" key={p.id}>
                  <strong>
                    {p.days} days · {p.status}
                  </strong>
                  <p>{new Date(p.createdAt).toLocaleString()}</p>
                  <div className="actions">
                    <button
                      className="text-button"
                      onClick={() => {
                        setActive(p.id);
                        setLocal(null);
                        setRevisionBase(null);
                        setConversationKey(k => k + 1);
                        setFeedback(null);
                        localStorage.setItem("caretable-active-plan", p.id);
                        setSelectedDay(1);
                      }}
                    >
                      Open plan
                    </button>
                    {!["running", "queued"].includes(p.status) && (
                      <button
                        className="text-button"
                        onClick={async () => {
                          try {
                            await remove({ id: p.id });
                            if (active === p.id) {
                              setActive(null);
                              setRevisionBase(null);
                              localStorage.removeItem("caretable-active-plan");
                            }
                          } catch (e) {
                            setError(explain(e));
                          }
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No saved plans yet.</p>
          )}
        </section>
      )}
      </div><PlanCompanion key={conversationKey} planId={row?.result ? active || undefined : row?.parentPlanId || revisionBase?.id} result={result} target={feedback} working={working} job={row && active ? {id:active,status:row.status,error:errors[row.errorCode || "PLANNING_ERROR"]} : undefined} onApply={revise} /></div>
    </section>
  );
}
function MealCard({
  meal,
  request,
  canRevise,
  onRevise,
}: {
  meal: Meal;
  request: PlanRequest;
  canRevise: boolean;
  onRevise: () => void;
}) {
  const scale = meal.recipientIds.length / (meal.recipe?.servings || 1);
  return (
    <article className="panel meal-result">
      <span className="badge">
        Day {meal.day} · {meal.slot}
      </span>
      <h3>{meal.recipe?.name || "No eligible selection"}</h3>
      <p>
        For{" "}
        {meal.recipientIds
          .map((id) => request.members.find((m) => m.id === id)?.name)
          .join(", ")}
      </p>
      {!meal.recipe ? (
        <p>{meal.reason}</p>
      ) : (
        <>
          <p>
            {meal.recipe.minutes} min estimated · {meal.recipientIds.length}{" "}
            servings
          </p>
          {meal.reason && <p className="notice">{meal.reason}</p>}
          <span className="badge">
            {meal.checks.status === "pass"
              ? "Listed checks passed"
              : "Review unverified requirements"}
          </span>
          {meal.tasteLinks.length > 0 && (
            <p className="taste-link">
              Mapped from Qloo dining affinities:{" "}
              {meal.tasteLinks.map((l) => l.name).join(", ")}.
            </p>
          )}
          <MealEvidence meal={meal} />
          <details>
            <summary>Ingredients & preparation</summary>
            <ul>
              {meal.recipe.ingredients.map((i) => (
                <li key={i.name}>
                  {amount(i.amount * scale, i.unit, request.units)} {i.name}
                </li>
              ))}
            </ul>
            <ol>
              {meal.recipe.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p>
              Source: {meal.recipe.source.label}. Original suggestion;
              preparation is not independently validated. Times are base-recipe
              estimates; scaling may change them.
            </p>
          </details>
          <details>
            <summary>See every check</summary>
            {meal.checks.results.map((c, i) => (
              <div className={`check-result ${c.status}`} key={i}>
                <strong>
                  {c.rule} ·{" "}
                  {c.status === "unknown" ? "cannot verify" : c.status}
                </strong>
                {c.memberId && (
                  <small>
                    {request.members.find((m) => m.id === c.memberId)?.name}
                  </small>
                )}
                <p>{c.reason}</p>
              </div>
            ))}
          </details>
          <details>
            <summary>Checked alternatives</summary>
            {meal.alternatives.length ? (
              meal.alternatives.map((a) => (
                <p key={a.recipe.id}>
                  <strong>{a.recipe.name}</strong>
                  <br />
                  {a.checks.status === "pass"
                    ? "Listed checks passed"
                    : "Some checks cannot be verified"}
                </p>
              ))
            ) : (
              <p>
                No eligible alternative found. Requirements have not been
                relaxed.
              </p>
            )}
          </details>
          {canRevise && (
            <button className="button outline" onClick={onRevise}>
              Find a better fit ↻
            </button>
          )}
        </>
      )}
    </article>
  );
}
function amount(value: number, unit: string, units: string) {
  if (units === "imperial" && unit === "g")
    return `${(value / 28.3495).toFixed(1)} oz`;
  if (units === "imperial" && unit === "ml")
    return `${(value / 29.5735).toFixed(1)} US fl oz`;
  return `${Number(value.toFixed(1))} ${unit}`;
}
function explain(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("PLAN_RATE_LIMIT"))
    return "You have reached the six planning requests per hour limit. Your existing plans are still available.";
  if (message.includes("DAILY_SERVICE_LIMIT"))
    return "The shared demonstration limit has been reached for today. Please return later.";
  if (message.includes("PLAN_ALREADY_RUNNING"))
    return "A plan is already running for this account. Open it below or wait for it to finish.";
  if (message.includes("AUTH_REQUIRED"))
    return "Sign in or load the sample before using live planning.";
  return message.includes("Review all settings")
    ? message
    : "The request could not be saved. Please review your settings and try again.";
}
