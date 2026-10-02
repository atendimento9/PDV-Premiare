/** Publish the AA/AAA editorial selection from the original catalog and Astor. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = path.join(root, "src", "data");
const read = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));
const write = async (file, value) => writeFile(path.join(data, file), JSON.stringify(value, null, 2) + "\n");
const key = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const unaccent = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const clean = (html = "") => html
  .replace(/<br\s*\/?\s*>/gi, ". ")
  .replace(/<\/(?:p|li|div)>/gi, ". ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/\s+/g, " ")
  .replace(/(?:\.\s*){2,}/g, ". ")
  .trim();
const excerpt = (value, limit = 380) => {
  if (value.length <= limit) return value;
  const cut = value.lastIndexOf(" ", limit);
  return value.slice(0, cut > 150 ? cut : limit).replace(/[,:;\s]+$/, "") + "…";
};

const categoryNames = {
  "kits-e-experiencias": "Kits e experiências",
  "executivo-e-trabalho": "Executivo e trabalho",
  tecnologia: "Tecnologia",
  "viagem-e-mobilidade": "Viagem e mobilidade",
  "casa-e-gastronomia": "Casa e gastronomia",
  "bem-estar-e-hospitalidade": "Bem-estar e hospitalidade",
  "reconhecimento-e-premiacao": "Reconhecimento e premiação",
};
const retained = [
  "BD95127", "BDKV0160", "KIT-GA0008", "BD-STANLEYPILSNER444ML", "KIT-ESPU025",
  "BD-POWERBANKPB198", "BD18673", "BD94399", "KIT-VBE002", "BD-BLCAPNOTISO",
  "BD94435", "KIT-COA0032", "KIT-FRA3047", "BDGA8400", "BDKWS100",
  "KIT-BOAS0056", "BD-CAIXACARTONADA02", "BD-W8DWXU5QR", "BD-ROUPAO",
];
const originalCategories = {
  BD95127: "executivo-e-trabalho", BDKV0160: "kits-e-experiencias",
  "KIT-GA0008": "kits-e-experiencias", "BD-STANLEYPILSNER444ML": "casa-e-gastronomia",
  "KIT-ESPU025": "kits-e-experiencias", "BD-POWERBANKPB198": "tecnologia",
  BD18673: "tecnologia", BD94399: "casa-e-gastronomia",
  "KIT-VBE002": "kits-e-experiencias", "BD-BLCAPNOTISO": "viagem-e-mobilidade",
  BD94435: "casa-e-gastronomia", "KIT-COA0032": "kits-e-experiencias",
  "KIT-FRA3047": "kits-e-experiencias", BDGA8400: "casa-e-gastronomia",
  BDKWS100: "kits-e-experiencias", "KIT-BOAS0056": "kits-e-experiencias",
  "BD-CAIXACARTONADA02": "kits-e-experiencias", "BD-W8DWXU5QR": "kits-e-experiencias",
  "BD-ROUPAO": "bem-estar-e-hospitalidade",
};
const featuredSkus = [
  "KIT-VBE002", "KIT-ITA6043", "KIT-VIN6028", "KIT-BOAS0047", "KIT-FRA3047",
  "BD92589", "BDMC700", "BD97216", "TB-PLACAPREMIAÇÃO", "BD-CAMPMUGSTANLEY",
];

const baseline = await read("src/data/catalog.baseline.json");
const astor = await read("scripts/astor-selection.source.json");
const selected = new Set(retained);
if (selected.size !== 19 || astor.length !== 46) throw new Error("Seleção de origem inesperada.");
const original = retained.map((sku) => {
  const p = baseline.find((item) => item.sku === sku);
  if (!p) throw new Error(`SKU original ausente: ${sku}`);
  const slug = originalCategories[sku];
  return {
    ...p,
    category: { name: categoryNames[slug], slug },
    image: p.image ? { ...p.image, alt: `${p.name} — ${categoryNames[slug]}` } : null,
    kitCombination: null,
    featured: featuredSkus.includes(sku),
  };
});

const application = {
  "kits-e-experiencias": "Composição para ações de relacionamento, celebração ou boas-vindas; apresentação e mensagem adaptadas à ocasião.",
  "executivo-e-trabalho": "Presente para lideranças, clientes estratégicos ou equipes, integrado a uma apresentação personalizada.",
  tecnologia: "Solução para equipes e clientes que valorizam utilidade no trabalho e na rotina móvel.",
  "viagem-e-mobilidade": "Presente para viagens, eventos de negócios e programas de relacionamento.",
  "casa-e-gastronomia": "Experiência de uso para clientes e colaboradores em ações de relacionamento.",
  "bem-estar-e-hospitalidade": "Composição de cuidado e hospitalidade para públicos selecionados.",
  "reconhecimento-e-premiacao": "Peça de homenagem com mensagem, identidade e acabamento definidos com a equipe.",
};

const astorProducts = await Promise.all(astor.map(async (p) => {
  const category = { name: categoryNames[p.category], slug: p.category };
  if (!category.name) throw new Error(`Categoria desconhecida em ${p.sku}`);
  const description = clean(p.sourceDescription);
  const parts = description.split(/(?<=\.)\s+(?=[A-ZÀ-Ú])/);
  const personalization = parts.filter((part) => /gravaç|personalizaç|impressão|serigrafia|silk|laser/i.test(part)).join(" ");
  const factual = parts.filter((part) => !/gravaç|personalizaç/i.test(part));
  const folder = key(p.sku);
  const photo = path.join(root, "public", "catalog", "products", folder, "cover-800.webp");
  const meta = await sharp(photo).metadata();
  const name = p.name;
  const sku = p.sku;
  return {
    sku,
    slug: `${key(name)}-${folder}`,
    name,
    category,
    image: {
      src: `/catalog/products/${folder}/cover-800.webp`,
      srcSmall: `/catalog/products/${folder}/cover-480.webp`,
      srcLarge: `/catalog/products/${folder}/cover-1200.webp`,
      alt: `${name} — ${category.name}`,
      width: meta.width,
      height: meta.height,
    },
    materials: null,
    colors: null,
    dimensionsAndCapacity: null,
    personalization: personalization ? excerpt(personalization, 300) : null,
    minimumQuantity: Number.isFinite(p.minimumQuantity) ? { value: p.minimumQuantity, unit: p.minimumQuantity === 1 ? "unidade" : "unidades", originalText: `${p.minimumQuantity} ${p.minimumQuantity === 1 ? "unidade" : "unidades"}` } : null,
    leadTime: null,
    differentiators: excerpt(factual.slice(0, 2).join(" ") || description),
    indicatedFor: null,
    premiareApplication: sku === "TB-PLACAPREMIAÇÃO"
      ? "Exemplo de gravação: ‘Em reconhecimento à dedicação e excelência — 2026’. A mensagem final é personalizada para cada homenagem."
      : application[p.category],
    kitCombination: null,
    technicalNotes: null,
    featured: featuredSkus.includes(sku),
  };
}));

const products = [...original, ...astorProducts];
if (products.length !== 65 || new Set(products.map((p) => p.sku)).size !== 65) throw new Error("Catálogo precisa ter 65 SKUs únicos.");
const bySku = new Map(products.map((p) => [p.sku, p]));
const categories = Object.entries(categoryNames).map(([slug, name]) => {
  const members = products.filter((p) => p.category.slug === slug);
  return { slug, name, count: members.length, coverSlug: (members.find((p) => p.featured) ?? members[0]).slug };
});
const solutions = [
  { slug: "boas-vindas-premium", name: "Boas-vindas premium", audience: "Novos colaboradores e lideranças", concept: "Uma chegada memorável com tecnologia, organização e apresentação de marca.", presentation: "Composição ilustrativa; a equipe confirma aplicação da marca, embalagem e disponibilidade no orçamento.", skus: ["KIT-BOAS0047", "BD92589", "BD-CAIXACARTONADA02"] },
  { slug: "lideranca-conectada", name: "Liderança conectada", audience: "Diretores e contas estratégicas", concept: "Mobilidade e tecnologia para a rotina executiva.", presentation: "Composição ilustrativa; a equipe confirma aplicação da marca, embalagem e disponibilidade no orçamento.", skus: ["BD-POWERBANKPB198", "BD95127", "BD97138", "BD18673"] },
  { slug: "ritual-de-cafe", name: "Ritual de café", audience: "Clientes e equipes especiais", concept: "Uma experiência de café para momentos de pausa e relacionamento.", presentation: "Composição ilustrativa; a equipe confirma aplicação da marca, embalagem e disponibilidade no orçamento.", skus: ["KIT-ITA6043", "BD-CAMPMUGSTANLEY", "BD-W8DWXU5QR"] },
  { slug: "bem-estar-e-hospitalidade", name: "Bem-estar e hospitalidade", audience: "Convidados, equipes e clientes", concept: "Cuidado e descanso em uma seleção de uso duradouro.", presentation: "Composição ilustrativa; a equipe confirma aplicação da marca, embalagem e disponibilidade no orçamento.", skus: ["BD-ROUPAO", "BD98138", "BD92580"] },
  { slug: "reconhecimento-com-presenca", name: "Reconhecimento com presença", audience: "Homenageados e parceiros", concept: "Uma homenagem acompanhada de uma experiência de celebração.", presentation: "Texto da placa ilustrativo; a equipe define mensagem, aplicação da marca e composição final no orçamento.", skus: ["TB-PLACAPREMIAÇÃO", "KIT-ESPU025", "BD-STANLEYPILSNER444ML"] },
];
const kits = solutions.map(({ skus, ...kit }) => ({
  ...kit,
  components: skus.map((sku) => {
    const p = bySku.get(sku);
    if (!p) throw new Error(`Componente ausente: ${sku}`);
    return { label: p.name, slug: p.slug, sku };
  }),
}));
const searchIndex = products.map((p) => ({
  slug: p.slug, name: p.name, sku: p.sku, category: p.category.name,
  categorySlug: p.category.slug, featured: p.featured,
  minQty: p.minimumQuantity?.value ?? null,
  haystack: unaccent([p.name, p.sku, p.category.name, p.materials, p.differentiators, p.indicatedFor].filter(Boolean).join(" ")).toLowerCase(),
}));
await Promise.all([
  write("catalog.generated.json", products),
  write("categories.generated.json", categories),
  write("featured.generated.json", featuredSkus),
  write("kits.generated.json", kits),
  write("catalog-search-index.json", searchIndex),
]);
console.log(`Catálogo publicado: ${products.length} produtos, ${categories.length} categorias, ${featuredSkus.length} destaques e ${kits.length} soluções.`);
