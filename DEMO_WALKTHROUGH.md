# CareTable demonstration and submission draft

**Current status:** [Public hosted app](https://caretable-v1.vercel.app) and [GitHub source](https://github.com/PetersonnOne/CareTableV1) are available; the source repository is currently private, pending a visibility decision for submission. GitHub `main` triggers automatic Vercel/production Convex deployment. Live 3/7/14-day planning was verified locally; hosted sample generation, corrected quicker-meal revision, and refresh recovery also passed. Email remains limited to Resend's authorized test recipient until GeneaOne DNS is verified.

## Project description

Meal planning is an act of care, but a technically suitable meal can still feel unfamiliar or unwelcome. CareTable helps older adults, caregivers, partners, and families keep taste and practical needs together. It captures each person's favorites and explicit exclusions, discovers related dining tastes through Qloo, and asks GPT-6 Luna to select from an inspectable recipe catalog. Deterministic checks and honest unknown states keep cultural affinities separate from suitability claims.

CareTable's workflow covers setup, optional conversational interpretation, confirmation, Qloo discovery, eligible recipe selection, checks, bounded repair, saved plans, feedback, and targeted revision. It supports 3, 7, and 14 days with selectable breakfast/lunch/dinner slots. A fictional sample allows judges to try live planning without entering personal data or creating an email account.

The stack is Next.js App Router for Vercel, Convex database/functions and authentication, OpenAI Responses using `gpt-6-luna`, and Resend for email verification/recovery. Qloo dining tags and affinities are retained with source identifiers and timestamps; mappings from these tags to our recipes are clearly identified as application interpretations.

## A short judging path

1. Open **Try a fictional sample**. Explain that its needs are editable demonstration data, with no default country.
2. Show favorites versus dislikes versus ingredients to avoid. Optionally interpret a short preference sentence and inspect the proposed fields before applying them.
3. Confirm three dinner slots across three days and choose **Create a Qloo + Luna plan**. The stages are real persisted job progress.
4. Inspect a meal's recipients, ingredients, scaled servings, preparation, and alternatives. Expand **See every check**. Soft preparation and missing regional prices remain unverified.
5. Show resolved Qloo dining affinities and their identifiers, then the separate recipe mapping. Unsupported favorite inputs remain unresolved.
6. Choose **Find a better fit**, give a reason, and request revision. Show the new version and the saved original; the original restrictions are read from the server.
7. Show longer duration options, partner/family profiles, personal themes, and refresh recovery. Reset the sample when finished.

For a deterministic fallback demonstration, use **Local preview** and explicitly say it makes no Qloo/OpenAI requests. Do not describe it as a replay of a live response.

## Evidence to mention accurately

- Live 3-day plan and revision, 7-day partner plan with separate peanut/wheat exclusions, and 14-day/42-slot plan completed.
- Actual returned dining affinities visibly mapped to selected tomato pasta and carrot-and-ginger rice in different runs.
- 24 automated checks cover access boundaries, exclusions, variants, completeness, invalid output repair, relevant quicker-meal revision, persistence, revision preservation, and durable usage limits.
- Original recipes are prototype suggestions under MIT, not clinically validated preparations. Qloo supplies cultural intelligence, not recipes or medical safety certification.

See [verification](VERIFICATION.md) for exact evidence and remaining release gates. The app/source are published; no Devpost submission has been made by this workflow.
