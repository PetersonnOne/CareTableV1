# CareTable — Product Requirements Document

**Version:** 0.1 (requirements baseline; implementation evidence updated separately)  
**Date:** 20 October 2026  
**Status:** Requirements baseline. See [22 October verification](VERIFICATION.md) for implemented features, live evidence, and remaining release gates. Creation-time implementation statements below are historical.  
**Product:** Qloo Agentic Hackathon application  
**Model direction:** GPT-6 Luna (`gpt-6-luna`) using the user's OpenAI API account; access remains untested.

**20 October implementation update:** The user requires Next.js hosted on Vercel, without a separate Express deployment. Luna access and synthetic function calling have now passed; the product remains unverified. The initial scaffold was archived and development stopped pending the user's foundation prompt pack. See [Next.js restart handoff](NEXTJS_RESTART_HANDOFF.md). This supersedes the earlier open stack selection and untested-access status, without changing product scope.

## 1. The beauty of CareTable

CareTable helps turn meal planning from a list of restrictions into an act of care. A caregiver should be able to respect what someone enjoys, preserve the familiarity of their food culture, and find practical alternatives without repeatedly starting from scratch.

The product combines cultural taste intelligence with explicit household needs. Its value is the complete loop: understand the people, discover appealing options, check requirements, explain choices, listen to feedback, and revise.

The core challenge is that a meal can technically match constraints and still be unwelcome. Qloo should improve the selection of appealing options, while our application makes those options practical and inspectable.

## 2. Inputs, authority, and evidence

This PRD translates the [concept brief](CareTable_Global_Hackathon_Concept.md) and [architecture/model record](CareTable_Agent_Architecture_and_Model_Decisions.md). It preserves individual, partner, and family profiles; 3-, 7-, and 14-day planning; a global design; real Qloo use; and feedback-driven revision.

The user has selected the Luna-first direction and reports possessing an OpenAI API key. Technical access and performance have not been verified. Detailed defaults introduced here are implementation proposals, not additional user decisions.

`Post Hackathon App Idea.txt` is a separate project and is excluded.

