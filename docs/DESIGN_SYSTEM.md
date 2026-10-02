# Sistema de design

Fonte da verdade: `src/styles/tokens.css`. Nenhum valor de cor literal existe
fora desse arquivo — o `lint` falha se aparecer.

## Cores

| Token | Valor | Uso |
|---|---|---|
| `--brand-blue` | `#002566` | Títulos, navegação, áreas institucionais |
| `--brand-yellow` | `#FAC20F` | CTA principal e a faixa de estrutura |
| `--brand-white` | `#FFFFFF` | Fundo principal |
| `--brand-gray` | `#4D4D4D` | Texto secundário |
| `--brand-black` | `#000000` | Reservado; não usado como cor de texto |

Neutros derivados, para superfície e estado. Não são cores novas — são o azul da
marca rebaixado:

| Token | Valor | Uso |
|---|---|---|
| `--surface-muted` | `#F5F7FA` | Alternância de seção, faixa do card |
| `--line` | `#DFE5EE` | Borda padrão |
| `--line-strong` | `#C3CDDD` | Borda de destaque e de campo |
| `--text` | `#23282F` | Corpo de texto |
| `--blue-700` | `#06316F` | Hover sobre azul |
| `--blue-100` | `#E7EDF7` | Fundo de estado e badge |
| `--yellow-600` | `#D9A600` | Hover do botão amarelo |

### Regras de aplicação

- **Nunca texto amarelo sobre branco.** O amarelo é superfície (botão com texto
  azul) ou faixa de 3–4 px. Nunca texto.
- Botão principal: fundo amarelo, texto azul.
- Em fundo azul, o registro utilitário vira amarelo — em cinza ele cai para
  1,7:1. Vale para `.section--deep` e para `.is-deep` (o rodapé).
- Foco em fundo azul usa contorno amarelo; em fundo claro, azul.

Contraste verificado **programaticamente** no navegador, não por impressão: todo
par texto/fundo renderizado foi medido contra 4,5:1 (3:1 para texto grande).
Resultado em `QA_REPORT.md`.

## Tipografia

Uma família: **Inter**, auto-hospedada, variável (100–900), `font-display: swap`.

| Token | Tamanho | Uso |
|---|---|---|
| `--step-5` | `clamp(2.2rem, 3.4vw + 1.4rem, 3.6rem)` | `h1` |
| `--step-4` | `clamp(1.85rem, 1.8vw + 1.4rem, 2.6rem)` | `h2` |
| `--step-3` | `clamp(1.5rem, 1vw + 1.25rem, 1.9rem)` | Título de solução |
| `--step-2` | `clamp(1.25rem, 0.4vw + 1.15rem, 1.4rem)` | `h3` |
| `--step-1` | `1.125rem` | Linha de apoio, título de card |
| `--step-0` | `1rem` | Corpo |
| `--step--1` | `0.8125rem` | Texto secundário, navegação |

**Pesos** — quatro tokens, nenhum literal no código:
`--weight-body` 400 · `--weight-medium` 600 · `--weight-bold` 700 ·
`--weight-display` 800.

Títulos em geral: peso 700, `letter-spacing: -0.022em`, `line-height: 1.15`,
`text-wrap: balance`. **`h1` e `h2` sobem para 800** com tracking mais fechado
(−0,035em e −0,03em): a família é uma só, então é o peso que dá voz de display,
e ele fica concentrado nos dois tamanhos maiores. O Inter aqui é variável
(100–900), então o 800 não custa nenhum arquivo novo.

Parágrafos limitados a 68ch; linhas de apoio a 62ch.

### Registro utilitário

A decisão tipográfica central. Um estilo só, repetido em todo lugar onde aparece
dado de catálogo: **11 px, caixa alta, `letter-spacing: 0.12em`, peso 600**.

Marca categoria, quantidade mínima, rótulo de ficha técnica e etiqueta de
seção. É o que um comprador B2B escaneia, e ele tem sempre a mesma aparência —
então dá para varrer a página procurando por ele.

## A faixa amarela

O logotipo da Premiare tem uma faixa amarela sob a palavra. Essa faixa virou o
dispositivo de estrutura do site inteiro, e é o único ornamento da página:

- `.rule-band` — barra de 44 × 4 px que abre **seção e página**, e nada mais;
- borda superior de 3 px na faixa de dados do card e nas etapas;
- borda esquerda de 3 px nos blocos modulares e nas pendências;
- sublinhado que marca o item de menu atual.

