# Relatório de QA

> **Registro histórico:** este relatório cobre a versão anterior do catálogo
> (40 produtos) e precede a curadoria de 65 itens e a publicação na Vercel.
> Consulte `CURADORIA_2026-10-02.md` e `VERCEL_DEPLOYMENT.md` para o estado atual.

Site servido a partir de `/dist` por `scripts/serve-dist.mjs` (sem Vite, sem HMR
— os bytes do build). Navegador com as ferramentas embutidas desta sessão.

> **Nota metodológica.** A primeira rodada de testes rodou por engano contra um
> servidor de desenvolvimento que já ocupava a porta 4321. Isso foi detectado
> pelo tráfego de rede (`@vite/client`) e **todos os testes foram refeitos**
> contra o build. Os dois defeitos de layout mais graves só apareceram nessa
> segunda rodada.

---

## 1. Cobertura estrutural — 64 / 64 páginas

`npm run lint && npx astro check && node scripts/audit-static.mjs`

Verificado em **todas** as páginas geradas, uma a uma:

| Verificação | Resultado |
|---|---|
| `lang="pt-BR"` | 64/64 |
| `<title>` único e ≤ 70 caracteres | 64/64 |
| `meta description` presente | 64/64 |
| `canonical` | 64/64 |
| Open Graph | 64/64 |
| Exatamente um `h1` | 64/64 |
| Ordem de headings sem salto | 64/64 |
| Skip link | 64/64 |
| `img` com `alt` | 370/370 |
| `img` com `width`/`height` explícitos | 370/370 |
| Âncora sem `href` | 0 |
| `target="_blank"` sem `rel="noopener"` | 0 |
| Botão sem nome acessível | 0 |
| Campo sem rótulo | 0 |
| `undefined` / `NaN` / `[object Object]` no texto | 0 |
| JSON-LD válido, com `<` escapado | 61 páginas |
| JSON-LD com `offers`/`price`/`rating`/`availability` | 0 |
| Marcadores `PENDENTE-CLIENTE` | 9 (esperado) |

Erros de tipo (`astro check`): **0** em 32 arquivos.

## 2. Responsividade — 64 páginas × 7 viewports

Cada rota carregada em iframe de mesma origem, medindo `scrollWidth` contra
`clientWidth` e listando qualquer elemento que ultrapasse a borda.

| Viewport | Páginas com rolagem horizontal |
|---|---|
| 360 × 800 | **0** |
| 390 × 844 | **0** |
| 430 × 932 | **0** |
| 768 × 1024 | **0** |
| 1024 × 768 | **0** |
| 1280 × 800 | **0** |
| 1440 × 900 | **0** |

448 combinações página × viewport, zero transbordo.

### Defeitos encontrados e corrigidos

1. **Menu quebrando em duas linhas a 1440 px.** O cabeçalho ficava com 98 px em
   vez de 76. Corrigido reduzindo o espaçamento do menu, transformando "Buscar"
   em ícone abaixo de 1340 px e subindo o ponto de troca para gaveta até 1200 px.
   Cabeçalho agora: 77 px, menu em linha única.

2. **Rolagem horizontal no catálogo e nas 9 categorias, a 360 e 390 px.**
   `scrollWidth` de 419 contra 390. Causa: item de grid e de flex nasce com
   `min-width: auto` e se recusa a encolher abaixo do conteúdo — a barra de busca
   e o seletor de ordenação empurravam a página para fora da tela. Corrigido
   zerando `min-width` em cada nível da cadeia.

3. **Contador de filtros aparecendo marcando "0".** O `display: inline-grid` da
   regra vencia o `[hidden]` do navegador. Corrigido com regra explícita.

4. **Hero com 1314 px de altura.** A foto principal sozinha tinha 506 px.
   Corrigido com teto de altura nas fotos da composição; hero agora com 878 px. A
   composição passou de quatro para três peças, porque com quatro a última sobrava
   sozinha e abria um buraco no canto.

## 3. Contraste — medido, não estimado

Todo par texto/fundo efetivamente renderizado foi medido no navegador (luminância
relativa, WCAG), com limiar de 4,5:1 e 3:1 para texto grande.

| Página | Elementos medidos | Reprovados |
|---|---|---|
| `/` | 261 | 0 |
| `/catalogo` | 190 | 0 |
| `/solucoes/coffee-experience` | 97 | 0 |
| `/contato` | 52 | 0 |
| `/404` | 49 | 0 |

