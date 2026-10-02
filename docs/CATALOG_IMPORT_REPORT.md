# Relatorio de importacao do catalogo

- Planilha: `relatorio_premiare_astor (2).xlsx`
- SHA-256: `f26a2aecb6726bb3797cd70147434a82882a9bac0054edceff85bb51c5f16303`
- Aba `Produtos`: cabecalho na linha 4, dados 5-44

## Contagens (real vs. esperado)

| Item | Real | Esperado | Situacao |
|---|---|---|---|
| products | 40 | 40 | OK |
| categories | 9 | 9 | OK |
| featured | 10 | 10 | OK |
| kits | 5 | 5 | OK |
| imagens publicaveis | 40 | 40 | OK |

## Mapeamento de imagens

Cada imagem foi associada ao produto pela **ancora de celula** do XLSX (coluna E, linhas 5-44), nunca pela ordem de aparicao. Cada associacao foi conferida contra o nome do arquivo da coluna `Foto oficial (URL)`; score abaixo de 0,50 marca o produto como `imagem_nao_confirmada` e a imagem nao e publicada.

## Clausulas removidas do texto publico

Total: 112. Regra: remove-se a clausula, nunca o campo inteiro, quando ela referencia a fonte de terceiro, declara ausencia de dado ou e nota interna de curadoria.

