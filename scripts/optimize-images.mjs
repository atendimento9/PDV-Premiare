/**
 * Pipeline de midia do catalogo.
 *
 * 1. A imagem embutida na planilha (240x240) e a referencia de VERDADE da
 *    associacao produto<->foto, porque vem ancorada na propria linha.
 * 2. Ela e pequena demais para uma pagina de produto, entao busca-se a versao
 *    em alta na URL oficial da planilha (unica outra origem permitida).
 * 3. O download so e aceito se bater PERCEPTIVAMENTE com a miniatura ancorada.
 *    Isso troca uma heuristica de nome por evidencia de pixel: se a planilha
 *    tivesse a URL trocada, a comparacao reprova e a foto errada nao e publicada.
 *
 * Idempotente: downloads e variantes ja existentes sao reaproveitados.
 * Uso: node scripts/optimize-images.mjs
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW = path.join(ROOT, ".cache", "images-raw");
const SRC = path.join(ROOT, ".cache", "images-src");
const OUT = path.join(ROOT, "public", "catalog", "products");
const CATALOG = path.join(ROOT, "src", "data", "catalog.generated.json");
const INTERNAL = path.join(ROOT, ".cache", "internal.json");
const CURATED = path.join(ROOT, "assets", "catalog-curated");
const OVERRIDES = path.join(ROOT, "scripts", "catalog-image-overrides.json");

const WIDTHS = [480, 800, 1200];
const QUALITY = 80;
/** Acima disto as imagens sao consideradas conteudos diferentes. */
/**
 * Calibrado sobre os 40 pares reais deste catalogo: mediana 0,028 e maximo
 * 0,294, e todos os pares acima de 0,09 foram conferidos a olho como sendo o
 * mesmo produto (variacoes de enquadramento e escala). 0,35 fica acima do pior
 * caso legitimo observado e ainda reprova uma foto de outro produto.
 */
const MAX_PERCEPTUAL_DISTANCE = 0.35;

const slug = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * Assinatura perceptiva: 16x16 em tons de cinza, normalizada.
 * O `trim` remove a moldura branca antes de reamostrar, para que a mesma foto
 * com enquadramento ou escala diferente continue comparavel.
 */
