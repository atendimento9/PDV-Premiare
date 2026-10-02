# Hero em vídeo da home

Documento da abertura de marca: o que foi feito com o material aprovado, por que,
e o que a Premiare ainda precisa decidir.

---

## 1. O material recebido não era um fundo

`Anime_esta_imagem_mantendo_EXA.mp4` (1,38 MB · 1280×720 · 24 fps · 10,006 s ·
H.264 High + faixa de áudio AAC).

Ao abrir os quadros, ficou claro que **não é um vídeo de fundo**: é a animação de
um *mockup de tela inteira*, que já traz desenhados dentro da imagem:

| Faixa (y) | Conteúdo |
|---|---|
| 0 – 70 | Cabeçalho: logotipo, menu de 5 itens e botão amarelo |
| 72 – 556 | **As ondas azuis — a parte aproveitável** |
| 560 – 612 | Curva branca de transição |
| 620 – 720 | Faixa de clientes com a palavra **"LOGO"** repetida como placeholder |

Publicar o quadro inteiro colocaria **dois cabeçalhos** na tela (o real por cima
do desenhado) e **placeholders "LOGO" no ar** — que o próprio briefing proíbe.

**Decisão:** aproveitar só a faixa de ondas, `crop=1280:480:0:76`.

O briefing pede para não cortar partes importantes *desnecessariamente*. Este
corte é necessário: remove interface duplicada e placeholder, não conteúdo. Foi
o único ajuste feito no vídeo. **Não** houve mudança de cor, saturação, filtro,
blur, velocidade, sentido, nem animação sobreposta.

## 2. Arquivos gerados

Estado atual publicado (após o corte de loop e o upscale — ver as duas seções
abaixo para o histórico e o porquê de cada mudança):

| Arquivo | Recorte | Resolução | Duração | Tamanho |
|---|---|---|---|---|
| *(original preservado)* | — | 1280×720 | 10,01s | 1.446.343 B (1,38 MB) |
| `hero-premiare-desktop.mp4` | `1280:480:0:76` → upscale Lanczos | 1920×720 | 7,375s (177 quadros) | 1.359.473 B (1,33 MB) |
| `hero-premiare-mobile.mp4` | `768:480:456:76` → upscale Lanczos | 1152×720 | 7,375s (177 quadros) | 937.680 B (916 KB) |
| `hero-premiare-poster.webp` | quadro 0 do desktop | 1920×720 | — | 18.412 B |
| `hero-premiare-poster-mobile.webp` | quadro 0 do mobile | 1152×720 | — | 15.011 B |

### Ajuste de qualidade (01/09/2026)

A primeira codificação (perfil H.264 `main`, CRF 24, 255 kb/s) priorizou peso
sobre fidelidade, e ficou aquém do material aprovado: áreas lisas em degradê
são o pior caso para compressão de vídeo — mesmo com PSNR de quadro estático em
46 dB, blocos e banding ficam mais visíveis em reprodução do que numa captura
parada.

Recodificado com perfil **`high`** (habilita transformadas 8×8, que ajudam
justamente em degradês), `preset veryslow`, `crf 18`. Resultado:

| Métrica | Antes | Depois |
|---|---|---|
| Bitrate desktop | 255 kb/s | **711 kb/s** |
| PSNR do quadro em t=5s vs. o original | 46,18 dB | **49,05 dB** |
| Peso desktop | 316 KB | 872 KB |

O corte, o enquadramento, as cores e a velocidade continuam exatamente os
mesmos — só a codificação mudou. O arquivo segue muito abaixo de qualquer
limite de plataforma (ver §9).

### Loop sem salto (01/09/2026)

O vídeo original de 10s não foi desenhado para looping: o último quadro é
visualmente muito diferente do primeiro, e a tag `loop` do HTML reinicia sem
transição — daí o salto perceptível a cada repetição.

Medi a diferença de pixel (escala de cinza, 160x60) entre o quadro 0 e os
demais 239 quadros. A diferença **média entre quadros consecutivos** é 0,16; a
diferença entre o quadro 0 e o último quadro (onde o loop reiniciava antes) era
**2,38** — cerca de 15x maior que um passo normal, o que explica o salto.

Testei os 240 pontos de corte possíveis. O melhor, de longe: **quadro 177,
t = 7,333s**, com diferença de **1,81** — não é zero (o vídeo tem um grão/ruído
sutil que nunca se repete exatamente), mas visualmente as ondas, a linha
dourada e o padrão de pontos ficam praticamente idênticos. Comparado lado a
lado com o quadro 0, a olho nu não há diferença de composição perceptível.

