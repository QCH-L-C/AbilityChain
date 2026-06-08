import fs from "fs";
import http from "http";
import crypto from "crypto";

function load(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function hashFile(path) {
  const data = fs.readFileSync(path);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function hashFractal(files) {
  let hashes = files.map(f => hashFile(f));
  while (hashes.length > 1) {
    hashes = [crypto.createHash("sha256").update(hashes.join("")).digest("hex")];
  }
  return hashes[0];
}

console.log("PRAI Runtime Server gestartet…");

const registry = load("registry.json");
const whitelist = load("whitelist.json");
const genesis = load("genesis-block.json");

console.log("Registry:", registry.blocks.length, "Einträge");
console.log("Whitelist:", whitelist.whitelist.allowed.length, "Einträge");
console.log("Genesis:", genesis.genesis.id);

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    let rpc = {};
    try { rpc = JSON.parse(body); } catch {}

    if (rpc.method === "hash.file") {
      return res.end(JSON.stringify({ jsonrpc: "2.0", result: hashFile(rpc.params.path), id: rpc.id }));
    }

    if (rpc.method === "hash.fractal") {
      const result = hashFractal(whitelist.whitelist.allowed);
      return res.end(JSON.stringify({ jsonrpc: "2.0", result, id: rpc.id }));
    }

    res.end(JSON.stringify({ jsonrpc: "2.0", error: "Unknown method", id: rpc.id }));
  });
});

server.listen(9090, () => console.log("JSON‑RPC Server aktiv auf Port 9090"));
