# Site institucional e catálogo B2B — Premiare Criativa

Catálogo comercial, vitrine institucional e geração de leads por WhatsApp.
Build estático, publicável na Wix.

**Não é e-commerce.** Não existem preço, carrinho, checkout, pagamento, login,
cadastro, área do cliente nem estoque — em nenhuma camada, nem como campo nulo.

---

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:4321`.

Para conferir o **build de verdade**, que é o que vai para a Wix:

```bash
npm run build
node scripts/serve-dist.mjs 4399
```

Servidor sem Vite, sem HMR, servindo os bytes de `dist/`. Use este para QA —
testar o servidor de desenvolvimento testa outra coisa.

## Gerar o build

```bash
SITE_URL=https://www.seudominio.com.br npm run build
```

Sem `SITE_URL`, o build usa o marcador `https://dominio-a-definir.invalid` em
canonical, Open Graph e sitemap. É proposital: um domínio adivinhado passaria
despercebido, um `.invalid` não.

Envie para a Wix a pasta **`dist/`**, com `index.html` na raiz. Detalhes em
[`docs/WIX_EXPORT.md`](docs/WIX_EXPORT.md).

## Atualizar o catálogo

A planilha `relatorio_premiare_astor*.xlsx` é a **fonte única**. Nada é
transcrito à mão.

```bash
npm run import-catalog    # lê a planilha, gera os JSONs e extrai as imagens
npm run optimize-images   # baixa a versão em alta, valida e gera as variantes webp
npm run build
npm run gates
```

O pipeline aplica as 13 imagens genéricas revisadas em
`assets/catalog-curated/` antes de gerar as variantes; o mapeamento está em
`scripts/catalog-image-overrides.json`. O importador procura a planilha em
`$PREMIARE_XLSX_DIR`, depois `./source/`,
depois `~/Downloads/`. Ele **não escreve** na planilha original.

Se a contagem divergir de 40 produtos / 9 categorias / 10 destaques / 5 kits, a
validação falha e mostra os números reais. Investigue a planilha; não ajuste o
dado para o gate passar.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera `dist/` |
| `npm run preview` | Preview do Astro |
| `npm run lint` | Regras próprias do projeto (sem HTML cru com dado, sem host externo, sem cor fora dos tokens, WhatsApp centralizado) |
| `npm run typecheck` | `astro check` |
| `npm run import-catalog` | Importa a planilha |
| `npm run optimize-images` | Pipeline de mídia |
| `npm run validate-catalog` | Contagens, integridade e allowlist do JSON público |
| `npm run check-forbidden` | Varre `dist/` e `src/` por preço, carrinho, URL do fornecedor, dado interno |
| `npm run check-budget` | Peso por página e limites da plataforma |
| `npm run check-links` | Links internos e sitemap |
| `npm run gates` | Roda os quatro gates em sequência |
| `node scripts/audit-static.mjs` | Auditoria de acessibilidade e SEO nas páginas geradas |
| `node scripts/serve-dist.mjs` | Serve `dist/` como estático puro |

## Estrutura

```
src/
├─ components/     Cabeçalho, rodapé, cards, catálogo, formulário de orçamento
├─ config/site.ts  WhatsApp, contatos, redes — ponto único
├─ content/faq.ts  Perguntas frequentes (fonte única da home e da página)
├─ data/           JSONs gerados — não editar à mão
├─ layouts/        Layout base: metadados, JSON-LD, animação de entrada
├─ lib/catalog.ts  Acesso ao catálogo e ordens determinísticas
├─ pages/          Rotas
├─ styles/         tokens.css e base.css
└─ types/          Forma pública do produto

scripts/           Importação, mídia, gates, servidor estático
assets/catalog-curated/  Fontes locais das imagens de produto editadas
docs/              Documentação e relatórios
public/            Logo, fontes, imagens do catálogo, favicon
```

## Onde ficam as coisas

