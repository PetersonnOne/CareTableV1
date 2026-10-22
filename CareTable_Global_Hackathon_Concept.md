# CareTable — Global Hackathon Concept

**Purpose:** A concept brief for a potential Qloo Agentic Hackathon 2026 submission.  
**Status:** Proposal for discussion; not a built or validated product.

**Architecture companion:** [Agent Architecture and Model Decisions](CareTable_Agent_Architecture_and_Model_Decisions.md) records the Qloo/LLM responsibilities, proposed workflow, dependencies, and GPT-6 Luna starting recommendation discussed on 20 October 2026.

**Product requirements:** [CareTable PRD v0.1](CareTable_PRD.md) translates the concept into scope, journeys, acceptance criteria, discovery gates, and delivery stages.

## One-line pitch

**CareTable helps older adults and the people who support them plan meals they will enjoy, using cultural taste intelligence alongside clearly stated dietary and practical needs.**

## The problem

Caregivers often need to plan meals around several factors at once: a person's preferences, familiar foods, texture needs, ingredient exclusions, budget, cooking time, and what is available nearby. Generic meal planners often repeat broad popular suggestions and can miss the personal and cultural context that makes a meal appealing.

CareTable focuses on the gap between a meal that technically fits a list of constraints and one the person is likely to welcome.

## The product

CareTable is a conversational meal-planning agent for older adults and caregivers. It gathers a small set of favorite foods, cuisines, ingredients, or other cultural references, then uses Qloo taste intelligence to find related food preferences and shape meal suggestions around them.

The user also provides practical constraints, such as:

- Ingredients to include or avoid
- Texture or preparation preferences
- Budget and cooking time
- Household size and available equipment
- Location or preferred sources for finding ingredients, if relevant

CareTable produces a short meal plan with alternatives and a plain-language explanation of how each suggestion matches the person's tastes and stated needs. A caregiver can reject a suggestion or change a constraint, and the agent revises the plan.

## Why Qloo belongs in the core

Qloo should help the product connect known preferences to culturally related food choices the person may also enjoy. For example, a few favorite cuisines or dishes could guide discovery of adjacent meals, ingredients, and flavor profiles. The app should show which taste signals informed each suggestion, making the cultural grounding visible to users and judges.

If Qloo has weak coverage for a specific dish or region, CareTable should say so and let users add familiar favorites as starting points. It should not imply that an unsupported connection came from Qloo.

## Agent workflow

1. **Learn preferences:** Ask for a few favorites and disliked foods; allow users to skip questions.
2. **Collect constraints:** Record user-provided ingredients, texture, budget, time, and preparation needs.
3. **Find taste connections:** Query Qloo for relevant food entities and related preferences.
4. **Build a plan:** Generate a small number of meal options that fit the preferences and constraints.
5. **Check and explain:** Apply deterministic checks for the entered constraints and explain the taste connections behind each option.
6. **Revise with feedback:** Update the plan when the caregiver or older adult rejects a meal or changes a requirement.

Dietary and health-related constraints must come directly from the user or a qualified care plan. CareTable is a planning aid; it does not diagnose conditions, infer medication interactions, or replace professional dietary advice.

## Hackathon MVP

Keep the first version narrow enough to finish and demonstrate reliably:

- One existing older adult profile, with caregiver-assisted setup. And a custom profile creation logic/flow 
- Partner Profile eg. for Spouses, Twins, brother sister etc. Eg, for they may have allergies. I believe you get it
- Family profile for an entire family to plan meals. 
- Preference onboarding using a few favorite and disliked foods
- A small set of explicit meal constraints
- A three-day meal plan with alternatives, but do not restrict to three days, it could be 7 days and 14 days.
- Visible Qloo-backed taste connections for each suggestion
- A deterministic constraint checker with clear pass/fail explanations
- Feedback buttons such as “not familiar,” “too difficult,” and “try something similar”
- Agent revision of the plan after feedback
- A clear sample profile so judges can try the app without lengthy setup

The initial launch should support users across regions. Avoid hard-coding a single country's cuisines, ingredients, stores, currency, measurement system, or dietary norms. Ask users for their region and preferences where these details affect results, and present localized options only when data coverage supports them.

## Demonstration scenario

Show a caregiver creating a plan for an older adult who enjoys several specified cuisines, prefers soft-texture meals, has named ingredients to avoid, and has a set budget and cooking-time limit. CareTable returns three days of meals, explains the cultural taste links, shows that the stated constraints were checked, then revises one day's meal after the user says it is unfamiliar.

The demo should make the difference between a generic language-model answer and a Qloo-grounded answer easy to see. Use actual API responses for the Qloo path and label any sample or fallback data clearly.

## Differentiation

Previous Qloo winners included location-based business intelligence, cultural analysis for mergers, political campaign messaging, and recommendations for discovering tastes outside a user's comfort zone. CareTable applies cultural intelligence to a recurring care task: finding meals that balance personal taste with practical needs for an older adult.

This concept also responds to the 2026 challenge brief's example of meal recommendations for seniors. Its distinction should come from a focused, complete workflow and a visible feedback loop—not from claiming the broad category as wholly unprecedented.

## How it can score well

- **Technological implementation:** Show real Qloo queries, meaningful taste connections, constraint checks, and a functioning agent loop.
- **Design:** Make setup short, results readable, and feedback/revision easy to try.
- **Potential impact:** Demonstrate a specific caregiver task and how the plan changes in response to the older adult's preferences.
- **Quality of idea:** Show how cultural taste context improves a practical care workflow beyond generic meal generation.

## Risks to resolve early

- **Regional data coverage:** Test Qloo queries across several cuisines and regions before committing to a result format.
- **Constraint reliability:** Keep hard constraints separate from probabilistic taste matching; never let a taste score override a stated restriction.
- **Recipe and availability sources:** Use properly licensed or attributed sources, and distinguish verified recipe or ingredient data from generated suggestions.
- **Privacy:** Collect only the profile data needed for the demo; do not request diagnoses or medication details.
- **Demo reliability:** Provide a sample profile, bounded API retries, useful empty/error states, and clear labeling when fallback examples are shown.

## Submission checklist

The current Qloo Agentic Hackathon rules call for a working, externally hosted demo; a public source repository with an open-source license; and a clear project description. Keep the demo usable without account creation if possible, or provide judging credentials and instructions if authentication is necessary. The event does not require a demo video, though a short walkthrough may still help the project page communicate the flow.

## Source links

- [Qloo Agentic Hackathon overview and brief](https://qloo.devpost.com/)
- [Official rules and judging criteria](https://qloo.devpost.com/rules)
- [Qloo API developer guide for the hackathon](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide)
- [2025 Qloo LLM Hackathon winners](https://www.linkedin.com/posts/qloo_hackathon-culturalintelligence-aiinnovation-activity-7370873373666549760-4W2g)
- [2025 Qloo LLM Hackathon Devpost gallery](https://qloo-hackathon.devpost.com/project-gallery)
