const http = require("http");
const fs = require("fs");
const path = require("path");

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
  const urlPath = req.url.split("?")[0];
  const filePath = path.join(DIST_DIR, urlPath);

  const serveFile = (targetPath) => {
    fs.readFile(targetPath, (err, data) => {
      if (err) {
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

  const ext = path.extname(urlPath);
  if (ext) {
    serveFile(filePath);
  } else {
    const indexCandidate = path.join(filePath, "index.html");
    fs.access(indexCandidate, fs.constants.F_OK, (err) => {
      if (!err) {
        serveFile(indexCandidate);
      } else {
        serveFile(path.join(DIST_DIR, "index.html"));
      }
    });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Static server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
});