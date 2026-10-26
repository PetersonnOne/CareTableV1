# Deploy CareTable to Vercel and Convex

CareTable is hosted at [caretable-v1.vercel.app](https://caretable-v1.vercel.app), backed by the separate production Convex deployment `artful-raven-948` in `joseph-petersonn`. Source lives in [PetersonnOne/CareTableV1](https://github.com/PetersonnOne/CareTableV1).

**Automatic deployment:** pushing to GitHub's `main` branch triggers Vercel production deployment. `vercel.json` selects Next.js and runs `scripts/vercel-build.mjs`, which deploys production Convex functions and builds the frontend with the production public URLs. The Convex deploy key is a protected Vercel production secret. Preview builds use the separate development Convex deployment. A local CLI link only allows management of the same cloud project; hosting and automatic publication do not depend on the local computer.

## Server environment

Create/select production in the existing Convex CareTable project. Generate separate JWT signing keys and JWKS using the official [Convex Auth manual setup](https://labs.convex.dev/auth/setup/manual); do not reuse the development signing key or print it. Configure these values on the **production Convex server**:

| Variable | Purpose |
|---|---|
| `JWT_PRIVATE_KEY` / `JWKS` | Convex Auth signing and verification |
| `SITE_URL` | Exact HTTPS Vercel app origin |
| `OPENAI_API_KEY` | Luna Responses access |
| `QLOO_API_KEY` | Qloo hackathon access |
| `RESEND_API_KEY` | Email delivery |
| `RESEND_FROM` | Verified sender, e.g. `CareTable <accounts@your-verified-domain>` |

Resend's restricted test sender may send only to the account owner's address. Verify a sending domain for other recipients. See [Resend sending documentation](https://resend.com/docs/api-reference/emails/send-email).

The development configure scripts target development. `scripts/configure-production.mjs` is guarded to this CareTable workspace, configures production from local private inputs, and preserves existing signing keys. Run it with the HTTPS site origin; pass `--update` only when deliberately replacing the supplied existing settings. JWKS must be written as raw JSON in its dotenv file, not a JSON-escaped string. Production keys belong in Convex's environment settings, outside source control.

## Vercel project

1. Sign in to Vercel and import this repository, or use the authenticated Vercel CLI. Framework: **Next.js**, project root: repository root, package manager: npm. Do not set a static export or a separate Express server.
2. Use the same Node major version as local verification (24), or verify the supported runtime before choosing another.
3. Configure `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` for the selected production deployment. The site URL is the `.convex.site` origin. These are public deployment addresses, not API keys.
4. Connect a Convex production deploy key through Vercel's protected build environment. A Convex-integrated build can use `npx convex deploy --cmd 'npm run build'` so generated API definitions and the frontend are built together. Follow the [Convex Vercel guide](https://docs.convex.dev/production/hosting/vercel) for the current integration and preview environments. Never expose the deploy key with `NEXT_PUBLIC_`.
5. Set `SITE_URL` on Convex to the final HTTPS origin. Keep previews on a separate Convex deployment; avoid pointing arbitrary preview builds at production data.
6. Open the hosted app and repeat sample generation, slot revision, refresh recovery, email verification/reset, mobile layout, and protected admin denial. A successful build alone is not hosted acceptance.

## First owner

Have the intended owner create and verify their email/password account. A trusted Convex operator can locate that user's ID in the dashboard and run internal `administration:bootstrapOwner` with `{ "userId": "the-verified-user-id" }` against the selected deployment. It refuses a second bootstrap. Never choose an anonymous sample user. The owner then assigns scoped admins from Administration.

## Email and DNS status — 23 October 2026

The verified Resend sender is CareTable <accounts@notify.geneaone.com>, configured on both Convex deployments. GeneaOne is used for email only. Cloudflare remains authoritative at elisabeth.ns.cloudflare.com and yevgen.ns.cloudflare.com; no nameserver migration is needed. The four additive Resend email records are verified; pre-existing records were preserved. The inactive Vercel DNS zone is not authoritative.

The latest app changes reached GitHub main and automatically produced a Ready Vercel production deployment on 26 October 2026 (source commit a8a80a6). The previous live deployment still referenced cf95550 because newer changes had remained on the local working branch. A successful HTTP/1.1 push restored the normal GitHub-to-Vercel delivery path. See [verification](VERIFICATION.md) for hosted browser acceptance.

## Release acceptance

Local Chromium now connects both GPT Live modes with audio transport and captions; review-to-plan and discussion-plus-notes revision pass. Hosted signup/reset browser checks passed on 26 October. Hosted voice and human device listening remain separate acceptance checks. Production owner provisioning requires the intended owner to create and verify their account. No family or caregiver review is a release requirement.

Keep credentials out of screenshots, support files, command output, commits and public browser bundles. Run node --env-file=.env.local scripts/check-public-secrets.mjs after building. Never rotate existing signing keys just to retry deployment.
