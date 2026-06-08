// global/quadruplex-engine.js
// Quadruplex Engine – Dual × Trinitär × Trival × Pixel
// Fusion aller Varianten: Axis-Arrays, Axis-Objekt, State-Factory, Orbit, Hash, Index, Steps

import { PZQQETFUSIONMASTER } from "../wallet/pzqqet-0_standard.js";

/**
 * Achsen:
 *  A1 – Dual:      0 / 1
 *  A2 – Trinitär:  -1 / 0 / +1
 *  A3 – Trival:    3×3 Matrix (i,j ∈ {-1,0,1})
 *  A4 – Pixel:     (x,y)
 *
 * Q = Dual × Trinitär × Trival × Pixel
 */

export const QuadruplexAxis = {
  Dual: Object.freeze([0, 1]),
  Trinitar: Object.freeze([-1, 0, 1]),
  Trival: Object.freeze([
    [-1, -1], [0, -1], [1, -1],
    [-1,  0], [0,  0], [1,  0],
    [-1,  1], [0,  1], [1,  1]
  ])
};

// Objekt-Variante mit benannten Zellen (aus der QuadruplexEngine-Version)
export const QuadruplexEngine = {
  Axes: {
    Dual: Object.freeze({ ZERO: 0, ONE: 1 }),
    Trinitary: Object.freeze({ NEG: -1, NEUTRAL: 0, POS: 1 }),
    Trival: Object.freeze({
      cells: [
        { id: "TL", x: -1, y: -1 },
        { id: "TC", x:  0, y: -1 },
        { id: "TR", x:  1, y: -1 },
        { id: "CL", x: -1, y:  0 },
        { id: "CC", x:  0, y:  0 },
        { id: "CR", x:  1, y:  0 },
        { id: "BL", x: -1, y:  1 },
        { id: "BC", x:  0, y:  1 },
        { id: "BR", x:  1, y:  1 }
      ]
    })
  },

  createState({ dual, trinitary, trivalId, pixel }) {
    return { dual, trinitary, trivalId, pixel };
  },

  getTrivalCell(id) {
    return this.Axes.Trival.cells.find(c => c.id === id) || null;
  },

  toIndex(state) {
    const d = state.dual === 1 ? 1 : 0;
    const t = state.trinitary + 1; // -1,0,1 → 0,1,2
    const vIndex = this.Axes.Trival.cells.findIndex(c => c.id === state.trivalId);
    const pX = state.pixel.x;
    const pY = state.pixel.y;

    return {
      scalar: d * 3 * 9 + t * 9 + (vIndex >= 0 ? vIndex : 0),
      vector: { x: pX, y: pY }
    };
  },

  stepOrbit(state) {
    const cell = this.getTrivalCell(state.trivalId) || { x: 0, y: 0 };
    return this.createState({
      dual: state.dual,
      trinitary: state.trinitary,
      trivalId: state.trivalId,
      pixel: {
        x: state.pixel.x + cell.x,
        y: state.pixel.y + cell.y
      }
    });
  }
};

/**
 * Normalisiert Pixelkoordinaten (z.B. für Canvas / Grid).
 */
export function normalizePixel(x, y) {
  return { x: Math.floor(x), y: Math.floor(y) };
}

/**
 * Low-Level Quadruplex-State:
 *  dual ∈ {0,1}
 *  tri  ∈ {-1,0,1}
 *  triCellIndex ∈ {0..8}
 *  pixel = {x,y}
 */
export function createQuadruplexState(dual, tri, triCellIndex, pixel) {
  if (!QuadruplexAxis.Dual.includes(dual)) {
    throw new Error("Dual-Achse ungültig (0 oder 1 erwartet).");
  }
  if (!QuadruplexAxis.Trinitar.includes(tri)) {
    throw new Error("Trinitär-Achse ungültig (-1, 0 oder 1 erwartet).");
  }
  if (triCellIndex < 0 || triCellIndex >= QuadruplexAxis.Trival.length) {
    throw new Error("Trival-Index außerhalb des gültigen Bereichs (0..8).");
  }

  const { x, y } = normalizePixel(pixel.x, pixel.y);
  const [tx, ty] = QuadruplexAxis.Trival[triCellIndex];

  return Object.freeze({
    dual,
    tri,
    trival: { tx, ty, index: triCellIndex },
    pixel: { x, y }
  });
}

/**
 * Deterministischer Hash für einen Quadruplex‑State.
 */
export function hashQuadruplexState(state) {
  const key = [
    "QX",
    state.dual,
    state.tri,
    state.trival.tx,
    state.trival.ty,
    state.pixel.x,
    state.pixel.y
  ].join(":");

  return PZQQETFUSIONMASTER.Engine.hashWord(key);
}

/**
 * Orbit‑Signatur:
 *  – iteriert über alle 9 Trival‑Zellen
 *  – erzeugt 9 Quadruplex‑States
 *  – gibt 9 Hashes zurück
 */
export function buildOrbitSignature(dual, tri, pixel) {
  return QuadruplexAxis.Trival.map((_, idx) => {
    const state = createQuadruplexState(dual, tri, idx, pixel);
    return hashQuadruplexState(state);
  });
}

/**
 * Quadruplex‑Step (Low-Level):
 *  – verschiebt Trinitär‑Achse um triDelta (mit Clamping)
 *  – verschiebt Pixel um (dx,dy)
 *  – behält Trival‑Index bei
 */
export function stepQuadruplex(state, triDelta, dx, dy) {
  const newTri = state.tri + triDelta;
  const clampedTri = QuadruplexAxis.Trinitar.includes(newTri)
    ? newTri
    : Math.max(-1, Math.min(1, newTri));

  return createQuadruplexState(
    state.dual,
    clampedTri,
    state.trival.index,
    { x: state.pixel.x + dx, y: state.pixel.y + dy }
  );
                              }