### Defeitos encontrados e corrigidos

1. **Títulos do rodapé em cinza sobre azul: 1,71:1.** O seletor de contexto
   escuro cobria `.section--deep` mas não o rodapé. Corrigido estendendo a regra
   para `.is-deep`; agora o registro utilitário fica amarelo sobre azul.
2. **Contadores de faceta a 1,60:1.** Estavam usando a cor de borda como cor de
   texto. Passaram a usar a cor de texto secundário; continuam discretos pelo
   tamanho e pelo peso, não pelo contraste baixo.

## 4. Alvos de toque

3.107 alvos medidos nas 64 páginas a 1280 px.

Abaixo de 24 px restam apenas as caixas de seleção de 18 px das facetas, cujo
alvo real é o rótulo de 44 px que as envolve.

Corrigidos durante o QA: botão pequeno (40 → 44 px), links do rodapé, links de
componentes modulares, categorias do 404, opções de filtro (40 → 44 px), links de
breadcrumb (16 → 28 px), links de solução na página de produto (16 → 26 px) e
título de card (21 → 27 px).

## 5. Busca, facetas e ordenação

Testado em `/catalogo`:

| Cenário | Esperado | Obtido |
|---|---|---|
| Estado inicial | 40 produtos, 12 visíveis | 40 / 12 |
| Busca "bambu" | subconjunto | 6 produtos |
| Busca por código "BD95127" | 0 — o código saiu do site (DECISIONS 20) | nenhum produto |
| Busca "cafe" (sem acento) | encontra "Café" | 4 produtos |
| Busca sem resultado | estado vazio visível | "Nenhum produto encontrado" |
| Limpar a partir do estado vazio | volta a 40 | 40 produtos |
| Faceta categoria = Tecnologia | 4 | 4, contador do botão em "1" |
| Categoria + só destaques | subconjunto | 2 |
| Quantidade mínima ≤ 10 | subconjunto | 10 |
| Ordenar por nome | primeiro alfabético | "Biscoito da sorte…" |
| Ordenar por quantidade mínima | menor primeiro | "Powerbank" (1 unidade) |
| Ordenar por destaques | topo do Top 10 | "Kit Viagem Personalizado" |
| Carregar mais | 12 → 24 → 40 | 12 → 24 → 40, botão some |

Contagem de resultados anunciada por `aria-live="polite"`.

## 6. Gavetas, teclado e foco

| Verificação | Resultado |
|---|---|
| Gaveta de menu: `aria-expanded` alterna | sim |
| Foco entra na gaveta ao abrir | sim |
| `Tab` no último item volta ao primeiro (foco preso) | sim |
| `Esc` fecha e devolve o foco ao botão | sim |
| Rolagem de fundo travada enquanto aberta | sim, e liberada ao fechar |
| Gaveta de filtros: mesmo comportamento | sim |
| Primeiro `Tab` da página chega ao skip link | sim, e ele fica visível |
| Indicador de foco visível (`:focus-visible`) | contorno sólido 2,4 px azul |
| `tabindex` positivo em qualquer lugar | 0 |
| Landmarks: header, main, footer | presentes |
| `nav` com `aria-label` | 5 por página |

Testado com eventos reais de teclado, não com `.focus()` programático — este
último não ativa `:focus-visible` e dá falso negativo.

## 7. Página de produto

Testado em `/produto/powerbank-20000mah-personalizado` e
`/produto/kit-viagem-personalizado`:

- Ficha técnica renderiza **apenas** os campos existentes. No Powerbank saíram
  Cores, Medidas e Quantidade mínima — sem linha para materiais ou prazo, que
  estão ausentes na planilha.
- Uma única imagem grande; sem miniatura falsa.
- 4 relacionados, por ordem determinística.
- `Product` estruturado com `name, sku, description, category, image, brand` —
  **sem** `offers`.
- Campo de quantidade: `"12ab#34;drop"` vira `"1234"`; `"99999999999"` é cortado
  em 7 dígitos.
- Com WhatsApp não configurado, o CTA aponta para `/contato`, sem `target` nem
  URL quebrada, e um aviso explica a situação.

## 8. Movimento reduzido

