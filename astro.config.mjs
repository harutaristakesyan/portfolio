// @ts-check
import {defineConfig} from 'astro/config';
import mdx from "@astrojs/mdx";
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel(),
    site: 'https://simple-portfolio.vicbox.dev/',
    integrations: [mdx(), react(), tailwind({
        applyBaseStyles: false,
    }), icon(), sitemap()],
    markdown: {
        shikiConfig: {
            theme: 'plastic',
            wrap: true,
        },
    },
    experimental: {
        svg: true,
    }
});
