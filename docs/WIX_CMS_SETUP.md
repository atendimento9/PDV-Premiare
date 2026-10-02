# Coleções sugeridas no Wix CMS

> **Documento arquivado em 02/10/2026:** o projeto passou a ser hospedado na
> Vercel e estes passos de Wix CMS não fazem parte da publicação atual. Consulte
> `VERCEL_DEPLOYMENT.md`.

Necessário apenas se a Premiare quiser editar o catálogo dentro da Wix. **Para
publicar, não é preciso nada disto** — o build estático sobe direto.

## O que é verdade sobre as opções

- **O build estático pode ser enviado como está.** É o caminho pronto hoje.
- **Edição visual nativa exige reconstrução ou integração específica.** Não
  existe importação automática perfeita de um site estático para o editor.
- **O catálogo estático precisa ser recompilado quando a planilha mudar** — o que
  são dois comandos, mas exige quem os rode.
- **Uma integração futura com o Wix CMS elimina essa recompilação**, ao custo de
  reconstruir as páginas no editor e migrar os dados.

## Coleções

### `Products` — 40 registros

| Campo | Tipo | Observação |
|---|---|---|
| `sku` | Texto | chave, único |
| `slug` | Texto | URL, único |
| `name` | Texto | |
| `categoryRef` | Referência → `Categories` | |
| `image` | Imagem | 37 preenchidas |
| `imageAlt` | Texto | derivado: "{nome} — {categoria}" |
| `materials` | Texto longo | opcional |
| `colors` | Texto longo | opcional |
| `dimensionsAndCapacity` | Texto longo | opcional |
| `personalization` | Texto longo | opcional |
| `minimumQuantityValue` | Número | opcional |
| `minimumQuantityText` | Texto | opcional |
| `leadTime` | Texto | opcional; só 1 de 40 preenchido |
| `differentiators` | Texto longo | |
| `indicatedFor` | Texto longo | |
| `premiareApplication` | Texto longo | opcional |
| `kitCombination` | Texto longo | opcional |
| `technicalNotes` | Texto longo | opcional; só 3 de 40 |
| `featured` | Booleano | |

> **`Products` não pode ter campo de preço.** Nem preço, nem promocional, nem
> moeda, nem parcelamento, nem estoque, nem disponibilidade — em nenhuma
> coleção. Um campo criado "só para uso interno" acaba exposto por um dataset
> mal configurado. Se precisar existir, que exista fora da Wix.

Também não devem ser criados: ID interno da planilha, potencial comercial,
posição no Top 10, URL da fonte, URL da imagem original ou qualquer coluna da
aba Prospecção.

### `Categories` — 9 registros

`slug` · `name` · `productCount` (número) · `coverProductRef` (referência).
Categoria sem produto não deve ser publicada.

### `Solutions` — 5 registros

`slug` · `name` · `audience` · `concept` · `presentation` ·
`components` (referência múltipla → `Products`) · `componentLabels` (texto longo,
para itens definidos no atendimento).

### `FAQs` — 9 registros

`question` · `answer` · `order` (número).
Nenhuma resposta pode prometer prazo, disponibilidade ou condição comercial.

### `SiteSettings` — 1 registro

`name` · `tagline` · `whatsappNumber` · `phone` · `email` · `address` ·
`instagram` · `linkedin` · `siteUrl`.

Registro único, lido por todos os componentes. Nenhum componente repete o
número. Com `whatsappNumber` vazio, os CTAs devem apontar para `/contato` — não
gerar URL quebrada nem inventar número.

## Importação

Os JSONs em `src/data/` são a fonte para popular as coleções:
`catalog.generated.json`, `categories.generated.json`, `kits.generated.json`,
`featured.generated.json`.

Ordem: `Categories` → `Products` → `Solutions` → `FAQs` → `SiteSettings`.

Imagens de `public/catalog/products/{codigo}/cover-800.webp`, subidas com o
código no nome do arquivo para casar com o `sku`.

## Se o CMS for adotado, mantenha os gates

As regras que protegem este projeto não moram no Astro; moram nos scripts. Se as
páginas forem reconstruídas na Wix, replicar pelo menos:

- nenhum campo de preço, estoque ou checkout em coleção nenhuma;
- nenhuma URL do fornecedor em conteúdo publicado;
- campo ausente não renderiza linha — nunca exibir "NI" ou "não informado";
- `alt` derivado do nome e da categoria, nunca descritivo;
- `Product` estruturado sem `offers`.
