# Exportação para a Wix

## O que enviar

A pasta **`dist/`** inteira, com `index.html` na raiz. Também vai empacotada em
`premiare-criativa-site.zip`, na raiz do projeto, pronta para upload.

Não envie `src/`, `scripts/`, `docs/`, `node_modules/`, `.cache/` nem a planilha.
Nada disso está dentro de `dist/`.

## Antes de gerar o build definitivo

1. **Domínio.** Sem ele o build sai com o marcador `dominio-a-definir.invalid`
   em canonical, Open Graph e sitemap:

   ```bash
   SITE_URL=https://www.seudominio.com.br npm run build
   ```

2. **WhatsApp.** Preencha `whatsappNumber` em `src/config/site.ts` (só dígitos,
   com DDI: `5511999999999`). Enquanto estiver vazio, todos os CTAs apontam para
   `/contato` — que é o comportamento correto, mas não o desejado no ar.

3. **Rode os gates:**

   ```bash
   npm run lint && npm run typecheck && npm run build && npm run gates
   ```

## Medidas do build atual

| Item | Valor |
|---|---|
| Total | **7,35 MB** em 215 arquivos |
| Maior arquivo | `video/hero-premiare-desktop.mp4`, **1,33 MB** (1920×720, upscale) |
| Segundo maior | `video/hero-premiare-mobile.mp4`, 916 KB (1152×720, upscale) |
| Maior imagem | `catalog/products/bd-roupao/cover-1200.webp`, 81 KB |
| JS por página (gzip) | **4,2 KB** no pior caso |
| CSS por página (gzip) | **8,3 KB** no pior caso |
| Páginas HTML | 62, todas pré-renderizadas |

**O vídeo do hero cabe no pacote estático.** Com 1,33 MB, ele está abaixo do
limite por arquivo — não é preciso hospedar no Wix Media, em CDN, nem cair para
poster estático. As alternativas, caso um dia o vídeo cresça, estão em
`HERO_VIDEO.md` §9.

Os limites usados nos gates são os de referência do briefing — 20 MB no total e
3 MB por arquivo. **Não foi possível confirmar um limite oficial publicado**
especificamente para upload de site estático no Wix Headless; isso está aberto
como pendência. O build atende aos limites de referência usados nos gates.
Os limites são
constantes no topo de `scripts/check-budget.mjs`.

## Compatibilidade

O build é 100% estático: HTML, CSS, JS de cliente, JSON, XML, WebP e WOFF2.

Não há: Node em produção, SSR, rotas de API, banco, PHP, Python em runtime,
função server-side, template renderizado no servidor, compilação executada pela
Wix ou WebAssembly. O vídeo do hero é um arquivo local dentro do pacote.

Depois de publicado, o catálogo monta sem nenhuma requisição de rede externa:
fontes, imagens, busca e filtros são todos locais.

## Estrutura entregue

```
dist/
├─ index.html
├─ 404.html
├─ robots.txt
├─ sitemap.xml
├─ favicon.svg
├─ _astro/                    CSS com hash
├─ brand/premiare-logo.svg
├─ fonts/                     Inter woff2 (2 arquivos)
├─ catalog/products/{codigo}/ cover-480 / 800 / 1200 .webp
├─ catalogo/index.html
├─ categoria/{9 slugs}/index.html
├─ produto/{40 slugs}/index.html
├─ solucoes/index.html + {5 slugs}/index.html
├─ projetos-personalizados/index.html
├─ perguntas-frequentes/index.html
├─ contato/index.html
└─ politica-de-privacidade/index.html
```

## Depois de publicar

- Confirme que `/` abre e que uma página de produto abre direto pela URL.
- Confirme que `sitemap.xml` e `robots.txt` respondem e trazem o domínio certo.
- Envie o sitemap ao Search Console.
- **Esperado e intencional:** o Search Console vai apontar "campo ausente:
  offers" nos `Product`. Não é erro a corrigir — este site não tem preço.
- Configure a página de erro do domínio para servir `404.html`.
