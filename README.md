# CareTable

A little more care at every meal. CareTable helps caregivers and households find appealing meal suggestions without losing each person's explicit needs. Qloo supplies aggregate dining affinities; GPT-6 Luna selects from an original recipe catalog; application code checks ingredients, equipment, time, and completeness before saving the result.

## Why CareTable stands out

**A meal can fit the checklist and still miss the person.** CareTable brings familiar tastes, explicit needs and practical cooking limits into one explainable workflow. Its focus is the everyday act of care: helping someone understand, review and improve what goes on the table.

| CareTable's edge | What we have built | See it in the product |
| --- | --- | --- |
| **Culturally grounded choices** | Real Qloo dining affinities influence eligible-recipe ranking, with traceable connections to CareTable's original recipes. | Open **Why this meal fits your table**: resolved signals → returned connections → our mapping → checks, plus saved before/after candidate ranks. |
| **A place for each person's needs** | Individual, partner and family profiles retain member-specific exclusions and recipients. Independently checked portions provide another path when no shared recipe fits. | Household controls, recipient portions and ingredient checks. |
| **Intelligence backed by checks** | Luna selects from eligible catalog IDs; application code checks ingredients, equipment, time and plan completeness. | Meal details and clear results for each applied catalog check. |
| **Improve one meal, keep your plan** | Targeted feedback revises a selected meal while preserving saved restrictions, other slots and previous versions. | The selected meal before and after revision, with saved history. |
| **People stay in control** | Reviewed settings and proposed changes need confirmation. Sample access, numbered guidance and contextual mode descriptions make the workflow approachable. | Fictional sample → review → generate → inspect → improve. |
| **A workflow you can follow** | Taste evidence, original recipe attribution, durable jobs and saved-version recovery keep the process inspectable. | Source-backed explanations, job progress and previous plan versions. |

**Measured Qloo contribution:** a [nine-scenario development evaluation](research/qloo-competitive-review-2026-10-24/evidence/README.md) changed the top-three ordering in six scenarios and 12 slots in deterministic control plans, while preserving eligible sets and recording no failed hard checks in selected recipes. Both variants recognize the same known cuisine mappings. The study measures Qloo's effect on our selection logic, not human meal preferences or superiority over a generic LLM.

**Demonstrated in development:** live Qloo-backed planning, targeted meal revision, saved receipts and refresh recovery. The current regression suite passes 47 tests; dated results and browser checks are recorded in [verification](VERIFICATION.md).

See the [judging evidence register](JUDGING_EVIDENCE.md) for the supporting implementation and verification behind these advantages.

