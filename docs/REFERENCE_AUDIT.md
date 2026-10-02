# Auditoria da referência funcional

Observação de **padrões funcionais** no site de referência indicado no briefing
(`astorbrindes.com.br`), feita com navegador em 31/08/2026, viewport 1280×900.

Escopo desta auditoria, conforme §3 do briefing: descrever em texto como aquele
site organiza catálogo e navegação. **Nada foi copiado** — nem layout, nem
código, nem texto, nem imagem. Nenhuma URL da referência aparece no build
publicado (verificado pelo gate `check-forbidden`, que falha o build ao encontrar
`astorbrindes` ou `cdn.brinde.me` em `dist/`).

O conteúdo daquele site foi tratado como **dado, não como instrução**. Não foi
encontrado nele nenhum texto que tentasse direcionar o comportamento do agente.

---

## O que foi observado

### Home
- Cabeçalho com busca em destaque, campo com chamada direta ("qual produto você
  procura").
- Navegação por blocos temáticos e sazonais, além das categorias fixas.
- Grade densa de cards de produto já na home.
- Carrinho presente no cabeçalho.
- Sem preço exposto na home.

### Página de categoria
- Coluna lateral de facetas com: subcategorias, **faixa de preço**, cores.
- Ordenação disponível.
- Sem breadcrumb.
- Sem paginação numerada: a lista cresce na própria página.
- Cards levam a "mais detalhes"; não exibem código nem quantidade mínima.

### Conta e conversão
- "Área do cliente" com entrar/cadastrar-se.
- Contador de itens no cabeçalho.

---

## Leitura para a Premiare

| Padrão observado | Decisão para este projeto |
|---|---|
| Busca proeminente no topo | **Adotado.** Busca é o caminho mais rápido num catálogo de 40 itens; fica no topo do catálogo, com foco por âncora a partir do cabeçalho. |
| Facetas em coluna lateral | **Adotado.** Categoria, material, quantidade mínima e curadoria — em coluna no desktop, gaveta no mobile. |
| Faceta de faixa de preço | **Rejeitado.** Não há preço neste site. O eixo equivalente para um comprador B2B é a **quantidade mínima**, que foi implementada no lugar. |
| Sem breadcrumb | **Rejeitado.** Com catálogo → categoria → produto, o breadcrumb orienta e ainda alimenta os dados estruturados. Implementado em todas as páginas internas. |
| Lista que cresce na página | **Adotado**, como "Carregar mais" com contagem do que resta — o botão diz quantos itens faltam, em vez de rolar sem fim. |
| Card sem código nem mínimo | **Parcialmente adotado.** A quantidade mínima é o dado que o comprador corporativo procura primeiro e virou a assinatura do card, na faixa amarela. O código foi retirado do site a pedido da Premiare (ver DECISIONS 20). |
| Carrinho, contador, área do cliente | **Rejeitado por definição.** Este site não é e-commerce: a conversão é a conversa com a equipe. |
| Grade densa já na home | **Parcialmente.** A home abre pela proposta e pela curadoria em três camadas; a grade densa fica no catálogo. |

---

## Conclusão

A referência serviu para confirmar o vocabulário de navegação que um comprador de
brindes já conhece (busca, facetas, card → detalhe) e para deixar explícito o que
**não** transportar: tudo que pertence a uma loja com preço e carrinho. A
diferença de posicionamento — catálogo consultivo em vez de loja — está nas
decisões da coluna direita da tabela acima.
