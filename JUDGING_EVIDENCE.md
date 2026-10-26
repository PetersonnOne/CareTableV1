# CareTable judging evidence register

Updated 26 October 2026. Competitive implementation resumed by the user; video rehearsal remains paused. This register is the claim authority for README highlights, presentation copy and walkthrough scripts. It distinguishes implemented behaviour, dated verification and future validation. An attractive UI or test count does not independently establish usefulness or production readiness.

The current [Qloo rules](https://qloo.devpost.com/rules) identify four equally weighted criteria: technological implementation, design, potential impact and idea quality. The [event brief](https://qloo.devpost.com/) emphasizes a meaningful difference from an LLM-only approach. This is our mapping to those criteria, not an organizer endorsement or judge score. See the [dated source review](research/qloo-competitive-review-2026-10-24/ASSESSMENT.md).

## Existing advantages

| ID | Advantage and criterion | Current evidence | Boundary / next proof |
| --- | --- | --- | --- |
| CT-E01 | Cultural grounding that can affect selection — technology, idea | Final live nine-scenario Qloo-on/off evaluation: six top-three changes, 12 changed deterministic-control slots, eligible sets preserved and no failed hard checks. Both variants recognize authored cuisine mappings. [Method and all cases](research/qloo-competitive-review-2026-10-24/evidence/README.md). | Measures deterministic selection influence using live evidence; no generic-LLM or human preference superiority claim. Three pooled signals are now chosen round-robin across members. |
| CT-E02 | Per-person restrictions within a shared table — technology, impact | `src/modules/meals/domain/checks.mjs` and `planning.ts`; individual/partner/family test matrix and dated live family run. Independent portions when shared intersection is empty. | Needs/exclusions are per person; taste discovery is pooled. No universal fairness or safety certification. |
| CT-E03 | Selection constrained by deterministic checks — technology | Server-side eligible IDs, catalog checks and bounded repair; malformed-ID and restriction tests. Original catalog/data attribution in DATA_ATTRIBUTION.md. | Twenty-six prototype recipes; unverified preparation, pricing, nutrition and clinical suitability remain unknown. |
| CT-E04 | Targeted revision without losing the prior plan — technology, design | Dated live revision preserving 41 unrelated slots and restrictions; saved snapshot/revision tests; history and recovery UI. | Exact revision improvement must be shown for the chosen recorded run. No alternative can be an honest result. |
| CT-E05 | Explicit human review and approachable trial — design | Confirmation gates, anonymous fictional sample, reviewed onboarding application, numbered steps, mode bubbles and targeted desktop/mobile checks. | Spoken voice has not passed acceptance; entering a mode never proves connection. No claim of effortless use for all older adults. |
| CT-E06 | Honest evidence and recoverable workflow — design, technology | Provider/source separation, visible unknowns, durable job expiry, bounded usage, saved-version recovery and ownership checks. See PRODUCTION_READINESS.md. | Not tamper-proof clinical/compliance evidence. Latest local changes have not received exact hosted-release acceptance. |
| CT-E07 | Care-specific product proposition — idea, potential impact | Implemented workflow follows caregiver meal-planning tasks; preferences, practical limits, review and feedback stay together. | The care benefit is a product hypothesis awaiting direct formative feedback. No measured health benefit, adoption, time saving or willingness-to-pay claim. |

Current verification: 47/47 regression tests and TypeScript pass on 26 October. Live development generation, saved meal receipts, selected-slot revision, unaffected-meal preservation and refresh pass in Chromium. Final build and hosted delivery evidence are tracked separately in VERIFICATION.md; do not equate development acceptance with production acceptance.

## Recommendation-to-evidence backlog

| ID | Next recommendation | Status | Evidence required before promotion to a completed advantage |
| --- | --- | --- | --- |
| CT-P01 | Representative Qloo-on/off comparison | Controlled live-evidence evaluation completed | Nine fixed scenarios, catalog/mapping hashes, retained first and revised runs, negative cases, ranking/plan outcomes and method linked above. Deterministic plan control deliberately avoids LLM randomness; repeated actual-LLM and human comparison studies are further work. |
| CT-P02 | Concise meal-level evidence receipt | Implemented; development browser journey passes | New saved meals preserve seed/connection provenance and before/after candidate ranks. Collapsible receipt explains app mapping and checks. No-match and unchanged rankings remain explicit. Historical plans without snapshots remain readable. |
| CT-P03 | Dependable hosted judge journey | Development journey passes; hosted delivery blocked 26 October | Latest live browser generation, revision, receipt and refresh pass with zero page errors. GitHub TCP and Vercel fetch/CLI fail from this machine, preventing push/deploy and exact hosted acceptance. Remaining voice/account gates remain separate. |
| CT-P04 | Caregiver formative review | Planned; potential reviewer identified by the user | Consent, dated task observations, reviewer role/context, relationship disclosure where relevant, anonymized notes, limitations, resulting changes and participant approval for any public quotation. No session has happened yet. |
| CT-P05 | Targeted cultural variety and mapping coverage | Six recipes and reviewed mapping coverage completed | Catalog expands from 20 to 26; Italian/Chinese/Indian/Thai/Mexican/West African-inspired additions, exact reviewed provider-tag mappings, soy-exclusion test and round-robin household signals. Longer plans can still repeat; physical preparation and human familiarity remain to be reviewed. |
| CT-P06 | Memorable evidence-backed improvement story | Story draft only; rehearsal paused | Actual before/after recording linked to saved plan versions, preserved restrictions/slots, accurate source labels and approved narration. R0 local preview does not satisfy live evidence. |

## How future work updates the presentation

Public-facing copy should lead with demonstrated capabilities and the value they deliver. Use **What's next** for future work; do not attach a limitation column to every advantage or create a weakness-focused presentation slide. Keep detailed QA, source boundaries and release findings in their supporting records. Describe a claim precisely enough to stand on its own, and never promote unfinished work to a completed capability.

For every completed recommendation or material fix:

1. Record the build/date, evidence file or reproducible command, observed result, failure/unknown cases and remaining limitations here and in VERIFICATION.md as appropriate.
2. Move only the supported part from planned to verified. Keep historical evidence and avoid silently replacing old results.
3. Update README's advantage table when the change alters the public claim. Keep the hosted/local distinction explicit.
4. Update local `Submission Video Workspace/PRESENTATION_MESSAGE_MAP.md`, `CLAIM_TO_SHOT_MATRIX.csv`, storyboard and narration. These stay Git-ignored. Do not start recording or paid generation merely because a script changed.
5. If caregiver feedback is involved, use the review kit. A proposed reviewer is not a testimonial; a completed small review is not clinical validation. Report favourable and unfavourable observations.
6. Before publication, check claims against the actual final build and obtain any necessary quote/identity permission. Competitive improvements resumed on 26 October; video rehearsal stays paused. Caregiver validation still requires an actual consented review.