`@media (prefers-reduced-motion: reduce)` presente na folha do build, zerando
transições e revelando `[data-reveal]` de imediato. O ramo equivalente existe no
JavaScript: com movimento reduzido, o observador nem é criado.

**Defeito encontrado:** o observador de interseção não reporta nada enquanto a
aba está em segundo plano — e a página inteira ficava em `opacity: 0`. Corrigido
com duas redes de segurança (ver `DECISIONS.md`, item 12). Verificado: com a aba
oculta, a área visível aparece normalmente.

## 9. Console e rede

Nenhum erro de console nas páginas testadas. Nenhuma requisição a host externo:
fontes, imagens, CSS e JS são todos locais. A única resposta 404 observada é a
própria `/404`, servida com o status correto.

## 10. Gates

```
lint             OK   33 arquivos
astro check      OK   0 erros
audit-static     OK   64 páginas
validate-catalog OK   40/40 · 9/9 · 10/10 · 5/5 · 37 imagens
check-forbidden  OK   102 arquivos varridos, 0 ocorrências
check-budget     OK   4,11 MB · maior arquivo 134 KB · JS 2,9 KB · CSS 5,7 KB
check-links      OK   5.495 referências internas, 0 quebradas
```

## 11. O que não foi verificado

- Navegadores reais além do motor usado nesta sessão (sem Safari, sem Firefox,
  sem dispositivo físico).
- Leitores de tela reais (NVDA, VoiceOver). A verificação foi de semântica,
  nomes acessíveis, foco e ordem — não de leitura assistiva de fato.
- Comportamento pós-publicação na Vercel.
- Fluxo de WhatsApp de ponta a ponta, porque não há número configurado. O que foi
  testado é o fallback.

---

# Adendo — hero em vídeo (01/09/2026)

Mesmo método: build servido por `scripts/serve-dist.mjs`.

## Cobertura

| Verificação | Resultado |
|---|---|
| Rolagem horizontal — 64 páginas × 7 viewports | **0** em 448 combinações |
| `astro check` | 0 erros em 35 arquivos |
| `lint`, `audit-static`, `validate-catalog`, `check-forbidden`, `check-budget`, `check-links` | todos verdes |
| Erros de console | nenhum |

## Vídeo

| Item | Resultado |
|---|---|
| `muted`, `loop`, `autoplay`, `playsinline` | presentes |
| `controls` | ausente |
| `preload` | `metadata` |
| `poster` | presente, e também como `background-image` |
| Fonte a 1440 px | `hero-premiare-desktop.mp4` (1280×480) |
| Fonte a 390 e 360 px | `hero-premiare-mobile.mp4` (768×480) |
| `object-position` mobile | `62% 50%` |
| `pointer-events` | `none` |
| Foco | `tabindex="-1"`, contêiner `aria-hidden="true"` |
| Fundo da seção | `rgb(0,37,102)` — **nunca preto** |
| Produtos dentro do hero | **0** |

**Não verificável neste ambiente:** o início automático da reprodução. O painel
de navegador desta sessão mantém a aba com `document.hidden = true`, e navegador
nenhum inicia autoplay em aba oculta — nem mesmo com `play()` manual, que resolve
sem erro e mantém `paused`. O que **foi** verificado é justamente o
comportamento nesse caso: o poster aparece no lugar, sem quadro preto. Convém
confirmar a reprodução num navegador comum antes de publicar.

## Hero

| Item | 1440 | 1280 | 390 | 360 |
|---|---|---|---|---|
| Altura | 720 px | 790 px | 660 px | 660 px |
| CTA visível sem rolar | sim | sim | sim (y=422) | sim |
| Carrossel visível sem rolar | — | — | sim (y=660) | sim |
| Linhas do título | 2 | 2 | 2 | 2 |
| Rolagem horizontal | não | não | não | não |

Hit-test no centro de cada CTA: o elemento mais ao topo é o próprio link — o
vídeo não intercepta clique. Um clique real no menu sobre o hero navegou
normalmente.

## Cabeçalho

Medido com as transições desativadas (elas não rodam em aba oculta e falseavam
a leitura):

| Propriedade | Sobre o hero | Rolado |
|---|---|---|
| Fundo | transparente | `rgb(255,255,255)` |
| Borda inferior | transparente | `rgb(223,229,238)` |
| Sombra | não | sim |
| Altura da barra | 76 px | 68 px |
| Cor do menu | branco | `rgb(0,37,102)` |
| Logotipo | versão **negativa** oficial | versão **colorida** oficial |

