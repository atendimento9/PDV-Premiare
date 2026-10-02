# Arquitetura da informação

## Jornada

Conhecer a Premiare → navegar categorias → encontrar produto ou solução →
consultar ficha técnica → informar quantidade estimada → falar com a equipe.

Todo produto tem **chamada para contato**, nunca para compra. Não existem preço,
carrinho, checkout, pagamento, login, cadastro, área do cliente nem estoque.

## Ordem da home

Abertura de marca, prova social e então conteúdo comercial:

```
cabeçalho (sobre o hero)
  hero em vídeo — marca e posicionamento
  carrossel de clientes — transição azul → branco
  categorias
  benefícios
  destaques · soluções · modulares · projetos · como funciona · FAQ · CTA
```

As categorias vieram para antes dos benefícios: depois da prova social, o
visitante entra direto no comercial. A home segue sendo um PDV digital —
a abertura de marca é curta e o catálogo domina o resto da página.

## Três camadas

A home reflete, nesta ordem, a estratégia registrada na aba Resumo da planilha:

1. **Produtos-herói** — a Seleção Premiare, com os itens do Top 10.
2. **Kits por ocasião** — as cinco soluções, como pontos de partida.
3. **Componentes modulares** — peças avulsas para compor algo exclusivo.

## Rotas (catálogo atual: 65 produtos e 7 categorias)

| Rota | Quantidade | Origem |
|---|---|---|
| `/` | 1 | — |
| `/catalogo` | 1 | 65 produtos |
| `/categoria/{slug}` | 7 | curadoria AA/AAA |
| `/produto/{slug}` | 65 | planilha original + Astor |
| `/solucoes` | 1 | — |
| `/solucoes/{slug}` | 5 | aba Kits sugeridos |
| `/projetos-personalizados` | 1 | — |
| `/perguntas-frequentes` | 1 | — |
| `/contato` | 1 | — |
| `/politica-de-privacidade` | 1 | privacidade e cookies na mesma página |
| `/404` | 1 | `noindex` |

Mais `sitemap.xml` e `robots.txt`, gerados a partir das rotas reais.

### Slugs de categoria

`produtos-executivos-e-premium` · `tecnologia` · `sustentabilidade` ·
`viagens-e-mobilidade` · `escritorio-e-home-office` · `alimentacao-e-bebidas` ·
`eventos-e-acoes-promocionais` · `kits-e-presentes-para-colaboradores` ·
`produtos-criativos-ou-diferenciados`

### Slugs de solução

`onboarding-hibrido-premium` · `lideranca-conectada` · `evento-tech-esg` ·
`coffee-experience` · `reconhecimento-de-resultados`

## Navegação

Menu do cabeçalho: Produtos · Soluções · Projetos personalizados.
Rodapé: catálogo, soluções, projetos, perguntas frequentes, contato e as duas
páginas legais.

Sem carrinho, login, cadastro, sacola, contador ou favoritos.

Abaixo de 1200 px o menu vira gaveta lateral, com foco preso, fechamento por
`Esc`, bloqueio de rolagem de fundo e as nove categorias listadas. A gaveta
aparece antes do que o normal porque seis itens não cabem numa linha ao lado da
logo, da busca e do CTA — e menu quebrado em duas linhas é pior que gaveta.

## Ligações cruzadas

- Produto → categoria (breadcrumb) e → soluções que o contêm.
- Solução → cada produto componente que existe no catálogo.
- Categoria → produtos, com busca e facetas próprias da categoria.
- Relacionados por ordem **determinística**: mesma categoria, depois quem divide
  um kit, depois prioridade editorial, depois nome. Nunca aleatório — o mesmo
  produto gera sempre a mesma lista.

## Busca e facetas

Busca no cliente sobre nome, categoria, materiais, cores,
personalização, diferenciais e indicação. Normaliza acentos, caixa e espaços:
"cafe" encontra "Café".

Facetas: categoria, material, quantidade mínima, curadoria e texto. As de
material vêm de um vocabulário fixo confrontado com o texto real da planilha —
só aparece o que existe, com a contagem real.

Ordenação: Destaques primeiro · Ordem da curadoria · Nome (A–Z) ·
Quantidade mínima.

Não existe ordenação nem filtro por preço, estoque, avaliação ou ESG inferido.
"Mais recentes" ficou de fora porque a planilha não traz data — ordenar por data
inexistente seria inventar.

## Separação público × interno

O JSON público é montado campo a campo a partir de uma **allowlist**, nunca por
remoção. Coluna nova na planilha nasce privada. O mesmo vale para o índice de
busca.

Nunca chegam à interface, ao HTML, a `data-*`, aos metadados, ao JSON público, ao
índice de busca ou ao sitemap: URL da fonte, URL da imagem original, ID interno,
potencial comercial, posição no Top 10 e qualquer dado da aba Prospecção. O
booleano de destaque é público; a **posição** não.
