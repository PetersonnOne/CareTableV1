import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
const names = [
  "OPENAI_API_KEY",
  "QLOO_API_KEY",
  "RESEND_API_KEY",
  "CONVEX_DEPLOY_KEY",
  "JWT_PRIVATE_KEY",
  "VERCEL_TOKEN",
  "VERCEL_OIDC_TOKEN",
];
const secrets = names
  .map((n) => process.env[n])
  .filter((v) => v && v.length > 12);
const roots = ["src", "convex", "scripts", "tests", "research", ".next/static"];
const bad = [];
async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return;
    throw e;
  }
  for (const e of entries) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) await walk(file);
    else if (/\.(?:js|mjs|cjs|ts|tsx|json|map|css)$/.test(file)) {
      const text = await readFile(file, "utf8");
      if (secrets.some((s) => text.includes(s))) bad.push(file);
    }
  }
}
for (const root of roots) await walk(root);
for (const e of await readdir(".", { withFileTypes: true })) {
  if (
    e.isFile() &&
    /\.(?:md|json|ts|txt)$/.test(e.name) &&
    !["Post Hackathon App Idea.txt"].includes(e.name)
  ) {
    const text = await readFile(e.name, "utf8");
    if (secrets.some((s) => text.includes(s))) bad.push(e.name);
  }
}
if (bad.length) {
  console.error("Configured private values detected in:", bad.join(", "));
  process.exitCode = 1;
} else
  console.log(
    `No configured private values found in public source candidates or client assets (${secrets.length} private settings checked).`,
  );
