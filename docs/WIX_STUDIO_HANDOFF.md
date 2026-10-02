# Handoff para o Wix Studio

> **Documento arquivado em 02/10/2026:** o projeto passou a ser hospedado na
> Vercel. Este handoff descreve uma alternativa antiga; consulte
> `VERCEL_DEPLOYMENT.md` para o fluxo atual.

Documento para quem for reconstruir ou manter este site dentro do editor visual
do Wix Studio. Este plano não descreve a hospedagem atual.

> **Seja realista quanto ao esforço.** Não existe importação automática de um
> site estático para o editor visual do Wix. Reconstruir no Studio é refazer o
> layout à mão a partir desta especificação.

---

## Tokens

Crie como estilos globais do site.

**Cores**

| Nome | Valor |
|---|---|
| Brand/Blue | `#002566` |
| Brand/Yellow | `#FAC20F` |
| Brand/White | `#FFFFFF` |
| Brand/Gray | `#4D4D4D` |
| Surface/Muted | `#F5F7FA` |
| Line | `#DFE5EE` |
| Line/Strong | `#C3CDDD` |
| Text | `#23282F` |
| Blue/700 | `#06316F` |
| Blue/100 | `#E7EDF7` |
| Yellow/600 | `#D9A600` |

**Tipografia** — Inter (subir os dois `.woff2` de `public/fonts` como fonte
personalizada; não usar CDN).

| Estilo | Tamanho | Peso | Observação |
|---|---|---|---|
| H1 | 35 → 58 px | 700 | `letter-spacing: -0.022em` |
| H2 | 30 → 42 px | 700 | idem |
| H3 | 20 → 22 px | 700 | |
| Body | 16 px | 400 | linha 1,6 |
| Small | 13 px | 400 | |
| **Utility** | **11 px** | **650** | caixa alta, `letter-spacing: 0.12em` |

O estilo Utility é o mais importante replicar: é ele que marca categoria,
quantidade mínima e rótulo de ficha em todo o site.

**Espaçamento** — 4, 8, 12, 16, 24, 32, 48, 72, 96 px. Contêiner 1200 px, com
margem interna de 24 px. Raio de canto: 4 px (8 px em cards).

## Breakpoints

| Nome | Largura | Colunas da grade de produto |
|---|---|---|
| Mobile | < 560 px | 1 |
| Mobile grande | ≥ 560 px | 2 |
| Tablet | ≥ 900 px | 3 |
| Desktop | ≥ 1180 px | 4 |

Trocas adicionais: menu vira gaveta abaixo de **1200 px**; facetas viram gaveta
abaixo de **900 px**; rótulo "Buscar" some abaixo de **1340 px**.

## Componentes globais

### Cabeçalho (sticky, 76 px, borda inferior 1 px)
Logo 176 px · menu de 6 itens · ícone de busca · botão "Falar com um
especialista" (fundo amarelo, texto azul) · botão de gaveta abaixo de 1200 px.
Item atual recebe sublinhado amarelo de 3 px.
**Sem** carrinho, login, cadastro, sacola, contador ou favoritos.

### Gaveta mobile
Painel à direita, largura mín(360 px, 88vw). Foco preso, fecha com `Esc`, trava
a rolagem de fundo, alvos ≥ 44 px. Contém o menu, as 9 categorias com contagem e
o CTA.

### Rodapé (fundo azul)
Três colunas: assinatura + CTA · 9 categorias · 8 links institucionais. Os
rótulos de coluna usam o estilo Utility **em amarelo** — em cinza sobre azul o
contraste cai para 1,7:1.

### Card de produto
Foto sobre branco (proporção 1:1, `object-fit: contain`) · categoria em Utility ·
nome em 18 px/650 · badge "Seleção Premiare" quando aplicável · **faixa amarela
de 3 px** separando o rodapé do card, que traz CÓDIGO e MÍNIMO em Utility ·
linha "Ver detalhes" com seta.
Hover: elevação de 3 px, imagem em `scale(1.02)`, 160–220 ms.
**Nunca:** preço, desconto, parcelamento, estoque, estrelas, "Comprar",
"Adicionar ao carrinho".

