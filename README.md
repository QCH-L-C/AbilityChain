# AbilityChain

📘 README.md — AbilityChain / Quadruplex‑System (FINAL)

🔶 1. Überblick

AbilityChain ist ein deterministisches, modular aufgebautes Blockchain‑Ökosystem, das auf vier Kernkomponenten basiert:

- Wallet (Seed‑System, Quadruplex‑Orbit, ACU‑Balance)  
- Explorer (Orbit‑Analyse, Block‑Simulation)  
- Settings (Account‑Daten, Quadruplex‑State‑Anzeige)  
- Global‑System (Auth, Popup, Quadruplex‑Engine, BIP‑39‑Axiome)

Das gesamte System ist pixel‑deterministisch, quadruplex‑basiert, modular, redundanzfrei und vollständig client‑seitig.

---

🔶 2. Verzeichnisstruktur

`
/
├── index.html
├── global/
│   ├── auth.js
│   ├── popup.html
│   ├── quadruplex-engine.js
│
├── wallet/
│   ├── index.html
│   ├── pzqqet-0_standard.js
│
├── chain/
│   └── explorer/
│       └── index.html
│
└── settings/
    └── index.html
`

---

🔶 3. Auth‑System

Das Auth‑System besteht aus:

- auth.js  
- popup.html  
- localStorage‑Session  
- Login / Register / Logout  
- Seed‑Generierung (12/24 Wörter)  
- Mask‑ID (8‑stellige UUID‑Maske)  

Das Popup wird automatisch geladen und ist global verfügbar.

---

🔶 4. Seed‑System (BIP‑39)

Die Datei:

`
wallet/pzqqet-0_standard.js
`

enthält:

- 2048 BIP‑39‑Wörter  
- hashWord() (deterministische 32‑bit‑Hashfunktion)  
- wordAt() (Index → Wort)  
- deriveWordsFromSeed() (Seed → Wortfolge)  
- FusionMaster (Wortfusion)

Damit ist das gesamte System BIP‑39‑kompatibel, aber nicht abhängig von Bitcoin‑Checksum‑Logik.

---

🔶 5. Quadruplex‑Engine

Die Datei:

`
global/quadruplex-engine.js
`

ist die final fusionierte Master‑Version und enthält:

Achsen
- Dual: 0 / 1  
- Trinitär: −1 / 0 / +1  
- Trival: 3×3‑Matrix (9 Zellen)  
- Pixel: (x,y)

Funktionen
- normalizePixel(x,y)  
- createQuadruplexState(dual, tri, trivalIndex, pixel)  
- hashQuadruplexState(state)  
- buildOrbitSignature(dual, tri, pixel)  
- stepQuadruplex(state, triDelta, dx, dy)  
- High‑Level‑API: QuadruplexEngine.createState(), toIndex(), stepOrbit()

Orbit‑Signatur
Ein Orbit besteht aus 9 deterministischen Hashes, erzeugt aus:

`
Dual × Trinitär × Trival × Pixel
`

---

🔶 6. Wallet

Die Datei:

`
wallet/index.html
`

enthält:

- Seed‑Anzeige (12/24 Wörter)  
- ACU‑Balance (statisch, erweiterbar)  
- Quadruplex‑Orbit‑Grid (3×3)  
- Navigation  
- Auth‑Integration  

Der Orbit wird live aus der Quadruplex‑Engine generiert.

---

🔶 7. Explorer

Die Datei:

`
chain/explorer/index.html
`

enthält:

- Orbit‑Analyse  
- Orbit‑Grid  
- Navigation  
- Auth‑Integration  

Der Explorer nutzt dieselbe Quadruplex‑Engine wie das Wallet.

---

🔶 8. Settings

Die Datei:

`
settings/index.html
`

zeigt:

- Username  
- Mask  
- Seed‑12  
- Seed‑24  
- Quadruplex‑State (Dual, Trinitär, Trival, Pixel)  
- Navigation  
- Logout  

---

🔶 9. Determinismus‑Prinzip

Das gesamte System basiert auf:

- px‑genauer Pixel‑Deterministik  
- Quadruplex‑State‑Maschine  
- Hash‑Determinismus  
- BIP‑39‑Axiomen  
- Modularität ohne Seiteneffekte  

Jede Komponente ist autark, aber vollständig kompatibel.

---

🔶 10. Lizenz

Die Lizenzdatei ist separat und wird nicht automatisch in die README integriert.
