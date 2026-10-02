import catalogData from "../data/catalog.generated.json";
import categoriesData from "../data/categories.generated.json";
import featuredData from "../data/featured.generated.json";
import kitsData from "../data/kits.generated.json";
import type { Category, Kit, Product } from "../types/catalog";

export const products = catalogData as Product[];
export const categories = categoriesData as Category[];
export const kits = kitsData as Kit[];

/**
 * Ordem editorial vinda da aba Top 10. Serve so para ordenar: a posicao de cada
 * item nunca chega ao HTML, ao JSON publico ou a um atributo data-*.
 */
const featuredOrder = featuredData as string[];
const featuredRank = new Map(featuredOrder.map((sku, i) => [sku, i]));

export const bySlug = new Map(products.map((p) => [p.slug, p]));
export const bySku = new Map(products.map((p) => [p.sku, p]));

export const featuredProducts: Product[] = featuredOrder
  .map((sku) => bySku.get(sku))
  .filter((p): p is Product => Boolean(p));

export function productsInCategory(slug: string): Product[] {
  return products.filter((p) => p.category.slug === slug);
}

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function kitBySlug(slug: string): Kit | undefined {
  return kits.find((k) => k.slug === slug);
}

/** Kits que citam este produto — usado para ligar produto e solucao nos dois sentidos. */
export function kitsWithProduct(sku: string): Kit[] {
  return kits.filter((k) => k.components.some((c) => c.sku === sku));
}

/**
 * Relacionados por ordem deterministica, nunca aleatoria: mesma categoria
 * primeiro, depois quem divide um kit sugerido, e o desempate final e a
 * prioridade editorial seguida do nome. O mesmo produto gera sempre a mesma
 * lista, em qualquer build.
 */
export function relatedProducts(product: Product, limit = 4): Product[] {
  const kitMates = new Set(
    kitsWithProduct(product.sku).flatMap((k) => k.components.map((c) => c.sku)),
  );
  const score = (p: Product): number => {
    let s = 0;
    if (p.category.slug === product.category.slug) s -= 100;
    if (kitMates.has(p.sku)) s -= 50;
    if (p.featured) s -= 10;
    return s;
  };
  return products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name, "pt-BR"))
    .slice(0, limit);
}

/** Ordena colocando os destaques na frente, na ordem editorial da planilha. */
export function byEditorialPriority(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    const ra = featuredRank.get(a.sku) ?? Number.MAX_SAFE_INTEGER;
    const rb = featuredRank.get(b.sku) ?? Number.MAX_SAFE_INTEGER;
    return ra - rb || a.name.localeCompare(b.name, "pt-BR");
  });
}

/** Linhas da ficha tecnica que existem de fato. Campo ausente nao vira linha. */
export function specRows(p: Product): Array<{ label: string; value: string }> {
  const candidates: Array<[string, string | null | undefined]> = [
    ["Materiais", p.materials],
    ["Cores", p.colors],
    ["Medidas e capacidade", p.dimensionsAndCapacity],
    ["Personalização", p.personalization],
    ["Quantidade mínima", p.minimumQuantity?.originalText],
    ["Prazo de produção", p.leadTime],
    ["Observações", p.technicalNotes],
  ];
  return candidates
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => ({ label, value }));
}

export const categoryCover = (category: Category): Product | undefined =>
  bySlug.get(category.coverSlug);
