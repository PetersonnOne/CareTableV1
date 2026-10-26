# CareTable production readiness — 23 October 2026

**26 October continuation:** the user resumed competitive improvements and the associated judge-journey verification. Video rehearsal stays paused. Current Qloo evaluation, meal receipts, catalog changes and verification are recorded in JUDGING_EVIDENCE.md and VERIFICATION.md. Earlier pause/status notes below are historical.

**Work paused by the user on 23 October 2026.** Current priority is reference review and a CareTable demo rehearsal pipeline. Outstanding gates below are retained for resumption; no production completion percentage is inferred from the pause. No deployment or readiness claim follows from demo preparation.

**Verdict: release candidate under verification; not approved as fully production-ready.** The PRD core and the added mode/theme features have implementation and test evidence. Live voice transport and hosted release verification remain blockers. A passing build or a created voice session is not end-to-end evidence.

## Scope and evidence

This audit covers CT-01–CT-20 in [the PRD](CareTable_PRD.md), plus email/password accounts, staff administration, four themes, the dashboard/chat, Interactive Mode and Discuss with AI. The separate post-hackathon idea is excluded. Development tests use fictional/sample records and the disposable verified QA account; production ownership is reserved for the intended owner.

Automated logic, live provider calls, browser tests and historical production evidence are reported separately below. Browser automation uses separate Playwright-controlled Chromium instances. Voice attempts use a locally generated fictional speech recording through Chromium's fake audio device; no room microphone is recorded.

## Journey acceptance catalog

| Journey / requirement | Evidence and result |
|---|---|
| Landing and navigation | Browser pages open; navigation, account and staff routes exercised. Public accessibility checks pass. |
| Sample entry — CT-01 | Anonymous session starts through the browser; fictional preferences are editable. No email required. |
| Individual, partner, family — CT-02 | Partner saved through UI; family add/remove controls and save exercised. Automated matrix covers 1, 2 and 8 members for all durations. |
| Onboarding — CT-03 | Live Luna interpretation and reviewed application pass in UI. Existing peanut exclusion survives an interpretation that contains no exclusion. Pending responses are bound to the selected member ID. |
| Explicit review — CT-04 | Changing profile type resets confirmation. Generation requires reviewed inputs. Voice proposals require a second explicit confirmation. |
| 3 / 7 / 14 days — CT-05 | Browser live 3-day plan; partner 7-day preview; family 14-day, all-slot preview shows 42/42. Live backend 14-day family request fills 42 slots for three recipients. Matrix tests cover every duration and slot. |
| Qloo — CT-06, CT-07 | Live family run returns 13 dining connections and maps 13 meals. Controlled identical-candidate ranking test passes. Qloo evidence remains separate from application recipe mappings. |
| Recipes and alternatives — CT-08, CT-09 | Original licensed catalog, ingredients, quantities, steps and attribution are displayed. Eligible alternatives are checked; shortages are explicit. Physical preparation is not independently validated. |
| Ingredient / practical / budget checks — CT-10–CT-12 | Tests cover aliases, fail/unknown outcomes, impossible equipment, soft-preparation uncertainty and missing prices. Representative household matrix finds no failed listed check in a selected recipe. |
| Shared meals / independent portions — CT-13 | Recipient and independent-portion tests pass. Live 42-slot family plan retains all three recipients. No exclusion is averaged away. |
| Feedback Chat — CT-14 | Two-turn request retains quicker intent and tomato/basil notes. No-quicker case reports shortage and preserves the earlier meal. Similar-meal revision succeeds through UI and records feedback. Live backend revision preserves 41 unrelated meals and every saved member restriction. |
| Conflicts — CT-15 | No equipment produces 42 explained empty slots; broad exclusions stay unverified. No-quicker recovery works in the browser. |
| Persistence / history — CT-16 | Live plan survives refresh. Backend snapshot survives parent deletion; UI restores revision snapshots after refresh and avoids opening a removed parent. Plan deletion/reset subscriptions receive a safe empty result. Final reset regression is tracked below. |
| Region, currency, units — CT-17 | Editable controls, USD fictional sample labeling and imperial family preview exercised. No default country or verified local-price claim. English interface remains the agreed scope. |
| Recovery — CT-18 | Quota/concurrency/idempotency, provider failure, malformed selection repair, queued expiry and late-worker results covered by tests. Voice startup failure closes the server connection without automatic retry. |
| Accessibility — CT-19 | Axe WCAG 2 A/AA and 2.1 AA scans: 11 public/planner states plus three authenticated staff screens report no violations. Four palettes tested. Mobile at 390px has no horizontal overflow. This is automated/targeted evidence, not certification or an exhaustive assistive-technology audit. |
| Hosted demonstration — CT-20 | Earlier hosted core-flow and email checks are recorded in [VERIFICATION.md](VERIFICATION.md). Current Vercel page/health and GitHub requests time out from this machine. Latest code is not verified on the hosted app. Repository publication/submission remains deferred by the user. |
| Account login / logout | Existing verified development account signs in through the form, survives hard refresh and reaches authorized staff pages. Logout denies staff access. Account recovery entry signs out and opens the recovery form rather than looping back. Production existing verified disposable account also signs in through the API in this audit. |
| Signup / verification / password recovery | Earlier actual production Gmail verification/reset, wrong/reused-code rejection and changed-password checks passed. Current sign-in form accessibility passes. A new full signup/reset browser sequence and live 15-minute code-expiry wait are not claimed by this audit. |
| Staff administration | Development QA owner provisioned. People page, appearance, audit trail and authenticated theme persistence pass in Chromium. Site default changed to White and restored to Midnight. Authorization/delegation/protected-owner boundaries pass automated tests. Production owner is not assigned to the disposable account. |
| Appearance | Garden, Midnight, Dark and White render; guest selection survives reload. Authenticated choice survives reload. Midnight is the site default; saved personal choices retain precedence. |
| Main mode switching | User Mode / Interactive Mode are explicit pressed-state controls. Hidden controls leave keyboard navigation; a voice draft survives switching. Entering voice mode does not start recording. |
| Interactive Mode review | Typed clarification notes produce a structured Luna proposal; confirmation starts the normal Qloo/Luna job and displays a saved plan. **This tests the review/generation path, not a successful spoken conversation.** |
| Discuss with AI review | Owned selected-meal context produces a reviewed feedback request; clarification and confirmation result in a saved meal revision. **This tests the review/revision path, not a successful spoken conversation.** |
| Live audio / captions / live mute / conversational turn taking | **Blocked.** Session creation succeeds, but Chromium remains in ICE checking/connecting with no opened data channel or transcript events. Both entry points reproduce startup failure and confirmed server cleanup. Root cause is not confirmed; real transport must work before voice release acceptance. |

