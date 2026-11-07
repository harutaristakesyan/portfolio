import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

/** Runs against apps/web/dist after `astro build`. */
const dist = new URL("../dist/", import.meta.url).pathname;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

test("build output exists", () => {
  assert.ok(existsSync(dist), "run `pnpm build` first");
  for (const f of ["index.html", "404.html", "robots.txt", "sitemap-index.xml", "og.png"]) {
    assert.ok(existsSync(join(dist, f)), `missing ${f}`);
  }
});

test("every case study has its own page", () => {
  const cases = readdirSync(new URL("../src/content/work/", import.meta.url).pathname).filter((f) =>
    f.endsWith(".md"),
  );
  assert.ok(cases.length >= 5);
  for (const f of cases) {
    const page = join(dist, "work", f.replace(/\.md$/, ".html"));
    assert.ok(existsSync(page), `missing ${page}`);
  }
});

test("no client, product or template names leak into the HTML", () => {
  const banned = [
    /bigrig/i,
    /flixteam/i,
    /rezka/i,
    /vicbox/i,
    /vercel/i,
    /\bTWY\b/,
    /\bGilt\b/,
    /Thaler/,
  ];
  for (const file of walk(dist).filter((f) => f.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    for (const re of banned) assert.ok(!re.test(html), `${re} found in ${file}`);
  }
});

test("HTML stays within the edge CSP (script-src 'self'; style-src 'self')", () => {
  for (const file of walk(dist).filter((f) => f.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    assert.doesNotMatch(html, /<style[\s>]/, `inline <style> in ${file}`);
    assert.doesNotMatch(html, /\sstyle="/, `style="" attribute in ${file}`);
    for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) {
      const allowed = /\ssrc="\/_astro\//.test(tag) || /type="application\/ld\+json"/.test(tag);
      assert.ok(allowed, `inline script ${tag} in ${file}`);
    }
  }
});

test("fonts are preloaded from the same hashed files the stylesheet uses", () => {
  const html = readFileSync(join(dist, "index.html"), "utf8");
  const css = walk(join(dist, "_astro"))
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(f, "utf8"))
    .join("");
  const preloads = [...html.matchAll(/<link rel="preload" href="([^"]+\.woff2)"/g)].map(
    (m) => m[1],
  );
  assert.equal(preloads.length, 2);
  for (const href of preloads) {
    assert.ok(existsSync(join(dist, href)), `missing ${href}`);
    assert.ok(css.includes(href), `${href} is not the file the stylesheet loads`);
  }
});

test("pages are files without trailing slashes and link to each other that way", () => {
  const html = readFileSync(join(dist, "index.html"), "utf8");
  assert.match(html, /href="\/work\/[a-z0-9-]+"/);
  assert.doesNotMatch(html, /href="\/work\/[a-z0-9-]+\/"/);
});
