// Rebuild every icon from the same vector used by the site. Run: pnpm --filter @portfolio/web brand
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const publicDir = new URL("../public/", import.meta.url);
const mark = readFileSync(new URL("brand/monogram.svg", publicDir), "utf8");
const inverse = mark.replaceAll("#9fcbe0", "#ffffff");
writeFileSync(new URL("brand/monogram-inverse.svg", publicDir), inverse);
writeFileSync(new URL("brand/monogram-ink.svg", publicDir), mark.replaceAll("#9fcbe0", "#202429"));
await sharp(Buffer.from(mark))
  .resize(960, 800)
  .png()
  .toFile(new URL("brand/monogram.png", publicDir).pathname);

// The solid field keeps the mark readable in both light and dark browser chrome.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <title>Harut Aristakesyan</title>
  <rect width="64" height="64" rx="8" fill="#9fcbe0"/>
  ${mark
    .replaceAll("#9fcbe0", "#0e0f11")
    .replace("<svg ", '<svg x="0" y="4" ')
    .replace(/width="\d+" height="\d+"/, 'width="64" height="56"')}
</svg>`;
writeFileSync(new URL("favicon.svg", publicDir), icon);

for (const [name, size] of [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
]) {
  // Touch/home-screen icons are opaque: the OS supplies its own corner mask.
  const source = size >= 180 ? icon.replace('rx="8"', 'rx="0"') : icon;
  await sharp(Buffer.from(source))
    .resize(size, size)
    .png()
    .toFile(new URL(name, publicDir).pathname);
}

// ICO can contain PNG payloads; include the native sizes used by desktop browsers.
const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map((size) => sharp(Buffer.from(icon)).resize(size).png().toBuffer()),
);
const directory = Buffer.alloc(6 + 16 * images.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(images.length, 4);
let offset = directory.length;
for (const [i, png] of images.entries()) {
  const entry = 6 + i * 16;
  directory[entry] = sizes[i];
  directory[entry + 1] = sizes[i];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(png.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
writeFileSync(new URL("favicon.ico", publicDir), Buffer.concat([directory, ...images]));
console.log("Brand SVGs, PNGs and 16/32/48px ICO generated.");
