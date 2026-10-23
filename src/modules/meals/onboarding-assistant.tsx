"use client";
import { useAction, useConvexAuth } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
type Suggestion = {
  favorites: string[];
  dislikes: string[];
  exclusions: string[];
  texture: "any" | "soft";
  questions: string[];
  summary: string;
};
export function OnboardingAssistant({
  members,
  onApply,
}: {
  members: { id: string; name: string }[];
  onApply: (index: number, s: Suggestion) => void;
}) {
  const { isAuthenticated } = useConvexAuth();
  const interpret = useAction(api.onboarding.interpret);
  const [text, setText] = useState(""),
    [person, setPerson] = useState(0),
    [suggestion, setSuggestion] = useState<Suggestion | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const targetId = members[Math.min(person, members.length - 1)]?.id;
  const currentTarget = useRef(targetId);
  currentTarget.current = targetId;
  const [suggestionTarget, setSuggestionTarget] = useState("");
  useEffect(() => { setSuggestion(null); }, [targetId]);
  return (
    <section className="panel assistant-panel">
      <span className="eyebrow">START WITH A CONVERSATION</span>
      <h2>Tell us what feels like home.</h2>
      <p>
        Describe one person's favorites, dislikes, and ingredients to avoid. You
        can skip this and use the profile fields instead.
      </p>
      <label>
        Whose preferences?
        <select
          value={Math.min(person, members.length - 1)}
          onChange={(e) => {
            setPerson(Number(e.target.value));
            setSuggestion(null);
          }}
        >
          {members.map((m, i) => (
            <option key={i} value={i}>
              {m.name || `Person ${i + 1}`}
            </option>
          ))}
        </select>
      </label>
      <label>
        Your meal preferences
        <textarea
          maxLength={1600}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I enjoy Italian food and rice, dislike mushrooms, and need to avoid peanuts. I prefer soft meals."
        />
        <small>
          No diagnoses, medication lists, or other personal details are needed.
        </small>
      </label>
      <button
        className="button outline"
        disabled={busy || !text.trim() || !isAuthenticated}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const requestedTarget = targetId;
            const result = await interpret({ text });
            if (currentTarget.current === requestedTarget) {
              setSuggestion(result);
              setSuggestionTarget(requestedTarget || "");
            }
          } catch {
            setError(
              "The assistant could not interpret this request. Try again later or use the profile fields.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Listening…" : "Help organize these preferences"}
      </button>
      {!isAuthenticated && (
        <p className="fine">
          Sign in or load the fictional sample to use the assistant.
        </p>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {suggestion && suggestionTarget === targetId && (
        <section className="notice">
          <h3>Review before applying</h3>
          <p>{suggestion.summary}</p>
          <p>
            Favorites: {suggestion.favorites.join(", ") || "none stated"}
            <br />
            Dislikes: {suggestion.dislikes.join(", ") || "none stated"}
            <br />
            Avoid: {suggestion.exclusions.join(", ") || "none stated"}
            <br />
            Preparation: {suggestion.texture}
          </p>
          {suggestion.questions.length > 0 && (
            <>
              <strong>Still to clarify</strong>
              <ul>
                {suggestion.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <p>
                Answer these in your text and interpret again, or complete the
                profile manually. Ambiguous restrictions have not been applied.
              </p>
            </>
          )}
          <button
            className="button"
            disabled={suggestion.questions.length > 0}
            onClick={() => {
              onApply(Math.min(person, members.length - 1), suggestion);
              setSuggestion(null);
            }}
          >
            Apply reviewed preferences
          </button>
        </section>
      )}
    </section>
  );
}
