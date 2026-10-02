# Decisões tomadas sob incerteza

Cada entrada: o que estava em aberto, o que foi decidido e por quê. A ordem de
precedência usada é a do briefing — legalidade e veracidade acima de integridade
dos dados, que fica acima de plataforma, funcionalidade e estética.

---

## 1. Domínio do site ainda não informado

**Aberto:** canonical, Open Graph e sitemap exigem uma origem absoluta; o domínio
final não foi fornecido.

**Decidido:** `astro.config.mjs` lê `SITE_URL` do ambiente e, sem ele, usa
`https://dominio-a-definir.invalid`. `.invalid` é o TLD reservado pela RFC 2606:
é inequivocamente um marcador, não um domínio adivinhado.

**Por quê:** inventar um domínio plausível seria pior — poderia passar
despercebido e ir ao ar. Um host `.invalid` é impossível de confundir com o real
e é fácil de encontrar. O build definitivo sai com uma variável:
`SITE_URL=https://www.dominio.com.br npm run build`.

---

## 2. Frases-meta no texto da planilha

**Aberto:** muitas células misturam especificação real com comentário sobre a
fonte — "Bambu natural; demais cores não informadas", "O site exibe amostras
visuais sem nomes textuais", "validar com a Astor".

**Decidido:** sanitizador **por cláusula**, não por campo. O texto é quebrado em
cláusulas e cada uma é descartada se referenciar a fonte de terceiro, declarar
ausência de dado ou for nota interna de curadoria. O que sobra é publicado. Se
não sobrar nada, o campo vira ausente e a linha não é renderizada.

**Por quê:** descartar o campo inteiro perderia "Bambu natural", que é
informação boa. Publicar o campo inteiro vazaria a origem dos dados e encheria as
fichas de "não informado", que o briefing proíbe. 112 cláusulas foram removidas;
a lista completa está em `CATALOG_IMPORT_REPORT.md`, auditável linha a linha.

---

## 3. Coluna "Observações técnicas"

**Aberto:** o briefing lista "observações técnicas **úteis**" como público, mas
38 das 40 células são só declarações do que a fonte não publicou.

**Decidido:** o campo passa pelo mesmo sanitizador. Sobraram três fatos reais,
todos publicados:

- `BD-ROUPAO` — "Pantufa não acompanha."
- `KIT-BOAS0058` — "O troféu é cedido pelo cliente."
- `BD-CHAVEIROESMALTADO` — "Arte sujeita a análise."

**Por quê:** o primeiro é especialmente importante. A foto oficial do roupão
mostra pantufas com destaque, e a planilha diz que elas não acompanham. Sem essa
frase ao lado da imagem, a página induziria o visitante a erro. Foi o caso que
justificou manter o campo em vez de descartá-lo por inteiro.

---

## 4. Imagens embutidas com 240 × 240 px

**Aberto:** a imagem ancorada em cada linha é a prova de qual foto pertence a
qual produto, mas é pequena demais para uma página de produto.

**Decidido:** baixar a versão em alta pela URL oficial da própria planilha
(origem permitida) e aceitá-la **somente se ela bater perceptivamente com a
miniatura ancorada**. Assinatura de 16×16 em tons de cinza, normalizada, com
recorte da moldura branca antes da comparação.

**Por quê:** troca uma heurística de nome de arquivo por evidência de pixel. Se a
planilha tivesse uma URL trocada em alguma linha, a comparação reprova e a foto
errada não é publicada — o fallback é a miniatura embutida, que é sempre do
produto certo.

**Calibração do limiar:** medido sobre os 40 pares reais — mediana 0,028, máximo
0,294. Todos os pares acima de 0,09 foram abertos e conferidos a olho: são o
mesmo produto, com diferença de enquadramento ou escala. O limiar ficou em 0,35,
acima do pior caso legítimo observado e ainda capaz de reprovar a foto de outro
produto. O número não foi escolhido para fazer o gate passar; foi medido.

---

## 5. Três imagens não publicadas

**Aberto:** a amostragem visual obrigatória revelou três imagens impróprias.

**Decidido:** não publicar; os produtos aparecem com o marcador "Foto sob
consulta" e entram na lista de pendências. Detalhes e justificativa por SKU em
`../scripts/image-review.json`, que o pipeline de mídia lê.

