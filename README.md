# CareTable

A little more care at every meal. CareTable helps caregivers and households find appealing meal suggestions without losing each person's explicit needs. Qloo supplies aggregate dining affinities; GPT-6 Luna selects from an original recipe catalog; application code checks ingredients, equipment, time, and completeness before saving the result.

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
2. Inspect each person's preferences and exclusions. Currency and region remain editable. Optional conversational onboarding proposes fields for review.
3. Choose 3, 7, or 14 days, meal slots, equipment, time, and an optional whole-plan budget. Confirm the inputs.
4. Create a live Qloo + Luna plan. Inspect recipients, ingredients, preparation, checks, alternatives, and the source identifiers behind cultural affinities.
5. Use **Find a better fit** to revise a slot while retaining the saved plan's restrictions. Earlier versions remain available in history.
6. Reset the sample to delete its saved households/plans and leave the anonymous session. Custom households and plans also have delete controls.

**Local preview** makes no OpenAI or Qloo requests and is labeled separately. Draft household fields persist in this browser until reset. Signed-in households, preferences, and plans persist in Convex under their owner. A sample session depends on its browser credentials; it is not a permanent email account.

## Evidence and limits

- The 20 recipes are original prototype suggestions, licensed under MIT with this source. They are not copied from a recipe provider, returned by Qloo, or independently tested preparations. Longer plans may repeat recipes.
- Qloo uses exact restaurant/cuisine tags from up to three distinct favorite inputs, then dining affinities from Insights. The recipe mappings are CareTable's interpretation, visible separately from returned identifiers. Unmatched inputs stay unresolved. A warm-worker cuisine cache expires after 10 minutes and may be lost on a cold start.
- Explicit ingredient matches fail a candidate for any intended eater. Unsupported restrictions and incomplete composition remain **cannot verify**. No clinical, swallowing-safety, product-label, cross-contact, nutrition, local-availability, or verified-price claims are made.
- Budgets identify their currency and whole-plan scope; without verified regional prices the budget result remains unknown.
- Luna is fixed to `gpt-6-luna`; no automatic model upgrade exists. One constrained selection call and one deterministic repair pass are bounded. Requests use provider timeouts and a persisted expiry. Failure preserves profiles and earlier plan versions.
- “Too difficult” revisions require a shorter estimated cooking time; if no quicker eligible meal exists, the previous plan is preserved. Actual preparation difficulty is not independently verified.
- Email verification and recovery use the verified `CareTable <accounts@notify.geneaone.com>` Resend sender. Cloudflare remains authoritative for GeneaOne DNS. Sample access needs no email.
- Limits: 8 household members, 20 saved households, 6 plan requests per hour per identity, one active job per identity, and a shared 200-plan daily demonstration cap. Conversational onboarding has a separate 12/hour per identity and 200/day cap. Anonymous sessions can be replaced, so these controls are not a complete bot-prevention system.
- Names are omitted from Luna planning input; only cuisine/food preferences go to Qloo. Onboarding sends the text entered by the user to OpenAI. Avoid personal or medical details. OpenAI requests set `store: false`; this is not a claim of zero provider retention.

## Administration

Signups receive member access. A trusted operator must deliberately bootstrap the intended owner using the internal `administration:bootstrapOwner` function after that owner registers. Never promote the sample account. Superadmins manage site appearance; scoped admins can manage people or audit records only with the corresponding permission. Database functions enforce access independently of navigation.

Garden, Midnight (the default), Dark, and White themes support a site default and a private per-user override. Staff, theme, household, planning, and assistant outcomes write bounded audit metadata. Audit records exclude credentials and ingredient lists; they are not tamper-proof compliance logs.

The planner has **User Mode / Interactive Mode**, and feedback has **Chat / Discuss with AI**. Both voice features use `gpt-live-1`; entering a mode does not start the microphone. See [voice behavior](VOICE_FEATURES.md) and the [production readiness audit](PRODUCTION_READINESS.md) for tested paths and remaining release blockers.

## Project records

- [Product requirements](CareTable_PRD.md)
- [Architecture and model decisions](CareTable_Agent_Architecture_and_Model_Decisions.md)
- [Foundation decisions](FOUNDATION_DECISIONS.md)
- [Recipe/data attribution](DATA_ATTRIBUTION.md)
- [Verification and release gates](VERIFICATION.md)
- [Deployment](DEPLOYMENT.md)

The local retrospective catalog, private credentials, provider PDFs, browser artifacts, and archived Vite/Express prototype are Git-ignored. `Post Hackathon App Idea.txt` belongs to a separate app and is excluded.
