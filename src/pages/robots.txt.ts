import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://dominio-a-definir.invalid");
  /**
   * Nada bloqueado. A pagina de privacidade saiu do Disallow quando deixou de
   * ser modelo em preenchimento: agora ela esta completa para o que promete e
   * pode ser lida por qualquer um, inclusive por buscador.
   */
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap.xml", base).href}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
