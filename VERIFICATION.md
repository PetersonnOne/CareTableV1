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
