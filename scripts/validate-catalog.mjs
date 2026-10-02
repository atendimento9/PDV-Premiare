/**
 * Validacao do catalogo gerado.
 *
 * Falha o build relatando os numeros REAIS. Em nenhuma hipotese ajusta dado
 * para bater com a contagem esperada: se a planilha mudar, o certo e a
 * validacao apontar a mudanca, nao o site esconder.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src", "data");

const EXPECTED = { products: 40, categories: 9, featured: 10, kits: 5 };

const FORBIDDEN_KEYS = [
  "price", "salePrice", "promotionalPrice", "currency", "discount",
  "installments", "inventory", "stock", "checkoutUrl", "addToCart", "offer",
  "offers", "potential", "sourceUrl", "photoUrl", "internalId", "rank", "position",
];

const json = async (name) => JSON.parse(await readFile(path.join(DATA, name), "utf8"));

function deepKeys(value, out = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((v) => deepKeys(v, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      out.add(k);
      deepKeys(v, out);
    }
  }
  return out;
}

async function main() {
  const products = await json("catalog.generated.json");
  const categories = await json("categories.generated.json");
  const featured = await json("featured.generated.json");
  const kits = await json("kits.generated.json");
  const searchIndex = await json("catalog-search-index.json");

  const errors = [];
  const warnings = [];

  const counts = {
    products: products.length,
    categories: categories.length,
    featured: featured.length,
    kits: kits.length,
  };

  for (const [key, expected] of Object.entries(EXPECTED)) {
    if (counts[key] !== expected) {
      errors.push(
        `Contagem de ${key}: real ${counts[key]}, esperado ${expected}. ` +
        "A planilha é a verdade — investigue a fonte, não ajuste o dado.",
      );
    }
  }

  // --------------------------------------------------------- integridade
  const slugs = new Set();
  const skus = new Set();
  for (const p of products) {
    if (!p.sku) errors.push(`Produto sem código: ${p.name ?? "(sem nome)"}`);
    if (!p.name) errors.push(`Produto sem nome: ${p.sku}`);
    if (!p.category?.slug) errors.push(`Produto sem categoria: ${p.sku}`);
    if (slugs.has(p.slug)) errors.push(`Slug duplicado: ${p.slug}`);
    if (skus.has(p.sku)) errors.push(`Código duplicado: ${p.sku}`);
    slugs.add(p.slug);
    skus.add(p.sku);

    if (p.image) {
      for (const key of ["src", "srcSmall", "srcLarge"]) {
        if (!p.image[key]?.startsWith("/catalog/products/")) {
          errors.push(`Imagem fora do diretório local em ${p.sku}: ${p.image[key]}`);
        }
      }
      if (!p.image.alt || !p.image.alt.includes(p.name)) {
        errors.push(`Alt text não derivado do nome em ${p.sku}.`);
      }
      if (!p.image.width || !p.image.height) {
        errors.push(`Imagem sem dimensões explícitas em ${p.sku}.`);
      }
    } else {
      warnings.push(`${p.sku}: sem imagem publicada (ver docs/CATALOG_ISSUES.md).`);
    }
  }

  // ------------------------------------------------------------ Top 10
  for (const sku of featured) {
    if (!skus.has(sku)) errors.push(`SKU do Top 10 não encontrado no catálogo: ${sku}`);
  }
  const flagged = products.filter((p) => p.featured).length;
  if (flagged !== featured.length) {
    errors.push(`Destaques marcados (${flagged}) não batem com a lista do Top 10 (${featured.length}).`);
  }

  // -------------------------------------------------------- categorias
  for (const c of categories) {
    const real = products.filter((p) => p.category.slug === c.slug).length;
    if (real === 0) errors.push(`Categoria vazia publicada: ${c.slug}`);
    if (real !== c.count) errors.push(`Contagem da categoria ${c.slug}: real ${real}, registrado ${c.count}.`);
    if (!slugs.has(c.coverSlug)) errors.push(`Capa da categoria ${c.slug} aponta para produto inexistente.`);
  }
  const orphan = products.filter((p) => !categories.some((c) => c.slug === p.category.slug));
  for (const p of orphan) errors.push(`Produto em categoria não publicada: ${p.sku}`);

  // -------------------------------------------------------------- kits
  for (const kit of kits) {
    if (!kit.components?.length) errors.push(`Kit sem composição: ${kit.slug}`);
    for (const c of kit.components) {
      if (c.sku && !skus.has(c.sku)) {
        errors.push(`Kit ${kit.slug}: componente aponta para SKU inexistente (${c.sku}).`);
      }
      if (c.slug && !slugs.has(c.slug)) {
        errors.push(`Kit ${kit.slug}: componente aponta para slug inexistente (${c.slug}).`);
      }
    }
  }

  // ------------------------------------------- allowlist do JSON publico
  const publicKeys = deepKeys([products, categories, kits, searchIndex]);
  for (const key of FORBIDDEN_KEYS) {
    if (publicKeys.has(key)) {
      errors.push(`Campo proibido presente no JSON público: "${key}".`);
    }
  }

  if (searchIndex.length !== products.length) {
    errors.push(`Índice de busca com ${searchIndex.length} entradas para ${products.length} produtos.`);
  }

  // -------------------------------------------------------------- saida
  console.log("validate-catalog");
  console.log(
    `  produtos ${counts.products}/${EXPECTED.products} · categorias ${counts.categories}/${EXPECTED.categories} · ` +
    `destaques ${counts.featured}/${EXPECTED.featured} · kits ${counts.kits}/${EXPECTED.kits} · ` +
    `imagens ${products.filter((p) => p.image).length}/${counts.products}`,
  );

  warnings.forEach((w) => console.log(`  aviso: ${w}`));

  if (errors.length) {
    console.error(`\nvalidate-catalog: FALHOU — ${errors.length} erro(s):`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log("  OK");
}

await main();
