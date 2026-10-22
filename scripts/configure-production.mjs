// CareTable-specific production setup. Never prints private values.
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { generateKeyPair, exportPKCS8, exportJWK } from "jose";
const local = await readFile(".env.local", "utf8");
if (!/^CONVEX_DEPLOYMENT=dev:outstanding-crocodile-717/m.test(local))
  throw new Error("Unexpected CareTable development selection.");
const origin = new URL(process.argv[2] || "https://caretable-v1.vercel.app")
  .origin;
if (!origin.startsWith("https://"))
  throw new Error("Production requires HTTPS.");
function convex(args) {
  return spawnSync(
    process.execPath,
    ["--use-system-ca", "node_modules/convex/bin/main.js", "env", ...args],
    { encoding: "utf8" },
  );
}
const settings = { SITE_URL: origin };
for (const name of [
  "OPENAI_API_KEY",
  "QLOO_API_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM",
]) {
  if (!process.env[name]) throw new Error(`Missing ${name}`);
  settings[name] = process.env[name];
}
const existing = convex(["get", "--prod", "JWKS"]);
if (existing.status !== 0 || !existing.stdout.trim()) {
  const pair = await generateKeyPair("RS256", { extractable: true });
  settings.JWT_PRIVATE_KEY = (await exportPKCS8(pair.privateKey))
    .trimEnd()
    .replace(/\n/g, " ");
  settings.JWKS = JSON.stringify({
    keys: [{ use: "sig", ...(await exportJWK(pair.publicKey)) }],
  });
}
await mkdir(".private", { recursive: true });
const file = ".private/production-setup.env";
await writeFile(
  file,
  Object.entries(settings)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join("\n") + "\n",
  { mode: 0o600 },
);
try {
  const r = convex(["set", "--prod", "--from-file", file]);
  if (r.status !== 0)
    throw new Error(
      "Production environment setup failed; private output suppressed.",
    );
  console.log(
    "CareTable production auth/provider settings configured; existing signing keys preserved. Temporary email sender has Resend testing restrictions.",
  );
} finally {
  await unlink(file);
}