**Por quê (P0):** uma delas declara na própria legenda ser gerada por IA, e o
briefing proíbe imagem gerada por IA; outra é ficha técnica com uma tabela de
números que se lê como preço, o que atravessa a proibição de preço por um caminho
que o `grep` não alcança. Placeholder é melhor do que imagem enganosa, e muito
melhor do que a foto de outro produto.

---

## 6. Dez imagens com marca de terceiro

**Aberto:** são mockups de personalização do fornecedor, exibindo a marca de
outra empresa. São as únicas fotos oficiais desses itens.

**Decidido:** publicar e **listar como pendência comercial** para a Premiare.

**Por quê:** mostrar exemplos de personalização com marca real é prática comum
no setor e comunica bem a capacidade de personalizar; a autorização declarada
cobre o material. Retirar dez de quarenta imagens esvaziaria o catálogo, e essa é
uma decisão de negócio da Premiare, não minha. O que cabe a mim é não deixar
passar em silêncio.

---

## 7. Campo `id` fora do JSON público

**Aberto:** o modelo de dados do briefing traz `id: number` marcado como
interno, enquanto a regra de separação lista "ID interno" entre os campos que
nunca podem chegar ao JSON público.

**Decidido:** o `id` não existe no JSON público. O tipo `Product` publicado não
o declara.

**Por quê:** a regra específica de separação público × interno é mais precisa que
o exemplo de tipo, e nada na interface precisa do id. O gate
`validate-catalog` falha se ele reaparecer.

---

## 8. Componentes modulares na home

**Aberto:** o briefing pede grupos "por afinidade real da planilha" nomeando
Tecnologia, Bebidas, Embalagens, Escritório, Mobilidade e Eventos — nomes que não
são exatamente as nove categorias.

**Decidido:** cada grupo é um filtro explícito sobre dado real: cinco deles
mapeiam direto para uma categoria da curadoria e "Embalagens" seleciona produtos
cujo nome começa com "Caixa". Kits ficam de fora dos grupos, porque um item
chamado "Kit" já é uma composição pronta — a terceira camada é justamente a das
peças avulsas. Grupo sem item não é renderizado.

**Por quê:** nenhum atributo novo foi inventado; os grupos são recortes
verificáveis do que está na planilha.

---

## 9. Título de página maior que o recomendado

**Aberto:** sete produtos têm nomes longos; com o sufixo da marca, o `<title>`
passava de 110 caracteres.

**Decidido:** o sufixo "· Premiare Criativa" só entra quando o total fica em 70
caracteres. Acima disso, o nome vai sozinho; e só se o nome sozinho ainda
estourar é que ele é cortado em fronteira de palavra, **apenas no `<title>`**.

**Por quê:** o nome é o que identifica o produto no resultado de busca; o sufixo
é redundante ali. O nome completo continua no `h1`, no corpo da página, nos dados
estruturados e no JSON — nenhum dado foi alterado, só o rótulo da aba.

---

## 10. Tamanho do build e hospedagem na Vercel

**Atualização de 02/10/2026:** a hospedagem foi definida na Vercel. Astro estático
é suportado sem adapter; pushes à branch Git de produção geram deployment quando
a integração Git do projeto está ativa.

**Decidido:** os limites de 20 MB por build e 3 MB por arquivo são orçamentos
internos de qualidade, não limites atribuídos à Vercel. As instruções de deploy
atuais estão em `VERCEL_DEPLOYMENT.md`.

**Por quê:** manter um orçamento de mídia próprio ajuda a evitar páginas pesadas,
independente dos limites operacionais da hospedagem. As constantes ficam no topo
de `scripts/check-budget.mjs`.

---

## 11. `overflow-x: clip` em vez de `hidden`

**Aberto:** `overflow-x: hidden` no `body` protege contra rolagem horizontal.

**Decidido:** trocado por `overflow-x: clip`.

**Por quê:** `hidden` cria um contexto de rolagem e quebra `position: sticky` em
parte dos navegadores — e o cabeçalho é sticky. `clip` corta o transbordo sem
criar esse contexto. A proteção real veio da correção de layout: as 64 páginas
foram medidas nos sete viewports e nenhuma transborda.

---

## 12. Rede de segurança da animação de entrada

**Aberto:** as seções entram com `opacity: 0` e só aparecem quando o observador
de interseção as libera. Se esse módulo não rodar, a página fica em branco.