**Decisão:** os vídeos publicados agora têm **177 quadros (7,375s)**, cortados
exatamente nesse ponto — `-frames:v 177` a partir do início, sem alterar
velocidade nem sentido. Medido no arquivo final publicado: diferença entre o
primeiro e o último quadro caiu de 2,38 para **1,73** (o upscale a seguir ainda
suaviza um pouco o ruído residual). Efeito colateral bom: a duração menor
também reduz o peso do arquivo.

### Upscale para 1080p-equivalente (01/09/2026)

**Limite honesto:** a fonte é nativamente 1280x720. Não existe informação
"1080p real" nela — qualquer saída maior é interpolação, não detalhe novo.
Decidido junto com a Premiare fazer o upscale mesmo assim, como medida
provisória até haver um vídeo de origem nativo em resolução maior.

Recorte já cortado (proporção 2,667:1, fora do 16:9 padrão), então "1080p" foi
interpretado como **largura equivalente a um monitor 1080p** — 1920 px — em vez
de forçar a altura em 1080 (o que exigiria 2880 px de largura, desperdício para
um hero que raramente passa de ~1920-2560 px na tela). A versão mobile recebeu
o mesmo fator de ampliação (1,5x) para consistência entre as duas fontes.

Escalonamento com filtro **Lanczos** (`scale=...:flags=lanczos`), o que preserva
melhor bordas e a linha dourada fina do que um redimensionamento bilinear
simples. Nenhuma nitidez artificial (`unsharp`) foi aplicada — o pedido era
upscale, não realce; a imagem não deve parecer "processada".

| Arquivo | Resolução | Duração | Tamanho |
|---|---|---|---|
| `hero-premiare-desktop.mp4` | **1920x720** (era 1280x480) | 7,375s (era 10s) | 1.359.473 B (1,33 MB) |
| `hero-premiare-mobile.mp4` | **1152x720** (era 768x480) | 7,375s (era 10s) | 937.680 B (916 KB) |

**Pendência registrada pelo próprio usuário:** ele pretende buscar um vídeo de
origem nativo em 1080p depois. Quando isso acontecer, o pipeline é o mesmo —
recorte da faixa de ondas, corte do loop no ponto de melhor casamento, sem
upscale nenhum dessa vez.

O original **não foi substituído**: continua em `~/Downloads`, intacto
(SHA-256 `fdc0d564…e9dd`). Todas as gerações (corte, recorte, upscale) partem
sempre dele, nunca de uma versão já derivada — evita perda de qualidade em
cascata.

Além do corte, cada saída recebeu:
- **remoção da faixa de áudio** (`-an`) — o vídeo é mudo por definição; a trilha
  AAC de 128 kb/s era ~11% do arquivo sem servir para nada;
- **`+faststart`** — o índice vai para o início do arquivo, então a reprodução
  começa antes do download terminar;
- H.264 `high`, `yuv420p` — perfil suportado por iOS, Android, Safari, Firefox,
  Chrome e Edge, e o que melhor comprime as áreas em degradê do material.

### Por que existe uma versão mobile

Não foi por tamanho, foi por **enquadramento**. O recorte desktop tem proporção
2,67:1; num celular em pé, `object-fit: cover` mostraria uma fatia vertical
estreita e quase aleatória dele. A versão mobile é um recorte horizontal do
**mesmo material**, com o mesmo enquadramento vertical do desktop — e recebeu o
mesmo fator de upscale (ver acima), para não ficar em desvantagem de nitidez em
telas de alta densidade.

## 3. Poster e ausência de flash preto

O poster é o **quadro 0** de cada versão — assim a passagem poster → vídeo não
tem salto nenhum: a primeira imagem do vídeo é exatamente a que já estava na
tela.

Três camadas garantem que nunca apareça preto:

1. a seção tem `background: var(--brand-blue)` sólido;
2. o contêiner do vídeo tem o poster como `background-image` (trocado por media
   query entre desktop e mobile);
3. o `<video>` tem o atributo `poster`.

Se o autoplay for recusado (aba em segundo plano, economia de dados, iOS em
modo de baixo consumo), o visitante vê o poster — não um retângulo escuro.

## 4. Movimento reduzido

Com `prefers-reduced-motion: reduce`:

- o vídeo é retirado de cena e **o download é interrompido** (`preload="none"`,
  `pause()`), em vez de continuar consumindo dados;
- fica o poster estático de fundo;
- todo o conteúdo continua no lugar e funcional — nenhuma informação vive apenas
  na animação;
