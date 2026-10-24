# CareTable: Qloo competitive assessment

Checked 24 October 2026. Demo rehearsal/review is paused. Production-readiness work remains paused. This is research and a proposed priority order, not authorization to build, publish, recruit participants or resume video production.

## Candid verdict

CareTable has a credible route to being competitive, but the present evidence does not justify calling it a likely top-three entry. Its care-specific problem, original meal/check/revision workflow and clear source boundaries are worthwhile differentiators. The strongest next improvement is demonstrable Qloo value, followed by a reliable judge experience and actual user feedback. No honest analysis can guarantee a win or assign meaningful numerical odds without knowing the field and judges' scores.

## Confirmed previous winners

Qloo's [official announcement](https://www.linkedin.com/posts/qloo_hackathon-culturalintelligence-aiinnovation-activity-7370873373666549760-4W2g) identifies GeoTaste as first place ($10,000), with Alloy, Resonance AI and Zesty receiving $5,000 honorable mentions. The [2025 gallery](https://qloo-hackathon.devpost.com/project-gallery) confirms the winner entries. These are the 2025 LLM event winners, not winners of the ongoing 2026 agentic event. Participant counts differ between pages; they are neither submission totals nor a sound way to calculate our odds.

| Project | Published product direction | My interpretation of its edge |
| --- | --- | --- |
| [GeoTaste](https://devpost.com/software/geotaste-your-agentic-qloo-taste-business-consultant) | Location/business analysis with an agent, interactive maps and data visualizations. | A decision-support product whose data can become visible, actionable evidence. |
| [Alloy](https://devpost.com/software/axiom-2bn391) | Cultural due diligence for acquisitions, agent analysis, compatibility/risk reporting, richer brand proxies and explicit fallback routes. | A non-obvious cultural-intelligence application tied to a consequential business decision. |
| [Resonance AI](https://devpost.com/software/resonance-ai-1hjbf0) | Geographic/cultural analysis leading to campaign material through an agent workflow. | It connects analysis to a usable output rather than ending at a chat answer. This is a descriptive comparison, not a recommendation to build political targeting. |
| [Zesty](https://devpost.com/software/zesty) | Discovery deliberately outside existing taste patterns, with onboarding and reflection. | A memorable reversal of ordinary recommendation logic, clearly expressed as a product idea. |

Those edges are my inferences from published project descriptions, not Qloo's private scoring rationale. I did not independently rerun the winners' applications, audit their code or verify their marketing performance claims. Do not inherit their claimed time savings, market sizes, audience predictions or production readiness as established facts.

## What is actually known about judging

The [2025 rules](https://qloo-hackathon.devpost.com/rules) describe a viability pass followed by five equally weighted areas: LLM use, Qloo integration, execution, originality and practical application. They describe averaging judges' scores. The organizer's [judging update](https://qloo-hackathon.devpost.com/updates/38031-judging-update) says entries were shortlisted and assessed on merit. I found no public per-project scorecards or detailed winner-specific rationale in the announcement and official updates checked.

For the current event, the [2026 rules](https://qloo.devpost.com/rules) give four equally weighted areas: technological implementation, design, potential impact and idea quality. Technology is the first tie-breaker. They require accessible working software and public open-source code. Submission closes 30 October at 11:45pm EDT, equivalent to 31 October at 4:45am Lagos time.

The [2026 overview](https://qloo.devpost.com/) makes Qloo's effect central: a generic LLM-only version should not work just as well. It explicitly says a demo video is not required; the usable externally hosted app is. It also announces an on-air presentation for the top three finalists on 5 November, with preparation/availability details to follow. Recheck these pages before submission because organizers can change requirements.

## CareTable against the current criteria

This comparison uses source inspected today and the existing dated acceptance records. It is not a new full QA run, user study or numerical judge score.

| Criterion | Existing strength | Gap that matters |
| --- | --- | --- |
| Technology | Real Qloo dining-tag discovery, eligible-candidate scoring, Luna selection, deterministic checks, bounded recovery, saved revisions. | Show a real controlled comparison of what Qloo changes; distinguish returned evidence from our editorial recipe mapping. |
| Design | Coherent care identity, sample path, numbered guidance, two planning modes, contextual bubbles, readable unknown states. | Current UI is local/unpublished; default Interactive Mode leads toward spoken audio that has not passed transport acceptance. A polished dead end undermines coherence. |
| Impact | A specific recurring task for caregivers and older adults; also supports partners/families. | No direct caregiver/older-adult usability validation is established by this review. Preparation time, costs and suitability are not clinical or real-world outcome evidence. |
| Idea | Cultural familiarity combined with explicit needs is a useful care-specific framing. | Generic meal planning is crowded. We must demonstrate an insight a standard recipe generator would miss, without claiming taste affinity predicts an individual's enjoyment. |

## What today's source inspection establishes

- `convex/services/taste.ts` resolves exact dining/cuisine tags from up to three unique favorite inputs and queries related dining tags. Unsupported inputs remain unresolved. It is not currently a general music/book-to-food discovery pipeline.
- `convex/services/planner.ts` pools member favorites before discovery. `src/modules/meals/domain/planning.ts` adds direct preference matches and Qloo-affinity-linked weights, using application-authored recipe/tag mappings. Hard exclusions are checked separately. Those source boundaries are a strength.
- `src/modules/meals/domain/catalog.mjs` has **20 recipes**: 7 breakfast-eligible, 16 lunch-eligible, 15 dinner-eligible; slot memberships overlap. A small inspectable catalog is defensible, but longer plans can be repetitive and apparent cultural breadth can exceed actual mapped choices.
- The existing test for a changed candidate ranking is a controlled unit scenario. It does not by itself prove that live Qloo meaningfully improves final plans across representative households.
- Pooled taste inputs do not establish balanced taste representation for each family member. Existing per-member restriction/portion protections are distinct from preference fairness.
- Existing readiness records retain unresolved spoken-voice acceptance and hosted-release/account checks. Connectivity was restored on 23 October, but that did not publish the latest local app.

## Proposed priorities, in order

### 1. Prove the Qloo difference

Use identical fictional profiles, recipe universe and hard constraints with and without real returned Qloo evidence. Start with deterministic candidate-ranking comparisons so model randomness cannot explain the change. Then compare saved final plans with documented model/settings and repeated runs where needed. Retain raw sanitized provider evidence, unresolved seeds and all negative/no-change cases.

Show which meals/ranks change, which real taste connections explain the change, and whether restrictions remain preserved. Do not turn an internal affinity score into a percentage probability of liking a meal. Use a small varied scenario set rather than cherry-picking the strongest single result. Report coverage failures and limited catalog mappings.

### 2. Make that evidence understandable

Propose a concise meal-level receipt: entered preference → resolved Qloo seed → returned connection → our recipe mapping → applicable checks → change history. Existing details can support this; it need not become another overwhelming dashboard. If a returned connection is not relevant to any available recipe, say so. Qloo does not certify meals or safety.

### 3. Deliver one dependable judge journey

When production work resumes, verify the externally hosted sample → plan → evidence → feedback → revised meal path on the exact intended release. Keep API errors honest and preview distinct from live data. Fix voice before making spoken interaction a headline demonstration. If voice remains unresolved, propose a clearly labelled unavailable state or an equally prominent working User Mode path; any default-mode change should be discussed with the user rather than silently undoing their choice.

Public repository/license and submission access are real entry requirements, but publication remains a separate user decision. Admin-owner provisioning should not distract from the publicly usable sample journey if it is unnecessary to judge it.

### 4. Validate the care problem with real people

With permission, conduct three to five short formative sessions with caregivers/older adults or appropriate proxies. Ask them to compare clarity, familiarity, effort and usefulness of the plan and revision. Track task completion, points of confusion and qualitative preferences. A tiny convenience sample supports design iteration, not clinical efficacy, general population claims or guaranteed willingness to pay.

### 5. Strengthen a few culturally coherent paths

Inspect the catalog against representative favorite cuisines and equipment/texture constraints. Expand and review mappings only where needed to demonstrate genuine variety; do not maximize recipe count for its own sake. Avoid inferring cuisine from ethnicity, age, nationality or a diagnosis. Cross-domain Qloo discovery could be an optional research spike if food coverage is adequate, but it is not mandatory and should not displace the core proof/reliability work.

### 6. Present one memorable before/after

Keep the story centered on one person's familiar preferences and a practical obstacle, followed by a traceable improvement. Show why the replacement makes sense and what stayed unchanged. The video can communicate that later; it cannot compensate for an unusable hosted app. No further carousel/theme/admin additions are proposed for competitive impact at this stage.

## Recommended positioning

“CareTable helps caregivers turn familiar tastes and practical needs into explainable meal plans—and revise a meal without losing sight of the person.”

My advice is to keep the project, narrow its competitive claim, and deepen the evidence. The strongest version is a dependable care workflow whose Qloo contribution a judge can inspect and test. It need not acquire the largest model, the most features or a fashionable agent framework merely to appear advanced.

## Research limitations and tools

TinyFish search returned `fetch failed`; research continued through the available web search/open tool. Official organizer pages and project-authored Devpost entries are the primary sources. Current competitors were not exhaustively assessed, so this is not a ranking of the entire 2026 field. No product code, provider settings, repository visibility, deployment or narration was changed by this research task.
