# CareTable verification record

Recorded 22 October 2026. This file reports observed results, not a production-readiness certification. The original PRD's creation-time statements are historical; this record provides current implementation status.

## Live integration evidence

- Convex development project `caretable`, team `joseph-petersonn`, deployment `outstanding-crocodile-717`: schema, generated API, password/anonymous providers, signing keys, Qloo/OpenAI server configuration, and application functions deployed successfully.
- Real browser: fictional older-adult sample → confirmed inputs → live Qloo + GPT-6 Luna → saved 3-day dinner plan, 3/3 slots filled. Qloo resolved Italian and returned Mediterranean Italian, Italian American, French-Italian, and Japanese-Italian dining affinities. Rice remained visibly unresolved. The selected tomato pasta showed its Mediterranean Italian mapping separately from provider evidence.
- Real browser revision: day-one pasta replaced by tomato rice, 3/3 slots retained, original version preserved. Saved exclusions came from the server's original request. Summary did not claim physical texture or cross-contact verification.
- Real conversational onboarding: Italian food/rice, mushrooms disliked, peanuts avoided, soft preparation → separate proposed fields and explicit review/apply step.
- Real 14-day request with breakfast/lunch/dinner: **42/42 slots filled**, persisted as complete; aggregate suitability remained unresolved because actual texture was unverified. Day 14 opened in the mobile browser.
- Mobile planner measured at viewport width 390: document width 375, no horizontal overflow. Screenshot inspected: day buttons wrap, check status uses text, meal details/feedback remain reachable.
- Production browser: saved a partner profile with peanuts excluded for one person and wheat for the other, then generated a live 7-day dinner plan. All 7 slots named both recipients; no failed check was present. Qloo resolved Italian/Chinese and returned Asian affinity, visibly mapped to carrot-and-ginger rice.
- Refresh recovered the saved 14-day plan and personal Midnight theme. Fresh production browser console reported zero errors/warnings.
- Production build passed (Next.js 16.4.2); root typecheck passed. Post-build tests: 22/22 passed. Exact-value scan found no configured private credentials in public source candidates or browser assets. Local environment, archive, private inputs, and retrospective ignore rules verified.
- Resend key accepted by its read-only domains endpoint (HTTP 200); zero verified sending domains returned. `RESEND_FROM` remains absent, so delivery/signup/recovery are still blocked.
- Qloo discovery probes resolved Italian, Nigerian, and Chinese dining/cuisine tags. Same-name music tags were deliberately excluded.
- Production family setup/preview showed three distinct members and all three meal recipients. Reset cleared the draft, signed out, and removed all sample plans/households (confirmed through a bounded database query).
- Final CSS rebuild passed. In the production browser a single desktop meal card now fills its 768.5px results column. Guest administration correctly requests an authorized sign-in. No live email or authenticated staff UI verification is implied.

No measured claim about improved human preference, clinical outcomes, coverage in every country, large-scale reliability, or per-plan commercial cost follows from these runs.

## Cloud deployment and email continuation

