import { rm } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { allRoutes } from "../lib/routes.js";

/**
 * One esbuild pass over every Lambda handler into infra/.lambda. Each CDK Lambda points
 * `Code.fromAsset` at this dir and sets its own `handler`, so the bundle is uploaded once.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");
const functionsRoot = path.join(repoRoot, "apps", "api", "src", "functions");
const outdir = path.join(here, "..", ".lambda");

const entryPoints = [...new Set(allRoutes.map((r) => r.handler))].map((h) =>
  path.join(repoRoot, h.replace(/\.handler$/, ".ts")),
);

// Remove retired handlers so an incremental local build cannot ship old code.
await rm(outdir, { recursive: true, force: true });

await esbuild.build({
  entryPoints,
  outdir,
  outbase: functionsRoot,
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outExtension: { ".js": ".mjs" },
  mainFields: ["module", "main"],
  treeShaking: true,
  minify: true,
  sourcemap: false,
  tsconfig: path.join(repoRoot, "apps", "api", "tsconfig.json"),
  banner: {
    js: [
      "import { createRequire as __createRequire } from 'module';",
      "const require = __createRequire(import.meta.url);",
    ].join("\n"),
  },
});
console.log(`Bundled ${entryPoints.length} handler(s) → ${outdir}`);
