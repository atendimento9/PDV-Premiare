# Esquema do catálogo

Arquivos gerados por `scripts/import-catalog.py` e `scripts/optimize-images.mjs`.
Todos em `src/data/`, UTF-8, com acentuação preservada. **Não edite à mão** —
são regenerados a cada importação.

## `catalog.generated.json` — 40 produtos

```ts
type Product = {
  sku: string;
  slug: string;
  name: string;
  category: { name: string; slug: string };
  image: {
    src: string;        // variante de 800 px
    srcSmall: string;   // 480 px
    srcLarge: string;   // 1200 px
    alt: string;        // "{nome} — {categoria}", sempre derivado
    width: number;
    height: number;
  } | null;             // null quando não há foto publicável
  materials?: string | null;
  colors?: string | null;
  dimensionsAndCapacity?: string | null;
  personalization?: string | null;
  minimumQuantity?: { value: number; unit: string; originalText: string } | null;
  leadTime?: string | null;
  differentiators?: string | null;
  indicatedFor?: string | null;
  premiareApplication?: string | null;
  kitCombination?: string | null;
  technicalNotes?: string | null;
  featured: boolean;
};
```

**Campos proibidos em qualquer camada, inclusive como `null`:** `price`,
`salePrice`, `promotionalPrice`, `currency`, `discount`, `installments`,
`inventory`, `stock`, `checkoutUrl`, `addToCart`, `offer`, `offers`. Também não
existem `id`, `potential`, `sourceUrl`, `photoUrl` nem posição no Top 10 — são
internos. `validate-catalog` falha o build se qualquer um deles aparecer.

`alt` é **derivado** do nome e da categoria, nunca uma descrição do que se supõe
estar na foto.

## `categories.generated.json` — 9 categorias

```ts
type Category = { slug: string; name: string; count: number; coverSlug: string };
```

`count` é conferido contra a contagem real; divergência falha o build. Categoria
sem produto não é publicada.

## `featured.generated.json` — 10 códigos

Array de SKUs na ordem editorial da aba Top 10. Serve **apenas para ordenar**. A
posição de cada item nunca é publicada, nem como texto, nem como atributo.

## `kits.generated.json` — 5 soluções

```ts
type Kit = {
  slug: string;
  name: string;
  audience: string | null;
  concept: string | null;
  presentation: string | null;
  components: Array<{ label: string; slug: string | null; sku: string | null }>;
};
```

`slug` e `sku` do componente ficam preenchidos quando ele foi casado com um
produto do catálogo; nulos quando o item é definido no atendimento. Os 22
componentes das cinco soluções casaram com produtos reais.

O casamento usa sobreposição de tokens significativos, com tolerância a plural e
gênero mas **sem** tolerância a raiz diferente — "neoplex" e "neoprene"
compartilham quatro letras e são produtos distintos. Empate no topo não vira
palpite: o componente é publicado como texto e a ocorrência é registrada.

## `catalog-search-index.json`

Índice da busca no cliente. **Público**, e por isso passa pela mesma allowlist.
Cada entrada traz slug, nome, código, categoria, destaque, quantidade mínima e um
campo de busca sem acentos, montado só com campos públicos.

## Normalização de ausência

`NI — não informado no site` e variantes viram **ausência** (`null`), nunca o
texto literal. Campo ausente não é renderizado: sem linha, sem espaço reservado,
sem "informação indisponível".

Além disso, um sanitizador remove **cláusula a cláusula** o que referencia a
fonte de terceiro, declara ausência ou é nota interna de curadoria. Ver
`CATALOG_IMPORT_REPORT.md` para a lista completa das 112 cláusulas removidas.

## Pipeline

```
planilha .xlsx
   └─ scripts/import-catalog.py     → JSONs + imagens brutas em .cache/
        └─ scripts/optimize-images.mjs → webp 480/800/1200 em public/catalog/
             └─ scripts/validate-catalog.mjs → falha o build se algo divergir
```

Idempotente: rodar de novo com a mesma planilha produz o mesmo resultado.
Downloads já feitos são reaproveitados do cache.
