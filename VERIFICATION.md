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

- Public source pushed to [CareTableV1](https://github.com/PetersonnOne/CareTableV1). Vercel's `caretable-v1` project is connected to GitHub `main`. Its first automatic deployment cloned commit `2d9b15a`, ran the production Next.js/Convex pipeline, and reached Ready at [caretable-v1.vercel.app](https://caretable-v1.vercel.app).
- Production uses Convex `artful-raven-948`; development and previews use `outstanding-crocodile-717`. Production credentials/signing keys are separate. The Vercel production deploy key is stored as a protected secret. Upload ignore rules exclude local environments, archives, private files, and the retrospective.
- Hosted browser initially found an invalid JWKS response caused by escaped JSON in production environment setup. Corrected serialization and reapplied it without rotating signing keys. Public discovery/JWKS endpoints now parse correctly; hosted anonymous sign-in and a live three-day Qloo + Luna plan succeeded.
- Hosted “Too difficult” feedback exposed selection of a slower meal. The corrected pipeline enforces a strictly shorter estimate and preserves the original when no quicker eligible option exists. Two regression tests cover successful repair of a slower model choice and no-match preservation; final hosted recheck follows the next automatic deployment.
- Resend temporary test sender configured per user choice. Development integration sent verification and reset messages to the authorized Resend account address; both reported **delivered**. Wrong code, reused code, unverified signup, member-only access, reset sign-in, old-password rejection, and new-password success checks passed. Temporary QA credentials remain private and are not production account credentials.
- `notify.geneaone.com` added to Resend for the future sender. Email DNS is prepared on Vercel; authoritative nameservers remain with Unstoppable Domains. Registrar login, full DNS inventory, and the existing DS/DNSSEC transition remain pending. GeneaOne is not assigned to the CareTable website.

## Automated checks

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
| CT-20 | Public GitHub source, MIT license, setup/data documentation, and hosted Vercel app are available. GitHub `main` automatically deploys the website and production Convex functions. Hosted sample generation verified; corrected feedback recheck pending next build. |

## Remaining release gates

1. General-recipient email requires GeneaOne DNS verification. Temporary-sender delivery, verification, recovery, wrong-code/reuse, and password-change checks passed in development. A full 15-minute expiry waiting test and hosted human signup remain unverified.
2. Select/register the intended owner account and provision its role; complete staff UI checks using real authenticated staff.
3. Production build, root typecheck, 24 tests, and client-secret scan have passed; repeat relevant checks after material changes.
4. GitHub, Vercel, and production Convex are connected. Recheck the corrected feedback behavior after the next automatic build; finish DNS migration after registrar authentication and DNSSEC review.

The ignored `retrospective-catalog/` contains more detailed local recovery notes and encountered issues. Provider payloads, credentials, and browser artifacts remain outside public source.
