# CareTable live voice

## Purpose and model

Caregivers can talk through meal requirements instead of entering every field, or discuss improvements to one saved meal. Both paths use **`gpt-live-1`**, the exact model used by the user's Convex Life Maxim project. CareTable's existing OpenAI key remains server-side in Convex. Text planning and reviewed handoff preparation retain `gpt-6-luna`; Qloo continues to supply taste evidence and deterministic checks remain authoritative.

## Reused foundation

Adapted from `D:\Agent Studio\Codex App\Hackathons\Convex Life Maxim\components\interactive-mode.tsx`, `convex/liveActions.ts`, and `convex/interactive.ts`: WebRTC offer/answer flow, `oai-events` channel, GPT-Live transcript events, caption grouping, canceled-start generation counter, mute/unmute, explicit stop, tab-hidden/idle termination, bounded session duration, account isolation, server hangup and uncertain-outcome locking. Life Maxim was inspected read-only; its credentials, database, research, billing and unrelated features were not copied or changed.

Current provider references: [GPT-Live guide](https://developers.openai.com/api/docs/guides/live), [session management](https://developers.openai.com/api/docs/guides/live-conversations). Source integration uses `POST /v1/live/sessions` with client delegation and server-side credentials, rather than a browser API key.

## Interactive Mode

The button appears near the beginning of the planner. Opening it does not activate the microphone. After signing in or loading the fictional sample, the user starts voice explicitly, discusses each member and the meal settings, then stops voice and prepares a review. Luna turns selected local captions and notes into a bounded proposed setup. Missing details are presented as questions. The user confirms the displayed setup before the existing Qloo/Luna generation pipeline starts. Existing member IDs and exclusions are preserved; removing existing people or changing restrictions requires the household controls. Returned plans appear in the normal planner/dashboard and saved history.

## Discuss with AI

The button lives on the meal feedback companion. It is available for a loaded, saved live plan. Context is fetched from the owned saved plan on the server for the selected day/slot; browser-supplied text cannot replace that context. Voice discusses that meal, then a reviewed, editable feedback request invokes the existing versioned revision pipeline. It cannot alter saved hard restrictions or silently revise unrelated slots. Guided typed chat remains available.

## Controls, privacy and limits

- Start voice, mute/unmute, stop, close, playback controls, live captions, remaining time, errors and server state.
- Microphone starts only on the user's button press/browser permission. Microphone is allowed for the same origin; camera and geolocation remain disabled.
- Maximum five minutes, one unclosed connection/account, one-minute cooldown, six starts/account/day and twelve starts/deployment/day (UTC counters). Reconnection consumes another allowance; muting still uses voice time. No automatic paid reconnect.
- Client stops when hidden or after 90 seconds without user transcript activity. Server schedules hangup at expiry and bounded hangup retries. Uncertain cleanup keeps the account locked rather than claiming billing has stopped.
- No raw audio or live captions are saved by CareTable. Captions/notes remain in component memory for the current page/meal context. Switching modes or closing the panel stops voice and keeps that draft; changing context or leaving the page clears it. Up to 600 fragments / 12,000 characters are used for a handoff, so review for omissions.
- A bounded context snapshot is stored for the server handoff and cleared after 24 hours following expiry. Connection metadata and confirmed plan/feedback persist. Sample reset clears snapshot context and requests hangup. OpenAI's processing policies still apply; `store:false` is requested.
- No clinical safety, actual texture, nutrition, local price or billed-usage claims. No voice tools execute arbitrary application actions; delegation asks for an on-screen reviewed handoff.

## Verification boundary — 23 October production audit

The CareTable key can access gpt-live-1, and actual browser session creation succeeds. Separate Chromium instances with synthetic audio input reproduce an ICE checking/connecting failure: the data channel does not open, no transcript arrives, and startup times out. Server cleanup is confirmed closed. This is a release blocker; the exact cause is not yet established.

Both review paths passed from typed clarification notes: Interactive Mode generated a saved plan, and Discuss with AI saved a meal revision. These are recovery/handoff tests, not successful spoken conversations. Mode switching preserves drafts while stopping voice; changing the profile/selected meal resets its voice context. Automated ownership, limits, canceled attachment, snapshot/expiry and exclusion tests pass. See [the full audit](PRODUCTION_READINESS.md).


## Current acceptance update — 26 October 2026

The earlier ICE blocker is no longer reproducible in the latest local Chromium sessions: both modes connect, show user and AI captions, and exchange audio packets. Discussion mute/unmute and explicit stop pass. Spoken setup plus a typed missing-region clarification generates a saved plan after review. These are synthetic-microphone local checks against development Convex; hosted voice and human device listening remain separate acceptance. See the dated continuation in [VERIFICATION.md](VERIFICATION.md). No credential-location or transport-code change was required.


## Meal Guide welcome and editable review — 26 October 2026

CareTable Meal Guide is the approved user-facing name for the planning layer. Technical model IDs remain unchanged. Spoken explanations name Qloo's related dining/taste signals alongside the Meal Guide's proposed meals and CareTable's saved-requirement checks. Qloo does not supply recipes, and no plan work is claimed before confirmation.

Each explicit Start voice sends one general Live commentary welcome cue after session.started. It requests a warm AI introduction, a short explanation of the reviewed workflow and one opening question. The cue is scoped to the active session and is not a user transcript or a backend tool call.

Review now includes currency, optional region/budget and preparation-time inputs. Missing currency, invalid values and unreviewed questions have visible explanations beside confirmation. A blank budget explicitly means no budget limit. Questions are displayed for human review and can be acknowledged after editing the proposal; they are not an opaque permanent block. Re-preparing resets that acknowledgement. Existing exclusions are still preserved by the normal handoff, and the authoritative request schema still validates confirmation. An unspecified optional budget or region alone no longer generates a mandatory clarification question.

Validation status: automated review-boundary regression, TypeScript, optimized build and development deployment pass. Both local welcome-first tests and the edited-review-to-saved-plan browser journey pass. The same welcome-first and edited-review checks also pass on the hosted production app; see VERIFICATION.md for exact evidence.