| Preciso de… | Está em |
|---|---|
| Número de WhatsApp, e-mail, endereço | `src/config/site.ts` |
| Cores e tipografia | `src/styles/tokens.css` |
| Dados do catálogo | `src/data/*.generated.json` |
| Perguntas frequentes | `src/content/faq.ts` |
| Revisão e substituição de imagens | `scripts/image-review.json`, `scripts/catalog-image-overrides.json` |
| Clientes do carrossel | `src/content/clients.ts` |
| Vídeo e poster do hero | `public/video/` |
| Limites de tamanho da Wix | topo de `scripts/check-budget.mjs` |

## Regras que o projeto se impõe

Estão nos gates, não só na intenção:

- **Nunca preço.** `check-forbidden` varre `dist/` e `src/` por moeda, marcação de
  preço, carrinho, checkout e parcelamento — nos bytes, não só no texto visível.
- **Nunca dado interno.** O JSON público é montado por **allowlist**, campo a
  campo. Coluna nova na planilha nasce privada.
- **Nunca invenção.** Todo texto publicado vem de célula da planilha, do briefing,
  de rótulo genérico de interface ou de um bloco marcado como pendente.
- **Nunca URL do fornecedor** em HTML, JSON, sitemap ou metadado.
- **Campo ausente não vira linha.** Sem "NI", sem "não informado", sem espaço
  reservado.
- **`alt` é derivado**, nunca uma descrição do que se supõe estar na foto.
- **Dado da planilha é sempre escapado.** `set:html` só para o marcador de
  pendência e para o JSON-LD, que escapa `< > &`.

## Documentação

| Documento | Assunto |
|---|---|
| [`DATA_PREFLIGHT`](docs/DATA_PREFLIGHT.md) | O que a planilha realmente contém |
| [`CATALOG_IMPORT_REPORT`](docs/CATALOG_IMPORT_REPORT.md) | Contagens e as 112 cláusulas removidas |
| [`CATALOG_ISSUES`](docs/CATALOG_ISSUES.md) | O que não foi possível resolver |
| [`CATALOG_SCHEMA`](docs/CATALOG_SCHEMA.md) | Formato dos dados gerados |
| [`SOURCE_MANIFEST`](docs/SOURCE_MANIFEST.md) | Fontes e hashes |
| [`RIGHTS_CLEARANCE`](docs/RIGHTS_CLEARANCE.md) | Direitos de uso e imagens bloqueadas |
| [`MEDIA_MANIFEST.csv`](docs/MEDIA_MANIFEST.csv) | Origem e peso de cada imagem |
| [`IMAGE_UPDATES_2026-10-02`](docs/IMAGE_UPDATES_2026-10-02.md) | Imagens genéricas, pesquisa e prompts |
| [`DECISIONS`](docs/DECISIONS.md) | Decisões sob incerteza, com o porquê |
| [`HERO_VIDEO`](docs/HERO_VIDEO.md) | Vídeo da abertura: recorte, poster, contraste e peso |
| [`REFERENCE_AUDIT`](docs/REFERENCE_AUDIT.md) | Padrões observados na referência |
| [`BRAND_AUDIT`](docs/BRAND_AUDIT.md) | Uso da marca |
| [`DESIGN_SYSTEM`](docs/DESIGN_SYSTEM.md) | Tokens e componentes |
| [`INFORMATION_ARCHITECTURE`](docs/INFORMATION_ARCHITECTURE.md) | Rotas e navegação |
| [`QA_REPORT`](docs/QA_REPORT.md) | O que foi testado e o que foi corrigido |
| [`WIX_EXPORT`](docs/WIX_EXPORT.md) | Como publicar |
| [`WIX_STUDIO_HANDOFF`](docs/WIX_STUDIO_HANDOFF.md) | Especificação para o editor visual |
| [`WIX_CMS_SETUP`](docs/WIX_CMS_SETUP.md) | Coleções sugeridas |
| [`PRE_LAUNCH_CHECKLIST`](docs/PRE_LAUNCH_CHECKLIST.md) | **Leia antes de publicar** |

## Pendências

Há pendências reais que dependem da Premiare — WhatsApp, domínio e os textos
institucionais e legais. Estão listadas em
[`PRE_LAUNCH_CHECKLIST`](docs/PRE_LAUNCH_CHECKLIST.md).