**Decidido:** duas redes. O script inline do `<head>` revela tudo caso o módulo
não tenha assumido em 1,2 s; e o próprio módulo, um segundo depois de montar o
observador, revela o que já está na área visível.

**Por quê:** foi descoberto no QA que o observador não reporta nada enquanto a
aba está em segundo plano — e abrir um link numa aba de fundo é comum. Uma
animação que falha não pode esconder o conteúdo do site.

---

## 13. Copy da home ajustada para não colidir com o gate

**Aberto:** o título do CTA final era "Vamos montar a sua próxima ação?", e
"Próxima ação" é o nome de uma coluna da aba Prospecção, que o gate varre.

**Decidido:** o texto virou "Qual é a sua próxima ocasião?".

**Por quê:** era copy minha, não dado vazado — mas afrouxar o gate por
conveniência ensina a afrouxar gates. Mudar a frase custou nada e o gate
continua rígido.

---

## 14. QA feito com o navegador embutido

**Aberto:** o briefing nomeia a skill `/agent-browser` para os testes.

**Decidido:** os testes de navegador foram executados com as ferramentas de
navegador embutidas nesta sessão, contra o `/dist` servido por
`scripts/serve-dist.mjs`.

**Por quê:** o objetivo é verificação real do build servido, e foi isso que
aconteceu — navegação, busca, filtros, gavetas, teclado, console, rede e medição
nos sete viewports. Fica registrado que a ferramenta usada foi outra.

**Correção importante durante o QA:** a primeira rodada rodou sem querer contra
um servidor de desenvolvimento que já ocupava a porta 4321. Isso foi detectado
pelo tráfego de rede (`@vite/client`), e **todos os testes foram refeitos** com
`serve-dist.mjs`, que serve os bytes do build sem Vite. Os defeitos de layout mais
graves só apareceram nessa segunda rodada.

---

## 15. O vídeo aprovado era um mockup de tela inteira

**Aberto:** o material entregue para o hero traz, desenhados dentro da imagem,
um cabeçalho com menu e botão, e uma faixa de clientes com a palavra "LOGO"
repetida como placeholder.

**Decidido:** aproveitar apenas a faixa de ondas (`crop=1280:480:0:76`).

**Por quê:** usar o quadro inteiro colocaria dois cabeçalhos na tela e
publicaria placeholder — que o próprio briefing proíbe. O briefing veta cortes
*desnecessários*; este é necessário, e é o único ajuste feito. Cor, velocidade,
sentido e textura seguem intactos. Detalhes em `HERO_VIDEO.md`.

---

## 16. Véu de contraste quase inexistente

**Aberto:** quanto escurecer o vídeo atrás do texto.

**Decidido:** um gradiente de 0,28 de opacidade que dissolve antes de 76% da
largura — praticamente invisível.

**Por quê:** medido sobre os pixels reais, o texto branco fica em **14,85:1 mesmo
sem véu**. Não havia problema de leitura para resolver. O véu ficou só como
margem para uma futura versão do vídeo; escurecer a peça aprovada seria piorar
o que já estava aprovado.

---

## 17. Curva de transição refeita em SVG

**Aberto:** a curva azul → branco existe dentro do vídeo.

**Decidido:** tirá-la do recorte e refazê-la em SVG, traçando o limite real do
material original em 33 pontos.

**Por quê:** dentro do vídeo ela seria recortada por `object-fit: cover` numa
altura diferente a cada viewport e deixaria de coincidir com o fim da seção. Em
SVG, cai sempre no pixel exato do limite. A curva é estática no original
(variação ≤ 1 px entre quadros), então nada de movimento se perdeu.

---

## 18. Versão negativa oficial da marca sobre o azul

**Aberto:** o logotipo colorido tem "PREMIARE" no mesmo azul do hero e sumiria.

**Decidido:** usar `PREMIARE.svg`, a versão negativa oficial já existente nos
assets, com o viewBox recortado para a arte.

**Por quê:** o briefing proíbe recolorir a marca por CSS e inventar variante. A
versão adequada existia. O recorte do viewBox não toca a arte — os 19 paths
seguem byte a byte idênticos.

---

## 19. Carrossel sem mudança de velocidade no hover

**Aberto:** o briefing permite ("pode") reduzir a velocidade no hover.

**Decidido:** não implementar.

**Por quê:** alterar `animation-duration` no meio de uma animação em curso faz o
progresso ser reescalado e produz um **salto visível** — exatamente o que o
mesmo briefing proíbe ("sem salto"). Como a redução era opcional e o salto era
proibido, a regra obrigatória venceu.

