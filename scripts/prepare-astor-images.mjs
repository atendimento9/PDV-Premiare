/** Download the selected official Astor product photos and make local web variants. */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await readFile(path.join(root, "scripts/astor-selection.source.json"), "utf8"));
const overrides = JSON.parse(await readFile(path.join(root, "scripts/astor-image-overrides.json"), "utf8"));
const cache = path.join(root, ".cache", "astor-curation", "images");
const out = path.join(root, "public", "catalog", "products");
await mkdir(cache, { recursive: true });

const key = (sku) => sku.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const audit = [];
for (const p of source) {
  const override = overrides[p.sku] || {};
  const chosenUrl = override.alternativeIndex === undefined ? p.imageUrl : p.imageAlternates[override.alternativeIndex];
  if (!chosenUrl && !override.sourceFile) throw new Error(`${p.sku}: alternative photo missing`);
  let original;
  if (override.sourceFile) {
    original = await readFile(path.join(root, "assets", "catalog-curated", override.sourceFile));
  } else {
    const response = await fetch(chosenUrl);
    if (!response.ok) throw new Error(`${p.sku}: image HTTP ${response.status}`);
    original = Buffer.from(await response.arrayBuffer());
  }
  const meta = await sharp(original).metadata();
  if ((meta.width ?? 0) < 200 || (meta.height ?? 0) < 200) throw new Error(`${p.sku}: image too small`);
  if ((meta.width ?? 0) < 600 || (meta.height ?? 0) < 600) console.warn(`${p.sku}: source is ${meta.width}x${meta.height}`);
  const folder = path.join(out, key(p.sku));
  await mkdir(folder, { recursive: true });
  for (const width of [480, 800, 1200]) {
    const buffer = await sharp(original)
      .flatten({ background: "#ffffff" })
      .resize(width, width, { fit: "contain", background: "#ffffff", withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    await writeFile(path.join(folder, `cover-${width}.webp`), buffer);
  }
  audit.push({ sku: p.sku, sourceUrl: p.sourceUrl, imageSource: override.sourceFile || chosenUrl, width: meta.width, height: meta.height, sha256: createHash("sha256").update(original).digest("hex") });
  console.log(p.sku);
}
await writeFile(path.join(cache, "image-audit.json"), JSON.stringify(audit, null, 2) + "\n");

const tileWidth = 190;
const tileHeight = 230;
const columns = 6;
const rows = Math.ceil(source.length / columns);
const label = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const svg = `<svg width="${columns * tileWidth}" height="${rows * tileHeight}" xmlns="http://www.w3.org/2000/svg"><style>text{font:14px Arial;fill:#1b2941}</style>${source.map((p,i)=>`<text x="${i%columns*tileWidth+9}" y="${Math.floor(i/columns)*tileHeight+217}">${label(p.sku)}</text>`).join("")}</svg>`;
const overlays = await Promise.all(source.map(async (p, i) => ({
  input: await sharp(path.join(out, key(p.sku), "cover-480.webp")).resize(180, 180).toBuffer(),
  left: (i % columns) * tileWidth + 5,
  top: Math.floor(i / columns) * tileHeight + 5,
})));
await sharp({ create: { width: columns*tileWidth, height: rows*tileHeight, channels: 3, background: "#fff" } })
  .composite([...overlays, { input: Buffer.from(svg), left: 0, top: 0 }])
  .png().toFile(path.join(cache, "contact-sheet.png"));