## Carrossel

| Item | Resultado |
|---|---|
| Largura das duas trilhas | 2651,61 px e 2651,61 px — **loop sem salto** |
| Logotipos deformados | **0** (proporção renderizada = proporção do arquivo) |
| Visíveis a 1440 | 7 |
| Visíveis a 390 e 360 | 3 |
| Cópia visual | `aria-hidden="true"` — não é lida duas vezes |
| Placeholders | nenhum |

## Movimento reduzido

Vídeo retirado de cena e download interrompido; poster estático no lugar;
conteúdo inteiro funcional; marquee parado, cópia oculta e logotipos em grade
estática; entradas de seção sem deslocamento.

## Contraste

Medido sobre os pixels reais do poster, com a matemática do véu aplicada.
No mobile, contra o fundo percebido (desfoque do tamanho de um glifo) — a
medição pixel a pixel derrubava o número por causa da linha dourada de 1–2 px,
que não é o fundo de uma letra.

| Contexto | Branco | Amarelo | Apoio |
|---|---|---|---|
| Desktop 1440 | 15,3:1 | 9,3:1 | 9,5:1 |
| Mobile 390 / 360 | 13,1:1 | — | 8,2:1 |

Seis enquadramentos mobile testados (30% a 82%): todos passam em AA.

## Menu mobile sobre o hero

`aria-expanded` alterna, foco entra no painel, `Tab` no último item volta ao
primeiro, `Esc` fecha e devolve o foco ao botão, rolagem de fundo travada e
liberada. 17 itens focáveis.


---

# Adendo 2 — loop e upscale do vídeo (01/09/2026)

A pedido do usuário: corte do vídeo no ponto de melhor casamento de loop e
upscale (Lanczos) para resolução equivalente a 1080p. Build refeito, todos os
gates rodados de novo.

| Verificação | Resultado |
|---|---|
| Duração do vídeo (`video.duration`) — desktop e mobile | **7,375s** (era 10s) |
| Resolução desktop (`videoWidth`/`videoHeight`) | **1920×720** (era 1280×480) |
| Resolução mobile | **1152×720** (era 768×480) |
| Diferença de pixel entre 1º e último quadro do arquivo final | **1,73** (era 2,38 — a diferença entre quadros consecutivos é 0,16, então o salto ficou bem mais próximo do movimento normal) |
| Rolagem horizontal — 64 páginas × 7 viewports | **0** em 448 combinações |
| `lint`, `astro check`, `audit-static`, `validate-catalog`, `check-forbidden`, `check-budget`, `check-links` | todos verdes |
| Build total | 6,42 MB (era 5,64 MB antes do upscale) |
| Maior arquivo | `video/hero-premiare-desktop.mp4`, 1,33 MB — ainda a menos de metade do limite de 3 MB por arquivo |

Altura do hero (medida no `[data-hero]`, confirma que o ajuste de proporção da
tarefa anterior não regrediu):

| Viewport | Altura |
|---|---|
| 1366×768 | 460px |
| 1440×900 | 504px |
| 1920×1080 | 560px |
| 390×844 (mobile) | 660px — inalterado |

---

# Adendo 3 — imagens dos produtos (02/10/2026)

As 13 imagens editadas foram inspecionadas visualmente. O pipeline de mídia
gerou as três variantes locais para cada SKU e publicou imagem para todos os
40 produtos. As três imagens antes ausentes foram abertas novamente após a
otimização para conferir conteúdo, enquadramento e ausência de marcas visíveis.

| Verificação | Resultado |
|---|---|
| `npm run lint` | OK, 35 arquivos |
| `npm run typecheck` | 0 erros em 34 arquivos |
| `npm run validate-catalog` | 40/40 produtos com imagem |
| `npm run build` | 62 páginas geradas |
| `npm run gates` | Todos os quatro gates passaram |
| `node scripts/audit-static.mjs` | 62 páginas, 415 imagens, OK |
| Arquivos locais referenciados pelo catálogo | Nenhum ausente |
| Pacote `premiare-criativa-site.zip` | Regenerado; contém as variantes dos 3 SKUs antes sem foto |
