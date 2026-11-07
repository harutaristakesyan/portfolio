import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { contactMock } from "./dev/contact-mock.ts";

// SITE_URL is set by the deploy workflow from the configured domain; local builds use a
// placeholder so canonical and sitemap URLs are still absolute.
const site = process.env.SITE_URL ?? "https://portfolio.invalid";

export default defineConfig({
  site,
  output: "static",
  // CloudFront maps /work/x → /work/x.html, so pages are files and URLs have no trailing slash.
  // The edge sends `script-src 'self'; style-src 'self'`, so nothing may be inlined into the HTML.
  build: { format: "file", inlineStylesheets: "never" },
  vite: { build: { assetsInlineLimit: 0 } },
  trailingSlash: "never",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404") }), contactMock()],
  devToolbar: { enabled: false },
});
