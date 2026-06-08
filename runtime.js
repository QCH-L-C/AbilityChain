import fs from "fs";
import crypto from "crypto";
import http from "http";

function hashFile(path) {
  const data = fs.readFileSync(path);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

console.log("PRAI Runtime Kernel gestartet...");

const registry = loadJSON("registry.json");
const whitelist = loadJSON("whitelist.json");
const genesis = loadJSON("genesis-block.json");

console.log("Registry:", registry.blocks.length, "Einträge");
console.log("Whitelist:", whitelist.whitelist.allowed.length, "Einträge");
console.log("Genesis Block:", genesis.genesis.id);

// JSON-RPC Server
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    const rpc = JSON.parse(body || "{}");

    if (rpc.method === "hash") {
      const result = hashFile(rpc.params.path);
      res.end(JSON.stringify({ jsonrpc: "2.0", result, id: rpc.id }));
      return;
    }

    res.end(JSON.stringify({ jsonrpc: "2.0", error: "Unknown method", id: rpc.id }));
  });
});

server.listen(8080, () => console.log("JSON-RPC aktiv auf Port 8080"));
