/**
 * Perguntas frequentes.
 *
 * Nenhuma resposta promete prazo, disponibilidade ou condicao comercial: todas
 * remetem a confirmacao no atendimento, que e o que de fato acontece. Este
 * arquivo e a unica fonte — a home e a pagina de FAQ leem daqui, e o JSON-LD
 * so descreve o que esta visivel na pagina.
 */
export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "Como solicito um orçamento?",
    a: "Escolha um produto ou uma solução e use o botão de orçamento. Você pode informar a quantidade estimada para adiantar a conversa. Também é possível falar direto com a equipe pela página de contato.",
  },
  {
    q: "Existe quantidade mínima?",
    a: "Sim, e ela varia por produto. Quando a quantidade mínima está confirmada, aparece na ficha do produto e no card do catálogo. Se não estiver indicada, a equipe confirma no atendimento.",
  },
  {
    q: "Posso montar um kit com itens diferentes?",
    a: "Pode. As soluções por ocasião são pontos de partida: os itens podem ser trocados, retirados ou combinados com produtos de outras categorias.",
  },
  {
    q: "Quais informações devo enviar?",
    a: "Ocasião, público, quantidade estimada, prazo desejado e os arquivos da marca. Quanto mais claro o objetivo, mais precisa fica a proposta.",
  },
  {
    q: "Como a marca é aplicada nos produtos?",
    a: "Depende do produto e do material. Quando a técnica de personalização está confirmada, ela aparece na ficha técnica. Nos demais casos, a equipe analisa o item e indica o que é possível.",
  },
  {
    q: "As cores e as técnicas mostradas são garantidas?",
    a: "Cores e técnicas são confirmadas no atendimento, produto a produto. O site publica apenas o que está confirmado na ficha de cada item.",
  },
  {
    q: "Os produtos estão sempre disponíveis?",
    a: "A disponibilidade é confirmada a cada projeto, no atendimento. Este site apresenta o portfólio, não o estoque.",
  },
  {
    q: "O site mostra preços?",
    a: "Não. Valores dependem de quantidade, personalização e composição, e por isso são informados por orçamento, no atendimento.",
  },
  {
    q: "Em quanto tempo o pedido fica pronto?",
    a: "O prazo depende do produto, da técnica de personalização e da quantidade. Quando um prazo está publicado na ficha do produto, ele aparece lá; nos demais casos, a equipe informa no atendimento.",
  },
];
