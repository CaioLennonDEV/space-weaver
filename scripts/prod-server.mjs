import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { Readable } from "node:stream";

const PORT = Number(process.env.PORT || process.env.NITRO_PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const CLIENT_DIR = join(process.cwd(), "dist", "client");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

async function loadFetchHandler() {
  const candidates = [
    join(process.cwd(), ".output", "server", "index.mjs"),
    join(process.cwd(), "dist", "server", "server.js"),
    join(process.cwd(), "dist", "server", "index.js"),
  ];

  for (const file of candidates) {
    if (!existsSync(file)) continue;

    // Nitro node-server já sobe o HTTP sozinho
    if (file.replace(/\\/g, "/").includes(".output/server/")) {
      await import(pathToFileURL(file).href);
      return null;
    }

    const mod = await import(pathToFileURL(file).href);
    const handler = mod.default ?? mod;
    if (typeof handler?.fetch === "function") return handler;
    if (typeof handler === "function") return { fetch: handler };
  }

  throw new Error(
    "Nenhuma entry de servidor encontrada (.output/server ou dist/server). Rode npm run build.",
  );
}

async function tryStatic(urlPath, res) {
  const clean = decodeURIComponent(urlPath.split("?")[0] || "/");
  if (clean.includes("..")) return false;

  const filePath = join(CLIENT_DIR, clean === "/" ? "index.html" : clean);
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return false;
    res.statusCode = 200;
    res.setHeader("Content-Type", MIME[extname(filePath)] || "application/octet-stream");
    createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const handler = await loadFetchHandler();

if (!handler) {
  // Nitro node-server já está escutando
} else {
  createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

      if (req.method === "GET" || req.method === "HEAD") {
        const served = await tryStatic(url.pathname, res);
        if (served) return;
      }

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
        else headers.set(key, value);
      }

      const body =
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : Readable.toWeb(req);

      const request = new Request(url, {
        method: req.method,
        headers,
        body,
        duplex: "half",
      });

      const response = await handler.fetch(request, {}, {});
      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "transfer-encoding") return;
        res.setHeader(key, value);
      });

      if (!response.body) {
        res.end();
        return;
      }

      Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Internal Server Error");
    }
  }).listen(PORT, HOST, () => {
    console.log(`Space Weaver listening on http://${HOST}:${PORT}`);
  });
}