**Racionamento.** A faixa chegou a aparecer 14 vezes na home — uma a cada 500 px
de rolagem. Um destaque que se repete a cada meia tela deixa de destacar, então
ela saiu dos cards de benefício, dos painéis da ficha de produto, dos títulos de
canal do contato e do aside do FAQ. Regra: **a faixa diz "começa aqui"** — se o
elemento não abre uma seção ou uma página, ele não a recebe (ver DECISIONS 36).

Não há gradiente, vidro, neon, sombra pesada nem forma decorativa. Elevação
máxima em hover: 3 px. Escala máxima de imagem em hover: 1.02.

## Espaçamento e grade

Escala de `0.25rem` a `6rem` (`--space-2xs` … `--space-4xl`). Contêiner de
1200 px — o mesmo para o hero, o cabeçalho, as seções e o rodapé —, com variante
estreita de 760 px para texto legal e FAQ.

Grade de produtos: 1 → 2 → 3 → 4 colunas, contadas pela largura da janela. A
quarta coluna só entra a partir de 1180 px, onde o card ainda respira; forçar
quatro antes disso espreme a foto. No catálogo e nas categorias, onde a coluna
de filtros ocupa 280 px, a grade conta pela largura **disponível**
(`auto-fill` com `minmax(238px, 1fr)`) — com a regra da janela, o card ali ficava
em ~200 px contra ~270 px nas grades sem filtro.

Card de produto: preenche a célula da grade, para que a faixa amarela e o link de
detalhe caiam na mesma altura em toda a fileira. Rótulos que ora cabem em uma
linha, ora em duas reservam a segunda — é o que mantém a linha de base comum
(ver DECISIONS 22).

## Movimento

Entrada de seção: opacidade + 16 px de deslocamento (10 px no mobile), 520 ms,
escalonamento de 70 ms, **uma vez por elemento**. Implementado com
`IntersectionObserver` e CSS — nenhuma biblioteca.

Proibido e ausente: bounce, rotação, partículas, parallax, scrolljacking,
carrossel automático, pulso infinito.

`prefers-reduced-motion: reduce` zera transições e revela tudo de imediato,
tanto no CSS quanto no ramo de JavaScript.

Duas redes de segurança garantem que uma falha na animação nunca deixe a página
em branco — ver `DECISIONS.md`, item 12.

## Componentes

| Componente | Arquivo |
|---|---|
| Abertura em vídeo | `src/components/HeroVideo.astro` |
| Carrossel de clientes | `src/components/ClientMarquee.astro` |
| Cabeçalho com gaveta e foco preso | `src/components/Header.astro` |
| Rodapé | `src/components/Footer.astro` |
| Card de produto | `src/components/ProductCard.astro` |
| Imagem de produto e placeholder | `src/components/ProductImage.astro` |
| Catálogo: busca, facetas, ordenação | `src/components/CatalogBrowser.astro` |
| Campo de quantidade e CTA | `src/components/QuoteForm.astro` |
| Cabeçalho de seção | `src/components/SectionHead.astro` |
| Breadcrumbs | `src/components/Breadcrumbs.astro` |
| Marcador de pendência | `src/components/PendingBlock.astro` |
| Contato flutuante | `src/components/FloatingContact.astro` |

## Alvos de toque

Mínimo de 44 px em botões, itens de menu, opções de filtro e listas de links.
Links de breadcrumb e títulos de card ficam acima de 24 px. A única exceção são
as caixas de seleção de 18 px, cujo alvo real é o rótulo de 44 px que as envolve.

## Abertura da home

A home abre com vídeo em vez de produto. A sequência é
marca → posicionamento → prova social → catálogo.

| Token | Valor | Uso |
|---|---|---|
| `--header-h` | 76px | Altura do cabeçalho; o hero usa para não esconder texto |
| `--header-h-solid` | 68px | Cabeçalho compacto, depois da rolagem |
| `--container-wide` | 1288px | Só na abertura |
| `--hero-scrim` | gradiente 0,28 → 0 | Véu de contraste, quase invisível |

Altura do hero: `clamp(560px, 86svh, 660px)` no celular e
`clamp(650px, 80svh, 820px)` a partir de 900px. `svh` em vez de `vh`, para as
barras do navegador móvel não cortarem o conteúdo.

O cabeçalho fica **fixo e transparente** sobre a abertura, com a versão negativa
oficial da marca, e vira sólido e mais baixo depois de 64px de rolagem. Nas
demais páginas ele continua `sticky` e branco, como antes.

Detalhes do vídeo, do poster, da curva de transição e das medições de contraste
em [`HERO_VIDEO.md`](HERO_VIDEO.md).
