/**
 * Gate de termos proibidos.
 *
 * Dois escopos diferentes, de proposito:
 *  - BYTES: tudo que sai no arquivo, inclusive script e atributo. Pega dado que
 *    "some" da tela mas continua no HTML.
 *  - TEXTO RENDERIZADO: so o que o visitante le, com script, style e tags fora.
 *    E onde moram as regras de linguagem, que num bundle dariam falso positivo.
 *
 * Uma excecao so vale se estiver escrita aqui e justificada em docs/DECISIONS.md.
 * Relaxar o gate em silencio e pior do que o problema que ele pega.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");

const SCAN_EXT = new Set([".html", ".json", ".xml", ".txt", ".svg", ".js", ".css"]);

/** Escopos: "bytes" | "rendered" | "both". */
const RULES = [
  { re: /R\$/g, scope: "bytes", label: "símbolo de moeda" },
  { re: /\bBRL\b/g, scope: "bytes", label: "código de moeda" },
  { re: /"price"|priceCurrency|"offers"|\bOffer\b|itemprop="price"|product:price/g, scope: "bytes", label: "marcação de preço" },
  { re: /salePrice|promotionalPrice|\bdiscount\b|installments|parcelamento/gi, scope: "bytes", label: "preço ou parcelamento" },
  { re: /addToCart|add-to-cart|\bcheckout\b|\bcarrinho\b/gi, scope: "bytes", label: "carrinho ou checkout" },
  { re: /\bcomprar\b/gi, scope: "rendered", label: "chamada de compra" },
  { re: /\bastorbrindes\b|cdn\.brinde\.me/gi, scope: "bytes", label: "URL do fornecedor" },
  { re: /\bNI\b/g, scope: "rendered", label: "marcador NI" },
  { re: /n[ãa]o informado no site/gi, scope: "both", label: "texto de ausência" },
  // Aba Prospecção: dado comercial interno.
  { re: /gancho de abordagem|pr[óo]xima a[çc][ãa]o|segmentos-alvo|montar mockup|potencial alt[íi]ssimo|m[ée]dio-alto/gi, scope: "bytes", label: "dado da aba Prospecção" },
  { re: /\bestoque\b|\bem estoque\b/gi, scope: "rendered", label: "afirmação de estoque" },
];

/**
 * "a partir de" e uma frase legitima de quantidade minima. So e proibida quando
 * aparece colada a valor ou moeda.
 */
const A_PARTIR_DE = /a partir de\s+([^.;<]{0,40})/gi;
const QUANTITY_AFTER = /^\s*\d[\d.,]*\s*(unidades?|pe[çc]as?|un\b|itens?)/i;
const MONEY_AFTER = /R\$|\breais\b|\bBRL\b/i;

/**
 * Excecoes auditadas. Cada entrada precisa de motivo.
 */
const ALLOWED = [
  {
    rule: "afirmação de estoque",
    // A pagina de privacidade e o FAQ explicam que o site NAO mostra estoque.
    contexts: [/n[ãa]o.{0,40}estoque/i, /estoque\b.{0,30}confirmad/i, /portf[óo]lio, n[ãa]o o estoque/i],
    why: "Frases que negam a existência de estoque no site — o oposto do que a regra evita.",
  },
];

const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

function renderedText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".cache") continue;
      out.push(...(await walk(full)));
    } else if (SCAN_EXT.has(path.extname(entry.name)) || entry.name.endsWith(".astro")) {
      out.push(full);
    }
  }
  return out;
}

function isAllowed(label, haystack, index) {
  const window = haystack.slice(Math.max(0, index - 80), index + 80);
  return ALLOWED.some(
    (a) => a.rule === label && a.contexts.some((c) => c.test(window)),
  );
}

async function main() {
  const files = [...(await walk(DIST)), ...(await walk(SRC))];
  const failures = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const inDist = rel.startsWith("dist");
    const raw = await readFile(file, "utf8");
    const isHtml = file.endsWith(".html");
    const rendered = isHtml ? renderedText(raw) : raw;

    for (const rule of RULES) {
      // Regras de fornecedor e de Prospecção só fazem sentido no build publicado
      // e no fonte; o restante vale para os dois.
      if (rule.scope === "rendered" && !isHtml) continue;
      const haystack = rule.scope === "rendered" ? rendered : raw;
      rule.re.lastIndex = 0;
      let match;
      while ((match = rule.re.exec(haystack)) !== null) {
        if (isAllowed(rule.label, haystack, match.index)) continue;
        failures.push({
          file: rel,
          rule: rule.label,
          found: match[0],
          context: haystack.slice(Math.max(0, match.index - 60), match.index + 60).trim(),
        });
        if (failures.length > 60) break;
      }
    }

    // "a partir de" com escopo próprio.
    if (isHtml || rel.startsWith("src")) {
      const hay = strip(rendered);
      A_PARTIR_DE.lastIndex = 0;
      let m;
      while ((m = A_PARTIR_DE.exec(hay)) !== null) {
        const after = m[1] ?? "";
        if (QUANTITY_AFTER.test(after)) continue;
        if (!MONEY_AFTER.test(after) && !/\d/.test(after)) continue;
        failures.push({
          file: rel,
          rule: '"a partir de" junto a valor',
          found: m[0].trim(),
          context: m[0].trim(),
        });
      }
    }

    if (inDist && isHtml) {
      // Nenhum dado interno pode viajar em atributo data-*.
      const forbiddenAttrs = raw.match(/data-(potencial|prioridade|gancho|source-url|photo-url|internal-id|posicao)="[^"]*"/gi);
      if (forbiddenAttrs) {
        failures.push({
          file: rel, rule: "campo interno em data-*",
          found: forbiddenAttrs[0], context: forbiddenAttrs.join(" "),
        });
      }
    }
  }

  if (failures.length === 0) {
    console.log(`check-forbidden: OK — ${files.length} arquivos varridos, nenhuma ocorrência.`);
    return;
  }

  console.error(`check-forbidden: FALHOU — ${failures.length} ocorrência(s):\n`);
  for (const f of failures.slice(0, 40)) {
    console.error(`  [${f.rule}] ${f.file}`);
    console.error(`      encontrado: ${JSON.stringify(f.found)}`);
    console.error(`      contexto:   …${f.context}…\n`);
  }
  process.exit(1);
}

await main();
