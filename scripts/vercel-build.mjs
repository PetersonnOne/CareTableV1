import { spawnSync } from "node:child_process";
const production = process.env.VERCEL_ENV === "production";
if (production && !process.env.CONVEX_DEPLOY_KEY)
  throw new Error("Production requires its protected Convex deploy key.");
const args = production
  ? ["node_modules/convex/bin/main.js", "deploy", "--cmd", "npm run build"]
  : ["node_modules/next/dist/bin/next", "build"];
const result = spawnSync(process.execPath, args, {
  stdio: "inherit",
  env: process.env,
});
process.exitCode = result.status ?? 1;
