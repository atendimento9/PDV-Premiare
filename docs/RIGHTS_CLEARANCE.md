# Registro de direitos de uso

Documento de rastreabilidade. **Não é um portão** — o trabalho não foi
interrompido por causa dele.

## Autorização

| Item | Registro |
|---|---|
| Declarante | Premiare Criativa (cliente) |
| Data do registro | 31/08/2026 |
| Escopo | Fotos, descrições e fichas técnicas dos 40 produtos presentes na planilha `relatorio_premiare_astor*.xlsx` |
| Finalidade | Publicação no site próprio da Premiare Criativa |
| Origem da declaração | Briefing do projeto (v2.1, §7.1): a Premiare confirmou possuir todas as autorizações de uso |

## Escopo original e atualização de 02/10/2026

A autorização registrada em 31/08 cobre **exclusivamente** o material presente
na planilha. Em 02/10, o cliente solicitou remover marcas das imagens de produto
e pesquisar imagens para os três SKUs sem foto. As 13 imagens resultantes estão
registradas em `IMAGE_UPDATES_2026-10-02.md`.

As três novas referências encontradas no site do fornecedor não estavam na
planilha original. A autorização de publicação dessas referências deve ser
confirmada pela Premiare. Os arquivos publicados são locais e não fazem hotlink.

Permanecem fora do escopo:

- usar a imagem de um produto em outro;
- fazer *hotlink* de imagem no site publicado — todas as imagens são arquivos
  locais em `public/catalog/products/`;
- publicar qualquer URL do fornecedor (gate `check-forbidden` falha o build se
  `astorbrindes` ou `cdn.brinde.me` aparecer em `dist/`).

## Origens de imagem efetivamente usadas

| Origem | Quantidade |
|---|---|
| Foto oficial da URL da planilha, mantida sem edição | 27 |
| Foto oficial da planilha, editada para remover marcas ou texto de mockup | 10 |
| Referência adicional do fornecedor, pesquisada por SKU e editada | 3 |
| **Total de produtos** | **40** |

As 37 fotos da planilha foram inicialmente aceitas após comparação perceptiva
com a miniatura ancorada na linha do produto. As três referências adicionais
foram conferidas pelo SKU exato na página do fornecedor.

## Revisão visual original e substituições

As três imagens abaixo foram bloqueadas na revisão inicial, registrada em
`../scripts/image-review.json`. Em 02/10, receberam novas versões editadas de
referências pesquisadas por SKU. A revisão original foi preservada como histórico.

| Código | Motivo |
|---|---|
| `KIT-COA0032` | A imagem original declara na própria legenda ter sido **gerada por inteligência artificial** e exibe marcas de terceiros. O briefing inicial proibia imagem gerada por IA; o pedido de 02/10 autorizou gerar novas imagens genéricas. |
| `BD-STANLEYPILSNER444ML` | Não é foto de produto: é ficha técnica do fornecedor, com tabela de nomes de cor seguidos de números de quatro dígitos que um visitante lê como preço. |
| `BD-COPOCOMTIRANTE` | Mockup com texto queimado na imagem e marca de terceiro aplicada ao produto. |

Os três produtos agora têm imagens locais próprias, sem os textos ou marcas
visíveis nas referências usadas.

## Imagens com marcas de terceiros identificadas na revisão original

Dez imagens oficiais da planilha exibiam marcas de clientes ou aplicativos.
Todas foram substituídas por versões editadas que mantêm o produto e removem
as marcas visíveis. A lista completa está em `IMAGE_UPDATES_2026-10-02.md`.