---

## 20. Códigos de produto retirados do site

**Aberto:** o card do catálogo e a ficha do produto abriam com "Código:
BD-STANLEYPILSNER444ML". A Premiare pediu a remoção completa.

**Decidido:** o SKU saiu de tudo que é público — faixa do card, ficha do produto,
`sku` do JSON-LD, `description` da meta tag, mensagem de orçamento, atributo
`data-haystack` da busca e o texto de apoio do /contato. Ele continua existindo
no dado importado, onde é a chave que liga produto, kit e imagem.

**Por quê:** "por completo" inclui o que não aparece na tela mas sai no HTML.
Um `data-haystack` com o código o entregaria a qualquer um que abrisse o
inspetor, e o `sku` do JSON-LD é lido por buscadores. `Product` sem `sku`
continua válido no schema.org. A busca por código deixou de funcionar — é a
consequência aceita, e o texto do campo passou a dizer o que ele aceita hoje
("Nome, material, ocasião…").

---

## 21. Uma caixa só para o site inteiro, hero incluído

**Aberto:** o hero usava `--container-wide` (1288 px) e todo o resto do site
usava `--container` (1200 px).

**Decidido:** o hero passou para a mesma caixa. `--container-wide` foi removido
por não ter mais uso.

**Por quê:** medido em 1440 px, o título do hero começava em x=101 e o logotipo
logo acima dele em x=137 — 36 px de diferença na primeira coisa que o visitante
vê, com os dois elementos um sobre o outro. Nenhum ganho de respiro compensa
duas linhas verticais concorrentes na abertura.

---

## 22. Altura reservada em vez de linha de base torta

**Aberto:** numa fileira de cards, um rótulo que quebra em duas linhas empurra só
o seu próprio texto e a fileira perde a linha de base comum. Medido: faixas
amarelas em quatro alturas diferentes na mesma fileira do catálogo (até 62 px de
diferença), textos de etapa 20 px fora, itens de kit 15 px fora.

**Decidido:** três correções, nesta ordem de causa: `.card` passou a preencher a
célula da grade (`height: 100%`) — sem isso o `margin: auto` da faixa nunca
tinha folga para empurrar; o selo "Seleção Premiare" saiu do fluxo do texto e
foi para cima da foto; e os rótulos que variam de uma para duas linhas
(categoria do card, público do kit, título da etapa, nome da solução) reservam a
segunda linha. `subgrid` foi considerado e descartado: o `gap` do pai passaria a
valer dentro do card, exigindo remendo maior que o problema.

**Por quê:** o alinhamento de uma fileira é lido de relance; o espaço reservado
sob um rótulo curto, não. Onde a reserva só faz falta em uma faixa de largura,
ela está dentro da media query dessa faixa.

---

## 23. Entrada do hero em CSS, não no observador de rolagem

**Aberto:** título, linha de apoio e botões do hero usavam `data-reveal`, o mesmo
mecanismo das seções que entram na rolagem.

**Decidido:** o hero anima por `@keyframes` em CSS; `data-reveal` ficou só para
o que está abaixo da primeira dobra.

**Por quê:** `data-reveal` nasce com `opacity: 0` e só é liberado quando o módulo
JS roda e o `IntersectionObserver` reporta. O maior elemento da primeira dobra
ficava invisível até lá — e é ele que marca o LCP. Em CSS a animação começa no
primeiro quadro pintado, com JS, sem JS ou com JS lento. O movimento é o mesmo.

---

## 24. Marca do WhatsApp só quando o destino é o WhatsApp

**Aberto:** o botão flutuante mostrava o símbolo do WhatsApp mesmo sem número
configurado, quando o link vai para `/contato`.

**Decidido:** com número, o símbolo do WhatsApp; sem número, um balão de
conversa neutro.

**Por quê:** o símbolo é a promessa de um canal. Exibi-lo apontando para outro
lugar é usar a marca de terceiro para prometer o que o site não entrega.

---

## 25. Servidor de QA sem `video/mp4` nem `Range`

**Aberto:** o vídeo do hero rodava na máquina de desenvolvimento e não rodava ao
abrir o mesmo build de outro aparelho na rede.

**Decidido:** `scripts/serve-dist.mjs` passou a declarar `video/mp4`, a responder
`206 Partial Content` a requisições `Range` e a escutar em `0.0.0.0`, imprimindo
o IP da rede local.

