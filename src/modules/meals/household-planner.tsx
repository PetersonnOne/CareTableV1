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
    <>
      <div className="page-heading">
        <span className="eyebrow">LET'S SET YOUR TABLE</span>
        <h1>Who are we cooking for?</h1>
        <p>A separate place for every person's preferences and needs.</p>
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
                    exclusions: s.exclusions.join(", "),
                    texture: s.texture,
                  }
                : m,
            ),
          }))
        }
      />
      <PlanStudio key={resetKey} household={fields} householdId={id} />
    </>
  );
}