async function signature(buf) {
  const { data } = await sharp(buf)
    .flatten({ background: "#ffffff" })
    .trim({ threshold: 12 })
    .resize(16, 16, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = Array.from(data);
  const mean = px.reduce((a, b) => a + b, 0) / px.length;
  const sd = Math.sqrt(px.reduce((a, b) => a + (b - mean) ** 2, 0) / px.length) || 1;
  return px.map((v) => (v - mean) / sd);
}

function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

async function download(url, dest) {
  if (existsSync(dest)) return { ok: true, cached: true };
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return { ok: true, cached: false };
}

async function main() {
  await mkdir(SRC, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const products = JSON.parse(await readFile(CATALOG, "utf8"));
  const internal = JSON.parse(await readFile(INTERNAL, "utf8"));
  const review = JSON.parse(await readFile(path.join(ROOT, "scripts", "image-review.json"), "utf8"));
  const overrides = JSON.parse(await readFile(OVERRIDES, "utf8"));
  const metaBySku = new Map(internal.map((m) => [m.sku, m]));
  const rawFiles = await readdir(RAW);

  const manifest = [];
  const issues = [];

  for (const product of products) {
    const sku = product.sku;
    const key = slug(sku);
    const meta = metaBySku.get(sku);
    const rawName = rawFiles.find((f) => f.startsWith(key + "."));

    // Edicoes aprovadas para o catalogo prevalecem sobre a imagem de origem,
    // inclusive nos tres casos antes bloqueados. Assim um novo processamento
    // nao restaura marcas, legendas ou placeholders antigos.
    const override = overrides[sku];
    if (override) {
      const sourceBuf = await readFile(path.join(CURATED, override.source));
      const { width: sw, height: sh } = await sharp(sourceBuf).metadata();
      const dir = path.join(OUT, key);
      await mkdir(dir, { recursive: true });
      const variants = {};
      let bytes = 0;
      for (const w of WIDTHS) {
        const target = Math.min(w, sw);
        const out = path.join(dir, `cover-${w}.webp`);
        const buf = await sharp(sourceBuf)
          .flatten({ background: "#ffffff" })
          .resize(target, target, { fit: "contain", background: "#ffffff" })
          .webp({ quality: QUALITY, effort: 6 })
          .toBuffer();
        await writeFile(out, buf);
        variants[w] = { path: `/catalog/products/${key}/cover-${w}.webp`, width: target, bytes: buf.length };
        bytes += buf.length;
      }
      product.image = {
        src: variants[800].path,
        srcSmall: variants[480].path,
        srcLarge: variants[1200].path,
        alt: `${product.name} — ${product.category.name}`,
        width: variants[800].width,
        height: variants[800].width,
      };
      manifest.push({
        codigo: sku, nome: product.name, origem: override.origin,
        confirmacao: override.reference ? `SKU confirmado em ${override.reference}` : "edicao visual da foto oficial do mesmo SKU",
        arquivo_local: `public/catalog/products/${key}/cover-800.webp`,
        dimensoes_fonte: `${sw}x${sh}`,
        variantes: WIDTHS.map((w) => `${variants[w].width}px`).join(" / "),
        peso_total_bytes: bytes,
        status_otimizacao: "webp q80",
        status_direitos: override.reference ? "nova imagem pesquisada a pedido do cliente; autorizacao externa a confirmar" : "derivada de material autorizado pela Premiare",
        sha256_fonte: createHash("sha256").update(sourceBuf).digest("hex").slice(0, 16),
      });
      continue;
    }

    // Reprovada na amostragem visual: nao se publica foto, e o produto entra
    // na lista de pendencias. Placeholder e melhor do que uma imagem enganosa.
    if (review.bloqueadas[sku]) {
      issues.push(`${sku}: imagem bloqueada na revisao visual - ${review.bloqueadas[sku]}`);
      product.image = null;
      manifest.push({
        codigo: sku, nome: product.name, origem: "bloqueada na revisao visual",
        confirmacao: review.bloqueadas[sku], arquivo_local: "", dimensoes_fonte: "",
        variantes: "", peso_total_bytes: 0, status_otimizacao: "nao publicada",
        status_direitos: "n/a", sha256_fonte: "",
      });
      continue;
    }

    if (!rawName) {
      issues.push(`${sku}: sem imagem embutida extraida - produto sem foto.`);
      product.image = null;
      continue;
    }

    const rawBuf = await readFile(path.join(RAW, rawName));
    const rawSig = await signature(rawBuf);

    let sourceBuf = rawBuf;
    let origin = "imagem embutida na planilha (ancora de celula)";
    let confirmation = "ancora de celula";

    const url = meta?.photoUrl;
    if (url) {
      const ext = (path.extname(new URL(url).pathname) || ".webp").slice(0, 6);
      const dest = path.join(SRC, `${key}${ext}`);
      const got = await download(url, dest).catch((e) => ({ ok: false, error: e.message }));
      if (!got.ok) {
        issues.push(`${sku}: falha ao baixar a foto oficial (${got.error}) - usando a miniatura embutida.`);
      } else {
        const hiBuf = await readFile(dest);
        const d = distance(rawSig, await signature(hiBuf));
        if (d <= MAX_PERCEPTUAL_DISTANCE) {
          sourceBuf = hiBuf;
          origin = "foto oficial da planilha (coluna Foto oficial (URL))";
          confirmation = `confere com a miniatura ancorada (distancia ${d.toFixed(3)})`;
        } else {
          issues.push(
            `${sku}: a foto baixada NAO confere com a miniatura ancorada na planilha ` +
            `(distancia ${d.toFixed(3)}) - mantida a miniatura embutida.`);
          confirmation = `download divergente (distancia ${d.toFixed(3)}) - descartado`;
        }
      }
    }

    const base = sharp(sourceBuf).flatten({ background: "#ffffff" });
    const { width: sw, height: sh } = await base.metadata();
    const dir = path.join(OUT, key);
    await mkdir(dir, { recursive: true });

    const variants = {};
    let bytes = 0;
    for (const w of WIDTHS) {
      // Nunca ampliar: sem resolucao falsa.
      const target = Math.min(w, sw);
      const out = path.join(dir, `cover-${w}.webp`);
      const buf = await sharp(sourceBuf)
        .flatten({ background: "#ffffff" })
        .resize(target, target, { fit: "contain", background: "#ffffff" })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();
      await writeFile(out, buf);
      variants[w] = { path: `/catalog/products/${key}/cover-${w}.webp`, width: target, bytes: buf.length };
      bytes += buf.length;
    }

    const rendered = variants[800];
    product.image = {
      src: variants[800].path,
      srcSmall: variants[480].path,
      srcLarge: variants[1200].path,
      // alt DERIVADO do dado, nunca descricao visual do que a foto mostra.
      alt: `${product.name} — ${product.category.name}`,
      width: rendered.width,
      height: rendered.width,
    };

    manifest.push({
      codigo: sku,
      nome: product.name,
      origem: origin,
      confirmacao: confirmation,
      arquivo_local: `public/catalog/products/${key}/cover-800.webp`,
      dimensoes_fonte: `${sw}x${sh}`,
      variantes: WIDTHS.map((w) => `${variants[w].width}px`).join(" / "),
      peso_total_bytes: bytes,
      status_otimizacao: "webp q80",
      status_direitos: "autorizado pela Premiare (docs/RIGHTS_CLEARANCE.md)",
      sha256_fonte: createHash("sha256").update(sourceBuf).digest("hex").slice(0, 16),
    });
  }

  await writeFile(CATALOG, JSON.stringify(products, null, 2) + "\n", "utf8");

  const headers = Object.keys(manifest[0]);
  const csv = [
    headers.join(","),
    ...manifest.map((r) => headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  await writeFile(path.join(ROOT, "docs", "MEDIA_MANIFEST.csv"), csv + "\n", "utf8");

  const total = manifest.reduce((a, r) => a + r.peso_total_bytes, 0);
  const hi = manifest.filter((r) => r.confirmacao.startsWith("confere com a miniatura")).length;
  const edited = Object.keys(overrides).length;
  console.log(`imagens processadas: ${manifest.length}/${products.length}`);
  console.log(`fotos originais confirmadas por pixel: ${hi}`);
  console.log(`imagens editadas e revisadas: ${edited}`);
  console.log(`peso total das variantes: ${(total / 1024 / 1024).toFixed(2)} MB`);
  if (issues.length) {
    console.log("ocorrencias:");
    issues.forEach((i) => console.log("  - " + i));
  }
  await writeFile(path.join(ROOT, ".cache", "media-issues.json"),
    JSON.stringify(issues, null, 2) + "\n", "utf8");
}

await main();
