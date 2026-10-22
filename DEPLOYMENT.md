# Deploy CareTable to Vercel and Convex

The verified cloud backend currently uses the CareTable **development** deployment in `joseph-petersonn`. A public release must deliberately select and configure a production deployment. No Vercel deployment has been verified yet.

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

The local configure scripts target development and intentionally do not deploy production secrets. Production keys belong in Convex's environment settings, outside source control. Set usage alerts/budgets in provider accounts before opening anonymous live planning broadly.

## Vercel project

1. Sign in to Vercel and import this repository, or use the authenticated Vercel CLI. Framework: **Next.js**, project root: repository root, package manager: npm. Do not set a static export or a separate Express server.
2. Use the same Node major version as local verification (24), or verify the supported runtime before choosing another.
3. Configure `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` for the selected production deployment. The site URL is the `.convex.site` origin. These are public deployment addresses, not API keys.
4. Connect a Convex production deploy key through Vercel's protected build environment. A Convex-integrated build can use `npx convex deploy --cmd 'npm run build'` so generated API definitions and the frontend are built together. Follow the [Convex Vercel guide](https://docs.convex.dev/production/hosting/vercel) for the current integration and preview environments. Never expose the deploy key with `NEXT_PUBLIC_`.
5. Set `SITE_URL` on Convex to the final HTTPS origin. Keep previews on a separate Convex deployment; avoid pointing arbitrary preview builds at production data.
6. Open the hosted app and repeat sample generation, slot revision, refresh recovery, email verification/reset, mobile layout, and protected admin denial. A successful build alone is not hosted acceptance.

## First owner

Have the intended owner create and verify their email/password account. A trusted Convex operator can locate that user's ID in the dashboard and run internal `administration:bootstrapOwner` with `{ "userId": "the-verified-user-id" }` against the selected deployment. It refuses a second bootstrap. Never choose an anonymous sample user. The owner then assigns scoped admins from Administration.

## Current setup gates

- Resend key and verified sender are requested from the user; delivery is unverified until supplied.
- Vercel sign-in/project selection is pending.
- Git repository is local; no remote/public repository is connected yet.
- Intended owner account has not been selected/provisioned.

Keep credentials out of screenshots, support files, command output, commits, and public browser bundles. Run `node --env-file=.env.local scripts/check-public-secrets.mjs` after building to check source candidates and client assets against the configured private values.
