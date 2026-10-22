# CareTable — Agent Architecture and Model Decisions

**Recorded:** 20 October 2026  
**Status:** Architecture proposal and model-selection record; no application or API integration implemented or tested by this document.  
**Companion:** [Global Hackathon Concept](CareTable_Global_Hackathon_Concept.md)

**20 October implementation update:** The user selected Next.js on Vercel with no separate Express server. The initial React/Vite/Express scaffold has been archived and development stopped pending the foundation prompt pack. OpenAI Luna model access and a synthetic tool call passed; Qloo tag lookup passed. Qloo's official harness does provide reusable workflows, correcting the earlier incomplete tooling account below. See the [restart handoff](NEXTJS_RESTART_HANDOFF.md) for current evidence and unresolved work. Earlier statements about untested key access are historical.

## Purpose and product scope

CareTable helps people plan meals that fit both their tastes and their practical needs. Its central audience is older adults and caregivers, with individual, partner, and family profiles. The intended experience includes custom onboarding, a ready-made demonstration profile, alternatives, and flexible plans such as 3, 7, or 14 days.

The user has excluded `Post Hackathon App Idea.txt`: it is a separate application for after the hackathon. Its contents were not consulted for these decisions.

## What Qloo provides, and what we build

Qloo presents its service as a cultural intelligence and grounding layer for models and agents: it supplies structured facts and taste context, while the language model handles conversation. Its public capabilities do not establish a built-in workflow builder for running CareTable's full process. We should therefore build the application workflow and call Qloo as a tool. [Qloo capabilities](https://www.qloo.com/capabilities)

An LLM is not intrinsically necessary for every Qloo recommendation product. For the conversational CareTable experience, a separate LLM is recommended to interpret requests, coordinate tools, explain results, and handle revisions. “Separate” means separate from Qloo; it could be a hosted API or a suitably deployed open-weight model. For this project, the user wants OpenAI and reports already having an OpenAI API key.

| Component | CareTable responsibility | Proposed supplier |
|---|---|---|
| Taste intelligence | Resolve supported cultural references and discover relevant affinities or rankings | Qloo API |
| Conversation and reasoning | Interpret requests, ask follow-up questions, select tools, assemble and explain plans | OpenAI LLM |
| Workflow control | Manage state, required stages, tool execution, retries, and revision limits | Our backend code |
| Profiles | Store individual preferences, household membership, restrictions, and feedback | Our application and database |
| Recipes | Supply attributable ingredients, quantities, instructions, servings, and preparation attributes | Curated structured dataset or suitable external API; selection pending |
| Constraint checker | Evaluate entered requirements against structured evidence | Our deterministic code |
| Interface | Display plans, alternatives, evidence, check results, and feedback | Our frontend |
| Localization | Handle region, currency, measurement preferences, and supported local options | Our application plus appropriate regional data |

Qloo should materially influence which eligible options are selected. Merely adding a Qloo citation to an otherwise unchanged LLM plan would not demonstrate the intended differentiation.

## Model decision: GPT-6 Luna first

**User preference:** GPT-6 Luna, with a question about whether GPT-6.1 Sol is necessary.  
**Recommendation:** Start with `gpt-6-luna`. Keep model selection configurable and compare `gpt-6.1-sol` only when representative tests show a quality gap. Sol is an evaluation candidate, not an approved automatic fallback or an established requirement.

