# Auditoria de marca

## Logotipo

`LOGO COLORIDA-8.svg`, copiado byte a byte para `public/brand/premiare-logo.svg`.
O SHA-256 do arquivo publicado é idêntico ao da origem
(`020c7f9d…c509c`) — prova de que **nada** foi alterado.

Não houve: redesenho, compressão, esticamento, recoloração, mudança de letras,
remoção da faixa amarela, efeito 3D, sombra pesada, alteração de proporção nem
criação de monograma.

Aplicação no site: 176 px de largura no cabeçalho, altura automática, com
`aria-label` "Premiare Criativa, página inicial". A logo não aparece sobreposta
a nenhuma foto de produto.

### Favicon

`public/favicon.svg` **não** é o logotipo reduzido — reduzir uma marca em texto a
32 px produziria uma mancha ilegível. É um ladrilho com as cores da identidade e
a faixa amarela, o mesmo dispositivo que estrutura o site. Nenhum traço do
logotipo foi redesenhado ali.

## Paleta

| Cor | Valor | Verificação |
|---|---|---|
| Azul | `#002566` | usado em títulos, navegação e áreas institucionais |
| Amarelo | `#FAC20F` | usado em CTA e faixa; **nunca como texto sobre branco** |
| Branco | `#FFFFFF` | fundo principal |
| Cinza | `#4D4D4D` | texto secundário |
| Preto | `#000000` | declarado; não usado como cor de texto |

Todos declarados em `src/styles/tokens.css`. O `lint` falha se um valor de cor
literal aparecer fora desse arquivo — a única exceção registrada é a meta
`theme-color`, que não aceita variável CSS.

Nenhuma cor fora da paleta foi introduzida. Os neutros de superfície e borda
(`#F5F7FA`, `#DFE5EE`, `#C3CDDD`, `#23282F`, `#06316F`, `#E7EDF7`, `#D9A600`) são
derivações do azul da marca para superfície, linha e estado, não cores novas.

## Tom e direção

Transmite criatividade, confiança, organização, profissionalismo, atendimento
consultivo e capacidade de personalização. O resultado é moderno, corporativo,
limpo e focado no produto — comercial sem parecer varejo popular.

**Ausentes por decisão:** glassmorphism, neon, blobs, gradientes, formas 3D,
cursor customizado, scroll horizontal, scrolljacking, tipografia gigante sem
função, carrossel, sombra pesada, arredondamento excessivo, ícone decorativo sem
significado e cara de template de SaaS.

O produto é o protagonista: as fotos ficam sobre branco, sem moldura pesada. O
amarelo destaca em faixas de 3 a 4 px e no botão principal; não domina. O azul dá
o peso institucional sem escurecer a leitura.

## Assinatura visual

A faixa amarela do logotipo virou o dispositivo estrutural do site — abre cada
seção, fecha cada card com a quantidade mínima, marca o item de menu
atual. É uma derivação da própria marca, não um ornamento importado, e é o único
elemento decorativo da página.

## Tipografia

Inter, auto-hospedada. O briefing autoriza "Inter, Manrope ou equivalente".
Nenhuma CDN de fontes é usada: o site funciona sem rede externa e não entrega
dados de visitante a terceiro.

## Assinatura verbal

"Reconhecimento que gera valor." aparece no hero e no rodapé, sempre literal.
A palavra "valor" não é usada em nenhum outro lugar do site — o gate de termos
proibidos existe justamente para que ela não escorregue para perto de um número.