**Por quê:** sem o tipo declarado o arquivo saía como `application/octet-stream`,
que o Safari recusa; e o Safari do iOS só reproduz vídeo se o servidor responder
ao `Range` com 206. Os dois defeitos eram do servidor de teste, não do site —
mas mascaravam o teste em aparelho real, que é onde o problema aparecia.

---

## 26. DDI completado nos números de WhatsApp

**Aberto:** os números chegaram como `wa.me/19995241766`, `wa.me/19982856198` e
`wa.me/11947849925` — sem o código do país.

**Decidido:** publicados como `5519995241766`, `5519982856198` e
`5511947849925`.

**Por quê:** `wa.me` lê o número inteiro como internacional. Sem o 55, o "1"
inicial vira DDI dos Estados Unidos e o link não abre conversa nenhuma. Os DDDs
19 (Campinas) e 11 (São Paulo) são brasileiros e o CNPJ é de São Paulo, então o
55 não é suposição sobre o número — é a leitura correta do formato. Ainda assim,
os três links precisam ser testados uma vez antes do lançamento: é a única
verificação que este projeto não consegue fazer sozinho.

---

## 27. O botão de contato pergunta antes de escolher por você

**Aberto:** a Premiare atende por três números. O padrão do site — um CTA que
abre direto uma conversa — teria que eleger um deles.

**Decidido:** todo botão de contato abre uma janela com os três atendimentos
(Weliton, Rafael e Caio) e os dois e-mails. A mensagem já montada — com produto,
quantidade e descrição, quando existem — é enxertada no canal que a pessoa
escolher.

**Por quê:** eleger um número concentraria a fila num atendente e tiraria a
escolha de quem está comprando. A janela é um `<dialog>` nativo: foco presilhado,
ESC e retorno de foco vêm do navegador, sem código próprio para errar. Sem
JavaScript ela nunca abre e cada botão continua sendo um link real para
`/contato`, onde os mesmos canais estão listados — e o que a pessoa digitou vai
junto na URL.

---

## 28. Endereço cadastrado não é canal de atendimento

**Aberto:** o endereço do CNPJ é "Rua Coronel José Eusébio, 95, Casa 13".

**Decidido:** publicado na identificação do controlador (páginas legais) e nos
dados cadastrais de /quem-somos. **Fora** da lista de canais de /contato.

**Por quê:** ali ele seria lido como convite a aparecer, e "Casa 13" indica
endereço residencial, não loja. Como identificação legal ele é obrigatório e já
é público no cadastro da Receita; como canal, seria informação errada.

Capital social e demais campos do cadastro (situação, natureza jurídica, porte,
data de abertura) não foram publicados: não servem ao visitante, e o valor em
reais dispararia o gate de moeda — que existe para impedir que qualquer preço
apareça neste site.

---

## 29. /quem-somos removida

**Aberto:** a página existia para abrigar história da empresa, números e dados
cadastrais — os três fornecidos pela Premiare.

**Decidido:** página removida a pedido da Premiare, que já trata o institucional
fora deste site. Os dados cadastrais, que eram o único conteúdo real da página,
foram para onde são obrigatórios: rodapé (razão social e CNPJ) e identificação
do controlador nas duas páginas legais.

**Por quê:** duas versões da mesma história em lugares diferentes divergem com o
tempo. Este site é o catálogo; o institucional mora onde a Premiare já o mantém.
A remoção também eliminou dois marcadores PENDENTE-CLIENTE que dependiam de
texto que este projeto não pode escrever.

---

## 30. Política reduzida ao que se aplica, e as duas viraram uma

**Aberto:** as páginas legais estavam publicadas como modelo marcado, com
`noindex` e seis blocos pendentes de redação jurídica — finalidades, bases
legais, direitos do titular, encarregado, datas de vigência.

**Decidido:** a Premiare pediu "somente o obrigatório". A política de cookies foi
absorvida pela de privacidade, que ficou com quatro seções curtas: o que o site
não faz (lista conferível), o que acontece ao falar com a equipe, quem responde
pelo site e o que muda se passar a haver medição. Sem bloco pendente, sem
`noindex`, sem `Disallow` no robots.