| Campo | Clausula | Motivo |
|---|---|---|
| `BD95127/materials` | material específico do bloqueio RFID não detalhado. | declaracao-de-ausencia |
| `BD95127/colors` | O site exibe amostras visuais sem nomes textuais. | referencia-a-fonte |
| `BD95127/notes` | Cores, prazo e técnica de gravação não informados. | declaracao-de-ausencia |
| `BDKV0160/colors` | demais cores não informadas. | declaracao-de-ausencia |
| `BDKV0160/application` | Presente executivo com vinho selecionado pela Premiare. | nota-interna |
| `BDKV0160/notes` | Personalização, cores e prazo não publicados. | declaracao-de-ausencia |
| `KIT-GA0008/dimensions` | capacidade da caneca e dimensões não informadas. | declaracao-de-ausencia |
| `KIT-GA0008/notes` | Capacidade da caneca, dimensões, cores e prazo não publicados. | declaracao-de-ausencia |
| `BD-STANLEYPILSNER444ML/colors` | o site informa cinco opções no total, sem enumerar as outras quatro. | referencia-a-fonte |
| `BD-STANLEYPILSNER444ML/notes` | Técnica de personalização, demais nomes de cores e prazo não publicados. | declaracao-de-ausencia |
| `KIT-ESPU025/colors` | demais cores não informadas. | declaracao-de-ausencia |
| `KIT-ESPU025/dimensions` | medidas da caixa e das taças não informadas. | declaracao-de-ausencia |
| `KIT-ESPU025/notes` | Prazo e dimensões não publicados. | declaracao-de-ausencia |
| `BD97194/notes` | Capacidades elétricas publicadas | comentario-sobre-a-fonte |
| `BD97194/notes` | técnica de personalização e cores não informadas. | declaracao-de-ausencia |
| `BD97161/notes` | Técnica de personalização e cores não publicadas. | declaracao-de-ausencia |
| `BD-POWERBANKPB198/dimensions` | Dimensões não informadas. | declaracao-de-ausencia |
| `BD-POWERBANKPB198/personalization` | O produto é anunciado como personalizado, mas a técnica não é informada. | declaracao-de-ausencia |
| `BD-POWERBANKPB198/notes` | Materiais, dimensões, técnica de personalização e prazo não publicados. | declaracao-de-ausencia |
| `BD18673/colors` | O site exibe amostras visuais sem nomes textuais. | referencia-a-fonte |
| `BD18673/personalization` | técnica não informada. | declaracao-de-ausencia |
| `BD18673/notes` | Nomes das cores, técnica de gravação e prazo não publicados. | declaracao-de-ausencia |
| `BD94399/colors` | nomes de cores não informados. | declaracao-de-ausencia |
| `BD94399/colors` | O site alerta que cor e impressão podem variar. | referencia-a-fonte |
| `BD94399/personalization` | Técnica de personalização não informada | declaracao-de-ausencia |
| `BD94399/personalization` | o site apenas alerta sobre variações de impressão em materiais naturais. | referencia-a-fonte |
| `BD94399/notes` | Capacidade não aplicável. | declaracao-de-ausencia |
| `BD94399/notes` | Prazo e técnica de gravação não publicados. | declaracao-de-ausencia |
| `BD94397/colors` | nomes de cores não informados. | declaracao-de-ausencia |
| `BD94397/colors` | O site alerta que cor e impressão podem variar. | referencia-a-fonte |
| `BD94397/personalization` | Técnica não informada | declaracao-de-ausencia |
| `BD94397/notes` | Prazo não publicado | declaracao-de-ausencia |
| `BD94397/notes` | cores sem nomenclatura textual. | declaracao-de-ausencia |
| `BDGA7950/colors` | O site exibe amostras visuais sem nomes textuais | referencia-a-fonte |
| `BDGA7950/notes` | Percentual de material reciclado, técnica de gravação, nomes das cores e prazo não publicados. | declaracao-de-ausencia |
| `BD-1000002/colors` | fita em várias cores, sem lista nominal. | declaracao-de-ausencia |
| `BD-1000002/notes` | Tamanhos, lista de cores e prazo não publicados. | declaracao-de-ausencia |
| `KIT-VBE002/materials` | materiais dos demais itens não detalhados. | declaracao-de-ausencia |
| `KIT-VBE002/notes` | Medidas, prazo e composição de vários itens não publicados. | declaracao-de-ausencia |
| `BD-BLCAPNOTSBL/colors` | cor-base não informada. | declaracao-de-ausencia |
| `BD-BLCAPNOTSBL/dimensions` | O texto de 15,6” aparece truncado. | declaracao-de-ausencia |
| `BD-BLCAPNOTSBL/notes` | Medida de 15,6” truncada no site | referencia-a-fonte |
| `BD-BLCAPNOTSBL/notes` | prazo não publicado. | declaracao-de-ausencia |
| `BD-BLCAPNOTISO/colors` | cor-base não informada. | declaracao-de-ausencia |
| `BD-BLCAPNOTISO/notes` | Prazo e cor-base não publicados. | declaracao-de-ausencia |
| `BD09274/personalization` | técnica não informada. | declaracao-de-ausencia |
| `BD09274/notes` | Cores, técnica de gravação e prazo não publicados. | declaracao-de-ausencia |
| `BD-LUMINARIA/materials` | LED e corpo de material não especificado | declaracao-de-ausencia |
| `BD-LUMINARIA/colors` | O site exibe duas amostras visuais, sem nomes textuais. | referencia-a-fonte |
| `BD-LUMINARIA/personalization` | O produto é anunciado como personalizado, mas a técnica não é informada. | declaracao-de-ausencia |
| `BD-LUMINARIA/notes` | Materiais completos, dimensões, nomes das cores, técnica e prazo não publicados. | declaracao-de-ausencia |
| `BD94398/materials` | caixa presente (material não detalhado). | declaracao-de-ausencia |
| `BD94398/colors` | O site exibe amostras visuais sem nomes textuais. | referencia-a-fonte |
| `BD94398/notes` | Personalização e nomes das cores não informados. | declaracao-de-ausencia |
| `BD94435/colors` | demais cores não informadas. | declaracao-de-ausencia |
| `BD94435/personalization` | Técnica não informada | declaracao-de-ausencia |
| `BD94435/personalization` | o site alerta para variação de impressão em materiais naturais. | referencia-a-fonte |
| `BD94435/notes` | Prazo e técnica de personalização não publicados. | declaracao-de-ausencia |
| `BDCO9310/colors` | o site exibe amostras sem nomes textuais. | referencia-a-fonte |
| `BDCO9310/notes` | Nomes das cores, técnica de gravação e prazo não informados. | declaracao-de-ausencia |
| `KIT-COA0032/dimensions` | o site informa pacote de café de 2.050 g — validar antes de cotar. | referencia-a-fonte |
| `KIT-COA0032/notes` | A gramatura de 2.050 g parece incomum, mas foi mantida exatamente como publicada | nota-interna |
| `KIT-COA0032/notes` | validar com a Astor. | referencia-a-fornecedor |
| `KIT-FRA3047/materials` | cafeteira francesa (material não detalhado) | declaracao-de-ausencia |
| `KIT-FRA3047/personalization` | técnicas não especificadas. | declaracao-de-ausencia |
| `KIT-FRA3047/notes` | Materiais da cafeteira, cores, técnicas específicas e prazo não publicados. | declaracao-de-ausencia |
| `BDGA8400/colors` | O site exibe amostras visuais sem nomes textuais. | referencia-a-fonte |
| `BDGA8400/notes` | Técnica de personalização, nomes das cores e prazo não publicados. | declaracao-de-ausencia |
| `BD-DRIPCOFFEE10G/notes` | Validade, dimensões externas e prazo não publicados. | declaracao-de-ausencia |
| `BD-CHAVEIROTAGNFC/dimensions` | dimensões não informadas. | declaracao-de-ausencia |
| `BD-CHAVEIROTAGNFC/notes` | Materiais, medidas, cores, capacidade útil da memória e prazo não detalhados além da especificação 1K. | declaracao-de-ausencia |
| `BD-COPOCOMTIRANTE/materials` | tipo de polímero e material do cordão não informados. | declaracao-de-ausencia |
| `BD-COPOCOMTIRANTE/colors` | nomes não enumerados na ficha. | declaracao-de-ausencia |
| `BD-COPOCOMTIRANTE/dimensions` | demais medidas não informadas. | declaracao-de-ausencia |
| `BD-COPOCOMTIRANTE/notes` | Lista nominal das cores, dimensões, prazo e composição exata do plástico não publicados. | declaracao-de-ausencia |
| `BD-CHAVEIROESMALTADO/notes` | Único item da seleção com prazo de produção publicado | nota-interna |
| `BDKWS100/notes` | Cores, gravação e prazo não publicados. | declaracao-de-ausencia |
| `KIT-BOAS0008/materials` | caderno tipo Moleskine e caixa com materiais não detalhados. | declaracao-de-ausencia |
| `KIT-BOAS0008/personalization` | técnicas não especificadas. | declaracao-de-ausencia |
| `KIT-BOAS0008/notes` | Medidas, cores, técnicas específicas e prazo não publicados. | declaracao-de-ausencia |
| `KIT-BOAS0058/materials` | materiais do porta-crachá e sacochila não detalhados. | declaracao-de-ausencia |
| `KIT-BOAS0058/dimensions` | demais medidas não informadas. | declaracao-de-ausencia |
| `KIT-BOAS0058/notes` | medidas, cores e prazo não publicados. | declaracao-de-ausencia |
| `KIT-BOAS0056/materials` | materiais da caderneta, camiseta e copo térmico não detalhados. | declaracao-de-ausencia |
| `KIT-BOAS0056/personalization` | Demais técnicas não informadas. | declaracao-de-ausencia |
| `KIT-BOAS0056/notes` | Medidas, cores, materiais completos e prazo não publicados. | declaracao-de-ausencia |
| `BD-CAIXACARTONADA02/materials` | Estrutura rígida não detalhada | declaracao-de-ausencia |
| `BD-CAIXACARTONADA02/colors` | Cores específicas não listadas. | declaracao-de-ausencia |
| `BD-CAIXACARTONADA02/application` | Embalagem-mãe para curadoria sob medida da Premiare. | nota-interna |
| `BD-CAIXACARTONADA02/notes` | O site informa explicitamente que não há berço | referencia-a-fonte |
| `BD-CAIXACARTONADA02/notes` | prazo e material estrutural não detalhados. | declaracao-de-ausencia |
| `BD-W8DWXU5QR/colors` | lista de cores não publicada. | declaracao-de-ausencia |
| `BD-W8DWXU5QR/personalization` | técnica de impressão adicional não informada. | declaracao-de-ausencia |
| `BD-W8DWXU5QR/kitCombination` | Combina com praticamente todos os itens menores da seleção. | nota-interna |
| `BD-W8DWXU5QR/notes` | Lista de cores, técnica de personalização e prazo não publicados. | declaracao-de-ausencia |
| `BD-ROUPAO/colors` | O site exibe amostras visuais sem nomes textuais. | referencia-a-fonte |
| `BD-ROUPAO/notes` | Tamanhos, nomes das cores e prazo não publicados. | declaracao-de-ausencia |
| `BD98166/notes` | Lista de funções publicada | comentario-sobre-a-fonte |
| `BD98166/notes` | cores, prazo e técnica de gravação ausentes. | declaracao-de-ausencia |
| `BD95114/materials` | recipiente interno não detalhado. | declaracao-de-ausencia |
| `BD95114/colors` | outras cores não informadas. | declaracao-de-ausencia |
| `BD95114/personalization` | Técnica não informada | declaracao-de-ausencia |
| `BD95114/personalization` | o site alerta sobre variação de impressão no bambu. | referencia-a-fonte |
| `BD95114/notes` | Composição do reservatório, prazo e técnica de gravação não detalhados. | declaracao-de-ausencia |
| `BD95112/colors` | O site exibe amostras visuais sem nomes textuais. | referencia-a-fonte |
| `BD95112/notes` | Nomes das cores, técnica de personalização e prazo não publicados. | declaracao-de-ausencia |
| `BD95111/colors` | O site exibe amostras visuais sem nomes textuais. | referencia-a-fonte |
| `BD95111/notes` | Cores, técnica de personalização e prazo não publicados. | declaracao-de-ausencia |
| `BD-BISCOITOSORTE/materials` | embalagem individual flow-pack, com composição do filme não detalhada. | declaracao-de-ausencia |
| `BD-BISCOITOSORTE/colors` | cores não limitadas na ficha. | declaracao-de-ausencia |
| `BD-BISCOITOSORTE/notes` | Ingredientes, alergênicos, dimensões e prazo não publicados | declaracao-de-ausencia |
| `BD-BISCOITOSORTE/notes` | validar para ações alimentícias. | nota-interna |
