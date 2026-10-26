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
