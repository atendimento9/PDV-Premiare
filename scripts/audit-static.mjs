/**
 * Auditoria estatica das paginas geradas.
 *
 * Cobre as 64 paginas, uma a uma — o que um passeio de navegador nao faz em
 * tempo util. Verifica acessibilidade estrutural, SEO e as regras de conteudo
 * deste projeto. O navegador cuida do que depende de layout e interacao.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const all = (html, re) => [...html.matchAll(re)];
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

async function main() {
  const pages = await walk(DIST);
  const problems = [];
  const stats = {
    pages: pages.length, images: 0, lazy: 0, eager: 0,
    withJsonLd: 0, pendingBlocks: 0,
  };

  for (const file of pages) {
    const rel = path.relative(DIST, file).replace(/\\/g, "/");
    const html = await readFile(file, "utf8");
    const fail = (msg) => problems.push(`${rel}: ${msg}`);

    // ---------------------------------------------------------- documento
    if (!/<html[^>]+lang="pt-BR"/.test(html)) fail('sem lang="pt-BR"');

    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    if (!title) fail("sem <title>");
    else if (title.length > 70) fail(`title com ${title.length} caracteres`);

    const desc = attr(html.match(/<meta name="description"[^>]*>/)?.[0] ?? "", "content");
    if (!desc) fail("sem meta description");
    else if (desc.length > 320) fail(`description com ${desc.length} caracteres`);

    if (!/<link rel="canonical"/.test(html)) fail("sem canonical");
    if (!/property="og:title"/.test(html)) fail("sem Open Graph");
    if (/application\/ld\+json/.test(html)) stats.withJsonLd++;

    // ------------------------------------------------------------ headings
    const h1s = all(html, /<h1[^>]*>/g);
    if (h1s.length !== 1) fail(`${h1s.length} elementos h1 (esperado 1)`);

    const levels = all(html, /<h([1-4])[^>]*>/g).map((m) => Number(m[1]));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        fail(`salto de heading h${levels[i - 1]} → h${levels[i]}`);
        break;
      }
    }

    // ------------------------------------------------------------- imagens
    for (const m of all(html, /<img\b[^>]*>/g)) {
      const tag = m[0];
      stats.images++;
      const alt = attr(tag, "alt");
      if (alt === undefined) fail(`img sem atributo alt: ${tag.slice(0, 90)}`);
      if (!attr(tag, "width") || !attr(tag, "height")) {
        fail(`img sem width/height explícitos: ${attr(tag, "src")}`);
      }
      if (/loading="lazy"/.test(tag)) stats.lazy++;
      else stats.eager++;
    }

    // -------------------------------------------------------- acessibilidade
    if (!/class="skip-link"/.test(html)) fail("sem skip link");

    for (const m of all(html, /<a\b[^>]*>/g)) {
      const tag = m[0];
      const href = attr(tag, "href");
      if (!href) fail(`âncora sem href: ${tag.slice(0, 80)}`);
      if (/target="_blank"/.test(tag) && !/rel="[^"]*noopener/.test(tag)) {
        fail(`target="_blank" sem rel noopener: ${href}`);
      }
    }

    for (const m of all(html, /<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
      const [tag, inner] = [m[0], m[1]];
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text && !attr(tag, "aria-label")) {
        fail(`botão sem nome acessível: ${tag.slice(0, 80)}`);
      }
    }

    for (const m of all(html, /<input\b[^>]*>/g)) {
      const tag = m[0];
      const id = attr(tag, "id");
      const type = attr(tag, "type");
      if (["hidden", "checkbox", "radio"].includes(type ?? "")) continue;
      const labelled =
        (id && new RegExp(`<label[^>]+for="${id}"`).test(html)) ||
        attr(tag, "aria-label");
      if (!labelled) fail(`campo sem rótulo: ${tag.slice(0, 90)}`);
    }

    // --------------------------------------------------------- conteudo
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ");

    if (/undefined|\[object Object\]|NaN\b/.test(text)) {
      fail("valor não renderizado no texto (undefined/NaN/objeto)");
    }
    if (/informação indisponível/i.test(text)) fail('texto "informação indisponível"');
    stats.pendingBlocks += all(html, /PENDENTE-CLIENTE/g).length;

    // Product estruturado nunca pode ganhar offers ou avaliacao.
    for (const m of all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const raw = m[1];
      if (/\\u003c/.test(raw) === false && /</.test(raw)) {
        fail("JSON-LD com '<' não escapado");
      }
      if (/"offers"|"price"|"aggregateRating"|"review"|"availability"/.test(raw)) {
        fail("JSON-LD com oferta, preço, avaliação ou disponibilidade");
      }
      try {
        JSON.parse(raw.replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&"));
      } catch {
        fail("JSON-LD inválido");
      }
    }
  }

  console.log("audit-static");
  console.log(`  ${stats.pages} páginas · ${stats.images} imagens (${stats.lazy} lazy / ${stats.eager} eager)`);
  console.log(`  ${stats.withJsonLd} páginas com dados estruturados · ${stats.pendingBlocks} marcadores PENDENTE-CLIENTE`);

  if (problems.length) {
    console.error(`\naudit-static: FALHOU — ${problems.length} problema(s):`);
    const shown = problems.slice(0, 40);
    shown.forEach((p) => console.error(`  - ${p}`));
    if (problems.length > shown.length) {
      console.error(`  … e mais ${problems.length - shown.length}`);
    }
    process.exit(1);
  }
  console.log("  OK");
}

await main();
