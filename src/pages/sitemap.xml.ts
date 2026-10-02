import type { APIRoute } from "astro";
import { categories, kits, products } from "../lib/catalog";

/**
 * Sitemap montado a partir das rotas que existem de fato. Nenhuma URL de
 * terceiro entra aqui.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://dominio-a-definir.invalid");
  const abs = (path: string) => new URL(path, base).href;

  const routes: Array<{ path: string; priority: string }> = [
    { path: "/", priority: "1.0" },
    { path: "/catalogo", priority: "0.9" },
    { path: "/solucoes", priority: "0.8" },
    { path: "/projetos-personalizados", priority: "0.7" },
    { path: "/perguntas-frequentes", priority: "0.6" },
    { path: "/contato", priority: "0.7" },
    { path: "/politica-de-privacidade", priority: "0.3" },
    ...categories.map((c) => ({ path: `/categoria/${c.slug}`, priority: "0.8" })),
    ...kits.map((k) => ({ path: `/solucoes/${k.slug}`, priority: "0.7" })),
    ...products.map((p) => ({ path: `/produto/${p.slug}`, priority: "0.7" })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${abs(r.path)}</loc>\n    <priority>${r.priority}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
