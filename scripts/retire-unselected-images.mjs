/** Archive unreferenced product photo folders outside public/ before publishing. */
import { lstat, mkdir, readFile, readdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicProducts = path.join(root, "public", "catalog", "products");
const archive = path.join(root, ".cache", "retired-products", new Date().toISOString().replace(/[:.]/g, "-"));
const products = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.generated.json"), "utf8"));
const active = new Set(products.map((p) => p.image?.src?.split("/")[3]).filter(Boolean));
const within = (base, target) => {
  const relative = path.relative(base, target);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
};
await mkdir(archive, { recursive: true });
const retired = [];
for (const entry of await readdir(publicProducts, { withFileTypes: true })) {
  if (active.has(entry.name)) continue;
  const source = path.resolve(publicProducts, entry.name);
  const target = path.resolve(archive, entry.name);
  if (!within(publicProducts, source) || !within(root, target)) throw new Error(`Caminho fora do projeto: ${entry.name}`);
  if (!entry.isDirectory() || (await lstat(source)).isSymbolicLink()) throw new Error(`Entrada inesperada: ${entry.name}`);
  await rename(source, target);
  retired.push(entry.name);
}
console.log(`${retired.length} pastas de produtos sem referência arquivadas: ${retired.join(", ")}`);
