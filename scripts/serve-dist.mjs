/**
 * Servidor estatico minimo para /dist.
 *
 * Serve exatamente os bytes do build, sem Vite, sem HMR e sem transformacao —
 * do jeito mais proximo possivel de como a Wix vai servir o site. E o alvo
 * correto para o QA: testar o dev server testaria outra coisa.
 *
 * Uso: node scripts/serve-dist.mjs [porta]
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const PORT = Number(process.argv[2] ?? 4399);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const rel = clean.replace(/^\/+/, "");
  const candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel, "index.html"),
    path.join(DIST, `${rel}.html`),
  ];
  for (const candidate of candidates) {
    if (!candidate.startsWith(DIST)) continue; // sem escapar da pasta
    try {
      const s = await stat(candidate);
      if (s.isFile()) return candidate;
    } catch {
      /* segue para o proximo candidato */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const file = (await resolveFile(req.url ?? "/")) ?? null;
  if (!file) {
    const notFound = await resolveFile("/404");
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    if (notFound) return createReadStream(notFound).pipe(res);
    return res.end("404");
  }
  const type = TYPES[path.extname(file)] ?? "application/octet-stream";
  const { size } = await stat(file);

  // Safari (principalmente iOS) so reproduz video se o servidor responder
  // a um Range request com 206 e o pedaco pedido. Sem isso o video fica
  // mudo/parado nesses navegadores mesmo com o Content-Type certo.
  const range = req.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    const start = match?.[1] ? Number(match[1]) : 0;
    const end = match?.[2] ? Number(match[2]) : size - 1;
    if (match && start <= end && end < size) {
      res.writeHead(206, {
        "Content-Type": type,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Cache-Control": "no-store",
      });
      createReadStream(file, { start, end }).pipe(res);
      return;
    }
  }

  res.writeHead(200, {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Content-Length": size,
    "Cache-Control": "no-store",
  });
  createReadStream(file).pipe(res);
}).listen(PORT, "0.0.0.0", () => {
  const lanIps = Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    .map((i) => i.address);

  console.log(`dist servido em http://localhost:${PORT}`);
  for (const ip of lanIps) {
    console.log(`  tambem em http://${ip}:${PORT} (para testar em outro dispositivo na mesma rede)`);
  }
});
