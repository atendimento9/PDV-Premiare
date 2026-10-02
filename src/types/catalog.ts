export type ProductImage = {
  src: string;
  srcSmall: string;
  srcLarge: string;
  alt: string;
  width: number;
  height: number;
};

export type MinimumQuantity = {
  value: number;
  unit: string;
  originalText: string;
};

/**
 * Forma publica do produto. O id interno da planilha, a URL de origem, a URL da
 * imagem original, o potencial comercial e a posicao no Top 10 nao existem aqui:
 * o JSON publico e montado campo a campo por allowlist no importador, nunca por
 * remocao de campos de um objeto completo. Coluna nova na planilha nasce privada.
 *
 * Nao existe, em nenhuma camada, campo de preco, estoque ou checkout.
 */
export type Product = {
  sku: string;
  slug: string;
  name: string;
  category: { name: string; slug: string };
  image: ProductImage | null;
  materials?: string | null;
  colors?: string | null;
  dimensionsAndCapacity?: string | null;
  personalization?: string | null;
  minimumQuantity?: MinimumQuantity | null;
  leadTime?: string | null;
  differentiators?: string | null;
  indicatedFor?: string | null;
  premiareApplication?: string | null;
  kitCombination?: string | null;
  technicalNotes?: string | null;
  featured: boolean;
};

export type Category = {
  slug: string;
  name: string;
  count: number;
  coverSlug: string;
};

export type KitComponent = {
  label: string;
  slug: string | null;
  sku: string | null;
};

export type Kit = {
  slug: string;
  name: string;
  audience: string | null;
  concept: string | null;
  presentation: string | null;
  components: KitComponent[];
};

export type SearchEntry = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  categorySlug: string;
  featured: boolean;
  minQty: number | null;
  haystack: string;
};
