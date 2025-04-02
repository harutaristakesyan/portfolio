import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// Access env var
const siteUrl = import.meta.env.PUBLIC_SITE_URL || "http://localhost:4321";

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel(),
    site: siteUrl,
    integrations: [
        mdx(),
        react(),
        tailwind({ applyBaseStyles: false }),
        icon(),
        sitemap()
    ],
    markdown: {
        shikiConfig: {
            theme: 'plastic',
            wrap: true,
        },
    },
    experimental: {
        svg: true,
    },
});