- Source pushed to [CareTableV1](https://github.com/PetersonnOne/CareTableV1). GitHub owner UI confirms the repository is currently **private**; changing it to public is awaiting the user's choice. The website is public. Vercel's `caretable-v1` project is connected to GitHub `main`. Its first automatic deployment cloned commit `2d9b15a`, ran the production Next.js/Convex pipeline, and reached Ready at [caretable-v1.vercel.app](https://caretable-v1.vercel.app).
- Production uses Convex `artful-raven-948`; development and previews use `outstanding-crocodile-717`. Production credentials/signing keys are separate. The Vercel production deploy key is stored as a protected secret. Upload ignore rules exclude local environments, archives, private files, and the retrospective.
- Hosted browser initially found an invalid JWKS response caused by escaped JSON in production environment setup. Corrected serialization and reapplied it without rotating signing keys. Public discovery/JWKS endpoints now parse correctly; hosted anonymous sign-in and a live three-day Qloo + Luna plan succeeded.
- Hosted “Too difficult” feedback exposed selection of a slower meal. The corrected pipeline enforces a strictly shorter estimate and preserves the original when no quicker eligible option exists. Two regression tests cover successful repair of a slower model choice and no-match preservation. Commit `cb5ec2a` automatically deployed and reached Ready; its hosted revision replaced a 30-minute meal with a 25-minute one, retaining all three slots and the peanut exclusion. Refresh restored the session and saved plan. A scan of 14 hosted public pages/scripts found no configured private values; the health endpoint returned 200 with CSP present.
- Hosted no-quicker recovery also passed: asking to shorten a 25-minute dinner produced an explicit catalog-shortage message and a return-to-previous-plan control. The return control now persists its selected version for refresh recovery.
- Resend temporary test sender configured per user choice. Development integration sent verification and reset messages to the authorized Resend account address; both reported **delivered**. Wrong code, reused code, unverified signup, member-only access, reset sign-in, old-password rejection, and new-password success checks passed. Temporary QA credentials remain private and are not production account credentials.
- `notify.geneaone.com` added to Resend for the future sender. Email DNS is prepared on Vercel; authoritative nameservers remain with Unstoppable Domains. Registrar login, full DNS inventory, and the existing DS/DNSSEC transition remain pending. GeneaOne is not assigned to the CareTable website.

## Automated checks

### GPT Live voice — 23 October

Reused the user's Life Maxim `gpt-live-1` WebRTC/session-control pattern for Interactive Mode and Discuss with AI. New backend functions and voice connection indexes deployed to development. The CareTable key's read-only model access probe returned HTTP 200. Automated suite now has **31 passing tests**, including voice ownership, duplicate/concurrent session locks, daily limits, context expiration, missing saved-plan rejection, and preserving existing identities/exclusions. This does not verify real microphone capture, audible quality, captions, or a full spoken handoff; those require browser/audio acceptance. Detailed behavior and retention are documented in `VOICE_FEATURES.md`.

### Meal companion — 23 October

The planner now has a right-hand dashboard and guided meal conversation, stacking below results on mobile. Statistics are derived from the loaded plan: filled slots, average base-recipe cooking estimates, passed/unverified/failed check counts, and saved revision count. Colors have text labels and separate dark-theme palettes. These are not nutrition, price, or medical-safety metrics.

Browser preview verification: a three-day dinner preview showed 3/3 slots, 28-minute average, and six passed catalog checks. A two-turn conversation retained both quicker-meal intent and a request to keep tomato/basil flavours in one editable change request. Preview cannot apply paid/live revisions. At 1280px the companion sits to the right of meals; at 390px its cards stack and document width is 375px. Both themes were visually inspected. Screenshots remain in ignored browser artifacts.

The conversation is deliberately guided: local replies collect bounded preference notes and explain plan statistics. Applying the request invokes the existing Qloo/Luna revision pipeline, not an extra LLM call for every message. Applied notes persist in plan feedback; unsent conversation drafts are session-only. Existing restrictions remain server-owned. New chat completion/failed/partial UI paths are implemented; live browser revision through the new chat has not yet been verified.

24 tests passed in three files after persistence and feedback fixes. Root typecheck and the configured-secret scan passed. Coverage includes:

- Authentication requirements, cross-account isolation, member/admin scope, delegation escalation, protected owner, explicit permissions, and second owner bootstrap refusal.
- Site default versus personal theme isolation, idempotent changes, and household member-count validation.
- Ingredient exclusion/alias failures and unresolved broad requirements; no unknown price or physical texture becomes a pass.
- All 3/7/14-day durations and meal slots, alternatives, and independently checked member portions when no shared candidate exists.
- Controlled identical-candidate comparison: supplied Qloo dining evidence changes recipe ranking. This proves an application ranking effect, not a user preference improvement.
- Invalid model recipe IDs cannot enter a final plan; bounded repair fills eligible missing slots across a 42-slot request without a second model call.
- Model request omits household names and sets `store:false`.
- Idempotent jobs, one active job per user, failures preserving requests, saved restrictions overriding client revision input, unrelated slots surviving revision, parent snapshot surviving deletion, and usage counts surviving plan deletion.

## Requirements matrix

| ID | Current evidence |
|---|---|
| CT-01 | Live fictional sample with anonymous session, editable inputs, no email required. |
| CT-02 | Individual/partner/family controls; ownership/count tests; partner saving/live planning and family preview verified in the production browser. |
| CT-03 | Live structured onboarding and review; clarification path implemented. |
| CT-04 | Explicit confirmation resets after settings/profile changes. Verified in browser. |
| CT-05 | Live 3-day and 14-day/42-slot runs; 7-day and all-duration completeness covered by tests. |
| CT-06 | Live returned dining tags/identifiers; selected recipe mapping visible; controlled ranking test. |
| CT-07 | Provider evidence, application mapping, and model summary distinguished in UI. |
| CT-08 | 20 original MIT prototype recipes, ingredient quantities, steps, servings, time/equipment; preparation not independently verified. |
| CT-09 | Checked alternatives visible; shortage explanation implemented. |
| CT-10 | Deterministic per-recipient checks and alias/unknown tests. This is bounded catalog matching, not a clinical allergen system. |
| CT-11 | Time/equipment/recipient scaling implemented; actual texture remains unknown. |
| CT-12 | Currency and whole-plan budget explicit; unavailable regional prices remain unknown. |
| CT-13 | Shared candidate intersection and independent portions tested; hard exclusions never averaged. |
| CT-14 | Live targeted revision plus immutable-restriction and unaffected-slot tests. Previous tags/minutes are passed as revision context. |
| CT-15 | Unfilled slots explain no eligible selection; unknown checks visible. No requirement relaxation. |
| CT-16 | Plan/theme refresh recovery verified. Browser sample reset signed out and deleted its plans/households; database query confirmed removal. |
| CT-17 | Editable region/currency/metric-imperial; no default country. English interface only. |
| CT-18 | Durable job expiry, safe provider errors, previous-version recovery; failure and malformed-output tests. No live quota exhaustion deliberately induced. |
| CT-19 | Labels, skip link, focus styles, reduced motion and textual states implemented. Mobile screenshot inspected; full accessibility audit not claimed. |
| CT-20 | GitHub source, MIT license, setup/data documentation, and public Vercel app are available. Repository currently private; public-source gate awaits user choice. GitHub `main` automatically deploys website and production Convex functions. Hosted sample generation, corrected quicker-meal revision, and refresh recovery verified. |

## Current release audit — 23 October 2026

The full journey catalog, corrections and current release gates are maintained in [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md). It supersedes historical sender, DNS migration, theme and voice-verification notes above.

- GeneaOne remains email-only, with Cloudflare nameservers preserved. The verified Resend sender is configured on development and production. No DNS migration is required.
- The new audit exercised separate Playwright/Chromium sessions, including both voice entry points. Live audio is blocked at WebRTC ICE connection setup; session creation and server cleanup succeed. Typed-note review/generation/revision paths pass, but do not establish spoken-voice acceptance.
- Production existing verified disposable-account login passes via API. Earlier verification/recovery OTP evidence remains valid. Full new signup/reset browser acceptance is still separate.
- Development staff UI, theme persistence, site appearance and audit pages pass. The intended production owner is still reserved for the user.
- Current hosted pages and GitHub requests time out from this machine. Do not claim the latest release has been published or hosted acceptance repeated.
- The local retrospective catalog, private QA outputs, tokens and browser artifacts remain Git-ignored. Repository publication/submission remains deferred.

## Homepage and planner overview update — 23 October 2026

Replaced the CSS food illustration with a generated editorial meal image served through Next.js Image. Moved the single At a Glance statistics panel beside the conversation/mode panel at the top. The preview/live plan result still supplies its metrics. Chromium checks pass desktop alignment, a single snapshot, updated 3/3 preview metrics, mobile stacking, both pages without horizontal overflow, and zero page errors. Forty existing tests and root TypeScript pass. Image prompt and provenance are in IMAGE_ASSETS.md.

Restart recovery check: the optimized production build completed successfully, including TypeScript and all routes. All 40 tests pass with a single worker. An initial concurrent run timed out in one test; the serial rerun passed without code changes. Local development server restored on port 4318.

Logo integration: shared header/footer use the approved wordmark. Metadata and manifest use matching resized emblem icons. Root TypeScript passes. Chromium verifies Midnight, Dark and White at desktop/mobile widths: both wordmarks load, no horizontal overflow, expected favicon and manifest assets resolve, zero page errors. Mobile Midnight screenshot visually inspected.

Planner care and guidance update: added a four-step navigation guide, warmer welcome, heart motif, softer themed cards, numbered review and feedback sections, and a collapsible household summary with an explicit next action. TypeScript passes. Chromium verifies collapse/reopen retains edited profile inputs, local preview generates, mode switches remain available, and all four themes at 1280px and 390px have no horizontal overflow or page errors. These checks do not repeat live audio acceptance.

Landing page care and carousel update: four generated food photographs join the original hero in a five-slide crossfade carousel. Includes previous/next, direct slide buttons, play/pause, hover/focus pause, background-tab suppression and reduced-motion default pause. Warmer themed cards and a four-step introduction extend planner styling. Root TypeScript passes. Chromium verifies all five images load, automatic advancement, manual navigation, pause state, reduced-motion state, four themes at desktop/mobile widths, no horizontal overflow and zero page errors. Midnight screenshots visually inspected. Initial exact-slide autoplay assertion timed out under heavy local load; a rerun checking advancement passed.

Mode guidance update: Interactive Mode is now the initial and reset default, including guest selection. Both buttons remain available; starting voice still requires a signed-in/sample session and an explicit Start voice click. Mode-specific labelled speech bubbles point to the selected button and announce changes politely. Sample/reset controls remain visible in both modes. TypeScript and Chromium checks pass: default selection, sample visibility, labels, profile input retention through switching, zero getUserMedia calls during mode changes, four themes at desktop/mobile widths, no horizontal overflow or page errors. Both desktop Interactive and mobile User bubble screenshots visually inspected. This does not verify spoken audio connectivity.

## Competitive improvements — 26 October 2026

- Added saved meal-level evidence receipts: resolved household seeds and IDs, returned dining connections, explicit CareTable mapping, per-meal checks and candidate ranks before/after Qloo. Rank data is captured at selection time; old meals remain readable without invented snapshots.
- Expanded the original prototype catalog from 20 to 26 with six cuisine-inspired choices. Household signals are selected round-robin before the existing three-input discovery cap. Exact reviewed mappings handle observed provider vocabulary; the strongest mapped affinity prevents synonymous-tag vote stacking.
- The final live-evidence evaluation completed nine scenarios against the same cuisine-aware baseline and fixed eligible catalog: six top-three order changes and 12 changed deterministic control-plan slots; all eligible sets preserved and zero failed hard checks in selections. The unsupported seed and no-equipment cases remain in the record. This isolates selection influence, not generic-LLM superiority or human preference. All intermediate/negative experiments and final methodology are in research/qloo-competitive-review-2026-10-24/evidence/README.md.
- 47/47 tests pass, root TypeScript passes, optimized Next.js build passes, and the final Convex development deployment succeeds.
- Chromium passes live generation, receipt display, real selected-slot revision, two unaffected meals preserved, saved receipt/plan recovery after refresh, sample reset, and no page errors. Four themes at desktop/mobile widths show no horizontal overflow. Receipt screenshots were visually inspected. The full journey was repeated against the optimized build served locally on port 4318 against development Convex, with zero page errors.
- Configured-secret scan includes research outputs and built client assets and passes for four loaded private settings. Local Markdown links and presentation CSV structures pass; retrospective, screenshots and Submission Video Workspace remain Git-ignored.
- Hosted delivery is blocked again on this machine: Git remote access cannot connect to github.com:443; Node fetches to GitHub API and the Vercel app fail; Vercel whoami also returns fetch failed. These checks supersede the restored-connectivity note of 23 October. No latest-code hosted acceptance or push/deploy is claimed.
- Caregiver review awaits an actual consented participant session. Spoken-voice transport acceptance and remaining production account checks are not established by these changes. Video rehearsal remains paused; only script/presentation resources were updated.


## Voice configuration comparison — 26 October 2026

Compared CareTable `convex/voiceActions.ts` and `src/modules/meals/voice-session.tsx` with Life Maxim `convex/liveActions.ts` and `components/interactive-mode.tsx`. Both call OpenAI `/v1/live/sessions` from Convex, use server-side `OPENAI_API_KEY`, model `gpt-live-1`, and exchange SDP for browser WebRTC. Both gather ICE before submitting the offer and use the `oai-events` data channel. Life Maxim uses the generated `env` accessor; CareTable's Node action uses `process.env`. This syntax difference does not imply a different credential location.

Current local selection is development `outstanding-crocodile-717`; `NEXT_PUBLIC_CONVEX_URL` points to that same deployment. A live Convex CLI lookup confirmed its OpenAI key is present without displaying its value. No wrong local deployment or absent development credential was found. This check does not verify the hosted deployment's current environment or establish successful audio. Earlier successful provider session creation followed by WebRTC connection timeout remains the last transport evidence; root cause remains unconfirmed. No API key relocation or speculative transport change was made.

Caregiver review is deferred by the user because the potential reviewer is unavailable; it remains unperformed and must not be presented as validation.


## GPT Live troubleshooting continuation — 26 October 2026

**Observed recovery, not a speculative configuration fix.** Separate Playwright-controlled Chromium sessions now connect to GPT Live 1 through CareTable's existing Convex development action. ICE and peer connection reach connected, the data channel opens, `session.started` arrives, input and output transcript deltas arrive, and RTP statistics show outgoing microphone and incoming audio bytes. Both Interactive Mode and Discuss with AI display two-sided live captions. Mute disables the sender track; Unmute restores it. Explicit Stop was exercised. No API key relocation, model substitution or transport-code change was necessary. The exact cause of the older ICE failures remains unconfirmed; current recovery does not prove a particular network cause.

The synthetic audio fixture must be passed to Chromium with `%noloop`. An earlier looping fixture continuously supplied speech and obscured AI response turn-taking; a finite fixture produced AI replies. This is test-harness behavior, not an application fix. Interactive spoken preferences were reviewed; a missing-region question correctly disabled confirmation. A typed fictional United States clarification enabled review and generated a saved three-day Qloo/Luna plan. Actual room-microphone/speaker listening and hosted voice transport have not been established by these local synthetic-device tests.

Current supporting reports are ignored: `.private/voice-full-acceptance-report.json`, `.private/voice-diagnostic-current.json`, and `output/playwright/voice-diagnostic-current.png`. Scripts are diagnostic tools, not public demo recordings.

Hosted browser signup, wrong-code rejection, successful email verification, password reset and logout passed against the existing production deployment (`.private/hosted-browser-auth-current.json`). One earlier reset attempt timed out; the repeated sequence passed. Hosted health returned HTTP 200; Vercel inspection reports the existing 22 October production deployment Ready. This does not establish delivery of the latest local source.

The production owner lookup still finds no non-anonymous account for the user's chosen email. Owner provisioning requires that user's verified signup; no test account was promoted. An additional local staff-login attempt using older stored QA credentials failed; current staff-browser acceptance is not claimed from that attempt. Earlier staff results remain historical.

GitHub read connectivity recovered intermittently, but a noninteractive push of the reviewed branch timed out after 60 seconds. No successful push or deployment of the latest changes is claimed. The repository remains private. Caregiver review stays deferred; video rehearsal remains paused.

Regression: initial parallel run 46/47 with one five-second cleanup-test timeout; isolated rerun 9/9, then full single-worker rerun 47/47. TypeScript passed. No timeout setting or application behavior was changed to obtain this result; the rerun used an explicit 15-second test execution limit.


Final 26 October voice run: the Interactive spoken-review journey generated a saved plan, then Discuss with AI connected with two-sided captions, mute/unmute passed, and a reviewed request saved a new meal revision. The discussion revision request included an explicit typed clarification; this is a mixed voice-plus-notes handoff, not a speech-only feedback acceptance claim. Browser page errors: zero. See `.private/voice-full-acceptance-report.json`.


26 October scope correction: at the user's explicit request the niece/caregiver review is removed from the project scope, active backlog, release acceptance and presentation requirements. It must not block production. Historical references describe earlier proposals only; no review result or testimonial is claimed. The unused review kit and active claim/shot entry have been removed.


## GitHub-to-Vercel delivery repaired — 26 October 2026

Diagnosis: local working branch contained newer commits, but remote main and the Vercel production alias still pointed at cf9555089ead071f59cecbbc5870e6ffa91bcaf5. Vercel's existing GitHub link was correct: PetersonnOne/CareTableV1, production branch main. A read-only ancestry check established a safe fast-forward. Fetch and push succeeded using git HTTP/1.1; no force push or standalone local deployment was used. GitHub main advanced to a8a80a6607f1cff842c7c597f41085a175f38ede, automatically triggering Vercel production deployment dpl_8uciDDpm6JLUCtDwpcS1UnECK2Bd, which reached READY. The GitHub repository remained private.

Actual public-alias Playwright/Chromium acceptance: new branding and five real food images loaded, Midnight default observed, Interactive Mode default pressed, fictional sample entry, confirmed live production Qloo/Luna three-day generation, saved meal evidence receipt, refresh recovery, 390px mobile without horizontal overflow, and sample reset all passed; zero page errors. Screenshot inspected: output/playwright/hosted-latest-home.png. Private report: .private/hosted-latest-smoke.json. The report's obsolete carousel-button selector returned zero matches; visual inspection confirms the five-slide carousel controls and all five loaded images. This selector result is not a product failure.

The family caregiver review requirement and unused review kit are removed. It is not a release blocker and no testimonial is claimed. Owner creation/verification remains the user's account-entry step; hosted voice/human audio acceptance remain separate from this delivery check.


## Authentication navigation warning fix — 26 October 2026

Reproduced the browser Leave site warning using existing-account login followed by navigation. A beforeunload listener trace identified Convex Auth's `isRefreshingToken` guard, not an application dirty-form listener. The installed Convex SDK immediately refreshes a server-confirmed cached token by default. CareTable now opts into its `initialAuthTokenReuse` setting, retaining scheduled refresh and refresh-on-rejection while avoiding that immediate duplicate refresh. Real unfinished database-request warnings remain enabled. The sign-in form also waits for pending authentication and Convex loading to settle before its normal account redirect. No auth SDK source was patched and no global browser-dialog suppression was added.

Local optimized-build Chromium acceptance with a disposable fictional account: leave filled sign-in form, leave filled sign-up form, signup, wrong-code rejection, email verification and account redirect, recovery/password reset, logout, existing-account sign-in, planner navigation and account reload all passed. Browser dialog listener recorded zero dialogs. Report: .private/auth-navigation-local-report.json. Root TypeScript, optimized build and 47/47 single-worker regression tests passed. Hosted acceptance follows the GitHub deployment of this fix.

The user's intended production account is now email-verified and the operator-only owner bootstrap completed successfully. The resulting superadmin grant was read back from production. No password or verification code was requested from the user or exposed. The owner's account needs no further bootstrap step.


## Hosted authentication fix acceptance — 26 October 2026

GitHub main commit 48d7dd573619ec07147348359b94159944eef6a5 automatically produced Ready Vercel production deployment dpl_7Dw8QKBRor3hb6yyu7ehci7DFEN7. Against the public alias, Chromium passed filled sign-in/sign-up exits, signup, invalid-code rejection, valid email verification/account navigation, and password recovery with zero browser dialogs. A combined test's immediate re-login step raced its unfinished sign-out and returned to the still-authenticated account; this is retained as a test-sequencing failure rather than reported as a fully passed combined hosted sequence. The existing-account path was therefore repeated in a fresh Chromium context using the disposable account: login, planner navigation and return to account passed with zero beforeunload dialogs and zero triggering guard listeners. Reports: .private/auth-navigation-hosted-signup-report.json and .private/auth-existing-navigation-report.json. The complete local optimized-build combined sequence also passed with zero dialogs. No user password or OTP was used in these tests.

Both requested entry paths now have hosted acceptance for the warning fix. The intended production owner is verified and provisioned; no account-creation/bootstrap blocker remains. Human owner-device testing is left to the owner, without sharing their password.


## Proactive Meal Guide welcome and editable voice review — 26 October 2026

User requested a spoken welcome before the first user utterance, a usable confirmation path for unresolved currency/budget, and approved the product name CareTable Meal Guide. User reports that the hosted Interactive Mode spoken conversation works; supplied screenshots demonstrate both speakers' captions and a review blocked on missing currency and a budget question. This is user-reported device evidence, distinct from the automated tests below.

Implementation: a single session-scoped Live commentary cue on session.started requests an AI welcome, workflow explanation and opening question. Both voice modes name Qloo's taste signals, CareTable Meal Guide's proposed meals and CareTable's saved-requirement checks. No underlying provider/model was changed. The review now supports explicit currency, optional region/budget and preparation-time edits, visible validation and explicit acknowledgement of model questions. Blank budget means no limit; unspecified optional region/budget no longer automatically raises a mandatory question. Currency is never inferred from Nigeria or another country. Existing exclusions and authoritative request validation remain enforced.

Final optimized-local-build Chromium test against development Convex: both modes connected, each sent exactly one welcome cue, each received AI output captions/audio playback with zero user transcript events from a silent fixture, both named Qloo and omitted Luna. The missing-currency review was initially disabled with an explanation; choosing NGN, leaving budget unlimited and acknowledging the question enabled it. Negative budget and zero preparation time were blocked. Corrected review generated a saved three-day plan; 390px review had no horizontal overflow; reset passed; zero page errors. Screenshots of mobile/desktop review were inspected. Report: .private/meal-guide-acceptance-report.json; earlier retained attempts correctly encountered the one-minute cooldown. The completed test waits a full minute after the prior session is closed, rather than assuming time from the initial button click equals the server reservation time. No allowance was raised or bypassed.

Root regression suite 48/48 passes; TypeScript, optimized Next build and development deployment pass. This tests a spoken welcome with typed fictional requirement notes and inline review corrections, not a fully spoken requirements interview. Latest hosted acceptance follows deployment; the video rehearsal remains paused.


## Hosted Meal Guide acceptance — 26 October 2026

GitHub main commit 34d0f0a16d543ab57dc9f3b1b90a2056b91b1f70 automatically produced Ready Vercel production deployment dpl_899cgRPAeBV9d3Xqqh5GGZ6zDosm, including the production Convex prompt update. The public-alias Chromium repetition passed both silent-microphone welcome-first cases: exactly one welcome cue each, zero user transcript events, connected transport, playing AI audio, Qloo named, CareTable Meal Guide named and no Luna wording in the received welcome captions.

The hosted review began with currency blank and confirmation disabled with an explanation. Explicit NGN selection and question acknowledgement enabled it while budget remained unlimited. Negative budget and zero preparation time were blocked. The corrected review generated a saved three-day plan. The 390px review had no horizontal overflow, sample reset passed, and the complete browser journey recorded zero page errors. Private report: .private/meal-guide-acceptance-report.json; local report retained separately. These tests use silence plus typed fictional requirement notes, not a newly recorded human requirements interview. No microphone audio from the user's room was collected and no demo recording was resumed.


## Clear voice interruption and review recovery — 26 October 2026

The user reports both hosted voice modes working, a successful discussion review saving the requested fish meal change, a review that succeeded after an initial failure, and a stream cutoff that still allowed review. The exact cause of those earlier provider/network interruptions is not established. This update improves recovery and continuity rather than claiming outages cannot happen.

Implemented: specific interruption/manual/idle/time-limit/tab-hidden messages; captured-text review without reconnecting; an explicit Retry preparing review action after failure; missing-word notes guidance; Open User Mode/Open Chat manual entry; offline guidance; server-cleanup and cooldown explanations. There is no automatic paid restart or review retry. AI greeting alone cannot create a preferences review without user speech or notes. Reconnect keeps captions and notes in this page and appends new-session captions in timeline order with distinct IDs. It starts a new provider session and consumes an allowance; its welcome-back cue does not pretend to remember earlier audio. Nothing is applied before confirmation. No raw transcript persistence was added.

Race fixes: pending review is locked before awaiting stop to prevent duplicate requests; intentional stop invalidates old transport callbacks; successful review clears stale transport errors; closed-state subscriptions are scoped to the current connection generation so the previous closed session cannot cancel a new reconnect. Short disconnected states can recover during a six-second grace period; longer interruptions stop the microphone and expose review/reconnect options.

Validation: 51/51 regressions pass with a single worker and an explicit 60-second test allowance. An earlier 15-second-allowance run had 49 passes and two timeout failures in existing planning tests; the longer run passed all assertions without changing application logic or the committed test configuration. Root TypeScript and optimized Next.js build pass. Both actual VoiceSession modes were exercised in a private Playwright/Chromium fault-injection harness with mocked transport and Convex responses: dropped connection, one rejected review followed by explicit retry using identical text, no automatic retry, rapid double clicks, late failure after review, explicit confirmation, reconnect preserving captions/notes and ordering, idle recovery, and 390px layout all pass with zero page errors. The first harness run reproduced the reconnect race; after its fix, a later selector issue was corrected in the private QA script. Completed report: .private/recovery-ui-report.json. Screenshots are labelled simulated QA and must not be presented as live provider demo footage. Earlier real-provider and user-reported evidence remain separate. Hosted delivery of the new frontend follows the GitHub deployment.


## Hosted controlled recovery acceptance — 26 October 2026

GitHub main commit 9a7eaaf33ed8f0168e9a265c1a8e7dd0bfb0afe7 automatically produced Ready Vercel production deployment dpl_54dBcpq2KERrKWC9S8xckqa8bqgD. The public app was exercised with one real GPT Live session using a fictional synthetic microphone fixture. After received user speech, the test forced the client peer-failure branch. Captured speech remained in the UI. The test then injected one ActionResponse rejection locally in Chromium before the review request could reach the server, demonstrating the failure panel without causing a provider review charge. The explicit retry submitted identical captured text to the real backend without a second voice start, returned a review, and confirmation generated a saved three-day plan. Reset passed, provider cleanup was confirmed closed, and there were zero browser page errors. This is controlled client fault injection, not a claim that an actual provider outage occurred during this test. Report: .private/hosted-voice-recovery-report.json.

Both mode-specific UI recovery scenarios separately passed in the mocked-transport harness. No voice limits were increased or bypassed, no automatic paid retry was introduced, and no demo recording was resumed.


## GPT Live handover and completion-status consolidation — 26 October 2026

Created the local GPT Live 1 handover: nine Markdown guides, including separate Interactive Mode and Discuss with AI files, twelve credential-free source snapshots with hashes, and a portable ZIP. It records the original Life Maxim reuse, transport/credential diagnosis, welcome, review validation, recovery, reconnect races, value retention, auth/deployment lessons and testing evidence. The user called it GPT-9 in a follow-up; the existing requested folder is GPT Live 1, which is now explicitly Git-ignored. It contains no copied private environment/session/account files. Archive integrity, snapshot hashes, UTF-8 and 28 local documentation links passed validation. No application features or provider calls were changed or rerun for this documentation task.

PRODUCTION_READINESS.md now opens with a consolidated current status so the older 23 October blockers cannot be mistaken for current ones. CareTable is production-deployed; the tested core is ready for controlled use. Final owner Administration UI sign-off, public voice-allowance policy, paused demo work and submission/source-publication decisions remain distinct completion steps. Public homepage and health checks returned HTTP 200. Source publication and changing paid usage limits were not authorized by this status question.


## Owner acceptance and voice-policy clarification — 27 October 2026

The owner reports successful production admin login and satisfactory Administration screens; record this as user acceptance, closing the outstanding owner UI check. The owner approves the existing five-minute per-session duration after their demo. Both Interactive Mode and Discuss with AI already show the five-minute maximum before starting (src/modules/meals/voice-session.tsx). Session duration is separate from six starts/account/day and twelve shared starts/deployment/day plus cooldown; these quotas remain unchanged. Wider-audience usage/quota planning is an operating decision, not evidence of a broken core flow. No new automated or hosted test was run for this documentation update. Remaining project deliverables are the paused walkthrough rehearsal/final demo and submission materials, including the source-publication decision.


## Shared judging voice allowance - 27 October 2026

Owner-authorized change: shared voice starts increase from 12 to 24 per deployment per UTC day across Interactive Mode and Discuss with AI. Six starts per account/day, five-minute sessions, cooldown, cleanup and explicit review remain unchanged. Existing daily counts are preserved; no reset or paid provider session is needed. Both voice entry points display 24 shared/day. Boundary coverage checks the 24th start succeeds and a different account's next start is rejected without consuming its account quota. Hosted delivery follows GitHub main through the Vercel/Convex build; record the delivery result separately. Demo rehearsal, recording and generation remain paused.

Validation for the 24-start change: 12/12 targeted voice/recovery tests passed, TypeScript passed, documentation link/CSV checks passed and git diff --check passed. No paid voice calls were made.


## Audio-first storytelling rehearsal - 27 October 2026

The user authorized an under-three-minute audio-only walkthrough before visuals. Reusable doctrine and CareTable-specific voice decisions are saved in the ignored Submission Video Workspace/doctrine folder. Draft 1 has 311 spoken words: emotional hook, manual User Mode, inspectable Qloo affinity/mapping/ranking path, Interactive Mode, text Chat and Discuss with AI, reviewed saved change, benefit-led close and explicit thanks to Qloo. Sarah narrates through OpenRouter ElevenLabs v4; Will portrays the caregiver; Alice stands in for the assistant in this scripted planning audio only. The application retains Tango. Audio planning is not new live feature acceptance or footage, and does not authorize video recording/publication. Generation and measured runtime are recorded with the artifact; human listening review follows.

Audio draft 1 exported successfully: 133.08 seconds (2:13), all fourteen original segments preserved, MP3 decode check passed, no time stretching. A transient DNS failure affected only the final two speech requests; the completed twelve files were reused and only missing takes were retried. No GPT Live session or video was recorded. Human listening and creative approval are pending. Script, generation hashes, cue sheet and verification are retained in work/audio-rehearsal-001.


## Rehearsal authorization and sound decision - 27 October 2026

The user approved the voice-only narration and rejected the instrumental because it masks warmth and emotional delivery. Use the clean voice master with no music. Preserve the instrumental audition as an unused option, not an approved soundtrack. The user now authorizes rehearsals. Capture User Mode first with a visible pointer, deliberate clicks and live typing, then Interactive Mode, Chat and Discuss with AI, following the approved story. Rehearsal recording and the necessary real application/provider interactions are in scope; final publication remains unrequested. Keep scripted audio planning separate from exact real-run responses in the production records.


## Live rehearsal R2 - 27 October 2026

A complete hosted Chromium capture passed manual live planning, Qloo provenance/meal receipt, both real GPT Live speech paths, reviewed setup confirmation and saved discussion revision, with zero page errors. The 45-minute scenario resulted in Poached fish with potato (35 minutes), replacing the selected meal. Separate actual assistant audio and exact transcript/event records were captured. Sarah narration remains the approved original; only the caregiver's time allowance was regenerated. No music. R1's incompatible 30-minute fish request remains documented rather than being promoted as a fulfilled request. The review workprint uses editorial excerpts and omitted waits; it is not a claim of real-time three-minute end-to-end processing. Final watch/listen approval and submission remain separate. No app source changed during rehearsal.

R2 saved-result read-back passed: final status complete; fish-potato saved at 35 minutes within maxMinutes 45; non-target meals exactly unchanged; original plan requirements exactly preserved. Verification used the rehearsal guest identity and read-only Convex queries, with no provider-generation calls. Evidence is in the R2 saved-result-verification.json.

R2 workprint exported and fully decoded: 138.916667 seconds, 1440x810, H.264/AAC, no music. Actual assistant excerpts are used alongside Sarah narration and Will input. Contact sheet inspected; full human watch/listen approval remains pending. A hash-identical review copy is at review/CareTable-Rehearsal-02.mp4; editable cut manifest and original stems remain in the source take.


## Live-voice edit repair - 27 October 2026

The user approved the R2 visual rehearsal but reported glitches in GPT Live audio. Audio-file word alignment confirms incorrect cuts in four assistant clips: truncated words and a discussion cut drawn from a later sentence. The prior constant-offset session-timeline calibration was insufficient. Source originals, approved narration and visual streams are preserved. Repair uses original real assistant recordings, recorded-file word boundaries, quiet margins and short edge ramps; no replacement voice or new live session is required. Two OpenRouter ElevenLabs Scribe alignment requests were used. No app runtime code changed. Do not call this a diagnosed network failure or audible repair acceptance before the user listens. Cross-project lesson is saved under GPT Live 1/09_RECORDING_AND_EDITING_TIMELINES.md.

Audio repair 03 exported and fully decoded: 138.916667 seconds. Video stream hash matches the approved R2 bit-for-bit. Decoded approved-master audio outside four assistant slots was preserved before final output encoding; no voice time stretching. Two word-alignment calls, zero new Live sessions and zero new synthesized speech. Earlier -shortest remux briefly omitted a terminal packet because audio padding differed by milliseconds; finalization removes that truncation and verifies the complete video hash. Listening approval remains pending. Review copy: Submission Video Workspace/review/CareTable-Rehearsal-03-Audio-Repair.mp4.


## Final captioned cut - 27 October 2026

The user accepted the remaining minor voice artifact and authorized the final content with bottom subtitles. No apology or unconfirmed connectivity attribution is added. The approved repaired soundtrack is retained; no music or new live sessions. Full-track word alignment yields 337 words and 49 non-overlapping English cues, at most two lines, with CareTable/Caregiver conversation labels and corrected Qloo/CareTable spellings. A separate bottom band keeps captions off the interface controls. Final 1080p render and sidecar SRT/VTT plus editable cues are prepared in the ignored Submission Video Workspace/final folder. Record encoded checks after rendering. Public upload/submission is not part of this authorization.

Final captioned master completed: 138.916667 seconds, 1920x1080 H.264/24fps with the approved AAC audio stream preserved bit-for-bit. Full video decode, complete 337-word/49-cue coverage, non-overlap and maximum-two-line checks passed. Representative caption and dialogue/end frames inspected; controls remain above the subtitle band. English SRT/VTT, editable ASS/JSON/CSV and transcript included in the verified ten-file Video Package ZIP; archive CRC and master-video byte match passed. Final human watch approval and public publication/submission remain separate.


## CareTable submission story and artwork - 27 October 2026

Created the Git-ignored Submit Projects folder with project name/pitch, links, the seven-section story, 20 Built With tags grouped by actual role, a matching landscape thumbnail and portrait poster. Qloo is foregrounded through seed/connection/mapping/ranking receipts and the controlled nine-scenario result. Original CareTable branding and a new caregiver/aunt promotional scene are used; the supplied Tonight Together assets inform structure/tone only. The story makes no endorsement or clinical-results claim and does not reinstate a niece review requirement. Runtime AI and media-production technologies remain separate. Artwork prompts, sources, dimensions, hashes and local-link checks are retained in Production Notes. No artwork publication, repository-visibility change or submission is performed.
