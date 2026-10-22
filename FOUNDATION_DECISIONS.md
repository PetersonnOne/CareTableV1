# CareTable foundation decisions

Recorded 20 October 2026. This is an implementation record, not a production-readiness claim.

**22 October continuation:** Next.js/Convex is active. Live Qloo + Luna planning, anonymous samples, conversational onboarding, 3/7/14-day selection, alternatives, revisions, durable jobs/limits, and server-side plan persistence are now implemented. Live 3-day, revision, onboarding, and 42-slot runs succeeded. Resend verification/recovery is implemented and awaits credentials/delivery testing. See [verification](VERIFICATION.md) and [deployment](DEPLOYMENT.md); those records supersede the historical unfinished-integration statements below.

## Source and product boundaries

The user supplied `Next_JS Web App SaaS Initial Prompt Pack for CARE TABLE Qloo Project.txt` from `D:\2 Base Coding Prompt Engineering Studio\Next JS Web App`. It guides the foundation alongside the [PRD](CareTable_PRD.md). The meal-planning product remains authoritative. The investigation/whereabouts philosophy is treated as template carryover; feed/messaging references do not introduce new product modules. The homepage remains intentionally simple pending further instructions.

The user explicitly selected **Next.js App Router on Vercel**, **Convex**, and **email/password sign-in**. Platform commercial tiers are pending a follow-up prompt and are not invented here. The old Vite/Express implementation stays in the archive.

## Architecture

- `src/app`: Next.js pages, layouts, loading/error states, manifest, and server-only HTTP endpoints. No Express service.
- `src/modules/identity`: account UI and explicit authorization policies.
- `src/modules/appearance`: two palettes and a Convex-reactive preference provider.
- `src/modules/administration`: permission-scoped management UI.
- `src/modules/meals`: household setup and reused pure recipe/constraint logic.
- `convex`: schema, auth, queries, mutations, and independent authorization checks. Database operations stay here.
- `convex/model`: shared identity resolution and audit helpers.
- `tests`: deterministic access-control, ownership, persistence, and restriction checks.

Read dependencies flow from UI into module policies and server functions. Private data is scoped by the authenticated identity, never a caller-supplied owner ID. API keys stay in server environments and are not imported into client components. The schema includes meal-plan storage for the next integration stage; it does not establish a complete agent implementation.

## Authentication and management

Convex Auth handles account and session data. Password length is 12–128 characters. Ordinary signups receive member access. Initial superadmin assignment uses the internal `administration:bootstrapOwner` function for a deliberately selected account. No public “first signup is owner” or browser role field exists.

Superadmins control site-wide appearance. Normal admins receive explicit permissions and can delegate only permissions they hold; they cannot edit themselves, a superadmin, or an admin with broader scope. Authorization is enforced in Convex, independently of visible navigation.

Email verification and password recovery require an email delivery configuration and are not complete. Do not describe the authentication package as production-ready before those flows, abuse limits, and security tests pass.

## Themes

Garden uses cream, sage, and forest; Midnight uses navy, slate, and mint. CSS custom properties apply throughout the UI. Guests can retain a local browser choice. Signed-in preferences persist in Convex. Following “site default” subscribes to the live default; choosing a personal palette overrides that default without changing other users' preferences.

## Audit model

`auditEvents` stores actor, event, module, outcome, target ID, request ID, timestamp, and a bounded summary. Staff/theme/household changes write their audit entry in the same mutation transaction. Audit reads are permission-gated and cursor-paginated.

No API secrets, passwords, profile ingredient lists, or full provider responses enter audit summaries. Database audit records are application-level history, not cryptographically tamper-proof logs. Rejected/rolled-back mutations do not persist their own failure audit entries; separate error ingestion and operational telemetry are still needed for complete failure coverage. Audit data is never automatically fed into code execution or deployment.

## Global and mobile foundation

The initial interface is English. Currency, region, and units are explicit household inputs. Locale-message modules and a web manifest prepare future localization/PWA work; there is no offline service worker or verified installable PWA yet. Responsive screens, keyboard focus, skip navigation, and asynchronous skeletons are included for browser verification.

## Integration and scale gates

Original recipe suggestions and deterministic checks were ported from the archive. The preview is explicitly local and makes no Qloo/OpenAI call. Live Qloo + Luna orchestration remains to be ported and verified after the foundation. Earlier successful credential checks do not establish a working meal-planning agent.

Before public release: finish email verification/recovery, durable API abuse controls and spend budgets, failure auditing/retention policies, finer CSP nonce enforcement, full end-to-end role and household flows, recipe verification/coverage, live agent tests, and Vercel/Convex production configuration. Load tests and operational evidence are required before any claim about millions of users.

## Sources consulted

- [Next.js App Router installation](https://nextjs.org/docs/app/getting-started/installation)
- [Convex CLI deployment workflow](https://docs.convex.dev/cli/reference/dev)
- [Convex Auth setup](https://labs.convex.dev/auth/setup)
- [Convex Auth signing keys and provider configuration](https://labs.convex.dev/auth/setup/manual)
- [Next.js server authentication and CSRF considerations](https://labs.convex.dev/auth/authz/nextjs)
- [Convex test guidance](https://docs.convex.dev/testing/convex-test)

Live build, deployment, and browser results belong in a separate verification record once actually run.
