/**
 * Lint de projeto: regras que importam para ESTE site e que um linter genérico
 * não conhece. Roda sobre o fonte, antes do build.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");

const RULES = [
  {
    id: "sem-html-cru-com-dado",
    re: /set:html=\{(?!`<!-- PENDENTE-CLIENTE)(?!serializeJsonLd\()/g,
    message:
      "set:html só é permitido para o marcador PENDENTE-CLIENTE e para o JSON-LD "
      + "serializado por serializeJsonLd, que escapa < > &. Dado do catálogo é renderizado escapado.",
  },
  {
    id: "sem-innerhtml",
    re: /\.innerHTML\s*=|dangerouslySetInnerHTML|insertAdjacentHTML/g,
    message: "innerHTML com dado do catálogo é proibido — use textContent.",
  },
  {
    id: "whatsapp-centralizado",
    re: /wa\.me\/\d/g,
    message: "Número de WhatsApp fora de src/config/site.ts.",
    allow: (file) => file.endsWith(path.join("config", "site.ts")),
  },
  {
    id: "sem-cdn-externo",
    re: /https?:\/\/(?!schema\.org|www\.sitemaps\.org|www\.w3\.org)[a-z0-9.-]+\.[a-z]{2,}/gi,
    // `.invalid` e o marcador de dominio pendente (RFC 2606), nao um host real.
    skipContext: /\.invalid/,
    message:
      "Referência a host externo. O site precisa funcionar sem rede externa; fontes e imagens são locais.",
    allow: (file) => file.endsWith(path.join("config", "site.ts")),
  },
  {
    id: "sem-cor-fora-do-token",
    re: /#(?!fff\b|ffffff\b)[0-9a-f]{3,8}\b/gi,
    message: "Cor literal fora de tokens.css. Use as variáveis da paleta.",
    allow: (file) => file.endsWith(path.join("styles", "tokens.css")) || file.endsWith(".svg"),
    // <meta name="theme-color"> nao aceita variavel CSS; o literal e inevitavel ali.
    skipContext: /theme-color/,
  },
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(astro|ts|css|mjs)$/.test(entry.name) && !entry.name.endsWith(".generated.json")) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const files = (await walk(SRC)).filter((f) => !f.includes(`${path.sep}data${path.sep}`));
  const problems = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const text = await readFile(file, "utf8");
    // Comentários não são código: uma regra citada em comentário não é violação.
    const code = text
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/(^|\s)\/\/[^\n]*/g, " ")
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");

    for (const rule of RULES) {
      if (rule.allow?.(file)) continue;
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(code)) !== null) {
        const around = code.slice(Math.max(0, m.index - 120), m.index + 60);
        if (rule.skipContext?.test(around)) continue;
        problems.push({ file: rel, rule: rule.id, found: m[0], message: rule.message });
      }
    }
  }

  console.log(`lint: ${files.length} arquivos`);
  if (problems.length) {
    console.error(`lint: FALHOU — ${problems.length} problema(s):`);
    for (const p of problems.slice(0, 30)) {
      console.error(`  [${p.rule}] ${p.file} → ${JSON.stringify(p.found)}`);
      console.error(`      ${p.message}`);
    }
    process.exit(1);
  }
  console.log("  OK");
}

await main();