### Botão de contato flutuante
Cápsula azul, canto inferior direito, 48 px de altura. Sem pulso infinito.

## Páginas

| Página | Seções, na ordem |
|---|---|
| Home | Hero · Benefícios (4) · Categorias (9) · Destaques (8) · Soluções (5) · Modulares (6) · Projetos (faixa azul) · Como funciona (4 etapas) · FAQ (7) · CTA final |
| Catálogo | Breadcrumb · título · busca · toolbar (contagem + ordenação) · facetas · grade · "Carregar mais" · estado vazio |
| Categoria | Igual ao catálogo, sem a faceta de categoria |
| Produto | Breadcrumb · imagem · nome · faixa quantidade mínima/prazo · diferenciais · nota importante · quantidade + CTA · ficha técnica · indicado para · exemplo de aplicação · combinação em kit · relacionados |
| Soluções | Lista das 5, com foto, público, conceito e composição |
| Solução | Cabeçalho + quantidade/CTA · itens como cards de produto · outras ocasiões |
| Institucionais | Cabeçalho padrão + conteúdo; blocos de pendência onde falta informação |

### Hero
Texto à esquerda, composição à direita. Composição: **3** produtos — o primeiro
ocupa a linha inteira (foto com teto de 230 px), os outros dois abaixo (teto de
150 px). Com quatro peças a última sobra sozinha e abre um buraco.

Textos, literais:
- Eyebrow: **PREMIARE CRIATIVA**
- Título: **Soluções personalizadas que fazem sua marca ser lembrada.**
- Descrição: **Brindes corporativos, kits e projetos personalizados para
  reconhecer pessoas, fortalecer relacionamentos e valorizar marcas.**
- CTAs: **Explorar catálogo** · **Falar com um especialista**
- Assinatura: **Reconhecimento que gera valor.**

## Estados

| Estado | Tratamento |
|---|---|
| Foco | contorno sólido 3 px azul, deslocado 2 px; amarelo sobre fundo azul |
| Hover de card | elevação 3 px, borda mais forte, imagem 1.02 |
| Hover de botão | escurece o fundo; feedback imediato |
| Filtro ativo | contador no botão de facetas; "Limpar filtros" aparece |
| Busca sem resultado | bloco com faixa amarela, explicação e botão de limpar |
| Produto sem foto | ladrilho neutro com "Foto sob consulta" — nunca a foto de outro produto |
| Campo ausente | a linha não é renderizada; sem espaço reservado |

## Animação

Entrada de seção: opacidade + 16 px (10 px no mobile), 520 ms, escalonamento de
70 ms, **uma vez**. Respeitar `prefers-reduced-motion`.

Proibido: bounce, rotação, partículas, confete, parallax forte, texto letra a
letra, movimento infinito, carrossel automático.

## Configuração do WhatsApp

Um único ponto: `src/config/site.ts`. No Studio, replicar como uma coleção
`SiteSettings` de um registro só. Nenhum componente pode repetir o número.

Mensagem de produto:
> "Olá! Vim pelo site da Premiare Criativa e gostaria de solicitar um orçamento
> para o produto {NOME}. Minha quantidade estimada é {QTD}."

Mensagem de kit:
> "Olá! Vim pelo site da Premiare Criativa e gostaria de desenvolver uma
> composição baseada na solução {NOME}. Minha quantidade estimada é {QTD}."

`https://wa.me/`, `encodeURIComponent`, nova aba, `rel="noopener noreferrer"`,
`aria-label` descritivo. A quantidade é validada antes: só dígitos, no máximo 7.

## Importação de imagens

`public/catalog/products/{codigo}/cover-{480,800,1200}.webp`, 40 produtos com
imagem local. Subir para o Media Manager mantendo o código no nome, para casar
com a coleção. Ver `IMAGE_UPDATES_2026-10-02.md`.

## Eventos preparados

Definidos, **não** disparados: `whatsapp_header_click`, `whatsapp_hero_click`,
`whatsapp_product_click`, `whatsapp_kit_click`, `whatsapp_footer_click`.
Nenhum analytics é instalado sem configuração e consentimento — e a política de
cookies afirma que não há rastreamento, então instalar um exige atualizar a
política e implementar consentimento antes.