**Por quê:** as obrigações da LGPD nascem do **tratamento** de dado pessoal. Este
site não trata nenhum: não há formulário que envie dados, cookie, armazenamento
local, analytics, pixel ou script de terceiro; a busca e os filtros rodam no
navegador e o campo de quantidade só monta a mensagem que a própria pessoa
envia. Sem tratamento, não há finalidade, base legal, prazo de retenção nem
compartilhamento a declarar — declarar mesmo assim seria descrever uma operação
que não existe.

Aviso de cookies também não é obrigatório onde não há cookie, e a página diz
isso em vez de exibir um banner decorativo.

O que a Premiare faz com os dados **depois** que a conversa migra para o WhatsApp
ou o e-mail é operação da empresa, não deste site. A página delimita o escopo e
aponta para lá, em vez de prometer, em nome da empresa, uma política que este
projeto não teria como verificar.

**Condição que invalida tudo isto:** as afirmações valem para os arquivos de
`dist/`. Se a hospedagem injetar analytics ou cookie próprio, elas deixam de ser
verdadeiras e a página precisa mudar no mesmo dia — está no checklist de
pré-lançamento.

---

## 31. `[hidden]` reforçado no reset

**Aberto:** o estado vazio do catálogo ("Nenhum produto com esses filtros") e o
botão "Limpar filtros" apareciam **sempre**, em 10 páginas, com o atributo
`hidden` posto e tudo.

**Decidido:** `[hidden] { display: none !important }` no reset.

**Por quê:** o `[hidden]` do navegador vale `display: none` na folha do agente de
usuário — a especificidade mais fraca que existe. Qualquer `display: grid` ou
`inline-flex` numa classe o derruba, e o elemento reaparece sem que ninguém
perceba, porque o atributo continua lá e o JS acha que escondeu. Já havia três
remendos pontuais espalhados pelo projeto para o mesmo sintoma. Uma regra forte
no reset encerra a categoria inteira e torna os remendos desnecessários.

---

## 32. Folha de impressão

**Aberto:** imprimir ou salvar em PDF saía quase em branco. Medido: 47 dos 48
elementos com entrada de seção continuavam em `opacity: 0` após 3 segundos sem
rolagem, e impressão não rola.

**Decidido:** `@media print` que restaura opacidade e transform, esconde o que
não serve no papel (cabeçalho fixo, botão flutuante, filtros, busca, formulário
de orçamento), evita quebra dentro de cards e fichas, e imprime o endereço dos
links ao lado do texto.

**Por quê:** num catálogo B2B a ficha impressa circula para aprovação interna. Um
PDF em branco não é detalhe de acabamento — é o material comercial falhando na
mão de quem decide.

---

## 33. Entrada de seção reduzida de 48 para 12 elementos

**Aberto:** todo card, item de grade e bloco de coluna carregava `data-reveal` —
ou seja, nascia invisível e dependia do observador de rolagem para aparecer. No
celular, com uma coluna só, isso virava pop-in constante ao longo de 9.000 px.

**Decidido:** `data-reveal` fica **apenas** nas aberturas de seção e nos dois
blocos de chamada da home. Saiu de card de produto, categoria, kit, módulo,
etapa, briefing e solução. A margem do observador virou positiva (20%): libera
antes de o elemento entrar na tela, não depois.

**Por quê:** conteúdo não deve depender de animação para existir. A entrada era
o mesmo efeito repetido dezenas de vezes por página — o oposto de um gesto de
marca. Com 12 ocorrências ela volta a marcar ritmo entre seções, que é o que a
peça original pedia.

---

## 34. Card de produto deitado no celular

**Aberto:** até 560 px a grade tem uma coluna, e o card vertical ocupava ~700 px
de altura — 12 produtos custavam mais de 9.000 px de rolagem só para varrer o
catálogo.

**Decidido:** abaixo de 560 px o card vira grade de duas colunas: foto de 112 px
à esquerda, texto à direita, faixa amarela e link em linhas próprias. O selo
"Seleção Premiare", que no desktop fica sobre a foto, entra no fluxo do texto —
sobre 112 px ele não caberia, e numa coluna só não há fileira para desalinhar.

**Por quê:** quem abre o catálogo no celular está varrendo, não contemplando. A
foto grande é o assunto da ficha do produto, não da lista. O card caiu para
~210 px e a página, de 9.332 para 5.549 px.

---

## 35. Peso 800 no display, três pesos no resto

