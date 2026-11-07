import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { contactMock } from "./dev/contact-mock.ts";

export default defineConfig({
  // Canonical, sitemap and robots URLs. Keep in sync with `domain` in infra/bin/cdk.ts.
  site: "https://harut.dev",
  output: "static",
  // CloudFront maps /work/x → /work/x.html, so pages are files and URLs have no trailing slash.
  // The edge sends `script-src 'self'; style-src 'self'`, so nothing may be inlined into the HTML.
  build: { format: "file", inlineStylesheets: "never" },
  vite: { build: { assetsInlineLimit: 0 } },
  trailingSlash: "never",
  // Astro 7 defaults to JSX whitespace rules, which drop the space between inline elements in
  // prose and metadata. Keep HTML-aware compression so rendered text matches the source.
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404") }), contactMock()],
  devToolbar: { enabled: false },
});
