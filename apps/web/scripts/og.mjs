// Render the social preview with the site's actual font and vector. Run: pnpm --filter @portfolio/web brand
import { readFileSync } from "node:fs";
import sharp from "sharp";

const publicDir = new URL("../public/", import.meta.url);
const fontfile = new URL(
  "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  import.meta.url,
).pathname;
const mark = readFileSync(new URL("brand/monogram.svg", publicDir));
const monofile = new URL(
  "../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  import.meta.url,
).pathname;

async function text(value, size, color, left, top, mono = false) {
  const input = await sharp({
    text: {
      text: `<span foreground="${color}">${value}</span>`,
      font: `${mono ? "JetBrains Mono" : "Manrope"} ${size}`,
      fontfile: mono ? monofile : fontfile,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer();
  return { input, left, top };
}

await sharp({ create: { width: 400, height: 128, channels: 4, background: "#00000000" } })
  .composite([
    { input: await sharp(mark).resize(144, 120).png().toBuffer(), left: 0, top: 4 },
    await text("harut.dev", 36, "#ecebe6", 160, 44, true),
  ])
  .png()
  .toFile(new URL("brand/wordmark.png", publicDir).pathname);

await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#0e0f11" } })
  .composite([
    { input: await sharp(mark).resize(96, 80).png().toBuffer(), left: 61, top: 62 },
    await text("harut.dev", 28, "#ecebe6", 176, 86, true),
    await text("Harut Aristakesyan", 60, "#ecebe6", 72, 238),
    await text("Backend engineer", 34, "#9a9b97", 72, 328),
    await text("TypeScript / AWS serverless / Java / Spring Boot", 28, "#9a9b97", 72, 390),
    {
      input: Buffer.from(
        '<svg width="1056" height="2"><path stroke="#24262b" stroke-width="2" d="M0 1h1056"/></svg>',
      ),
      left: 72,
      top: 474,
    },
    await text("7+ years in production / remote / UTC+4", 24, "#9fcbe0", 72, 518, true),
  ])
  .png()
  .toFile(new URL("og.png", publicDir).pathname);
console.log("og.png generated (1200×630).");
