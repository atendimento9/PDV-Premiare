/** Refresh the private source snapshot for the editorial Astor selection. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(await readFile(path.join(root, "scripts/astor-selection-spec.json"), "utf8"));
const headers = { domain: "astorbrindes.com.br", Accept: "application/json" };
const results = new Array(spec.length);
let cursor = 0;

async function getJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function detailFor(item) {
  const searchUrl = `https://app3.brinde.me/api/product?per_page=100&search=${encodeURIComponent(item.sku)}`;
  const listing = await getJson(searchUrl);
  const match = listing.data.find((p) => p.sku === item.sku);
  if (!match) throw new Error(`SKU absent on Astor: ${item.sku}`);
  const sourceUrl = `https://astorbrindes.com.br/brinde/${match.slug}`;
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`${response.status} ${sourceUrl}`);
  const html = await response.text();
  const nextData = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!nextData) throw new Error(`No product data: ${sourceUrl}`);
  const product = JSON.parse(nextData[1]).props.pageProps.initialProduct;
  if (product.sku !== item.sku) throw new Error(`SKU mismatch: ${item.sku} != ${product.sku}`);
  const imageUrl = product.image?.image_url?.original;
  if (!imageUrl) throw new Error(`No official image: ${item.sku}`);
  return {
    ...item,
    astorSlug: product.slug,
    sourceUrl,
    sourceName: product.name,
    sourceDescription: product.description || null,
    sourceTechnicalDescription: product.tech_description || null,
    minimumQuantity: product.min_quantity ?? null,
    imageUrl,
    imageAlternates: (product.images || []).map((img) => img.image_url?.original).filter(Boolean),
  };
}

async function worker() {
  while (cursor < spec.length) {
    const i = cursor++;
    results[i] = await detailFor(spec[i]);
    console.log(`${i + 1}/${spec.length} ${spec[i].sku}`);
  }
}

await Promise.all(Array.from({ length: 5 }, worker));
await writeFile(path.join(root, "scripts/astor-selection.source.json"), JSON.stringify(results, null, 2) + "\n", "utf8");
