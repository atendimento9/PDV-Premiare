/** Rebuild the internal, source-linked selection register. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = async (p) => JSON.parse(await readFile(path.join(root, p), "utf8"));
const original = await read("src/data/catalog.baseline.json");
const published = await read("src/data/catalog.generated.json");
const spec = await read("scripts/astor-selection-spec.json");
const astor = await read("scripts/astor-selection.source.json");
const active = new Set(published.map((p) => p.sku));
const sourceBySku = new Map(astor.map((p) => [p.sku, p]));
const removed = original.filter((p) => !active.has(p.sku));
const retained = original.filter((p) => active.has(p.sku));
if (retained.length !== 19 || removed.length !== 21 || spec.length !== 46) throw new Error("Contagens da curadoria divergentes.");

const lines = [
  "# Curadoria do catálogo — 2 de outubro de 2026", "",
  "## Critério", "",
  "AA e AAA são classes **editoriais de valor percebido**, não faixas de preço comprovadas. A seleção prioriza kits completos, marcas reconhecidas, materiais e funções de uso duradouro, apresentação adequada a presentes corporativos e possibilidades de composição ou personalização. Itens avulsos simples só permanecem quando funcionam como base de um kit personalizado. Condições, técnicas e disponibilidade dependem de orçamento.", "",
  "O catálogo original tinha 40 itens. Foram mantidos 19, retirados 21 e adicionados 46 itens do catálogo oficial da Astor, totalizando **65 produtos**. Há 7 categorias, 10 destaques e 5 soluções editoriais por ocasião.", "",
  "## Originais mantidos", "",
  "| SKU | Produto |", "|---|---|",
  ...retained.map((p) => `| ${p.sku} | ${p.name.replaceAll("|", "/")} |`), "",
  "## Originais retirados", "",
  "| SKU | Produto |", "|---|---|",
  ...removed.map((p) => `| ${p.sku} | ${p.name.replaceAll("|", "/")} |`), "",
  "## Produtos adicionados da Astor", "",
  "Cada link leva à ficha do próprio fornecedor. O SKU, a descrição e o mínimo publicados foram confrontados com essas fichas em 2 de outubro de 2026. A classificação AA/AAA é julgamento de curadoria da Premiare.", "",
  "| Classe | SKU | Produto | Ficha oficial |", "|---|---|---|---|",
  ...spec.map((p) => {
    const source = sourceBySku.get(p.sku);
    if (!source) throw new Error(`Ficha Astor ausente: ${p.sku}`);
    return `| ${p.tier} | ${p.sku} | ${p.name.replaceAll("|", "/")} | [Astor](${source.sourceUrl}) |`;
  }), "",
  "## Soluções e imagem de premiação", "",
  "As cinco soluções de boas-vindas, liderança, café, bem-estar e reconhecimento são composições ilustrativas com produtos que existem no catálogo final. A equipe comercial define a combinação, a embalagem e a personalização antes de orçar.", "",
  "A placa de premiação mostra o texto genérico **‘Em reconhecimento à dedicação e excelência — 2026’**. O troféu acrílico com ‘Destaque do Ano 2026’ foi retirado. Na linha de reconhecimento, a placa em caixa aveludada é a alternativa selecionada. A caneca térmica Stanley Camp Mug 350 mL ocupa a vaga no total de 65 itens. A imagem do troféu foi arquivada fora da pasta pública.", "",
  "A busca nas fichas Astor por ‘troféu’ retornou apenas o modelo acrílico rejeitado. As outras ‘placas de metal/inox’ encontradas são pequenas placas para fixar em mochilas e malas, portanto não foram tratadas como premiações.", "",
  "Quatro imagens foram editadas com ImageGen em modo de edição, preservando o produto e substituindo marcas ou inscrições de exemplos por apresentação neutra: `assets/catalog-curated/astor-kit-boas0047.png` (remover logos Denso), `assets/catalog-curated/astor-kit-boas0053.png` (remover logos Assistance), `assets/catalog-curated/astor-kit-que0002.png` (remover logos Minutos Lavanderia) e `assets/catalog-curated/astor-tb-placapremiacao.png` (aplicar mensagem genérica de reconhecimento). As variantes WebP publicadas foram geradas a partir desses arquivos. As demais fotos são variantes das imagens oficiais da Astor, com algumas alternativas de ângulo selecionadas em `scripts/astor-image-overrides.json`.", "",
  "A relação entre fotos locais, fichas oficiais e hashes está em `.cache/astor-curation/images/image-audit.json`. URLs de origem e metadados internos ficam fora dos JSONs e páginas públicas.", "",
];
await writeFile(path.join(root, "docs", "CURADORIA_2026-10-02.md"), lines.join("\n"), "utf8");
console.log("Relatório de curadoria atualizado.");
