"use client";
import { useEffect, useRef, useState } from "react";
import type { PlanResult } from "./domain/planning";
import { VoiceSession } from "./voice-session";
import type { Id } from "../../../convex/_generated/dataModel";

export type MealFeedback = {
  day: number;
  slot: "breakfast" | "lunch" | "dinner";
  reason: "not familiar" | "too difficult" | "try something similar" | "other";
  text: string;
};
type Message = { role: "you" | "caretable"; text: string };
export function PlanCompanion({ result, target, working, job, onApply, planId }: {
  planId?:Id<"mealPlans">;
  result: PlanResult | null;
  target: { day: number; slot: string } | null;
  working: boolean;
  job?: { id: string; status: string; error?: string };
  onApply: (feedback: MealFeedback) => Promise<string | null>;
}) {
  const [choice, setChoice] = useState("");
  const [voiceOpen,setVoiceOpen]=useState(false);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState<MealFeedback["reason"]>("other");
  const [messages, setMessages] = useState<Message[]>([]);
  const [waiting, setWaiting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pendingTarget = useRef<{day:number;slot:string}|null>(null);
  const waitingJob = useRef<string | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const meals = result?.meals.filter(m => m.recipe) || [];
  const selected = meals.find(m => `${m.day}:${m.slot}` === choice) || meals[0];
  const add = (text: string) => setMessages(m => [...m.slice(-29), {role:"caretable",text}]);
  useEffect(() => {
    if (target) {
      setChoice(`${target.day}:${target.slot}`);
      setNotes("");
      setDraft("");
      setMessages([{role:"caretable",text:`Let's improve day ${target.day}, ${target.slot}. What worked, and what would you change?`}]);
    }
  }, [target?.day, target?.slot]);
  useEffect(() => {
    if (!waiting || !job || job.id !== waitingJob.current || !["complete", "partial", "failed"].includes(job.status)) return;
    setWaiting(false);
    if (job.status === "failed") add(job.error || "The change could not finish. Your previous meal is preserved. You can adjust your request and try again.");
    else {
      const meal = result?.meals.find(m => m.day === pendingTarget.current?.day && m.slot === pendingTarget.current?.slot);
      add(meal?.recipe ? `Your revision is saved: ${meal.recipe.name} (${meal.recipe.minutes} estimated minutes). The saved restrictions were rechecked. What would you like to improve next?` : "A partial revision was saved, but this slot has no eligible meal. Review the planner's explanation; the requirements were not relaxed.");
      setNotes("");
      setReason("other");
    }
  }, [job?.id, job?.status, waiting, result]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, waiting]);
  const expected = result ? result.request.days * result.request.slots.length : 0;
  const filled = result ? new Set(meals.map(m=>`${m.day}:${m.slot}`)).size : 0;
  const checks = result?.meals.flatMap(m => m.checks.results) || [];
  const pass = checks.filter(c=>c.status === "pass").length;
  const fail = checks.filter(c=>c.status === "fail").length;
  const unknown = checks.filter(c=>c.status === "unknown").length;
  function send(text: string) {
    const value = text.trim();
    if (!value || !selected || working || waiting) return;
    setMessages(m=>[...m.slice(-29),{role:"you",text:value}]);
    setDraft("");
    if (/\b(stats|how many|coverage|checks)\b/i.test(value)) {
      add(`There are ${filled}/${expected} filled meal slots. Listed checks: ${pass} passed, ${fail} failed, ${unknown} unverified. Unknown checks still need review. What would you change about this meal?`);
      return;
    }
    const next = /\b(easier|quicker|faster|difficult|shorter|less time)\b/i.test(value) ? "too difficult" : /\b(familiar|unfamiliar)\b/i.test(value) ? "not familiar" : /\b(similar|like this)\b/i.test(value) ? "try something similar" : "other";
    if (next !== "other") setReason(next);
    setNotes(previous => (previous ? `${previous}\n${value}` : value).slice(-400));
    add(next === "too difficult"
      ? "I'll request a shorter estimated cooking time. Are there any flavours or ingredients you want to keep? Add another message, or apply the change below."
      : next === "not familiar"
        ? "I'll favour your saved familiar tastes. Which part felt unfamiliar? Add a detail, or apply the change below."
        : "I've added that to this meal's change request. Anything else to keep or change? When ready, apply the request below. Saved restrictions always stay in place.");
  }
  return <aside className="plan-companion" aria-label="Meal feedback">

    <section id="meal-improvements" tabIndex={-1} className="panel companion-chat" aria-labelledby="meal-chat-title">
      <span className="eyebrow">4 · REFLECT & IMPROVE</span><h3 id="meal-chat-title">A little better, together.</h3>
      <p className="fine">Guided conversation to shape a change. Luna selects a revised meal only when you apply it.</p>
      <div className="mode-switch" role="group" aria-label="Feedback mode">
        <button className="button outline" aria-pressed={!voiceOpen} onClick={()=>setVoiceOpen(false)}>Chat</button>
        <button className="button outline" aria-pressed={voiceOpen} disabled={!planId||!selected||working||waiting||result?.mode!=="live"} onClick={()=>setVoiceOpen(true)}>Discuss with AI</button>
      </div>
      <p className="fine">{voiceOpen?"Discuss this meal by voice. Your text draft is kept when you switch back to Chat.":"Type back and forth to shape a meal improvement. Switch to Discuss with AI for a live voice conversation."}</p>
      {planId&&selected&&<div hidden={!voiceOpen}><VoiceSession active={voiceOpen} key={`${planId}:${selected.day}:${selected.slot}`} mode="discussion" context="Selected saved meal" planId={planId} day={selected.day} slot={selected.slot} onClose={()=>setVoiceOpen(false)} onReviewed={async draft=>{
        pendingTarget.current={day:selected.day,slot:selected.slot};const id=await onApply({day:selected.day,slot:selected.slot as MealFeedback["slot"],reason:draft.reason,text:draft.feedback});if(!id)throw Error("Revision not saved");waitingJob.current=id;setWaiting(true);setMessages(m=>[...m,{role:"you",text:draft.feedback}]);setVoiceOpen(false);
      }}/></div>}
      {selected ? <>
        <label>Meal to discuss<select value={`${selected.day}:${selected.slot}`} disabled={working || waiting || submitting} onChange={e=>{setChoice(e.target.value);setNotes("");setMessages([]);setReason("other");}}>
          {meals.filter((m,i,a)=>a.findIndex(x=>x.day===m.day&&x.slot===m.slot)===i).map(m=><option key={`${m.day}:${m.slot}`} value={`${m.day}:${m.slot}`}>Day {m.day} · {m.slot}</option>)}
        </select></label>
        <p className="chat-context">Discussing <strong>{selected.recipe?.name}</strong></p>
        <div hidden={voiceOpen}>
        <div className="chat-log" role="log" aria-label="Meal conversation" aria-live="polite" aria-relevant="additions" tabIndex={0} ref={log}>
          <p className="chat-bubble caretable"><strong>CareTable</strong>How did this meal fit your table? Tell me what to improve. Your messages build one request for the selected meal.</p>
          {messages.map((m,i)=><p className={`chat-bubble ${m.role}`} key={i}><strong>{m.role === "you" ? "You" : "CareTable"}</strong>{m.text}</p>)}
          {waiting && <p role="status" className="chat-bubble caretable">Revising and rechecking your meal…</p>}
        </div>
        <div className="chat-quick-actions" aria-label="Suggested messages">{["Make it quicker", "Try something similar", "Show plan checks"].map(t=><button className="text-button" key={t} disabled={working||waiting} onClick={()=>send(t)}>{t}</button>)}</div>
        <form onSubmit={e=>{e.preventDefault();send(draft);}}>
          <label htmlFor="meal-chat-message">Your message</label>
          <textarea id="meal-chat-message" value={draft} onChange={e=>setDraft(e.target.value)} maxLength={400} rows={2} disabled={working||waiting} placeholder="We liked the flavours, but cooking took too long…" />
          <button className="button outline" disabled={!draft.trim()||working||waiting} type="submit">Send message ↑</button>
        </form>
        {notes && <div className="chat-request"><label>Change request (review or edit)<textarea maxLength={400} value={notes} onChange={e=>setNotes(e.target.value)} disabled={working||waiting} rows={3}/></label>
          <small>{notes.length}/400 characters · {reason}</small>
          <button className="button" disabled={!notes.trim()||working||waiting||submitting||result?.mode!=="live"} onClick={async()=>{
            setSubmitting(true);pendingTarget.current={day:selected.day,slot:selected.slot};
            try { const accepted=await onApply({day:selected.day,slot:selected.slot as MealFeedback["slot"],reason,text:notes});if(accepted){waitingJob.current=accepted;setWaiting(true);}else add("The request could not be saved. Your draft is kept; check the planner message and try again."); }
            finally {setSubmitting(false);}
          }}>Apply change & recheck ↗</button>
          {result?.mode!=="live"&&<p className="fine">Preview chat is a draft. Create a live plan to apply revisions.</p>}
        </div>}
        </div>
      </> : <p>Create or open a plan to start a meal conversation.</p>}
      <details><summary>Saved feedback</summary>{result?.feedback?.length ? result.feedback.map((f,i)=><p key={i}>Day {f.day} · {f.slot}: {f.reason}</p>) : <p>No saved revisions yet.</p>}</details>
      <p className="fine">Conversation drafts stay in this session. Applied feedback is saved with the plan. For new restrictions, edit the household and create a new plan.</p>
    </section>
  </aside>;
}
