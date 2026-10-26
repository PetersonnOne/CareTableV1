"use client";
// Adapted from Convex Life Maxim/components/interactive-mode.tsx: WebRTC lifecycle,
// captions, generation cancellation, visibility/idle timeout, mute and server stop.
import { useEffect, useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { LIVE_MODEL, voiceDraftSchema, voiceReviewIssues, voiceWelcome, type VoiceDraft } from "./domain/voice-contracts";
type Fragment = {id:string;speaker:"You"|"CareTable";text:string;start:number;end:number};
function captions(fragments:Fragment[]) {
  const rows:Fragment[]=[];
  for(const f of fragments){const last=rows.at(-1);if(last&&last.speaker===f.speaker&&f.start-last.end<1500){last.text+=f.text;last.end=Math.max(last.end,f.end);}else rows.push({...f});}
  return rows;
}
export function VoiceSession({mode,context,planId,day,slot,onReviewed,onClose,active=true}: {
  mode:"interactive"|"discussion"; context:string; planId?:Id<"mealPlans">; day?:number;slot?:string;
  onReviewed:(draft:VoiceDraft)=>Promise<void>;onClose:()=>void;
  active?:boolean;
}) {
  const startVoice=useAction(api.voiceActions.start),prepare=useAction(api.voiceActions.prepare),stopVoice=useMutation(api.voice.stop);
  const [connectionId,setConnectionId]=useState<Id<"voiceConnections">|null>(null);
  const voice=useQuery(api.voice.state,connectionId?{id:connectionId}:"skip");
  const idRef=useRef<Id<"voiceConnections">|null>(null);
  const [status,setStatus]=useState("Voice is off"),[busy,setBusy]=useState(false),[connected,setConnected]=useState(false),[muted,setMuted]=useState(false),[error,setError]=useState("");
  const [remaining,setRemaining]=useState(300),[fragments,setFragments]=useState<Fragment[]>([]),[notes,setNotes]=useState("");
  const [draft,setDraft]=useState<VoiceDraft|null>(null),[working,setWorking]=useState(false);
  const [questionsReviewed,setQuestionsReviewed]=useState(false);
  const peer=useRef<RTCPeerConnection|null>(null),channel=useRef<RTCDataChannel|null>(null),media=useRef<MediaStream|null>(null),audio=useRef<HTMLAudioElement|null>(null);
  const epoch=useRef(0),mounted=useRef(true),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),seen=useRef(new Set<string>()),latestInput=useRef(0),expiry=useRef(0),connecting=useRef(false);
  function cleanup(){clearTimeout(timer.current);media.current?.getTracks().forEach(t=>t.stop());media.current=null;channel.current?.close();channel.current=null;peer.current?.close();peer.current=null;if(audio.current)audio.current.srcObject=null;connecting.current=false;}
  async function stop(){epoch.current++;setBusy(false);setConnected(false);setMuted(false);connecting.current=false;media.current?.getTracks().forEach(t=>t.stop());media.current=null;if(channel.current?.readyState==="open")channel.current.send(JSON.stringify({type:"session.close"}));const closing=peer.current;clearTimeout(timer.current);timer.current=setTimeout(()=>{if(peer.current===closing)cleanup();},3000);setStatus("Microphone off · cleanup requested");if(idRef.current)try{await stopVoice({id:idRef.current});}catch{if(mounted.current)setError("Server hangup could not be confirmed. Cleanup is scheduled; do not reconnect until the server closes this session.");}}
  const stopRef=useRef(stop);useEffect(()=>{stopRef.current=stop;});
  useEffect(()=>{if(!active&&(connecting.current||media.current||connected))void stopRef.current();},[active,connected]);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;epoch.current++;cleanup();if(idRef.current)void stopVoice({id:idRef.current}).catch(()=>{});};},[stopVoice]);
  useEffect(()=>{if(voice&&["closed","uncertain"].includes(voice.status)&&(connected||busy))void stopRef.current();},[voice?.status,connected,busy]);
  useEffect(()=>{if(!connected)return;const interval=setInterval(()=>{const left=Math.max(0,Math.ceil((expiry.current-Date.now())/1000));setRemaining(left);if(!left||Date.now()-latestInput.current>90000)void stopRef.current();},1000);const hidden=()=>{if(document.hidden)void stopRef.current();};document.addEventListener("visibilitychange",hidden);hidden();return()=>{clearInterval(interval);document.removeEventListener("visibilitychange",hidden);};},[connected]);
  async function start(){
    if(!active||connecting.current||connected||(voice&&voice.status!=="closed"))return;
    cleanup();connecting.current=true;const generation=++epoch.current;setBusy(true);setError("");setStatus("Requesting microphone…");setFragments([]);setDraft(null);seen.current.clear();setMuted(false);
    try{
      if(!navigator.mediaDevices?.getUserMedia||!window.RTCPeerConnection)throw Error("Unsupported browser");
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(generation!==epoch.current||document.hidden){stream.getTracks().forEach(t=>t.stop());if(mounted.current){setBusy(false);connecting.current=false;}return;}
      media.current=stream;const pc=new RTCPeerConnection();peer.current=pc;
      pc.ontrack=e=>{if(generation===epoch.current&&audio.current){audio.current.srcObject=new MediaStream([e.track]);void audio.current.play().catch(()=>setStatus("Press play to hear the AI."));}};
      stream.getTracks().forEach(t=>pc.addTrack(t,stream));const dc=pc.createDataChannel("oai-events");channel.current=dc;
      dc.onmessage=e=>{
        if(dc!==channel.current)return;let data;try{data=JSON.parse(String(e.data));}catch{return;}
        if(data.type==="session.closed"){cleanup();if(mounted.current){setConnected(false);setBusy(false);setStatus("Voice ended.");}if(idRef.current)void stopVoice({id:idRef.current}).catch(()=>{});return;}
        if(generation!==epoch.current)return;
        if(data.type==="session.started"){clearTimeout(timer.current);connecting.current=false;setBusy(false);setConnected(true);setStatus("Listening · AI voice");latestInput.current=Date.now();if(!seen.current.has("caretable-welcome")){seen.current.add("caretable-welcome");dc.send(JSON.stringify({type:"session.commentary.append",event_id:crypto.randomUUID(),delegation_id:null,content:voiceWelcome(mode)}));}}
        if(data.type==="session.delegation.created"&&typeof data.delegation?.id==="string"&&!seen.current.has(data.delegation.id)){seen.current.add(data.delegation.id);dc.send(JSON.stringify({type:"session.commentary.append",event_id:crypto.randomUUID(),delegation_id:data.delegation.id,content:"No application changes have run. Ask the user to Stop voice & prepare review, then confirm the on-screen handoff. After confirmation, Qloo supplies related taste signals, CareTable Meal Guide proposes the meals, and CareTable checks the saved requirements."}));}
        if(["session.input_transcript.delta","session.output_transcript.delta"].includes(data.type)&&typeof data.delta==="string"&&typeof data.event_id==="string"&&Number.isFinite(data.start_ms)&&Number.isFinite(data.end_ms)&&!seen.current.has(data.event_id)){
          seen.current.add(data.event_id);if(data.type==="session.input_transcript.delta")latestInput.current=Date.now();
          const f:Fragment={id:data.event_id,speaker:data.type==="session.input_transcript.delta"?"You":"CareTable",text:data.delta.slice(0,2000),start:data.start_ms,end:data.end_ms};setFragments(c=>[...c,f].sort((a,b)=>a.start-b.start).slice(-600));
        }
        if(data.type==="error")setError("A voice command was rejected. Stop voice if the conversation cannot continue.");
      };
      pc.onconnectionstatechange=()=>{if(pc.connectionState==="failed"){setError("Voice connection lost. Reconnect explicitly when ready.");void stopRef.current();}};
      dc.onclose=()=>{if(generation===epoch.current&&mounted.current){cleanup();setConnected(false);setBusy(false);setStatus("Voice disconnected.");if(idRef.current)void stopVoice({id:idRef.current}).catch(()=>{});}};
      await pc.setLocalDescription(await pc.createOffer());
      if(pc.iceGatheringState!=="complete")await new Promise<void>((resolve,reject)=>{const timeout=setTimeout(()=>{pc.removeEventListener("icegatheringstatechange",check);reject(Error("Network setup timed out"));},10000);function check(){if(pc.iceGatheringState==="complete"){clearTimeout(timeout);pc.removeEventListener("icegatheringstatechange",check);resolve();}}pc.addEventListener("icegatheringstatechange",check);check();});
      if(generation!==epoch.current)return;
      if(document.hidden){await stop();return;}
      setStatus("Connecting securely…");
      const result=await startVoice({mode,context,requestId:crypto.randomUUID(),sdp:pc.localDescription?.sdp||"",...(planId?{planId}:{}),...(day?{day}:{}),...(slot?{slot}:{})});
      if(generation!==epoch.current){await stopVoice({id:result.id});return;}
      idRef.current=result.id;
      if(document.hidden){await stop();return;}
      setConnectionId(result.id);expiry.current=result.expiresAt;setRemaining(Math.max(0,Math.ceil((result.expiresAt-Date.now())/1000)));
      await pc.setRemoteDescription({type:"answer",sdp:result.sdp});
      if(connecting.current)timer.current=setTimeout(()=>{setError("Voice did not become ready. No automatic retry was made.");void stopRef.current();},15000);
    }catch(e){if(generation!==epoch.current)return;cleanup();if(mounted.current){setBusy(false);setConnected(false);setStatus("Voice is off");setError(e instanceof ConvexError&&typeof e.data==="string"?e.data:e instanceof DOMException&&e.name==="NotAllowedError"?"Microphone permission was denied. You can continue using text.":"Could not connect voice. Check browser support, network and API access; no automatic paid retry was made.");}if(idRef.current)void stopVoice({id:idRef.current}).catch(()=>{});}
  }
  async function review(){if(!idRef.current)return;await stop();setWorking(true);setError("");setQuestionsReviewed(false);try{const text=(fragments.map(f=>`${f.speaker}: ${f.text}`).join("\n")+"\nUser notes: "+notes).slice(-12000);setDraft(voiceDraftSchema.parse(JSON.parse(await prepare({id:idRef.current,transcript:text}))));}catch(e){setError(e instanceof ConvexError&&typeof e.data==="string"?e.data:"Review preparation failed. Your local conversation notes remain.");}finally{setWorking(false);}}
  const reviewIssues=draft?(mode==="interactive"?voiceReviewIssues(draft,questionsReviewed):[...(!draft.feedback.trim()?["Describe the meal change you want."]:[]),...(draft.questions.length&&!questionsReviewed?["Confirm that you have reviewed the open questions below."]:[])]):[];
  return <section className="panel voice-session" aria-label={mode==="interactive"?"Interactive Mode":"Discuss with AI"}>
    <div className="voice-heading"><h3>{mode==="interactive"?"Interactive Mode":"Discuss with AI"}</h3><button className="text-button" disabled={working} onClick={async()=>{await stop();onClose();}}>Close ×</button></div>
    <p>{mode==="interactive"?"Talk through your household needs and meal settings. Review the setup before creating a plan.":"Talk about this selected meal. Review your proposed improvement before applying it."}</p>
    <p className="fine">AI-generated voice · {LIVE_MODEL}. Start voice shares microphone audio and the displayed food/plan context with OpenAI. CareTable does not save raw audio or live captions. A bounded context snapshot is kept for handoff and cleared after 24 hours; connection metadata and reviewed plan inputs/feedback are saved. Provider policies apply.</p>
    <p role="status"><strong>{status}</strong> {connected&&`· ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")} left`}</p>
    <div className="actions"><button className="button" disabled={busy||connected||working||Boolean(voice&&voice.status!=="closed")} onClick={()=>void start()}>{busy?"Connecting…":"Start voice"}</button>
      <button className="button outline" disabled={!connected} onClick={()=>{const next=!muted;media.current?.getTracks().forEach(t=>{t.enabled=!next;});if(channel.current?.readyState==="open")channel.current.send(JSON.stringify({type:next?"session.input_audio.mute":"session.input_audio.unmute",event_id:crypto.randomUUID()}));setMuted(next);}}>{muted?"Unmute":"Mute"}</button>
      <button className="button outline" disabled={!connected&&!busy} onClick={()=>void stop()}>Stop voice</button></div>
    <audio ref={audio} autoPlay controls aria-label="CareTable AI voice playback" />
    <p className="fine">Five-minute maximum; six starts per account/day, twelve shared/day. Mute still uses time. Voice stops when the tab is hidden or after 90 seconds without user transcript activity. Server: {voice?.status||"not started"}. Billed usage is not measured here.</p>
    <div className="voice-captions" role="log" aria-label="Live conversation captions" aria-live="polite" tabIndex={0}>{captions(fragments).map(f=><p key={f.id}><strong>{f.speaker}</strong> {f.text}</p>)}{!fragments.length&&<p>Your live captions will appear here.</p>}</div>
    <label>Extra notes for the review<textarea rows={2} maxLength={6000} value={notes} onChange={e=>setNotes(e.target.value)}/></label>
    <button className="button outline" disabled={!connectionId||working||(!fragments.length&&!notes.trim())} onClick={()=>void review()}>{working?"Preparing…":"Stop voice & prepare review"}</button>
    {error&&<p role="alert" className="alert">{error}</p>}
    {draft&&<div className="voice-review"><h4>Review before applying</h4><p className="fine">Conversation summary — your edited values below take precedence.</p><p>{draft.summary}</p><p className="fine">After you confirm, Qloo connects your preferences with related tastes, CareTable Meal Guide proposes meals using those signals, and CareTable checks your saved requirements.</p>{draft.questions.length>0&&<div className="notice"><strong>Open questions to review</strong><ul>{draft.questions.map((q,i)=><li key={i}>{q}</li>)}</ul><p>Edit the details below, or add more conversation notes and prepare the review again.</p><label className="checkbox"><input type="checkbox" disabled={working} checked={questionsReviewed} onChange={e=>setQuestionsReviewed(e.target.checked)}/>I have reviewed these questions and checked the proposed details.</label></div>}
      {mode==="interactive"&&<fieldset disabled={working}><legend>Complete your plan details</legend><p className="fine">These are proposals, not saved changes. Currency is required; a budget limit and region are optional. Edit any proposed defaults before confirming.</p><label>Currency code<input value={draft.currency} placeholder="For example NGN, USD or GBP" maxLength={3} autoCapitalize="characters" onChange={e=>setDraft({...draft,currency:e.target.value.trim().toUpperCase()})}/></label><label>Region (optional)<input value={draft.region} maxLength={80} onChange={e=>setDraft({...draft,region:e.target.value})}/></label><label>Budget limit (optional)<input type="number" min="0.01" max="10000000" step="any" value={draft.budget??""} placeholder="Leave empty for no budget limit" onChange={e=>setDraft({...draft,budget:e.target.value===""?null:Number(e.target.value)})}/></label><p className="fine">An empty budget means no budget limit. It does not mean meals are free or prices are verified.</p><label>Maximum preparation minutes<input type="number" min={10} max={180} step={1} value={draft.maxMinutes} onChange={e=>setDraft({...draft,maxMinutes:Number(e.target.value)})}/></label></fieldset>}
      {mode==="interactive"?<><ul>{draft.members.map((m,i)=><li key={i}><strong>Person {i+1}:</strong> favourites: {m.favorites.join(", ")||"not specified"}; dislikes: {m.dislikes.join(", ")||"none stated"}; avoid: {m.exclusions.join(", ")||"none stated"}; texture: {m.texture}.</li>)}</ul><p>{draft.days} days · {draft.slots.join(", ")} · {draft.maxMinutes} min · {draft.currency||"currency missing"} · {draft.units} · equipment: {draft.equipment.join(", ")||"none"} · budget: {draft.budget??"no limit"} · region: {draft.region||"not set"}</p><p className="fine">Existing household exclusions remain in place even if omitted here. To change a restriction, edit the household fields directly. Every existing person must remain in the review.</p></>:<label>Meal improvement request<textarea value={draft.feedback} maxLength={400} onChange={e=>setDraft({...draft,feedback:e.target.value})}/></label>}
      {reviewIssues.length>0&&<div role="status" className="notice"><strong>Before you can confirm</strong><ul>{reviewIssues.map(issue=><li key={issue}>{issue}</li>)}</ul></div>}
      <button className="button" disabled={working||reviewIssues.length>0} onClick={async()=>{setWorking(true);setError("");try{await onReviewed(draft);}catch{setError("The handoff could not be applied. Review the settings and try again; your notes are kept.");}finally{setWorking(false);}}}>{mode==="interactive"?"Confirm setup & generate plan":"Confirm & apply meal change"}</button>
    </div>}
  </section>;
}
