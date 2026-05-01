import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, "client", "dist");

const MIME_TYPES = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".mjs":  "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".eot":  "application/vnd.ms-fontobject",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  // Strip query string
  const urlPath = req.url.split("?")[0];
  const filePath = path.join(DIST_DIR, urlPath);

  // Resolve the file, falling back to index.html for SPA routing
  const serveFile = (targetPath) => {
    fs.readFile(targetPath, (err, data) => {
      if (err) {
        // Last resort: serve index.html for SPA client-side routing
        const indexPath = path.join(DIST_DIR, "index.html");
        fs.readFile(indexPath, (indexErr, indexData) => {
          if (indexErr) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(indexData);
        });
        return;
      }
      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  };

  // Check if the path points to a file with a known extension
  const ext = path.extname(urlPath);
  if (ext) {
    // Looks like a static asset — serve it directly
    serveFile(filePath);
  } else {
    // No extension — could be a directory or an SPA route
    const indexCandidate = path.join(filePath, "index.html");
    fs.access(indexCandidate, fs.constants.F_OK, (err) => {
      if (!err) {
        serveFile(indexCandidate);
      } else {
        // Fall back to root index.html for SPA routing
        serveFile(path.join(DIST_DIR, "index.html"));
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
});
