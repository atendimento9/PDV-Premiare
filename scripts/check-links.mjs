/**
 * Verificador de links internos e de referencias a arquivos locais.
 *
 * Nada de rede: so confere se cada href, src e URL do sitemap tem um arquivo
 * correspondente dentro de /dist. Link externo e apenas listado, para revisao.
 */
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

async function resolves(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return exists(path.join(DIST, "index.html"));
  const rel = clean.replace(/^\//, "");
  if (await exists(path.join(DIST, rel))) return true;
  if (await exists(path.join(DIST, rel, "index.html"))) return true;
  if (await exists(path.join(DIST, `${rel}.html`))) return true;
  return false;
}

async function main() {
  const files = await walk(DIST);
  const pages = files.filter((f) => f.endsWith(".html"));
  const broken = [];
  const external = new Set();
  let checked = 0;

  for (const page of pages) {
    const rel = path.relative(DIST, page);
    const html = await readFile(page, "utf8");
    const refs = [
      ...[...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) =>
        m[1].split(",").map((part) => part.trim().split(/\s+/)[0]),
      ),
    ];

    for (const ref of refs) {
      if (!ref) continue;
      if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) {
        if (ref.startsWith("http")) external.add(`${ref}  (${rel})`);
        continue;
      }
      checked++;
      if (!(await resolves(ref))) broken.push({ page: rel, ref });
    }
  }

  // O sitemap precisa apontar só para páginas que existem.
  const sitemap = path.join(DIST, "sitemap.xml");
  if (await exists(sitemap)) {
    const xml = await readFile(sitemap, "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = new URL(m[1]);
      checked++;
      if (!(await resolves(url.pathname))) broken.push({ page: "sitemap.xml", ref: url.pathname });
    }
  }

  console.log("check-links");
  console.log(`  ${checked} referências internas verificadas em ${pages.length} páginas`);
  if (external.size) {
    console.log(`  ${external.size} destino(s) externo(s) — não verificados por rede:`);
    [...external].slice(0, 10).forEach((e) => console.log(`    ${e}`));
  } else {
    console.log("  nenhum link externo no build");
  }

  if (broken.length) {
    console.error(`\ncheck-links: FALHOU — ${broken.length} link(s) quebrado(s):`);
    broken.slice(0, 30).forEach((b) => console.error(`  - ${b.page} → ${b.ref}`));
    process.exit(1);
  }
  console.log("  OK");
}

await main();
