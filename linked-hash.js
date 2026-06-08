import fs from "fs";
import crypto from "crypto";

function hash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

const files = [
  "index.html",
  "README.md",
  "LICENSE.md",
  "registry.json",
  "whitelist.json",
  "genesis-block.json",
  "package.json",
  "global/auth.js",
  "global/popup.html",
  "global/quadruplex-engine.js",
  "wallet/index.html",
  "wallet/pzqqet-0_standard.js",
  "chain/explorer/index.html",
  "settings/index.html"
];

let hashes = files.map(f => hash(fs.readFileSync(f)));

console.log("Initial Hashes:", hashes);

while (hashes.length > 1) {
  const combined = hashes.join("");
  const newHash = hash(combined);
  console.log("→ Reduziert:", newHash);
  hashes = [newHash];
}

console.log("FINALER MASTER-HASH:", hashes[0]);
