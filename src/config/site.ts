/**
 * Configuracao unica do site. Nenhum componente repete numero, e-mail ou
 * endereco: tudo sai daqui.
 *
 * Campos vazios sao PENDENTE-CLIENTE. Nada aqui pode ser preenchido por
 * suposicao — um telefone inventado e pior do que um campo vazio. Enquanto o
 * WhatsApp estiver vazio, todos os CTAs apontam para /contato.
 */
export const siteConfig = {
  name: "Premiare Criativa",
  tagline: "Reconhecimento que gera valor.",

  /**
   * Quem atende, na ordem em que aparece na escolha de canal. O PRIMEIRO e o
   * principal: e o numero que o rodape mostra e o que responde quando so cabe
   * um.
   *
   * `whatsapp` e so digitos, com DDI. Os numeros chegaram como
   * "wa.me/19995241766", sem o 55 — assim o WhatsApp leria o 1 inicial como DDI
   * dos Estados Unidos e o link nao abriria conversa nenhuma. Os DDDs 19 e 11
   * sao brasileiros, entao o DDI foi completado aqui.
   */
  attendants: [
    { name: "Weliton", whatsapp: "5519995241766" },
    { name: "Rafael", whatsapp: "5519982856198" },
    { name: "Caio", whatsapp: "5511947849925" },
  ],

  /** O primeiro e o principal, pelo mesmo motivo. */
  emails: [
    "atendimento@premiarecriativa.com.br",
    "atendimento2@premiarecriativa.com.br",
  ],

  phone: "",

  /**
   * Dados cadastrais, para o rodape e as paginas legais. O endereco e o
   * ENDERECO CADASTRADO no CNPJ — nao e loja nem ponto de atendimento, e por
   * isso nao entra na lista de canais da pagina de contato.
   */
  legalName: "Premiare Criativa e Publicidade LTDA",
  cnpj: "57.528.562/0001-20",
  address:
    "Rua Coronel José Eusébio, 95, Casa 13 — Higienópolis, São Paulo/SP, CEP 01239-030",

  instagram: "",
  linkedin: "",
  siteUrl: "",
} as const;

/** Atendimento principal — o que aparece quando so cabe um. */
export const primaryAttendant = siteConfig.attendants[0];
export const whatsappNumber: string = primaryAttendant?.whatsapp ?? "";
export const hasWhatsApp = whatsappNumber.trim().length > 0;

/** E-mail que responde aos CTAs de e-mail. */
export const primaryEmail: string = siteConfig.emails[0] ?? "";
export const hasEmail = primaryEmail.trim().length > 0;

/** Rotulo curto da acao de contato, usado em todo botao de orcamento. */
export const CONTACT_LABEL = "Falar com um especialista";

/** Monta o link de um numero especifico. Todo `wa.me` do site sai daqui. */
export function whatsappLink(digits: string, message?: string): string {
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Monta o link de contato principal. Sem numero configurado, nao se inventa
 * numero nem se gera URL quebrada: o visitante vai para a pagina de contato.
 */
export function contactLink(message?: string): string {
  if (!hasWhatsApp) return "/contato";
  return whatsappLink(whatsappNumber, message);
}

export function mailtoLink(address: string, subject?: string): string {
  return subject
    ? `mailto:${address}?subject=${encodeURIComponent(subject)}`
    : `mailto:${address}`;
}

/** "5519995241766" -> "(19) 99524-1766". Fora do padrao, devolve como veio. */
export function formatWhatsApp(digits: string): string {
  const parts = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return parts ? `(${parts[1]}) ${parts[2]}-${parts[3]}` : digits;
}

export function generalMessage(): string {
  return "Olá! Vim pelo site da Premiare Criativa e gostaria de falar com um especialista.";
}

/**
 * Eventos definidos para uso futuro. Nenhum analytics e instalado e nada e
 * disparado: sem ferramenta configurada e sem consentimento, nao ha coleta.
 */
export const analyticsEvents = [
  "whatsapp_header_click",
  "whatsapp_hero_click",
  "whatsapp_product_click",
  "whatsapp_kit_click",
  "whatsapp_footer_click",
] as const;
