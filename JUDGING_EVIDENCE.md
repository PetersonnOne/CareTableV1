# CareTable judging evidence register

Updated 27 October 2026. Hosted voice/revision rehearsals and a captioned 2:19 final video are complete; CareTable submission story, Built With copy and branded artwork are prepared locally. No public upload or submission has been performed. This register is the claim authority for README highlights, presentation copy and walkthrough scripts. Dated earlier pause notes below are historical. Implemented behaviour, hosted checks and future work remain distinct.

The current [Qloo rules](https://qloo.devpost.com/rules) identify four equally weighted criteria: technological implementation, design, potential impact and idea quality. The [event brief](https://qloo.devpost.com/) emphasizes a meaningful difference from an LLM-only approach. This is our mapping to those criteria, not an organizer endorsement or judge score. The dated source review is retained in the local Git-ignored research folder.

## Existing advantages

| ID | Advantage and criterion | Current evidence | Boundary / next proof |
| --- | --- | --- | --- |
| CT-E01 | Cultural grounding that can affect selection — technology, idea | Final live nine-scenario Qloo-on/off evaluation: six top-three changes, 12 changed deterministic-control slots, eligible sets preserved and no failed hard checks. Both variants recognize authored cuisine mappings. Method and cases are retained locally; the evaluation script remains in `scripts/evaluate-qloo.mjs`. | Measures deterministic selection influence using live evidence; no generic-LLM or human preference superiority claim. Three pooled signals are now chosen round-robin across members. |
| CT-E02 | Per-person restrictions within a shared table — technology, impact | `src/modules/meals/domain/checks.mjs` and `planning.ts`; individual/partner/family test matrix and dated live family run. Independent portions when shared intersection is empty. | Needs/exclusions are per person; taste discovery is pooled. No universal fairness or safety certification. |
| CT-E03 | Selection constrained by deterministic checks — technology | Server-side eligible IDs, catalog checks and bounded repair; malformed-ID and restriction tests. Original catalog/data attribution in DATA_ATTRIBUTION.md. | Twenty-six prototype recipes; unverified preparation, pricing, nutrition and clinical suitability remain unknown. |
| CT-E04 | Targeted revision without losing the prior plan — technology, design | Dated live revision preserving 41 unrelated slots and restrictions; saved snapshot/revision tests; 27 October hosted recorded fish revision with read-back proving other meals and requirements unchanged. | Exact revision improvement must be shown for the chosen recorded run. No alternative can be an honest result. |
| CT-E05 | Explicit human review and approachable trial — design | Confirmation gates, anonymous fictional sample, reviewed onboarding application, numbered steps, mode bubbles, a proactive AI welcome and editable voice-review details with explicit confirmation. | Hosted real-provider recordings now cover both voice modes with prepared caregiver input, actual assistant audio, editable review and confirmation; user reported both modes working. No claim of effortless use for all older adults. |
| CT-E06 | Honest evidence and recoverable workflow — design, technology | Provider/source separation, visible unknowns, durable job expiry, bounded usage, saved-version recovery, explicit voice/review recovery and ownership checks. See PRODUCTION_READINESS.md. | Not tamper-proof clinical/compliance evidence. Hosted dated acceptance and final recorded journeys are documented in VERIFICATION.md. |
| CT-E07 | Care-specific product proposition — idea, potential impact | Implemented workflow follows caregiver meal-planning tasks; preferences, practical limits, review and feedback stay together. | The care benefit is a product hypothesis awaiting direct formative feedback. No measured health benefit, adoption, time saving or willingness-to-pay claim. |

Dated verification includes the 51-test regression pass, TypeScript/build and hosted Chromium journeys; the later 24-start policy change passed 12 targeted voice/recovery checks. The 27 October recorded revision has a saved-result read-back. Exact runs and scope are retained in VERIFICATION.md; no whole-suite rerun is claimed for submission-copy changes.

## Recommendation-to-evidence backlog

| ID | Next recommendation | Status | Evidence required before promotion to a completed advantage |
| --- | --- | --- | --- |
| CT-P01 | Representative Qloo-on/off comparison | Controlled live-evidence evaluation completed | Nine fixed scenarios, catalog/mapping hashes, retained first and revised runs, negative cases, ranking/plan outcomes and method linked above. Deterministic plan control deliberately avoids LLM randomness; repeated actual-LLM and human comparison studies are further work. |
| CT-P02 | Concise meal-level evidence receipt | Implemented; development browser journey passes | New saved meals preserve seed/connection provenance and before/after candidate ranks. Collapsible receipt explains app mapping and checks. No-match and unchanged rankings remain explicit. Historical plans without snapshots remain readable. |
| CT-P03 | Dependable hosted judge journey | Hosted updated app delivered and core journey verified 26 October | GitHub main push automatically deployed the updated app to Vercel. Public-alias Chromium generation, receipt, refresh, mobile and reset pass with zero page errors. Earlier local revision evidence remains separate; hosted voice retains its own gate; the verified production owner has been provisioned. |
| CT-P05 | Targeted cultural variety and mapping coverage | Six recipes and reviewed mapping coverage completed | Catalog expands from 20 to 26; Italian/Chinese/Indian/Thai/Mexican/West African-inspired additions, exact reviewed provider-tag mappings, soy-exclusion test and round-robin household signals. Longer plans can still repeat; physical preparation and human familiarity remain to be reviewed. |
| CT-P06 | Memorable evidence-backed improvement story | Hosted R2 journey recorded; captioned 2:19 final master exported | Saved fish revision read-back confirms requirements and other slots unchanged. Actual assistant excerpts, Sarah narration, subtitles and production manifests retained locally. Public upload/submission remains separate. |

## How future work updates the presentation

Public-facing copy should lead with demonstrated capabilities and the value they deliver. Use **What's next** for future work; do not attach a limitation column to every advantage or create a weakness-focused presentation slide. Keep detailed QA, source boundaries and release findings in their supporting records. Describe a claim precisely enough to stand on its own, and never promote unfinished work to a completed capability.

For every completed recommendation or material fix:

1. Record the build/date, evidence file or reproducible command, observed result, failure/unknown cases and remaining limitations here and in VERIFICATION.md as appropriate.
2. Move only the supported part from planned to verified. Keep historical evidence and avoid silently replacing old results.
3. Update README's advantage table when the change alters the public claim. Keep the hosted/local distinction explicit.
4. Update local `Submission Video Workspace/PRESENTATION_MESSAGE_MAP.md`, `CLAIM_TO_SHOT_MATRIX.csv`, storyboard and narration. These stay Git-ignored. Do not start recording or paid generation merely because a script changed.
6. Before publication, check claims against the actual final build and obtain any necessary quote/identity permission. Competitive improvements resumed on 26 October; video rehearsal stays paused. Caregiver review is outside the agreed release scope.


26 October voice evidence: local Chromium now connects both GPT Live modes with two-sided captions and audio transport; reviewed spoken setup plus region clarification saves a plan. Discussion voice plus explicit typed revision notes saves a meal revision. Mute/unmute and stop pass; zero page errors in the completed journey. Hosted signup/reset passed on the existing deployment. Exact latest-source hosting remains pending a successful GitHub push; owner signup remains required. These updates supersede the earlier local ICE-blocked status without claiming a confirmed historical root cause.


26 October scope decision: the proposed family caregiver review has been removed from the active project requirements, release gates and presentation plan. It is not a production blocker. No review or testimonial is claimed.


26 October delivery update: production commit a8a80a6 passed hosted core acceptance after the normal GitHub main integration rebuilt Vercel. See VERIFICATION.md for exact observed checks. Family review is removed from the release scope.


26 October account UX validation: the authentication refresh/navigation race is fixed locally; Chromium records zero Leave site dialogs across filled-form exits, signup/verification, existing-account sign-in and recovery. Production owner setup is complete for the verified intended account. See VERIFICATION.md for method and deployment status.


Hosted follow-up: production signup/verification and fresh-session existing-account navigation both passed with zero browser Leave site dialogs on the deployed fix. A combined test sign-out/re-login race is retained in VERIFICATION.md rather than omitted. Intended production owner provisioning is complete.


Meal Guide update: local silent-microphone Chromium sessions in both modes speak first, explain Qloo's contribution and use the approved product name. Missing-currency review is recoverable through inline edits and explicit question review, followed by a saved plan; negative budget/time validation remains enforced. 48/48 regressions pass. Hosted acceptance follows deployment; no new recording was produced.


Hosted follow-up: both Meal Guide welcomes speak first and name Qloo with a silent microphone; editable missing-currency review leads to a saved plan on production. Negative budget/time are blocked; zero browser page errors. See VERIFICATION.md for the exact synthetic-input test boundary.


Voice recovery update: 51/51 regressions, TypeScript and optimized build pass. Both voice UIs pass simulated Chromium interruption/retry/reconnect scenarios with captured text retained and no automatic paid retry. Mocked-transport QA is explicitly separate from live-provider evidence and the user's reported successful hosted fish revision. No guarantee of uninterrupted networking is claimed.


Hosted recovery follow-up: one real voice session plus controlled client interruption/review rejection passed captured-text recovery, explicit retry without another voice start, confirmation and saved plan generation; server cleanup confirmed and zero page errors. Both modes separately passed mocked-transport recovery scenarios. Fault injection is labelled and is not evidence of a naturally occurring provider outage.


Documentation update: a local, Git-ignored GPT Live 1 handover preserves separate mode guides, shared recovery lessons and credential-free source snapshots. It is an engineering reuse artifact, not an additional independently tested product feature. Current deployment versus final sign-off is consolidated at the top of PRODUCTION_READINESS.md. Demo rehearsal remains paused.


## Owner acceptance and voice-policy clarification — 27 October 2026

The owner reports successful production admin login and satisfactory Administration screens; record this as user acceptance, closing the outstanding owner UI check. The owner approves the existing five-minute per-session duration after their demo. Both Interactive Mode and Discuss with AI already show the five-minute maximum before starting (src/modules/meals/voice-session.tsx). Session duration is separate from six starts/account/day and twelve shared starts/deployment/day plus cooldown; these quotas remain unchanged. Wider-audience usage/quota planning is an operating decision, not evidence of a broken core flow. No new automated or hosted test was run for this documentation update. Remaining project deliverables are the paused walkthrough rehearsal/final demo and submission materials, including the source-publication decision.


## Shared judging voice allowance - 27 October 2026

Owner-authorized change: shared voice starts increase from 12 to 24 per deployment per UTC day across Interactive Mode and Discuss with AI. Six starts per account/day, five-minute sessions, cooldown, cleanup and explicit review remain unchanged. Existing daily counts are preserved; no reset or paid provider session is needed. Both voice entry points display 24 shared/day. Boundary coverage checks the 24th start succeeds and a different account's next start is rejected without consuming its account quota. Hosted delivery follows GitHub main through the Vercel/Convex build; record the delivery result separately. Demo rehearsal, recording and generation remain paused.


## Audio-first storytelling rehearsal - 27 October 2026

The user authorized an under-three-minute audio-only walkthrough before visuals. Reusable doctrine and CareTable-specific voice decisions are saved in the ignored Submission Video Workspace/doctrine folder. Draft 1 has 311 spoken words: emotional hook, manual User Mode, inspectable Qloo affinity/mapping/ranking path, Interactive Mode, text Chat and Discuss with AI, reviewed saved change, benefit-led close and explicit thanks to Qloo. Sarah narrates through OpenRouter ElevenLabs v4; Will portrays the caregiver; Alice stands in for the assistant in this scripted planning audio only. The application retains Tango. Audio planning is not new live feature acceptance or footage, and does not authorize video recording/publication. Generation and measured runtime are recorded with the artifact; human listening review follows.


## Rehearsal authorization and sound decision - 27 October 2026

The user approved the voice-only narration and rejected the instrumental because it masks warmth and emotional delivery. Use the clean voice master with no music. Preserve the instrumental audition as an unused option, not an approved soundtrack. The user now authorizes rehearsals. Capture User Mode first with a visible pointer, deliberate clicks and live typing, then Interactive Mode, Chat and Discuss with AI, following the approved story. Rehearsal recording and the necessary real application/provider interactions are in scope; final publication remains unrequested. Keep scripted audio planning separate from exact real-run responses in the production records.


## Live rehearsal R2 - 27 October 2026

A complete hosted Chromium capture passed manual live planning, Qloo provenance/meal receipt, both real GPT Live speech paths, reviewed setup confirmation and saved discussion revision, with zero page errors. The 45-minute scenario resulted in Poached fish with potato (35 minutes), replacing the selected meal. Separate actual assistant audio and exact transcript/event records were captured. Sarah narration remains the approved original; only the caregiver's time allowance was regenerated. No music. R1's incompatible 30-minute fish request remains documented rather than being promoted as a fulfilled request. The review workprint uses editorial excerpts and omitted waits; it is not a claim of real-time three-minute end-to-end processing. Final watch/listen approval and submission remain separate. No app source changed during rehearsal.

R2 saved-result read-back passed: final status complete; fish-potato saved at 35 minutes within maxMinutes 45; non-target meals exactly unchanged; original plan requirements exactly preserved. Verification used the rehearsal guest identity and read-only Convex queries, with no provider-generation calls. Evidence is in the R2 saved-result-verification.json.


## Live-voice edit repair - 27 October 2026

The user approved the R2 visual rehearsal but reported glitches in GPT Live audio. Audio-file word alignment confirms incorrect cuts in four assistant clips: truncated words and a discussion cut drawn from a later sentence. The prior constant-offset session-timeline calibration was insufficient. Source originals, approved narration and visual streams are preserved. Repair uses original real assistant recordings, recorded-file word boundaries, quiet margins and short edge ramps; no replacement voice or new live session is required. Two OpenRouter ElevenLabs Scribe alignment requests were used. No app runtime code changed. Do not call this a diagnosed network failure or audible repair acceptance before the user listens. Cross-project lesson is saved under GPT Live 1/09_RECORDING_AND_EDITING_TIMELINES.md.


## Final captioned cut - 27 October 2026

The user accepted the remaining minor voice artifact and authorized the final content with bottom subtitles. No apology or unconfirmed connectivity attribution is added. The approved repaired soundtrack is retained; no music or new live sessions. Full-track word alignment yields 337 words and 49 non-overlapping English cues, at most two lines, with CareTable/Caregiver conversation labels and corrected Qloo/CareTable spellings. A separate bottom band keeps captions off the interface controls. Final 1080p render and sidecar SRT/VTT plus editable cues are prepared in the ignored Submission Video Workspace/final folder. Record encoded checks after rendering. Public upload/submission is not part of this authorization.

Final captioned master completed: 138.916667 seconds, 1920x1080 H.264/24fps with the approved AAC audio stream preserved bit-for-bit. Full video decode, complete 337-word/49-cue coverage, non-overlap and maximum-two-line checks passed. Representative caption and dialogue/end frames inspected; controls remain above the subtitle band. English SRT/VTT, editable ASS/JSON/CSV and transcript included in the verified ten-file Video Package ZIP; archive CRC and master-video byte match passed. Final human watch approval and public publication/submission remain separate.


## CareTable submission story and artwork - 27 October 2026

Created the Git-ignored Submit Projects folder with project name/pitch, links, the seven-section story, 20 Built With tags grouped by actual role, a matching landscape thumbnail and portrait poster. Qloo is foregrounded through seed/connection/mapping/ranking receipts and the controlled nine-scenario result. Original CareTable branding and a new caregiver/aunt promotional scene are used; the supplied Tonight Together assets inform structure/tone only. The story makes no endorsement or clinical-results claim and does not reinstate a niece review requirement. Runtime AI and media-production technologies remain separate. Artwork prompts, sources, dimensions, hashes and local-link checks are retained in Production Notes. No artwork publication, repository-visibility change or submission is performed.
