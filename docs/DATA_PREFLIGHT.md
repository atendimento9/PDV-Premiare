# Pré-voo dos dados

Leitura da planilha antes de qualquer implementação, para saber o que existe de
fato — e não o que se espera que exista.

Planilha: `relatorio_premiare_astor (2).xlsx` · lida em 31/08/2026.

## Abas

| Aba | Dimensões | Imagens | Uso |
|---|---|---|---|
| Resumo | A1:H22 | 0 | Totais, ordem das categorias e estratégia de três camadas |
| Produtos | A1:T44 | **40** | Fonte do catálogo público |
| Top 10 | A1:H14 | 0 | Prioridade editorial (posição nunca publicada) |
| Kits sugeridos | A1:E8 | 0 | Cinco páginas de solução |
| Prospecção | A1:G18 | 0 | **Interno.** Nunca publicado; varrido pelo gate |
| Categorias Astor | A1:D48 | 0 | Referência interna de arquitetura; não replicada |
| Lacunas | A1:C11 | 0 | Lista negativa de coisas a não inventar |

## Aba Produtos

- Cabeçalho na **linha 4**; dados nas **linhas 5 a 44** → **40 produtos**.
- 20 colunas: ID, Categoria, Produto, Código, Foto, Link direto, Materiais,
  Cores disponíveis, Medidas e capacidade, Personalização, Quantidade mínima,
  Prazo, Principais diferenciais, Indicado para, Exemplo de aplicação pela
  Premiare, Combinação em kit, Potencial comercial, Observações técnicas,
  Fonte oficial (URL), Foto oficial (URL).
- **Nenhum código duplicado.** Nenhum slug duplicado.

### Imagens embutidas

40 imagens, todas ancoradas na **coluna E**, uma por linha, cobrindo exatamente
as linhas 5 a 44. Não há linha sem imagem, linha com duas, nem imagem fora da
faixa de dados. Formato PNG, **240 × 240 px** — resolução baixa demais para
página de produto, o que levou a buscar a versão em alta pela URL oficial
(ver `CATALOG_IMPORT_REPORT.md` e `DECISIONS.md`).

O importador falha e registra ocorrência se esse padrão de ancoragem mudar. É a
defesa contra o erro mais grave e mais silencioso possível aqui: um
deslocamento de uma linha associaria a foto errada a 39 produtos.

## Confronto com a expectativa do briefing

| Item | Esperado | Real | Situação |
|---|---|---|---|
| Produtos | 40 | **40** | confere |
| Categorias da curadoria | 9 | **9** | confere |
| Top 10 | 10 | **10** | confere, todos os SKUs casaram |
| Kits sugeridos | 5 | **5** | confere |

### Distribuição por categoria

| Categoria | Esperado | Real |
|---|---|---|
| Produtos executivos e premium | 5 | 5 |
| Tecnologia | 4 | 4 |
| Sustentabilidade | 4 | 4 |
| Viagens e mobilidade | 3 | 3 |
| Escritório e home office | 2 | 2 |
| Alimentação e bebidas | 7 | 7 |
| Eventos e ações promocionais | 3 | 3 |
| Kits e presentes para colaboradores | 7 | 7 |
| Produtos criativos ou diferenciados | 5 | 5 |
| **Total** | **40** | **40** |

Nenhuma divergência. Nada precisou ser ajustado — e nada teria sido: a validação
falharia relatando os números reais.

## Campos ausentes

`NI — não informado no site` aparece com frequência. Contagem do que sobrou
publicável depois da normalização:

| Campo | Produtos com valor |
|---|---|
| Quantidade mínima | 40 / 40 |
| Principais diferenciais | 40 / 40 |
| Indicado para | 40 / 40 |
| Combinação em kit | 39 / 40 |
| Materiais | 38 / 40 |
| Exemplo de aplicação | 38 / 40 |
| Medidas e capacidade | 34 / 40 |
| Personalização | 22 / 40 |
| Cores | 20 / 40 |
| **Prazo** | **1 / 40** |
| Observações técnicas úteis | 3 / 40 |

**Prazo é o buraco mais relevante:** um único produto o publica
(`BD-CHAVEIROESMALTADO`, 15 a 20 dias úteis). Por isso nenhuma parte do site —
FAQ incluída — promete prazo.

## Frases-meta encontradas no texto

Muitas células misturam informação real com comentário sobre a fonte
("o site exibe amostras visuais sem nomes textuais", "cores não informadas",
"validar com a Astor"). Publicar isso literalmente vazaria a origem dos dados e
encheria as fichas de declarações de ausência. Daí o sanitizador por cláusula
descrito em `DECISIONS.md`.
