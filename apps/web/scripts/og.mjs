// Renders public/og.png (1200×630) from inline SVG. Run: node scripts/og.mjs
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0e0f11"/>
  <rect x="72" y="72" width="64" height="64" rx="18" fill="#9fcbe0"/>
  <text x="104" y="116" text-anchor="middle" font-family="Manrope, Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="#0e0f11" letter-spacing="-1">HA</text>
  <text x="72" y="300" font-family="Manrope, Arial, Helvetica, sans-serif" font-size="64" font-weight="500" fill="#ecebe6" letter-spacing="-2">Harut Aristakesyan</text>
  <text x="72" y="372" font-family="Manrope, Arial, Helvetica, sans-serif" font-size="34" fill="#9a9b97">Backend engineer · TypeScript on AWS serverless · Java/Spring Boot</text>
  <text x="72" y="430" font-family="Manrope, Arial, Helvetica, sans-serif" font-size="34" fill="#9a9b97">Integrations that keep working when something upstream fails.</text>
  <line x1="72" y1="500" x2="1128" y2="500" stroke="#24262b" stroke-width="2"/>
  <text x="72" y="556" font-family="JetBrains Mono, Menlo, monospace" font-size="24" fill="#9fcbe0">harut.dev · 7+ years in production · remote · UTC+4</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(new URL("../public/og.png", import.meta.url), png);
console.log(`og.png ${png.length} bytes`);
