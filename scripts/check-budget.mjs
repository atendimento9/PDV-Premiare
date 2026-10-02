/**
 * Orcamento de peso por pagina e limites da plataforma.
 *
 * Falha quando o build estoura, em vez de reduzir qualidade em silencio.
 * Reporta os maiores arquivos para que a decisao seja informada.
 */
import { gzipSync } from "node:zlib";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

const JS_BUDGET = 150 * 1024;
const CSS_BUDGET = 80 * 1024;
/** Limites da Wix confirmados na Fase 0 — ver docs/DECISIONS.md. */
const TOTAL_BUDGET = 20 * 1024 * 1024;
const FILE_BUDGET = 3 * 1024 * 1024;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const gz = (buf) => gzipSync(buf).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function main() {
  const files = await walk(DIST);
  const errors = [];

  let total = 0;
  const sizes = [];
  for (const file of files) {
    const { size } = await stat(file);
    total += size;
    sizes.push({ file: path.relative(DIST, file), size });
    if (size > FILE_BUDGET) {
      errors.push(`Arquivo acima do limite individual: ${path.relative(DIST, file)} (${kb(size)}).`);
    }
  }

  // Peso de JS e CSS que cada pagina realmente carrega.
  const pages = files.filter((f) => f.endsWith(".html"));
  const cache = new Map();
  const readGz = async (assetPath) => {
    if (cache.has(assetPath)) return cache.get(assetPath);
    let value = 0;
    try {
      value = gz(await readFile(assetPath));
    } catch {
      value = 0;
    }
    cache.set(assetPath, value);
    return value;
  };

  let worstJs = { page: "", bytes: 0 };
  let worstCss = { page: "", bytes: 0 };

  for (const page of pages) {
    const html = await readFile(page, "utf8");
    const rel = path.relative(DIST, page);

    let js = 0;
    let css = 0;

    for (const m of html.matchAll(/<script[^>]*src="([^"]+)"/g)) {
      js += await readGz(path.join(DIST, m[1]));
    }
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      js += gz(Buffer.from(m[1], "utf8"));
    }
    for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
      css += await readGz(path.join(DIST, m[1]));
    }
    for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      css += gz(Buffer.from(m[1], "utf8"));
    }

    if (js > worstJs.bytes) worstJs = { page: rel, bytes: js };
    if (css > worstCss.bytes) worstCss = { page: rel, bytes: css };

    if (js > JS_BUDGET) errors.push(`JS acima do orçamento em ${rel}: ${kb(js)} (limite ${kb(JS_BUDGET)}).`);
    if (css > CSS_BUDGET) errors.push(`CSS acima do orçamento em ${rel}: ${kb(css)} (limite ${kb(CSS_BUDGET)}).`);
  }

  if (total > TOTAL_BUDGET) {
    errors.push(`Build total acima do limite da plataforma: ${kb(total)} (limite ${kb(TOTAL_BUDGET)}).`);
  }

  sizes.sort((a, b) => b.size - a.size);

  console.log("check-budget");
  console.log(`  build total: ${(total / 1024 / 1024).toFixed(2)} MB em ${files.length} arquivos (limite 20 MB)`);
  console.log(`  maior arquivo: ${sizes[0].file} — ${kb(sizes[0].size)} (limite 3 MB)`);
  console.log(`  pior JS por página:  ${worstJs.page} — ${kb(worstJs.bytes)} gzip (limite ${kb(JS_BUDGET)})`);
  console.log(`  pior CSS por página: ${worstCss.page} — ${kb(worstCss.bytes)} gzip (limite ${kb(CSS_BUDGET)})`);
  console.log("  cinco maiores arquivos:");
  sizes.slice(0, 5).forEach((s) => console.log(`    ${kb(s.size).padStart(9)}  ${s.file}`));

  if (errors.length) {
    console.error(`\ncheck-budget: FALHOU — ${errors.length} problema(s):`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log("  OK");
}

await main();
