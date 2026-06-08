// wallet/pzqqet-0_standard.js
// PZQQET‑0 Standard – BIP‑39 Axiomatische Wortmatrix + FusionMaster + Engine

// HINWEIS:
// Du ersetzt den wordPool unten 1:1 durch die 2048 offiziellen BIP‑39‑Wörter
// aus dem BTC‑Repo (in exakt derselben Reihenfolge).

export const PZQQETFUSIONMASTER = {

  Axioms: {
    // BIP‑39 Wortliste (PLATZHALTER – hier kommen deine 2048 Wörter rein)
    // Beispielstruktur:
    // wordPool: ["abandon","ability","able", ... , "zoo"]
    wordPool: [
      // ↓ HIER deine 2048 BIP‑39‑Wörter einfügen ↓
      "abandon","ability","able","about","above","absent","absorb","abstract",
      "absurd","abuse","access","accident","account","accuse","achieve","acid",
      "acoustic","acquire","across","act","action","actor","actress","actual",
      "adapt","add","addict","address","adjust","admit","adult","advance",
      "advice","aerobic","affair","afford","afraid","again","age","agent",
      "agree","ahead","aim","air","airport","aisle","alarm","album",
      "alcohol","alert","alien","all","alley","allow","almost","alone",
      "alpha","already","also","alter","always","amateur","amazing","among",
      "amount","amused","analyst","anchor","ancient","anger","angle","angry",
      "animal","ankle","announce","annual","another","answer","antenna","antique",
      "anxiety","any","apart","apology","appear","apple","approve","april",
      "arch","arctic","area","arena","argue","arm","armed","armor",
      "army","around","arrange","arrest","arrive","arrow","art","artefact",
      "artist","artwork","ask","aspect","assault","asset","assist","assume",
      "asthma","athlete","atom","attack","attend","attitude","attract","auction",
      "audit","august","aunt","author","auto","autumn","average","avocado",
      "avoid","awake","aware","away","awesome","awful","awkward","axis",
      // … hier vollständig bis zum letzten BIP‑39‑Wort „zoo“ auffüllen …
      "zebra","zero","zone","zoo"
    ]
  },

  Fusion: {
    /**
     * Fusioniert zwei Wörter zu einem deterministischen, lesbaren Token.
     * Beispiel: "alpha", "orbit" → "ALPHA-ORBIT"
     */
    fuse(a, b) {
      return `${String(a).toUpperCase()}-${String(b).toUpperCase()}`;
    }
  },

  Engine: {
    /**
     * Deterministische Hashfunktion für ein Wort / einen Key.
     * Nutzt 32‑bit Integer‑Rolling‑Hash, Ausgabe als 8‑stelliger Hex‑String.
     */
    hashWord(word) {
      let h = 0 >>> 0;
      const s = String(word);
      for (let i = 0; i < s.length; i++) {
        h = (h * 31 + s.charCodeAt(i)) >>> 0;
      }
      return h.toString(16).padStart(8, "0");
    },

    /**
     * Liefert ein Wort aus dem BIP‑39‑Pool anhand eines Indexes
     * (Index wird modulo der Pool‑Länge genommen).
     */
    wordAt(index) {
      const pool = PZQQETFUSIONMASTER.Axioms.wordPool;
      if (!pool || pool.length === 0) return "";
      const i = ((index % pool.length) + pool.length) % pool.length;
      return pool[i];
    },

    /**
     * Erzeugt eine deterministische Wortsequenz aus einem Seed‑String.
     * Kann z.B. genutzt werden, um aus einem internen Key eine
     * abgeleitete Wortfolge zu generieren (unabhängig von BIP‑39‑Checksum‑Logik).
     */
    deriveWordsFromSeed(seed, count = 12) {
      const out = [];
      let h = this.hashWord(seed);
      for (let i = 0; i < count; i++) {
        const num = parseInt(h.slice(0, 8), 16) >>> 0;
        out.push(this.wordAt(num));
        h = this.hashWord(h + ":" + i);
      }
      return out;
    }
  }
};
