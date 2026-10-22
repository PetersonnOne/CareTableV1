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

## Email and DNS status — 22 October 2026

- Resend's temporary sender is configured for testing. Verification and recovery delivery plus code/password checks passed in development. It is restricted to the Resend account email; public UI uses `NEXT_PUBLIC_EMAIL_MODE=test` to show that limitation.
- `notify.geneaone.com` has been added to Resend. GeneaOne is for email only; neither its root nor `www` is assigned to the CareTable website.
- **Current decision:** retain Cloudflare as GeneaOne's authoritative DNS provider. Public nameservers were verified as `elisabeth.ns.cloudflare.com` and `yevgen.ns.cloudflare.com`. Do not migrate nameservers or change existing DNS records. The previously prepared Vercel DNS zone is inactive for public resolution and must not be treated as live email configuration.
- Cloudflare DNS and Vercel hosting are compatible: DNS authority does not determine the app host. CareTable remains on its Vercel address with GitHub main automatic deployments. GeneaOne remains for email only. Future GeneaOne applications can connect individual hostnames to Vercel while retaining Cloudflare nameservers; use the exact records supplied by each Vercel project. See [Vercel DNS documentation](https://vercel.com/docs/domains/working-with-dns).
- The user authorized email-only additions. All four Resend records for `notify.geneaone.com` were added in Cloudflare: DKIM TXT, return-path MX (priority 10), SPF TXT, and the Resend CNAME in DNS-only mode. The four pre-existing records and nameservers were preserved. Resend verification was triggered; retain the temporary sender until verification succeeds. No registrar login is needed for this arrangement. Follow [Resend's Cloudflare guide](https://resend.com/docs/guides/dns/cloudflare). Cloudflare nameservers alone do not put a Vercel site behind Cloudflare's HTTP proxy or enable application-level CDN/WAF services for it.
- After domain verification, switch `RESEND_FROM` on Convex to the verified sender, repeat delivery tests, set `NEXT_PUBLIC_EMAIL_MODE=live` in Vercel and redeploy. Do not lift the UI notice before arbitrary-recipient delivery is actually supported.
- Intended owner account has not been selected/provisioned.

Keep credentials out of screenshots, support files, command output, commits, and public browser bundles. Run `node --env-file=.env.local scripts/check-public-secrets.mjs` after building to check source candidates and client assets against the configured private values.