The official catalog positions Luna for focused, frequent tasks and Sol for more complex work. Both support function calling and structured outputs. Use the Responses API for the proposed tool-driven implementation. [GPT-6 Luna documentation](https://developers.openai.com/api/docs/models/gpt-6-luna), [GPT-6.1 Sol documentation](https://developers.openai.com/api/docs/models/gpt-6.1-sol)

### Published standard text prices

Checked 20 October 2026; USD per million tokens, excluding caching, special processing modes, tools, and other services:

| Model | API identifier | Input | Output |
|---|---|---:|---:|
| GPT-6 Luna | `gpt-6-luna` | $0.10 | $0.50 |
| GPT-6.1 Sol | `gpt-6.1-sol` | $2.00 | $10.00 |

Sol's listed input and output rates are each 20 times Luna's. This is a rate comparison, not a measured cost-per-plan comparison: token use, reasoning, retries, and tool calls can differ. [Luna pricing](https://developers.openai.com/api/docs/models/gpt-6-luna), [Sol pricing](https://developers.openai.com/api/docs/models/gpt-6.1-sol)

### Why Luna is a reasonable starting point

This is an architectural judgment, not a CareTable benchmark result. We can give Luna a bounded task: use explicit profile fields, retrieve grounded candidates, return structured choices, and respond to checker results. Database operations, serving arithmetic, exclusions, and required validation remain in application code.

Begin evaluation at medium reasoning effort, then adjust against measured quality, latency, and cost. Both models document medium reasoning support. [Luna settings](https://developers.openai.com/api/docs/models/gpt-6-luna), [Sol settings](https://developers.openai.com/api/docs/models/gpt-6.1-sol)

Compare Sol if Luna repeatedly loses member-specific requirements, mishandles conflicting preferences, chooses inappropriate tools, or produces weak revisions after clear validation feedback. A stronger model does not replace missing recipe data or deterministic checks. Keep the lightest model that meets the quality bar; official guidance recommends testing models on the actual workflow. [OpenAI model-selection guidance](https://developers.openai.com/api/docs/guides/model-selection)

### API key status

The user reports having a key. It has not been requested, read, configured, or tested during this documentation task. Account-specific model access, billing readiness, and rate limits remain unverified. During implementation, keep the credential in server-side environment or secret storage and exclude it from client code, logs, public documentation, and source control.

## Proposed agent workflow

Use one logical agent with tools and application-controlled stages. Multiple agents, a visual workflow builder, and a particular agent framework are not required by this architecture proposal.

1. **Learn preferences:** Gather favorites, dislikes, relevant cultural references, and region when needed. Allow skipped preference questions.
2. **Collect and confirm constraints:** Record ingredients to avoid, preparation or texture preferences, time, budget, equipment, household members, servings, and plan duration. Ask about ambiguous restrictions before treating them as settled.
3. **Find taste connections:** Query Qloo for supported entities and affinities. Preserve returned identifiers, ranking evidence, and query context for explanations.
4. **Retrieve and assemble:** Obtain structured recipe candidates and use supported taste signals to choose among eligible options. Record any mapping from Qloo concepts to recipe tags as our application's mapping.
5. **Check:** Run deterministic validation against every relevant member and the requested plan. Validate the complete ingredient list of any substitution as well.
6. **Repair and explain:** Replace failed candidates within a bounded revision loop. If evidence or valid choices are insufficient, explain what cannot be verified or satisfied. Render the final plan with alternatives and attributed taste reasoning.
7. **Revise with feedback:** Support “not familiar,” “too difficult,” and “try something similar.” Update the relevant preference or requirement, retain unrelated constraints, and rerun checks before presenting changes.

Proposed tool responsibilities include profile retrieval, Qloo discovery, recipe retrieval, constraint checking, and plan storage. These are responsibilities to implement, not claims about existing endpoint names.

## Constraint and household behavior

Hard restrictions take priority over taste scores. The model cannot bypass the checker by asserting that a meal is suitable.

- **Ingredient exclusions:** Check normalized ingredients, known aliases, and available compound-ingredient details. Missing information must not be treated as a pass.
- **Household members:** Keep restrictions attached to the correct person. A shared meal must satisfy all intended eaters; separate variants must identify their recipients and be checked independently.
- **Preparation time and equipment:** Compare structured recipe requirements with user-entered limits. Recheck adaptations.
- **Budget:** Calculate only where quantities and relevant prices exist; otherwise show a labeled estimate or an unknown result.
- **Texture:** Compare documented preparation attributes with the user's stated requirement. Do not present a text match as clinical swallowing-safety certification.

Use **pass**, **fail**, and **cannot verify** states, each with a reason. A pass establishes only the supported check against the supplied data; it is not a blanket safety guarantee. Probabilistic taste matching remains separate from these checks.

Dietary requirements come from users or qualified care plans. The product remains a planning aid and does not diagnose conditions or infer medication interactions. Collect only the profile information needed for the experience.

## Dependencies and unresolved evidence

1. **Qloo food coverage:** Test the actual hackathon API for relevant cuisines, dishes, tags, and regions. Do not promise dish-level or ingredient-level support before checking it.
2. **Recipe source:** Choose a licensed or appropriately attributable source. Distinguish retrieved recipes from generated suggestions and unverified adaptations.
3. **Taste provenance:** Show only relationships supported by returned Qloo data as Qloo-backed. Clearly identify our recipe mapping and the model's explanation.
4. **Global behavior:** Avoid hard-coding a country, cuisine, currency, measurement system, store network, or dietary norm. Unsupported availability must remain unknown.
5. **Reliability:** Provide bounded retries, clear empty/error states, a short setup path, and a ready-made judge profile. Label sample and fallback data visibly.
6. **Access:** Verify both Qloo credentials and OpenAI account/model access during implementation.

The detailed Qloo developer guide was inaccessible during the preceding research. Its exact endpoints, access scope, and food coverage have not been verified. [Qloo hackathon developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide)

## Validation before settling the model

Evaluate individual, partner, and family scenarios; 3-, 7-, and 14-day plans; contradictory preferences; ingredient exclusions; missing recipe details; unfamiliar-meal feedback; unsupported cultural references; and API errors.

Assess correct tool use, preservation of restrictions during revision, honest unknown states, accurate attribution, plan completeness, latency, and cost. Include a comparison showing how Qloo changes selection versus the same workflow without its taste signals. No Luna-versus-Sol evaluation has yet been run.

## Hackathon fit

The current event permits a Qloo-integrated agentic tool, an application built using an agent framework, or Qloo integrated into an existing agent. It specifies no particular LLM provider. This does not mean a generic chatbot suffices: the project should demonstrate meaningful cultural grounding. [Hackathon overview](https://qloo.devpost.com/), [Official rules](https://qloo.devpost.com/rules)

The concept's hosted demo, public source repository, open-source license, and project-description requirements remain part of submission planning. [Submission requirements](https://qloo.devpost.com/)

## Current continuation point

Documentation is complete for this discussion. Next implementation prerequisites are to verify credentials and model access, probe Qloo's food-related coverage, choose a structured recipe source, and implement one bounded end-to-end profile-to-plan-to-revision flow. Framework, database, hosting, and recipe-provider selections remain open.
