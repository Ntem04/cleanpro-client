import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function getMimeType(filePath: string): string | undefined {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext];
}

// En-têtes HTTP de sécurité stricts (OWASP Top 10 & ANSSI) délivrés par le serveur HTTP
const HTTP_SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' http://localhost:5000 ws://localhost:5173 http://localhost:5173 https://*.ngrok-free.app wss://*.ngrok-free.app https://*.ngrok.io wss://*.ngrok.io https://*.ngrok.app wss://*.ngrok.app https://*.ngrok-free.dev wss://*.ngrok-free.dev",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

/**
 * Plugin de compression automatique Gzip & Brotli au build
 * et distribution ultra-rapide des fichiers compressés sous Vite Preview / ngrok.
 */
function cleanproCompression(): Plugin {
  const threshold = 1024;
  const exts = [".js", ".css", ".html", ".svg", ".json"];

  return {
    name: "cleanpro-compression",
    // 1. Compression au build
    closeBundle: {
      sequential: true,
      order: "post",
      async handler() {
        const distDir = path.resolve(process.cwd(), "dist");
        if (!fs.existsSync(distDir)) return;

        let totalOriginal = 0;
        let totalGzip = 0;
        let totalBrotli = 0;
        let count = 0;

        function processDir(dir: string) {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              processDir(fullPath);
            } else if (entry.isFile()) {
              const ext = path.extname(entry.name).toLowerCase();
              if (
                exts.includes(ext) &&
                !entry.name.endsWith(".gz") &&
                !entry.name.endsWith(".br")
              ) {
                const stat = fs.statSync(fullPath);
                if (stat.size >= threshold) {
                  const content = fs.readFileSync(fullPath);

                  // Gzip (Niveau 9 maximal avec memLevel 9)
                  const gzipped = zlib.gzipSync(content, {
                    level: 9,
                    memLevel: 9,
                  });
                  fs.writeFileSync(`${fullPath}.gz`, gzipped);

                  // Brotli (Qualité maximale 11, mode texte optimisé et size hint)
                  const brotlied = zlib.brotliCompressSync(content, {
                    params: {
                      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: stat.size,
                    },
                  });
                  fs.writeFileSync(`${fullPath}.br`, brotlied);

                  totalOriginal += stat.size;
                  totalGzip += gzipped.length;
                  totalBrotli += brotlied.length;
                  count++;
                }
              }
            }
          }
        }

        processDir(distDir);

        if (count > 0) {
          const gzipSavings = Math.round(
            (1 - totalGzip / totalOriginal) * 100
          );
          const brSavings = Math.round(
            (1 - totalBrotli / totalOriginal) * 100
          );
          console.log(
            `\n⚡ [CleanPro Optimisation ngrok] ${count} fichiers compressés avec succès :`
          );
          console.log(
            `   • Poids brut    : ${(totalOriginal / 1024).toFixed(1)} kB`
          );
          console.log(
            `   • Gzip (.gz)    : ${(totalGzip / 1024).toFixed(1)} kB (-${gzipSavings}%)`
          );
          console.log(
            `   • Brotli (.br)  : ${(totalBrotli / 1024).toFixed(1)} kB (-${brSavings}%)\n`
          );
        }
      },
    },

    // 2. Middleware pour servir les fichiers pré-compressés avec cache et en-têtes de sécurité
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url?.split("?")[0] || "/";
        const isSpaRoute = !path.extname(rawUrl) && !rawUrl.startsWith("/api");
        const effectiveFile = isSpaRoute ? "/index.html" : (rawUrl === "/" ? "/index.html" : rawUrl);

        // Injection des en-têtes HTTP de sécurité
        for (const [header, val] of Object.entries(HTTP_SECURITY_HEADERS)) {
          res.setHeader(header, val);
        }

        // Entêtes de mise en cache agressive pour les assets hachés
        if (effectiveFile.startsWith("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }

        const acceptEncoding = (req.headers["accept-encoding"] as string) || "";
        const distDir = path.resolve(process.cwd(), "dist");
        const filePath = path.join(distDir, effectiveFile.replace(/^\//, ""));

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const contentType = getMimeType(filePath);

          // 1. Brotli prioritaire si supporté par le navigateur
          if (acceptEncoding.includes("br") && fs.existsSync(`${filePath}.br`)) {
            res.setHeader("Content-Encoding", "br");
            res.setHeader("Vary", "Accept-Encoding");
            if (contentType) res.setHeader("Content-Type", contentType);
            fs.createReadStream(`${filePath}.br`).pipe(res);
            return;
          }

          // 2. Gzip en repli si Brotli n'est pas supporté
          if (
            acceptEncoding.includes("gzip") &&
            fs.existsSync(`${filePath}.gz`)
          ) {
            res.setHeader("Content-Encoding", "gzip");
            res.setHeader("Vary", "Accept-Encoding");
            if (contentType) res.setHeader("Content-Type", contentType);
            fs.createReadStream(`${filePath}.gz`).pipe(res);
            return;
          }
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Plugin de compression Gzip & Brotli + middleware de cache ngrok
    cleanproCompression(),
  ],

    resolve: {
      dedupe: [
        "react",
        "react-dom",
        "react-router-dom",
        "use-sync-external-store",
      ],
    },

    // Configuration Serveur Dev avec support complet ngrok
    // ⚠️ Vite est un outil de développement et ne doit JAMAIS servir de serveur de production.
    server: {
      host: process.env.VITE_DEV_HOST || "0.0.0.0", // Écoute réseau ouverte pour autoriser le tunnel ngrok
      port: 5173,
      strictPort: true,
      // Protection anti DNS Rebinding & Support étendu des domaines de tunnels ngrok
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        ".ngrok-free.app",
        ".ngrok.io",
        ".ngrok.app",
        ".ngrok-free.dev",
      ],
      // Proxy inverse automatique : achemine les appels /api vers le backend CleanPro sans CORS
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
      cors: false,
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    },

    // Configuration Serveur Preview avec support ngrok et en-têtes HTTP de sécurité
    preview: {
      host: process.env.VITE_PREVIEW_HOST || "0.0.0.0",
      port: 5173,
      strictPort: true,
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        ".ngrok-free.app",
        ".ngrok.io",
        ".ngrok.app",
        ".ngrok-free.dev",
      ],
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
      cors: false,
      headers: HTTP_SECURITY_HEADERS,
    },

    // Pré-compilation des dépendances pour un démarrage instantané sans rafale de requêtes HTTP
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "lucide-react",
        "clsx",
        "tailwind-merge",
        "axios",
        "zod",
      ],
    },

    // Optimisations de compilation & compression maximale
    build: {
      target: "es2022",
      minify: "esbuild",
      cssMinify: true,
      cssCodeSplit: true,
      sourcemap: false,
      modulePreload: { polyfill: false },
      reportCompressedSize: true,
      // En deçà de 4 Ko, les petits fichiers/icônes sont intégrés en data-URI (évite un aller-retour réseau ngrok)
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Zod reste isolé pour les schémas de validation
            if (id.includes("node_modules/zod")) {
              return "schemas";
            }
            // Coeur React et routage
            if (
              id.includes("node_modules/react") ||
              id.includes("node_modules/react-dom") ||
              id.includes("node_modules/react-router") ||
              id.includes("node_modules/use-sync-external-store")
            ) {
              return "vendor-core";
            }
            // Bibliothèque d'icônes
            if (
              id.includes("node_modules/lucide-react") ||
              id.includes("node_modules/react-icons")
            ) {
              return "vendor-icons";
            }
            // Utilitaires réseau et classes CSS
            if (
              id.includes("node_modules/clsx") ||
              id.includes("node_modules/tailwind-merge") ||
              id.includes("node_modules/axios")
            ) {
              return "vendor-utils";
            }
          },
        },
      },
    },
});