**Aberto:** o site usava uma família só (Inter) em cinco pesos — 400, 500, 600,
650 e 700. Entre 600 e 650 não há diferença visível, mas são dois tokens. E a
tipografia não dizia nada sobre a marca: entregava o texto e saía.

**Decidido:** quatro tokens (`--weight-body` 400, `--weight-medium` 600,
`--weight-bold` 700, `--weight-display` 800) e nenhum peso literal no código.
`h1` e `h2` sobem para 800 com tracking fechado (−0,035em e −0,03em).

**Por quê:** a família é uma só e não há orçamento nem rede para trazer outra —
mas o Inter aqui é variável (100–900), então o peso 800 já está no arquivo que o
site carrega, sem um byte a mais. A voz de display vem do peso e do espaçamento,
concentrada nos dois tamanhos maiores. Abaixo deles nada muda.

---

## 36. Faixa amarela racionada

**Aberto:** a documentação chama a faixa de "o único ornamento da página".
Contagem real: 14 na home, 7 na ficha de produto, 6 no contato — uma a cada
500 px de rolagem.

**Decidido:** a faixa marca **abertura de seção e de página**, e nada mais. Saiu
dos quatro cards de benefício, dos quatro painéis da ficha de produto, dos
títulos de canal do contato e do aside do FAQ.

**Por quê:** quando um destaque aparece a cada meia tela ele deixa de destacar.
O uso que sobrou é o que carrega significado — ali a faixa diz "começa aqui".

---

## 37. Tipografia do kit da marca: Roboto e Lato

**Aberto:** o site usava Inter — escolha de quem construiu, não da marca. Na
revisão anterior eu havia registrado que a mudança que tiraria o ar de template
seria uma família de display própria, e que eu não conseguiria fazê-la sem o
arquivo da fonte.

**Decidido:** a Premiare forneceu o kit. Aplicado como o próprio kit define:

| Papel | Família | Onde |
|---|---|---|
| Título | Roboto Bold | `h1`, `h2` |
| Subtítulo | Roboto Regular | `.lede` |
| Cabeçalho | Lato Bold | `h3`, `h4`, título de card, registro utilitário |
| Corpo | Lato Regular | todo o resto |

Seis arquivos `.woff2` auto-hospedados em `/public/fonts`, 140 KB no total
(o Inter ocupava 130 KB em dois). Roboto é variável — um arquivo cobre de 100 a
900; Lato é estática e vem em Regular e Bold. Cada família tem um arquivo por
subconjunto (`latin` e `latin-ext`), então o navegador só baixa o segundo quando
a página realmente usa um caractere dele. `preload` apenas nos dois que a
primeira dobra sempre usa: Roboto e Lato Regular.

**Por quê auto-hospedar:** o `sem-cdn-externo` do lint proíbe host de terceiro, e
a razão continua valendo — o site precisa funcionar sem rede externa e não
entrega o IP do visitante ao Google Fonts. Ambas as famílias são livres (Roboto:
Apache 2.0; Lato: SIL OFL 1.1), o que permite servir do próprio domínio.

**Consequência medida:** o Roboto Bold é mais largo que o Inter. "Mais do que
objetos." passou a pedir 474 px onde o `max-width: 15ch` dava 461, e o título do
hero quebrava em três linhas em vez das duas que o `<br>` define. A medida foi
para 18ch.

**Os pesos caíram para dois.** O kit oferece Regular e Bold, e só. Pedir 600 ao
Lato faria o navegador cair no 700 de qualquer jeito, então `--weight-medium` e
`--weight-display` foram absorvidos por `--weight-strong`. O sistema agora diz a
verdade sobre o que a marca tem. Também some o peso 800 que eu havia introduzido
para dar voz ao Inter: com duas famílias, a voz vem do contraste entre elas.

---

## 38. Imagens genéricas para os produtos (02/10/2026)

**Pedido posterior:** remover marcas e logotipos das fotos dos produtos e
pesquisar imagens para os três produtos sem foto. Esta instrução substitui as
decisões 5 e 6 sobre manter imagens com marcas ou deixar placeholders.

**Decidido:** editar as dez fotos oficiais que mostravam marcas de terceiros;
pesquisar pelo SKU exato os três itens restantes e publicar versões editadas,
sem logotipos nem legendas. O pipeline prioriza essas 13 fontes locais para
evitar que uma reimportação restaure imagens antigas. Origem, prompts e limites
de direitos estão em `IMAGE_UPDATES_2026-10-02.md`.
