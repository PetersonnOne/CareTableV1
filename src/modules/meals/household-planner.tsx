"use client";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { PlanStudio } from "./plan-studio";
import { OnboardingAssistant } from "./onboarding-assistant";
import { VoiceSession } from "./voice-session";
import { requestSchema } from "./domain/schema.mjs";
import type { PlanRequest, PlanResult } from "./domain/planning";
import { PlanSnapshot } from "./plan-snapshot";
import { preserveVoiceMembers } from "./domain/voice-contracts";
const draftSchema = z.object({
  label: z.string().max(80),
  mode: z.enum(["individual", "partner", "family"]),
  members: z
    .array(
      z.object({
        id: z.string().max(60),
        name: z.string().max(80),
        favorites: z.string().max(500),
        exclusions: z.string().max(500),
        dislikes: z.string().max(500).default(""),
        texture: z.enum(["any", "soft"]),
      }),
    )
    .min(1)
    .max(8),
  region: z.string().max(80),
  currency: z.string().max(3),
  units: z.enum(["metric", "imperial"]),
});
type Household = z.infer<typeof draftSchema>;
const member = (n = 1) => ({
  id: crypto.randomUUID(),
  name: `Person ${n}`,
  favorites: "",
  exclusions: "",
  dislikes: "",
  texture: "any" as const,
});
const fresh = (): Household => ({
  label: "My table",
  mode: "individual",
  members: [member()],
  region: "",
  currency: "",
  units: "metric",
});
const split = (s: string = "") =>
  s
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
export function HouseholdPlanner() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const viewer = useQuery(api.identity.current, isAuthenticated ? {} : "skip");
  const saved = useQuery(api.households.list, isAuthenticated ? {} : "skip");
  const save = useMutation(api.households.save);
  const remove = useMutation(api.households.remove);
  const resetDemo = useMutation(api.demo.reset);
  const startPlan = useMutation(api.plans.start);
  const [interactive, setInteractive] = useState(true);
  const [profileOpen, setProfileOpen] = useState(true);
  const [planSnapshot, setPlanSnapshot] = useState<PlanResult | null>(null);
  const [voicePlan, setVoicePlan] = useState<{id:Id<"mealPlans">;request:PlanRequest}|null>(null);
  const [household, setHousehold] = useState<Household>(fresh);
  const [id, setId] = useState<Id<"households"> | undefined>();
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("caretable-household-draft");
      if (stored) {
        const parsed = draftSchema.safeParse(JSON.parse(stored));
        if (parsed.success) setHousehold(parsed.data);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      localStorage.setItem(
        "caretable-household-draft",
        JSON.stringify(household),
      );
  }, [household, ready]);
  async function sample() {
    setBusy(true);
    setError("");
    try {
      if (!isAuthenticated) await signIn("anonymous");
      setId(undefined);
      setVoicePlan(null);
      setHousehold({
        label: "Fictional sample table",
        mode: "individual",
        members: [
          {
            ...member(),
            name: "Sample older adult",
            favorites: "Italian, rice",
            exclusions: "peanuts",
            texture: "soft",
          },
        ],
        region: "",
        currency: "USD",
        units: "metric",
      });
      setMessage(
        "Fictional sample loaded. The cuisine, currency, and all needs are editable. No real personal data is required.",
      );
      setResetKey((k) => k + 1);
    } catch {
      setError("The sample session could not start. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("sample") === "1") {
      window.history.replaceState(null, "", "/planner");
      void sample();
    }
  }, []);
  const fields = {
    ...household,
    members: household.members.map((m) => ({
      ...m,
      favorites: split(m.favorites),
      exclusions: split(m.exclusions),
      dislikes: split(m.dislikes),
    })),
  };
  function mode(value: Household["mode"]) {
    setHousehold((h) => ({
      ...h,
      mode: value,
      members: Array.from(
        {
          length:
            value === "individual"
              ? 1
              : value === "partner"
                ? 2
                : Math.max(3, h.members.length),
        },
        (_, i) => h.members[i] || member(i + 1),
      ),
    }));
    setId(undefined);
  }
  function patch(
    i: number,
    key: "name" | "favorites" | "exclusions" | "texture" | "dislikes",
    value: string,
  ) {
    setHousehold((h) => ({
      ...h,
      members: h.members.map((m, j) => (i === j ? { ...m, [key]: value } : m)),
    }));
  }
  async function reset() {
    setBusy(true);
    try {
      if (viewer?.isAnonymous) {
        await resetDemo({});
        await signOut();
      }
      localStorage.removeItem("caretable-household-draft");
      localStorage.removeItem("caretable-active-plan");
      setHousehold(fresh());
      setVoicePlan(null);
      setInteractive(true);
      setId(undefined);
      setResetKey((k) => k + 1);
      setMessage(
        "Local draft cleared. Sample session data is scheduled for deletion. Saved profiles on regular accounts are unchanged.",
      );
    } catch {
      setError("The sample could not be reset. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="care-planner" aria-busy={!ready} inert={!ready}>
      <div className="planner-welcome">
        <span className="care-seal" aria-hidden="true">♡</span>
        <div><span className="eyebrow">A LITTLE CARE, ONE STEP AT A TIME</span>
        <h1>Good meals begin with your people.</h1>
        <p>Bring their favourites, their routines, and the little things that matter. We’ll help you find a place for them all.</p></div>
      </div>
      <nav className="planner-steps" aria-label="Meal planning steps">
        {[["Your table", "People & preferences"], ["Plan your meals", "Time, budget & rhythm"], ["Review your plan", "Meals & checks"], ["Reflect & improve", "A little better together"]].map(([title, note], index) => (
          <a key={title} href={["#your-table", "#plan-settings", "#review-plan", "#meal-improvements"][index]} onClick={() => { if(index === 0){setInteractive(false);setProfileOpen(true);} }}><span>{index + 1}</span><div><strong>{title}</strong><small>{note}</small></div></a>
        ))}
      </nav>
      <div className="planner-overview">
      <section className="panel voice-entry">
        <div><span className="eyebrow">LET'S TALK IT THROUGH</span><h2>A conversation can set your table.</h2><p>Choose what feels comfortable: fill in the steps yourself, or talk through them with your AI companion. You’ll review the details before a plan is made.</p></div>
        <div className={`mode-guidance ${interactive?"is-interactive":"is-manual"}`}>
          <div className="mode-switch" role="group" aria-label="Planning mode">
            <button className="button outline" aria-pressed={!interactive} aria-describedby={!interactive?"planning-mode-description":undefined} onClick={()=>setInteractive(false)}>User Mode</button>
            <button className="button outline" aria-pressed={interactive} aria-describedby={interactive?"planning-mode-description":undefined} onClick={()=>setInteractive(true)}>Interactive Mode</button>
          </div>
          <div className="mode-bubble" id="planning-mode-description" role="status" aria-live="polite" aria-atomic="true">
            <svg className="mode-bubble-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{interactive?<><path d="M5 9a5 5 0 0 1 0 6M10 6a10 10 0 0 1 0 12M15 3a15 15 0 0 1 0 18" /></>:<><path d="m4 16 11-11 4 4L8 20l-5 1zM13 7l4 4" /></>}</svg>
            <div><h3>{interactive?"Interactive Mode is on":"You’re in User Mode"}</h3>
            <p>{interactive?"Talk through your setup, then review it before generation. Switching to User Mode stops voice and keeps your conversation draft.":"Use the profile fields, planning controls and text assistant. You can switch to voice at any time."}</p></div>
          </div>
          <p className="mode-reassurance"><span aria-hidden="true">{interactive?"◌":"♡"}</span>{interactive?"Your microphone stays off until you start.":"Your progress stays with you when you switch."}</p>
        </div>
        {!isAuthenticated&&interactive&&<p className="fine">Sign in or load the fictional sample below to start voice. You can also choose User Mode to explore the fields.</p>}
      </section>
      <PlanSnapshot result={planSnapshot} />
      </div>
      {isAuthenticated&&<div hidden={!interactive}><VoiceSession active={interactive} key={JSON.stringify(fields)} mode="interactive" context={JSON.stringify({...fields,voiceMode:"interactive",members:fields.members.map((m,i)=>({...m,name:`Person ${i+1}`})),label:undefined})} onClose={()=>setInteractive(false)} onReviewed={async draft=>{
        const members=preserveVoiceMembers(fields.members,draft.members,()=>crypto.randomUUID());
        const input=requestSchema.parse({...draft,members,confirmed:true});
        const planId=await startPlan({request:input,requestId:crypto.randomUUID()});
        setHousehold({label:household.label,mode:input.mode,members:members.map(m=>({...m,favorites:m.favorites.join(", "),dislikes:m.dislikes.join(", "),exclusions:m.exclusions.join(", ")})),region:input.region,currency:input.currency,units:input.units});
        setId(undefined);setVoicePlan({id:planId,request:input});localStorage.setItem("caretable-active-plan",planId);setResetKey(k=>k+1);setInteractive(false);setMessage("Reviewed voice setup applied. Qloo + Luna are building and checking your plan.");
      }}/></div>}

      <div className="page-heading">
        <span className="eyebrow">{interactive?"A COMFORTABLE START":"1 · YOUR TABLE"}</span>
        <h2>{interactive?"Ready when you are.":"Who are we cooking for?"}</h2>
        <p>{interactive?"Try a fictional table, or sign in to plan around your own people.":"A separate place for every person's preferences and needs."}</p>
        <div className="actions">
          <button
            className="button outline"
            disabled={busy}
            onClick={() => void sample()}
          >
            Try a fictional sample
          </button>
          <button
            className="text-button"
            disabled={busy}
            onClick={() => void reset()}
          >
            Reset sample / local draft
          </button>
        </div>
      </div>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <div hidden={interactive}>
      <details id="your-table" className="care-disclosure" open={profileOpen} onToggle={e=>setProfileOpen(e.currentTarget.open)}>
      <summary><span><strong>Your people, thoughtfully considered</strong><small>{household.members.length} {household.members.length === 1 ? "person" : "people"} · {household.label} · preferences & ingredients to avoid</small></span><span className="disclosure-hint">Review / edit</span></summary>
      <div className="split">
        <section className="panel">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!isAuthenticated) {
                setError(
                  "Sign in to save a profile, or load the fictional sample.",
                );
                return;
              }
              setBusy(true);
              try {
                const savedId = await save({
                  ...fields,
                  ...(id ? { id } : {}),
                });
                setId(savedId);
                setMessage("Household saved to your account.");
                setError("");
              } catch {
                setError(
                  "The profile could not be saved. Check member counts and use up to 12 favorites and exclusions per person.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <div className="form-grid">
              <label>
                Household name
                <input
                  required
                  maxLength={80}
                  value={household.label}
                  onChange={(e) =>
                    setHousehold((h) => ({ ...h, label: e.target.value }))
                  }
                />
              </label>
              <label>
                Profile type
                <select
                  value={household.mode}
                  onChange={(e) => mode(e.target.value as Household["mode"])}
                >
                  <option value="individual">Individual · one person</option>
                  <option value="partner">Partner · two people</option>
                  <option value="family">Family · your whole table</option>
                </select>
              </label>
            </div>
            {household.members.map((m, i) => (
              <section className="member-card" key={m.id}>
                <div className="section-heading">
                  <h3>Person {i + 1}</h3>
                  {household.mode === "family" &&
                    household.members.length > 2 && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                          setHousehold((h) => ({
                            ...h,
                            members: h.members.filter((x) => x.id !== m.id),
                          }))
                        }
                      >
                        Remove
                      </button>
                    )}
                </div>
                <div className="form-grid">
                  <label>
                    Name or label
                    <input
                      required
                      maxLength={80}
                      value={m.name}
                      onChange={(e) => patch(i, "name", e.target.value)}
                    />
                  </label>
                  <label>
                    Preparation preference
                    <select
                      value={m.texture}
                      onChange={(e) => patch(i, "texture", e.target.value)}
                    >
                      <option value="any">No texture preference</option>
                      <option value="soft">Soft preparation preferred</option>
                    </select>
                  </label>
                  <label className="full-width">
                    Favorite foods or cuisines
                    <input
                      value={m.favorites}
                      maxLength={500}
                      placeholder="Favorites, separated by commas"
                      onChange={(e) => patch(i, "favorites", e.target.value)}
                    />
                  </label>
                  <label className="full-width">
                    Disliked foods (preferences, not restrictions)
                    <input
                      maxLength={500}
                      value={m.dislikes}
                      onChange={(e) => patch(i, "dislikes", e.target.value)}
                      placeholder="Dislikes, separated by commas"
                    />
                  </label>
                  <label className="full-width">
                    Ingredients to avoid
                    <input
                      value={m.exclusions}
                      maxLength={500}
                      placeholder="Specific ingredients, separated by commas"
                      onChange={(e) => patch(i, "exclusions", e.target.value)}
                    />
                    <small>
                      No diagnoses or medication details are needed. Broad or
                      unsupported restrictions remain unverified.
                    </small>
                  </label>
                </div>
              </section>
            ))}
            {household.mode === "family" && household.members.length < 8 && (
              <button
                type="button"
                className="button outline"
                onClick={() =>
                  setHousehold((h) => ({
                    ...h,
                    members: [...h.members, member(h.members.length + 1)],
                  }))
                }
              >
                + Add a person
              </button>
            )}
            <div className="form-grid member-card">
              <label>
                Region (optional)
                <input
                  maxLength={80}
                  value={household.region}
                  placeholder="Your region"
                  onChange={(e) =>
                    setHousehold((h) => ({ ...h, region: e.target.value }))
                  }
                />
              </label>
              <label>
                Currency code
                <input
                  required
                  pattern="[A-Z]{3}"
                  maxLength={3}
                  value={household.currency}
                  placeholder="Your 3-letter code"
                  onChange={(e) =>
                    setHousehold((h) => ({
                      ...h,
                      currency: e.target.value.toUpperCase(),
                    }))
                  }
                />
              </label>
              <label>
                Measurement units
                <select
                  value={household.units}
                  onChange={(e) =>
                    setHousehold((h) => ({
                      ...h,
                      units: e.target.value as Household["units"],
                    }))
                  }
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </label>
            </div>
            <div className="actions">
              <button type="submit" disabled={busy} className="button">
                {busy ? "Saving…" : "Save household"} ↗
              </button>
              {id && (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    setId(undefined);
                    setHousehold((h) => ({
                      ...h,
                      label: `${h.label.slice(0, 70)} copy`,
                    }));
                  }}
                >
                  Save as new
                </button>
              )}
            </div>
            <p className="fine">
              Draft inputs stay in this browser until reset. Saved households
              are private to your account.
            </p>
          </form>
        </section>
        <aside className="panel">
          <span className="eyebrow">YOUR SAVED TABLES</span>
          <h2>Pick up where you left off.</h2>
          {!isAuthenticated ? (
            <>
              <p>Sign in to save profiles privately.</p>
              <Link className="button outline" href="/sign-in">
                Sign in
              </Link>
            </>
          ) : saved === undefined ? (
            <div className="skeleton sk-line" />
          ) : saved.length ? (
            <div className="saved-list">
              {saved.map((row) => (
                <article className="saved-item" key={row._id}>
                  <h3>{row.label}</h3>
                  <p>
                    {row.mode} · {row.members.length} people · revision{" "}
                    {row.revision}
                  </p>
                  <div className="actions">
                    <button
                      className="text-button"
                      onClick={() => {
                        setId(row._id);
                        setHousehold({
                          label: row.label,
                          mode: row.mode,
                          members: row.members.map((m) => ({
                            ...m,
                            favorites: m.favorites.join(", "),
                            exclusions: m.exclusions.join(", "),
                            dislikes: (m.dislikes || []).join(", "),
                          })),
                          region: row.region,
                          currency: row.currency,
                          units: row.units,
                        });
                        setMessage("Saved profile loaded.");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-button"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        try {
                          await remove({ id: row._id });
                          if (id === row._id) setId(undefined);
                        } catch {
                          setError("The profile could not be deleted.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No saved profiles yet.</p>
          )}
          <p className="fine">
            CareTable is a planning aid. Review ingredients and preparation with
            the relevant care plan; no medical or medication advice is provided.
          </p>
        </aside>
      </div>
      <OnboardingAssistant
        members={household.members}
        onApply={(index, s) =>
          setHousehold((h) => ({
            ...h,
            members: h.members.map((m, i) =>
              i === index
                ? {
                    ...m,
                    favorites: s.favorites.join(", "),
                    dislikes: s.dislikes.join(", "),
                    exclusions: [...new Set([...split(m.exclusions), ...s.exclusions])].join(", "),
                    texture: s.texture,
                  }
                : m,
            ),
          }))
        }
      />
      <div className="step-next"><p><span aria-hidden="true">♡</span> Every preference helps us make this table more yours.</p><button className="button" type="button" onClick={()=>{setProfileOpen(false);document.getElementById("plan-settings")?.scrollIntoView({block:"start"});document.getElementById("plan-settings")?.focus({preventScroll:true});}}>Next: plan your meals <span aria-hidden="true">→</span></button></div>
      </details>
      </div>
      <PlanStudio key={resetKey} household={fields} householdId={id} initialPlan={voicePlan || undefined} interactive={interactive} onResultChange={setPlanSnapshot} />
    </div>
  );
}
