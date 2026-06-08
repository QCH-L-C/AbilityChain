console.log("PRAI Start Node aktiviert...");

import http from "http";

function rpc(method, params) {
  return new Promise(resolve => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 8080,
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      res => {
        let data = "";
        res.on("data", chunk => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      }
    );

    req.write(JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }));
    req.end();
  });
}

(async () => {
  console.log("Teste Hash-Funktion...");
  const result = await rpc("hash", { path: "index.html" });
  console.log("Hash(index.html):", result.result);
})();
