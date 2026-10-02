/**
 * Marcas atendidas pela Premiare.
 *
 * PROVENIENCIA: todos estes logotipos foram publicados pela propria Premiare
 * Criativa na secao "Atendemos quem exige o melhor" do site oficial
 * (www.premiarecriativa.com.br), consultado em 01/09/2026. Nenhum cliente foi
 * inventado, nenhum logotipo foi gerado e nao ha placeholder nesta lista.
 *
 * Os arquivos foram normalizados pela CAIXA VISUAL — aparados e reamostrados
 * para uma altura otica comum, sempre com a proporcao original preservada.
 * Nenhum foi esticado, cortado no conteudo ou recolorido.
 *
 * Ordem: alternada de propostito, para que marcas de larguras parecidas nao
 * fiquem vizinhas e o ritmo do carrossel nao pareche irregular.
 */
export type Client = {
  slug: string;
  name: string;
  /** Dimensoes intrinsecas do arquivo, para reservar espaco e evitar CLS. */
  width: number;
  height: number;
  /**
   * Altura de exibicao calculada para AREA aparente parecida entre as marcas.
   * Altura unica penalizaria logotipos estreitos e altos, que ficariam
   * visualmente menores que os deitados. Formula: base x raiz(refAspect/aspect),
   * limitada entre 26 e 54 px. Nenhum logotipo e esticado: a largura segue a
   * proporcao original.
   */
  opticalHeight: number;
};

export const clients: Client[] = [
  { slug: "xp-inc", name: "XP Inc.", width: 298, height: 63, opticalHeight: 30 },
  { slug: "safra", name: "Safra", width: 300, height: 88, opticalHeight: 35 },
  { slug: "mrv", name: "MRV", width: 300, height: 84, opticalHeight: 35 },
  { slug: "lobo-de-rizzo", name: "Lobo de Rizzo", width: 300, height: 58, opticalHeight: 29 },
  { slug: "metagal", name: "Metagal", width: 207, height: 96, opticalHeight: 45 },
  { slug: "gef-capital-partners", name: "GEF Capital Partners", width: 298, height: 66, opticalHeight: 31 },
  { slug: "criteria-investimentos", name: "Criteria Investimentos", width: 300, height: 89, opticalHeight: 36 },
  { slug: "patagonia-capital", name: "Patagônia Capital", width: 182, height: 96, opticalHeight: 47 },
  { slug: "coelho-advogados", name: "Coelho Advogados", width: 293, height: 96, opticalHeight: 37 },
  { slug: "archx-capital", name: "ARCHX Capital", width: 299, height: 91, opticalHeight: 36 },
  { slug: "gen-t", name: "gen-t", width: 268, height: 96, opticalHeight: 39 },
  { slug: "big-invest", name: "big Invest", width: 299, height: 81, opticalHeight: 34 },
  { slug: "otcon", name: "OTCON", width: 75, height: 96, opticalHeight: 54 },
  { slug: "vasksport", name: "VASKsport", width: 299, height: 55, opticalHeight: 28 },
];

/** Rotulo do carrossel. Mesma redacao usada na peca aprovada do hero. */
export const CLIENTS_LABEL = "Empresas que confiam na Premiare";
