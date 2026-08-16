import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { getPairing, submitPairing } from "../cloud-pairing";
import { createContext } from "./context";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.get("/connect", (req, res) => {
    const token = String(req.query.token || "").toUpperCase();
    const session = token ? getPairing(token) : undefined;
    if (!session) return res.status(404).send("Token expirado ou inválido.");
    res.type("html").send(`<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Configurar Cineclub TV</title><style>body{font-family:system-ui;background:#07191f;color:#f5ebdd;margin:0;padding:24px}main{max-width:520px;margin:auto;background:#102b33;border:1px solid #31535a;border-radius:16px;padding:24px}h1{margin-top:0}label{display:block;margin:16px 0 6px;color:#d8a59a;font-weight:700}input{box-sizing:border-box;width:100%;padding:13px;border-radius:8px;border:1px solid #4c6b6d;background:#07191f;color:#f5ebdd;font-size:16px}button{margin-top:22px;width:100%;padding:14px;border:0;border-radius:8px;background:#d86c5c;color:#07191f;font-weight:800;font-size:16px}.muted{color:#b6c9c4;line-height:1.5}.ok{margin-top:16px;color:#9fe3b1}</style></head><body><main><h1>Configurar Nuvem</h1><p class="muted">Token temporário: <b>${token}</b>. As credenciais são enviadas por HTTPS e não ficam no QR Code.</p><form id="form"><label>URL completa da playlist M3U</label><input name="m3uUrl" type="url" placeholder="https://exemplo.com/playlist.m3u"><p class="muted">Ou use os dados separados:</p><label>Servidor/URL</label><input name="server" placeholder="https://exemplo.com:8080"><label>Usuário</label><input name="username"><label>Senha</label><input name="password" type="password"><label>Tipo/formato</label><input name="format" value="m3u_plus"><button>Adicionar lista</button><div id="status"></div></form></main><script>const form=document.querySelector('#form');const status=document.querySelector('#status');form.addEventListener('submit',async(e)=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));status.textContent='Enviando…';const r=await fetch('/api/cloud/pair',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:'${token}',...data})});status.className=r.ok?'ok':'';status.textContent=r.ok?'Lista enviada para a TV. Você pode fechar esta página.':'Não foi possível enviar. Confira o token e os dados.'});</script></body></html>`);
  });

  app.post("/api/cloud/pair", (req, res) => {
    try {
      const { token, m3uUrl, server, username, password, format } = req.body || {};
      let resolvedUrl = typeof m3uUrl === "string" && m3uUrl.trim() ? m3uUrl.trim() : undefined;
      if (!resolvedUrl && typeof server === "string" && server.trim()) {
        const base = server.trim().replace(/\/$/, "");
        const url = new URL(base.includes("://") ? base : `http://${base}`);
        url.pathname = url.pathname === "/" ? "/get.php" : url.pathname;
        url.search = new URLSearchParams({ username: String(username || ""), password: String(password || ""), type: String(format || "m3u_plus") }).toString();
        resolvedUrl = url.toString();
      }
      if (!token || !resolvedUrl) return res.status(400).json({ error: "M3U_SOURCE_REQUIRED" });
      submitPairing({ token: String(token), m3uUrl: resolvedUrl, server, username, password, format });
      return res.json({ success: true });
    } catch {
      return res.status(400).json({ error: "PAIRING_EXPIRED" });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