[Open the hosted app](https://caretable-v1.vercel.app) · [GitHub source](https://github.com/PetersonnOne/CareTableV1). Pushes to `main` automatically build and publish through Vercel, including production Convex deployment.

Built with Next.js App Router, React, TypeScript, Convex, Convex Auth, OpenAI Responses, and Resend. Deploy the web app to Vercel and its database/functions to Convex. No Express service is required.

## Run locally

Use Node.js 24 and npm. Copy `.env.example` to `.env.local`, install with `npm ci`, then configure a Convex project using `npx convex dev`. The existing CareTable development project belongs to the `joseph-petersonn` team. Do not create a second project when continuing that workspace.

Set the public Convex deployment URLs in `.env.local`. Put `OPENAI_API_KEY`, `QLOO_API_KEY`, `RESEND_API_KEY`, and `RESEND_FROM` in the **Convex server environment**, never in a `NEXT_PUBLIC_` variable. The local setup scripts copy credentials without printing them, and deliberately restrict provider/email setup to this workspace's selected development deployment:

```powershell
node --use-system-ca scripts/configure-auth.mjs
node --use-system-ca --env-file=.env.local scripts/configure-providers.mjs
node --use-system-ca --env-file=.env.local scripts/configure-email.mjs
npm run dev
```

Open http://localhost:4317. `--use-system-ca` enables the Windows system trust store; TLS verification stays enabled. `configure-auth.mjs` preserves existing signing keys. For a different project, configure its environment in the Convex dashboard instead of bypassing script guards.

```powershell
npm test
npm run typecheck
npm run build
npm start
```

Stop the development server before building; both use `.next`. See [deployment instructions](DEPLOYMENT.md) and [verification evidence](VERIFICATION.md).

## Try the product

1. Choose **Try a fictional sample**. This opens an anonymous Convex session without personal data or email signup.
2. Interactive Mode is the initial selection. For the verified manual journey, choose **User Mode**, then inspect each person's preferences and exclusions. Currency and region remain editable. Optional conversational onboarding proposes fields for review.
3. Choose 3, 7, or 14 days, meal slots, equipment, time, and an optional whole-plan budget. Confirm the inputs.
4. Create a live Qloo + Luna plan. Inspect recipients, ingredients, preparation, checks, alternatives, and the source identifiers behind cultural affinities.
5. Use **Find a better fit** to revise a slot while retaining the saved plan's restrictions. Earlier versions remain available in history.
6. Reset the sample to delete its saved households/plans and leave the anonymous session. Custom households and plans also have delete controls.

**Local preview** makes no OpenAI or Qloo requests and is labeled separately. Draft household fields persist in this browser until reset. Signed-in households, preferences, and plans persist in Convex under their owner. A sample session depends on its browser credentials; it is not a permanent email account.

## How CareTable works

- CareTable includes 26 original prototype recipes, with six new cuisine-inspired choices covering reviewed Italian, Chinese, Indian, Thai, Mexican and West African mappings. Each recipe carries its attribution.
- Qloo uses exact restaurant/cuisine tags from up to three distinct favorite inputs, selected round-robin across household members, then dining affinities from Insights. Recipe mappings are CareTable's interpretation. The strongest mapped affinity contributes to ranking so synonymous tags do not stack extra votes. Unmatched inputs stay unresolved. A warm-worker cuisine cache expires after 10 minutes and may be lost on a cold start.
- Explicit ingredient matches fail a candidate for any intended eater. Each check displays its result; unsupported restrictions and incomplete composition are marked **cannot verify**.
- Budgets identify their currency and whole-plan scope; without verified regional prices the budget result remains unknown.
- Luna is fixed to `gpt-6-luna`; no automatic model upgrade exists. One constrained selection call and one deterministic repair pass are bounded. Requests use provider timeouts and a persisted expiry. Failure preserves profiles and earlier plan versions.
- “Too difficult” revisions require a shorter estimated cooking time; if no quicker eligible meal exists, the previous plan is preserved.
- Email verification and recovery use the verified `CareTable <accounts@notify.geneaone.com>` Resend sender. Cloudflare remains authoritative for GeneaOne DNS. Sample access needs no email.
- Limits: 8 household members, 20 saved households, 6 plan requests per hour per identity, one active job per identity, and a shared 200-plan daily demonstration cap. Conversational onboarding has a separate 12/hour per identity and 200/day cap. Anonymous sessions can be replaced, so these controls are not a complete bot-prevention system.
- Names are omitted from Luna planning input; only cuisine/food preferences go to Qloo. Onboarding sends the text entered by the user to OpenAI. Avoid personal or medical details. OpenAI requests set `store: false`; this is not a claim of zero provider retention.

## Administration

Signups receive member access. A trusted operator must deliberately bootstrap the intended owner using the internal `administration:bootstrapOwner` function after that owner registers. Never promote the sample account. Superadmins manage site appearance; scoped admins can manage people or audit records only with the corresponding permission. Database functions enforce access independently of navigation.

Garden, Midnight (the default), Dark, and White themes support a site default and a private per-user override. Staff, theme, household, planning, and assistant outcomes write bounded audit metadata. Audit records exclude credentials and ingredient lists; they are not tamper-proof compliance logs.

The planner has **User Mode / Interactive Mode**, and feedback has **Chat / Discuss with AI**. Both voice features use `gpt-live-1`; entering a mode does not start the microphone. Local Chromium checks now demonstrate live user/AI captions and audio transport in both modes, mute/unmute, and reviewed spoken setup leading to a saved plan. See [voice behavior](VOICE_FEATURES.md) and the [production readiness audit](PRODUCTION_READINESS.md) for tested paths and remaining release blockers.

## What's next

- Human review of the usefulness of culturally grounded choices, building on the completed controlled Qloo-on/off evaluation.
- More culturally coherent recipe choices and richer meal-level explanations.
- Complete release verification and the spoken-interaction acceptance journey.

## Project records

- [Product requirements](CareTable_PRD.md)
- [Architecture and model decisions](CareTable_Agent_Architecture_and_Model_Decisions.md)
- [Foundation decisions](FOUNDATION_DECISIONS.md)
- [Recipe/data attribution](DATA_ATTRIBUTION.md)
- [Verification and release gates](VERIFICATION.md)
- [Judging evidence and future validation](JUDGING_EVIDENCE.md)
- [Competitive assessment](research/qloo-competitive-review-2026-10-24/ASSESSMENT.md)
- [Deployment](DEPLOYMENT.md)

The local retrospective catalog, private credentials, provider PDFs, browser artifacts, and archived Vite/Express prototype are Git-ignored. `Post Hackathon App Idea.txt` belongs to a separate app and is excluded.

Video submission materials are kept locally in [Submission Video Workspace](<Submission Video Workspace/README.md>). The entire folder is Git-ignored, including scripts, drafts, references, recordings and exports.


26 October hosted verification: the updated [CareTable website](https://caretable-v1.vercel.app) was delivered automatically from GitHub main. Chromium checks passed live plan generation, saved evidence receipts, refresh recovery and mobile layout.


Account navigation now reuses the confirmed initial session token, avoiding an unnecessary refresh during sign-in and sign-up redirects. Local and hosted Chromium checks passed signup, verification, recovery and existing-account navigation without Leave site dialogs.
