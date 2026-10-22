# CareTable — Next.js restart handoff

**22 October continuation:** This handoff is historical. The Next.js/Convex app has been built and live planning exercised. Continue from [VERIFICATION.md](VERIFICATION.md), [README.md](README.md), and [DEPLOYMENT.md](DEPLOYMENT.md), rather than restarting the scaffold. The original Vite/Express code remains archived and ignored.

**Recorded:** 20 October 2026.  
**Current instruction:** Stop development after verifying the OpenAI key and preserving the first scaffold. Wait for the user's foundation prompt pack before creating the Next.js application.

## Authoritative direction

- Next.js application for deployment on Vercel.
- No separately hosted Express server.
- GPT-6 Luna remains the model choice. Do not silently upgrade to Sol.
- API credentials must remain server-side. Local secrets stay in the root `.env.local`; deployment secrets belong in Vercel's environment-variable settings. Never use `NEXT_PUBLIC_` for credentials.
- Read and apply the user's forthcoming foundation prompt pack before choosing the new application structure.
- Preserve the full agreed PRD scope and reuse suitable work from the archive.
- `Post Hackathon App Idea.txt` remains excluded.

## Preserved work

[React/Vite/Express scaffold](archive/react-vite-express-2026-10-20/) contains the source, scripts, package manifests, lockfile, and installed dependencies. Seventeen source/configuration files were hash-verified after moving. [Source manifest](archive/react-vite-express-2026-10-20/SOURCE_MANIFEST.json) records those hashes; dependency binaries are not individually hashed.

The root concept, PRD, architecture notes, `.env.local`, `.env.example`, and `.gitignore` remain in place. Private discovery data and the credential-free OpenAI verification report remain in Git-ignored `.private/`. The key-bearing PDF was removed by the user; the extracted key-bearing text copy was also removed after configuring the key.

The scaffold is incomplete and **not a working or validated MVP**. A build started before the stop instruction failed because of mismatched JSX tags in `src/main.jsx`. No UI validation or complete live meal-plan test was performed. Qloo harness installation was interrupted when stopping work; do not assume the archived dependency directory is complete. Use a clean dependency install for Next.js.

## Verified integration facts

- OpenAI check: `gpt-6-luna` model access returned HTTP 200.
- A synthetic Responses API request returned HTTP 200 and correctly called the specified function with structured arguments.
- Test usage: 55 input tokens, 18 output tokens, 73 total tokens. This establishes key/model/tool-call access, not meal-planning quality.
- This Windows environment initially produced a Node certificate error. `node --use-system-ca` resolved the check while preserving TLS verification. Do not disable certificate verification.
- Qloo: live `/v2/tags` lookup returned HTTP 200 using the locally configured hackathon credential.
- The attempted `/v2/insights` request timed out. Related dining affinities and the complete recipe-ranking path are **not verified**.

## Qloo instructions discovered in the PDFs

The starter-kit email links to [Qloo's official hackathon kit](https://github.com/qloo/qloo-hackathon-kit). This corrects the earlier incomplete account of Qloo's tooling: Qloo provides reusable validated workflows through its harness, including CLI and MCP surfaces. CareTable still needs its own product orchestration, profiles, recipe data, checks, and revision experience.

Use `https://hackathon.api.qloo.com` with the key in `X-Api-Key`. The email also names `QLOO_BASE_URL` and `QLOO_TRUSTED_BASE_URL` for harness configuration. Keep data queries on the server, send no personal identifiers or health details to Qloo, and present affinities as aggregate signals. The email supports `qloo exec` and `qloo mcp`; avoid relying on its chat/plan/build modes for the event.

Direct retrieval of the [developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide) succeeded after the earlier browser/TinyFish failures. It documents cuisine tags and supported dining-place/brand entities; it does not establish a recipe endpoint. Private server caching is allowed; raw Qloo response data should not be committed to the public repository.

## Reuse candidates and limitations

| Archived work | Reuse in Next.js | Remaining work |
|---|---|---|
| `server/checks.mjs` | Pure deterministic checking helpers | Expand/verify alias coverage; current unknown handling is incomplete for arbitrary restriction groups. No clinical safety guarantees. |
| `server/schema.mjs` | Server input-validation schema | Integrate with new routes and validate every revision input. |
| `server/catalog.mjs` | Twenty original prototype recipe suggestions | Unvalidated generated preparations, no external recipe source selected, no price/nutrition data. Label clearly or replace with an appropriate source. |
| `server/qloo.mjs` | Starting point for server-only Qloo adapter | Actual Insights result shape, ranking, recipe mapping, unsupported cases, and caching need validation. |
| `server/planner.mjs` | Prototype tool schemas and loop | Meal planning untested; improve feedback-specific behavior, request deadlines, partial plans, and cost limits. |
| `src/main.jsx`, `src/style.css` | UI ideas and reusable components/styles | JSX does not compile; no browser verification. Match foundation prompt pack before transplanting. |
| `scripts/check-openai.mjs` | Small synthetic credential/tool-call verification | Uses archived config path; adapt after restart. Never print the key. |

The first draft only records feedback reasons and rejects the prior recipe; it does not yet change discovery according to the reason. Household variants, conversational onboarding, free-text feedback, stronger persistence validation, and full acceptance coverage remain unfinished. The current server binds locally; do not transplant Express deployment assumptions to Vercel.

## Next action

Receive the foundation prompt pack, then create a clean Next.js application. Port reusable logic into server-only modules and Next.js route handlers, retain the local environment file, and verify against the [PRD](CareTable_PRD.md). Recheck current provider guidance and deployment constraints during implementation. Do not resume automatically before the user's next direction.