- o carrossel para, a cópia visual some e os logotipos passam a uma grade
  estática centralizada.

A preferência é reavaliada se mudar com a página aberta.

## 5. Acessibilidade do vídeo

É decorativo, e por isso: `aria-hidden="true"` no contêiner, `tabindex="-1"`,
sem controles, sem áudio, `pointer-events: none`.

Verificado por hit-test: no centro de cada CTA, o elemento mais ao topo é o
próprio link — o vídeo **não** intercepta clique.

## 6. Contraste do texto sobre o vídeo

Medido sobre os **pixels reais** do poster, com a matemática do véu aplicada.

O resultado surpreendeu na direção boa: o azul do material é escuro o bastante
para o texto branco ficar em **14,85:1 mesmo sem véu nenhum**. Por isso o véu
ficou no mínimo (0,28 → 0 antes de 76% da largura): ele não existe para salvar a
leitura, existe como margem caso uma futura versão do vídeo clareie a área. Um
overlay pesado escureceria a peça aprovada sem necessidade.

| Contexto | Texto branco | Eyebrow amarelo | Texto de apoio |
|---|---|---|---|
| Desktop 1440 | 15,3:1 | 9,3:1 | 9,5:1 |
| Mobile 390 / 360 | 13,1:1 | — | 8,2:1 |

No mobile a medição usa o **fundo percebido** (desfoque do tamanho de um glifo).
Medindo pixel a pixel, a linha dourada de 1–2 px derrubava o número
artificialmente — mas uma hairline atrás de uma letra não é o fundo dela. Seis
posições de enquadramento foram testadas (30% a 82%) e **todas** passam em AA; a
escolhida, 62%, mantém a crista da onda e o traço dourado no quadro.

## 7. A curva de transição azul → branco

A curva branca do rodapé existe no material original, e lá ela é **estática**
(medida entre quadros: variação ≤ 1 px). Ela foi tirada do vídeo e refeita em
SVG, traçando o limite branco/azul do quadro original em 33 pontos.

O motivo é técnico: dentro do vídeo, `object-fit: cover` recortaria a curva numa
altura diferente a cada viewport, e ela deixaria de coincidir com o fim da seção.
Como SVG com `preserveAspectRatio="none"`, ela cai **sempre no pixel exato** do
limite entre o azul e o branco, em qualquer tela.

## 8. Logotipo sobre o azul

O arquivo colorido tem a palavra "PREMIARE" em `#002566` — o mesmo azul do
fundo. Sobre o hero, ela desapareceria.

Existe versão oficial para isso: `PREMIARE.svg` (fornecida nos assets), com 16
preenchimentos brancos e a faixa amarela, sem azul. É a versão negativa da
marca, idêntica à que aparece no próprio mockup do vídeo.

Ela foi copiada para `public/brand/premiare-logo-negativa.svg`. O único ajuste
foi **recortar o viewBox** (era um quadrado 375×375 com muita margem
transparente; virou 304×84, colado na arte). Os **19 paths continuam byte a
byte idênticos** — nenhum traço foi redesenhado e nada foi recolorido por CSS.
Cada fundo recebe o arquivo oficial feito para ele.

## 9. Peso no build

| Item | Valor |
|---|---|
| Build total | **6,42 MB** (era 4,11 MB antes do hero) |
| Acréscimo do hero | ~2,31 MB (vídeos 1080p-equivalente, posters e 14 logotipos) |
| Maior arquivo | `video/hero-premiare-desktop.mp4` — **1,33 MB** |
| JS por página | 3,0 KB gzip |
| CSS por página | 6,6 KB gzip |

Nenhum arquivo chega perto do limite por arquivo, e o build está a menos de um
quarto do limite total. **O vídeo cabe no pacote estático** — não é preciso
hospedar fora, nem no Wix Media, nem em CDN, nem cair para poster estático.

Se um dia a Premiare quiser um vídeo mais longo ou em 1080p, a ordem de
preferência para não estourar o pacote é: (1) reduzir duração e bitrate;
(2) hospedar no Wix Media e apontar o `src`; (3) CDN HTTPS própria;
(4) por último, poster estático sem vídeo. Nenhuma delas é necessária hoje.

## 10. Pendência

Os 14 logotipos de clientes vieram da seção "Atendemos quem exige o melhor" do
**site oficial da Premiare** — ou seja, a própria empresa já os publica. Ainda
assim, republicá-los aqui repete uma afirmação de relacionamento comercial, e
convém que a Premiare confirme que a autorização de uso de marca de cada cliente
segue válida para este site. Ver `PRE_LAUNCH_CHECKLIST.md`.