## Corrections made during this audit

- Explicit mode switches and preserved local drafts replace ambiguous extra-panel buttons. Switching away stops voice.
- The sign-in form and household draft wait for client initialization before accepting input, preventing early input from being reset.
- Account password recovery no longer loops through the signed-in redirect; its explicit sign-out entry opens the recovery form.
- Onboarding proposals are tied to member IDs; late responses cannot silently move to another selected person. Existing exclusions remain unless edited directly.
- Old voice-start promises cannot close or overwrite a newer connection after cancellation.
- Revision snapshots are shown after refresh; removed parent versions do not lead into a crashing lookup.
- A nullable owned-plan subscription handles plan deletion/reset without a page crash; other accounts receive the same empty result.
- Already expired queued jobs are rejected before paid provider work starts. Late completed results cannot overwrite an expired job.
- Removed the obsolete restricted-email banner after verified GeneaOne sender setup; corrected stale sender/theme documentation.

## Release checks

- Automated regression suite: 40 tests, covering existing guarantees and the new release boundary cases. Final rerun results are recorded in the continuation below.
- Production dependency audit: 0 reported vulnerabilities (including 0 high/critical) at audit time. This does not guarantee absence of vulnerabilities.
- TypeScript, Next.js build, development deployment and configured-secret scan must pass for the final source revision; see the final continuation below.
- Private QA scripts, tokens, credentials, reports, audio and screenshots remain Git-ignored. The retrospective catalog remains ignored.

## Remaining release actions

1. Resolve the WebRTC startup failure; then repeat real input/output, captions, mute/unmute, stop, mode switching, idle/expiry and both complete spoken handoffs. Do not label note-based recovery as a voice conversation.
2. Restore GitHub/Vercel connectivity, publish the reviewed release through the existing GitHub workflow, and repeat all required hosted acceptance checks against that exact deployment.
3. The user has selected the production owner email. No matching account was found in the production account check; complete signup and email verification, then provision through the operator-only bootstrap and confirm production staff access. The selected address is retained privately.
4. Complete the remaining signup/reset browser acceptance with the user's credential-entry handoff, and document email expiry/recovery evidence. Preserve the earlier valid API/email evidence separately.
5. Keep the repository private until the user separately decides hackathon publication/submission. This is distinct from application hosting.

Current local review URL: http://localhost:4318/planner. Current audio integration references: [OpenAI WebRTC connection guide](https://developers.openai.com/api/docs/guides/voice-webrtc), [GPT-Live session management](https://developers.openai.com/api/docs/guides/live-conversations).

## Final audit continuation

- **40/40 tests pass**, root TypeScript passes, final optimized Next.js build passes, and final Convex development deployment succeeds.
- Final configured-secret scan passes for public source candidates and built client assets; Git-ignore checks confirm the retrospective catalog, private session tokens and screenshots are excluded.
- The optimized production build was served locally against **development Convex**, separate from the public deployment. Its browser smoke test passes live generation, hard-refresh plan recovery, retained feedback-mode draft, and sample reset with **zero page errors** after the nullable-subscription fix.
- That same optimized build passes existing verified login, authorized staff pages, saved theme refresh, audit visibility and logout protection in Chromium.
- Development site appearance was restored to **Midnight**. Production owner email is now selected; its production signup/verification is pending. No disposable user was made production owner.
- Changes are retained on **codex/production-readiness**. They have not been promoted through GitHub/Vercel. Live audio, the remaining credential-entry browser acceptance, hosted acceptance and production ownership remain the explicit release gates above.

## Blocker status recheck — 23 October 2026

- Connectivity is restored for the tested endpoints: GitHub API and public Vercel homepage return HTTP 200; authenticated git ls-remote reads origin main. The unauthenticated private-repository webpage returns 404 as expected for a private repository. Earlier timeout statements above are historical. Publishing and exact-deployment hosted acceptance remain outstanding.
- Read-only production lookup inspected two users and found no matching non-anonymous account for the selected owner. Owner email selection is complete; account signup, verification, owner provisioning and staff acceptance remain pending.
- Voice transport and full signup/reset browser acceptance have not been reverified since the earlier audit. They remain unresolved acceptance gates; current mode/UI checks do not establish spoken-audio success.


## 26 October competitive continuation result

Qloo evidence evaluation, saved meal receipts and targeted catalog/mapping improvements are implemented and verified in development. The 47-test suite, TypeScript, optimized build and actual local optimized-build planning/revision/refresh journey pass. Hosted promotion/acceptance is currently blocked by renewed GitHub/Vercel connectivity failure from this machine. Remaining voice and account acceptance gates above are retained; no fully production-ready claim is made. The caregiver review and video recording have not been conducted by this continuation.


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
