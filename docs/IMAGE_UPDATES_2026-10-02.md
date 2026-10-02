# Atualização das imagens dos produtos — 02/10/2026

> Este registro documenta as imagens da seleção original de 40 itens. A curadoria
> atual de 65 produtos, inclusive as quatro imagens Astor editadas, está em
> `CURADORIA_2026-10-02.md`.
> A nota antiga sobre autorização das três referências adicionais foi superada
> pelo registro da parceria Astor em `RIGHTS_CLEARANCE.md`.

Pedido do cliente: remover marcas e logotipos das imagens de produto, mantendo
os itens genéricos; pesquisar os três produtos sem foto e incluí-los no catálogo.

## Resultado

- 10 fotos oficiais da planilha foram editadas para remover marcas, artes de
  clientes e textos de mockup.
- 3 imagens foram pesquisadas pelo SKU exato no site do fornecedor e editadas
  para retirar marcas e legendas.
- Os 40 produtos têm imagem local. Cada fonte final está em
  `assets/catalog-curated/<sku>.webp`; o pipeline gera variantes 480, 800 e
  1200 px em `public/catalog/products/<sku>/`.
- As novas imagens são **edições geradas por IA** a partir das referências,
  não fotografias originais intactas. As fichas técnicas e SKUs não foram
  alterados. Em particular, o item Stanley conserva o nome e o SKU da fonte,
  embora a imagem exibida tenha sido deixada sem logotipo.

## Imagens editadas

| SKU | Alteração visual solicitada |
|---|---|
| `BD-BLCAPNOTSBL` | Remover TikTok e ícones de aplicativos da capa; prolongar a arte abstrata. |
| `BD-BLCAPNOTISO` | Remover Dell, Windows e textos da capa preta. |
| `KIT-FRA3047` | Remover marcas e rótulos da caixa e das embalagens do kit café. |
| `KIT-BOAS0008` | Remover a marca do escritório da garrafa, caderno, caneta e caixa. |
| `KIT-BOAS0058` | Remover marcas do troféu, crachá, caneca e caixa. |
| `KIT-BOAS0056` | Remover marca do copo, caderneta, caneta e peça têxtil. |
| `BD-ROUPAO` | Remover bordados do roupão e das pantufas. |
| `KIT-VBE002` | Remover monogramas dos organizadores de viagem. |
| `BD-CHAVEIROESMALTADO` | Remover arte do cliente; frente esmaltada branca lisa. |
| `BD-DRIPCOFFEE10G` | Remover textos da área de personalização e legenda inferior. |
| `KIT-COA0032` | Remover Grupo Fleury, Orfeu e demais marcas do kit completo. |
| `BD-STANLEYPILSNER444ML` | Remover logotipo externo e assinatura interna do copo azul. |
| `BD-COPOCOMTIRANTE` | Remover marca do copo e do tirante, além da legenda da foto. |

Prompt base usado no editor de imagens: **edição precisa de foto de produto para
catálogo; remover apenas marcas, logotipos, letras e legendas especificados;
reconstruir naturalmente as superfícies; preservar produto, componentes,
materiais, proporções, perspectiva, luz e fundo; nenhuma nova marca ou texto.**
As instruções particulares de cada SKU são as da tabela acima. Ferramenta:
`image_gen` integrada do Codex; fontes finais escolhidas após inspeção visual.

## Pesquisa dos três SKUs antes sem imagem

| SKU | Página consultada | Referência usada |
|---|---|---|
| `KIT-COA0032` | [Kit Coador de Café Personalizado](https://astorbrindes.com.br/brinde/kit-coador-personalizado-18) | Imagem do conjunto completo com caixa vermelha. |
| `BD-STANLEYPILSNER444ML` | [Copo Stanley Pilsner Glass Azure 444 mL](https://astorbrindes.com.br/brinde/copo-stanley-pilsner-glass-happy-hour-stanley-azure-444ml) | Foto do copo azul em fundo transparente. |
| `BD-COPOCOMTIRANTE` | [Eco Copo Personalizado 550 mL](https://astorbrindes.com.br/brinde/eco-copo-personalizado-550ml-in-mold-label) | Foto do copo e do tirante azuis. |

As referências são específicas de cada SKU. A autorização anterior registrada
em `RIGHTS_CLEARANCE.md` cobre o material da planilha; cabe à Premiare confirmar
o uso das três referências adicionais pesquisadas na internet.
