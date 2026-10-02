import { defineConfig } from "astro/config";

/**
 * O dominio final ainda nao foi informado pela Premiare. Ate que seja, o build
 * usa um host reservado (.invalid, RFC 2606) — obviamente um marcador, nunca um
 * dominio adivinhado. Para gerar o build definitivo:
 *   SITE_URL=https://www.dominio-da-premiare.com.br npm run build
 */
const SITE_URL = process.env.SITE_URL || "https://dominio-a-definir.invalid";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "ignore",
  build: { format: "directory", inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
  compressHTML: true,
});