External references are linked for implementation research: [Qloo capabilities](https://www.qloo.com/capabilities), [Qloo developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide), [hackathon brief](https://qloo.devpost.com/), [official rules](https://qloo.devpost.com/rules), and [GPT-6 Luna documentation](https://developers.openai.com/api/docs/models/gpt-6-luna). The architecture record contains the preceding source check; this PRD does not claim a new API probe or rule verification.

## 3. Users and jobs

| User | Main job | Successful outcome |
|---|---|---|
| Older adult | Find appealing meals within stated practical needs | Readable options, recognizable preferences, and easy feedback |
| Caregiver | Plan on another person's behalf | Restrictions remain visible and survive revisions |
| Partner household | Coordinate food for two people | Each person's needs remain distinct and shared meals fit both |
| Family planner | Coordinate several people | Plans show who eats each meal and explain conflicts |
| Judge or first-time visitor | Understand and try the product quickly | Sample profile leads to a complete, inspectable planning loop |

Relationship labels are descriptive; spouses, twins, siblings, or other pairs use the same two-person planning logic. Relationship type must not imply dietary needs.

## 4. Goals and product boundaries

### Required hackathon product

- Accessible web experience with sample and custom setup.
- Individual, partner, and family planning with member-specific preferences and restrictions.
- Selectable 3-, 7-, and 14-day plans, alternatives, and targeted revision.
- Actual Qloo results that materially influence meal selection.
- Luna-driven conversation and tool coordination with application-controlled validation.
- Structured recipe information with source attribution and honest data limitations.
- Deterministic checks, including explicit unknown states.
- Externally hosted working demo and submission materials after implementation.

### Outside the initial scope

Clinical nutrition prescriptions, diagnosis, medication-interaction inference, food-order fulfillment, grocery checkout, live inventory guarantees, and certified swallowing-safety assessments are excluded. Monetization, voice interaction, social networking, and multi-agent orchestration are not initial requirements.

Global suitability means adaptable inputs and honest coverage; it does not mean verified recipe, pricing, or Qloo coverage for every region. English is the proposed initial interface language, with locale-aware currency and units. Additional interface translations are open future work.

## 5. User journeys and screens

1. **Welcome:** Explain the benefit and offer “Try a sample” or “Create a profile.” No mandatory account is proposed for the judge path.
2. **Household setup:** Choose individual, partner, or family; add members and identify intended eaters.
3. **Preferences and needs:** Gather favorites, dislikes, exclusions, preparation/texture preferences, region, units, budget, time, and equipment through editable controls supported by conversation.
4. **Review:** Show the structured interpretation before planning. Clearly separate preferences from hard restrictions.
5. **Plan request:** Choose duration and meal slots. Proposed default: one main meal per day, with breakfast/lunch/dinner selection available; the product must state exactly what the plan covers.
6. **Planning progress:** Show real stages such as finding taste connections, selecting meals, and checking requirements. Do not simulate completed API work.
7. **Plan overview:** Display days, meal names, recipients, alternatives, and check summaries in a readable calendar/list layout.
8. **Meal details:** Show ingredients, quantities, servings, preparation, source, taste evidence, checks, and limitations.
9. **Feedback and revision:** Replace or adapt a selected meal, show what changed and why, and preserve the previous plan until a checked replacement is ready.

A concise three-day sample demonstrates the loop; it must not limit custom plan duration.

## 6. Functional requirements and acceptance criteria

All requirements below are **not implemented** at this document's creation.

| ID | Requirement | Acceptance criteria |
|---|---|---|
| CT-01 | Sample setup | Visitor can open a clearly fictional older-adult sample, inspect/edit its needs, and request a plan without entering personal data. |
| CT-02 | Custom profiles | User can create/edit an individual, exactly two-member partner household, or multi-member family. Member preferences and exclusions remain attached to the right person after edits. |
| CT-03 | Conversational onboarding | Agent extracts structured fields, asks about ambiguous requirements, and permits skipped preference questions. No restriction is silently invented. |
| CT-04 | Explicit confirmation | Before generation, user can inspect and edit the interpreted household, recipients, restrictions, duration, slots, and practical limits. |
| CT-05 | Plan completeness | Successful requests produce the selected 3, 7, or 14 days and selected slots, each with recipients and servings. Partial plans identify every unfilled slot and reason. |
| CT-06 | Qloo discovery | Live results are retained with source identifiers/context. At least one result genuinely informs ranking or selection in the supported demo flow. Unsupported references remain visibly unresolved. |
| CT-07 | Honest taste explanations | Qloo evidence, our recipe mapping, and the agent's wording are distinguishable. No explanation invents an API-supported affinity or presents an affinity score as a health score. |
| CT-08 | Recipe grounding | Each selected recipe has a source/license record, ingredients, servings, preparation steps, and available time/equipment attributes. Missing fields are marked unknown; generated adaptations are labeled. |
| CT-09 | Alternatives | Each filled slot offers at least one checked alternative when candidates exist. Otherwise it explains the shortage without fabricating one. |
| CT-10 | Ingredient checks | Normalized ingredients, supported aliases, and known compound ingredients are checked against every intended eater's exclusions. Matches fail; incomplete relevant evidence returns cannot verify. |
| CT-11 | Practical checks | Available recipe time, equipment, serving, and preparation/texture attributes are compared with entered needs. Results include reasons and evidence. |
| CT-12 | Budget handling | User specifies currency and budget scope. Supported quantities/prices produce calculations; incomplete costs show estimates or unknown status, never a verified budget pass. |
| CT-13 | Shared household meals | Shared meals meet all intended eaters' hard restrictions. Separate variants identify recipients and are independently checked; no household averaging can erase an exclusion. |
| CT-14 | Feedback loop | “Not familiar,” “Too difficult,” and “Try something similar,” plus free text, trigger relevant revision. The revised slot is rechecked and unrelated restrictions remain intact. |
| CT-15 | Conflict handling | Impossible or ambiguous combinations produce an explanation and options to edit inputs. Hard restrictions are never silently relaxed. |
| CT-16 | Plan persistence | User can revisit the current plan and feedback during the session and after refresh in the same browser. Storage mechanism is pending; sample reset clears its saved state. |
| CT-17 | Regional settings | Region, currency, and units are editable; no country is silently assumed. Localization does not claim local prices or availability without supporting data. |
| CT-18 | Recovery | Timeout, quota, empty result, invalid output, and provider failure states preserve entered information and offer a useful next action. Sample/replay mode is labeled. |
| CT-19 | Accessible interaction | All core controls work with keyboard, have labels and visible focus, and express check states in text as well as color. Results remain usable on mobile and desktop. |
| CT-20 | Published demonstration | Hosted app supports the core loop end-to-end; public repository includes setup instructions, data attribution, and an open-source license. Submission text accurately describes tested behavior. |

## 7. Agent and validation contract

Proposed flow:

`request → structured profile/constraints → Qloo discovery → recipe retrieval → candidate selection → deterministic checks → bounded repair → explained plan → feedback → recheck`

One logical agent uses server-side tools for profile retrieval, taste discovery, recipe retrieval, checks, and plan storage. These are proposed tool responsibilities, not established Qloo endpoint names. Application code controls stage transitions, validates tool arguments/results, and prevents presenting unchecked selections as complete.

Use GPT-6 Luna through the Responses API. Keep model configuration changeable. Sol is an evaluation option only if Luna fails representative quality checks; do not silently route to a more expensive model. Proposed initial reasoning effort is medium, subject to measurement.

Proposed operating limits: a finite tool-call budget, at most two candidate-repair rounds per batch, bounded provider retries for retryable errors, and a total request deadline. Set concrete timeout/token limits after the first measured 3/7/14-day runs. For longer requests, batch by day/slot and validate the combined plan for completeness and consistency. Reaching a limit must end in an honest partial/failure state, not an endless loop.

Checks return **pass**, **fail**, or **cannot verify**, with affected member, rule, evidence, and reason. A failed hard-restriction candidate is excluded. A candidate with an unverified hard restriction cannot be presented as compliant; it may appear only as an explicitly unresolved suggestion requiring further verification. Substitutions invalidate previous ingredient checks and trigger fresh validation.

Plan status must distinguish complete-and-checked, partial, and unresolved. “Checked” describes the supplied requirements and data only. The interface must not imply medical certification or cross-contamination guarantees.

## 8. Proposed data objects

| Object | Minimum contents |
|---|---|
| Household | ID, profile mode, members, locale, units, currency, shared equipment |
| Member | ID, display label, favorites/dislikes, explicit exclusions and preparation needs, confirmation state |
| Plan request | Recipients, duration, slots, servings, time limit, budget amount/scope, profile version |
| Taste evidence | Provider, query context, returned entities/tags, supported scores, timestamp, unresolved references |
| Recipe | ID, source/license, ingredients and completeness, servings, steps, available preparation attributes, adaptations |
| Check result | Rule, outcome, recipients, supporting fields, reason, checked recipe/profile version |
| Plan/version | Request, slots, candidates, chosen recipes, alternatives, evidence references, check results, status |
| Feedback | Target slot/version, reason, requested change, resulting version |

Preference data should be minimal. Do not request diagnoses, medication lists, exact birth dates, or home addresses for the demo. Send Qloo only the supported taste/location context needed for its query; omit household names and health-related restrictions from Qloo requests unless a verified integration explicitly requires an appropriate field.

## 9. Reliability, privacy, and cost requirements

- Credentials remain on the server and outside public source, frontend bundles, and logs.
- Tool access is limited to required operations; recipe content and API responses are data, not instructions that may change system behavior.
- Bound request sizes, household sizes, and generation frequency; publish any product limits clearly after representative testing.
- Record provider status, latency, token usage, tool-call count, and aggregate cost estimates without storing credentials or unnecessary profile text.
- Cache eligible cultural/recipe results with an explicit freshness policy; do not reuse another household's private profile context.
- Preserve previous plan versions during revision and reject stale check results after profile or recipe changes.
- Explain storage scope and provide reset/delete controls appropriate to the chosen persistence design.

Latency and per-plan spending targets remain open until measured; no speed, reliability, or cost-per-plan claims are currently verified.

## 10. Qloo and recipe discovery gates

Before committing to the final candidate-selection design:

1. Verify available Qloo endpoints/access and test relevant seeds across at least three user-selectable regional/cuisine contexts. Select representative contexts during discovery; no default culture is approved by this PRD.
2. Record exact supported relationships and failures. If Qloo exposes cuisines/tags rather than recipes, define an explicit mapping to our recipe catalog and test its effect on ranking.
3. Select a recipe source with usable terms, structured ingredients, and enough eligible variety to exercise 14-day plans. Record coverage limitations.
4. Verify OpenAI key access to Luna with a small tool-call/structured-output integration check when implementation is authorized.
5. If coverage cannot materially support meal selection, record the evidence and resolve the product approach before presenting a Qloo-powered claim.

## 11. Delivery sequence

| Stage | Deliverable | Exit evidence |
|---|---|---|
| A — Dependencies | Qloo coverage probe, recipe-source decision, Luna access check, stack choice | Saved capability/coverage notes and successful minimal integrations |
| B — Core flow | Custom individual/sample setup → live Qloo → recipes → checked three-day plan → revision | Real end-to-end run with traceable sources and preserved restrictions |
| C — Full agreed scope | Partner/family profiles, 7/14 days, alternatives, persistence, localization inputs | Acceptance scenarios pass for every profile mode and duration |
| D — Product quality | Responsive UI, accessibility, errors, provenance, cost controls | Manual browser checks plus focused automated validation |
| E — Submission | External hosting, public source/license, judging instructions, accurate description | Hosted end-to-end verification and submission checklist |

The first working three-day individual flow is a delivery milestone; it does not redefine the full MVP. No completion date or effort estimate is established here.

## 12. Validation and success measures

### Required acceptance scenarios

- Older-adult sample with favorites, preparation needs, exclusions, budget/time inputs, and an unfamiliar-meal revision.
- Custom individual profile using each duration and explicitly selected meal slots.
- Partner profile with different tastes and conflicting exclusions; correct recipients after revision.
- Family profile with shared meals and separately checked variants where needed.
- Ingredient alias match, incomplete compound ingredient, missing price/time/texture data, and a generated substitution.
- Unknown Qloo seed, weak regional coverage, no valid candidate, provider timeout/quota error, and invalid model output.
- Refresh recovery, sample reset, keyboard-only core journey, and mobile/desktop layout checks.

### Release gates

- No known hard-restriction violation is displayed as passing in the acceptance suite.
- Every Qloo-backed claim in tested plans is traceable to actual evidence; replay data is visibly labeled.
- Every completed plan fills all requested slots; partial/unresolved plans are explicit.
- Revisions retain unrelated restrictions and recipients in all tested scenarios.
- A controlled comparison uses identical profiles and candidate data with/without Qloo signals and demonstrates a traceable selection/ranking effect. A measured preference improvement requires user evaluation and cannot be inferred from a changed ranking alone.
- Hosted core flow, source licensing, and setup instructions are verified before submission.

Collect generation completion/partial/failure rates, revision outcomes, measured latency and token/cost totals by duration, and available user feedback about familiarity and appeal. Targets for user preference improvements require an actual study; do not invent them.

## 13. Decisions still open

Frontend/backend stack, database and anonymous-session storage, hosting, recipe provider, regional coverage, ingredient-normalization scope, household/usage limits, and numerical performance/cost targets remain open. These can be resolved through Stage A without delaying this PRD.

**Next concrete deliverable:** dependency/coverage findings and a technical implementation plan mapped to CT-01 through CT-20. Implementation has not begun as part of creating this document.

## 14. User-approved scope amendments — 23 October 2026

The user added two main interaction modes (User Mode / Interactive Mode) and two feedback modes (Chat / Discuss with AI). Voice uses the exact gpt-live-1 model from the user's Life Maxim implementation. Both voice handoffs require review before the existing Qloo/Luna pipeline applies changes. A right-side lightweight dashboard/chat and four themes (Garden, Midnight, Dark, White) are included; Midnight is the default. Email/password accounts use Convex Auth and the verified GeneaOne Resend sender. Next.js, Convex and Vercel/GitHub replace the creation-time open stack choices. See [production acceptance evidence and blockers](PRODUCTION_READINESS.md); historical creation-time statements above are not a current implementation status.
