#!/usr/bin/env node
// CS2 layout traffic simulator (local evaluation tool; not used by the models).
//
//   node tools/sim/simulate.js <layout.json | page.html> [--out report.html] [--json] [--days 3] [--seed 1]
//   node tools/sim/simulate.js --all <dir>          one line per layout, plus tools/sim/out/<name>.html
//
// The tile is simulated as a torus: its east edge continues on its west edge and its south edge on its north edge,
// which is exactly an endless city made of copies of this tile. Roads that don't continue across the edges end there.
// See tools/sim/README.md for the model, what comes from the game code and what is assumed.
'use strict';
const fs = require('fs');
const path = require('path');
const CS2 = require('../../validator.js');

const ROOT = path.join(__dirname, '..', '..');
const ASSETS = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets.json'), 'utf8'));
const SIM = JSON.parse(fs.readFileSync(path.join(__dirname, 'sim_data.json'), 'utf8'));
const P = SIM.params;
const CAL_FILE = path.join(__dirname, 'calibration', 'calibration.json');
const CAL = fs.existsSync(CAL_FILE) ? JSON.parse(fs.readFileSync(CAL_FILE, 'utf8')) : null;

// ---------------------------------------------------------------- model constants
const CELL = ASSETS.grid.cellMeters;                 // 8 m
const DAY = P.framesPerDay / P.framesPerSecond;      // one game day = 4369 s of vehicle movement (game clock)
const HOUR = DAY / 24;                               // one game hour = 182 s
const CONFIG = {
  // --- from the game code (decompiled Game.dll; values from the game's prefabs) ---
  workDayStart: P.workDayStart,                      // 0.35 of the day (08:24) before the citizen's offset
  workDayEnd: P.workDayEnd,                          // 0.683 (16:24)
  workOffsetDays: 10922 / 262144,                    // WorkerSystem.GetWorkOffset: ±1 game hour per citizen
  trafficReduction: P.trafficReduction,              // EconomyParameters.m_TrafficReduction (0.0005), for the city-size gates
  parkingSearchM: P.maxParkingSearchDistanceM,       // 150 m: cars park within this distance of a pedestrian-only lot
  flowSmoothingS: 68,                                // TrafficFlowSystem: lerp 0.125 per update ≈ 68 s time constant
  pathRandom: [0.5, 1.0],                            // PathUtils.CalculateCost: target cost × random(0.5, 1)
  // --- trip rates and base driving speeds: measured in the game, see calibration/calibration.json ---
  // --- capacities: defaults here, replaced by the values fitted to the game's queues (calibration.json "capacity",
  //     calibrate.js; tools/sim/README.md, Calibration) ---
  laneCapacityVps: 0.5,                              // cars per second per lane along a city road
  highwayLaneCapacityVps: 0.5,                       // along a highway / ramp lane
  junctionVps: 0.5,                                  // cars per second per lane leaving an approach into a city junction
  highwayJunctionVps: 0.5,                           // into a highway merge or split
  signalLostTime: 0.25,                              // share of a signal cycle lost to amber and change-over (TrafficLightSystem: ~6 s green phases)
  minorApproachShare: 0.4,                           // capacity share of minor approaches at junctions without lights
  mergeRampShare: 1,                                 // capacity share of a ramp at a highway merge
  // --- assumptions ---
  cityKm2: 16,                                       // the end-game city around the tile: 16 km² built from copies of it
  shoppingDwellH: 0.5, leisureDwellH: 2,             // time at the destination before driving home (game hours)
  vehicleSpacingM: 7.5,                              // jam density (storage per lane)
  localTruckShare: 0.8,                             // where the area has industry: share of truck trips that start there
  otherToOutsideShare: 0.15,                         // 'other' car trips leaving the area (moving away etc.)
  stuckDespawnS: 600,                                // a car blocked this long at the head of a queue is removed
  squeezeAfterS: 60,                                 // a car blocked this long may squeeze onto a full road (deadlock breaking)
  lotChunkCells: 6,                                 // zone blocks are split into lots of up to 6×6 cells
  driveSpacingCells: 2,                              // driveways closer than this on one road share an access node
};
if (CAL && CAL.capacity) Object.keys(CAL.capacity).forEach((k) => { if (k in CONFIG && typeof CAL.capacity[k] === 'number') CONFIG[k] = CAL.capacity[k]; });

// ---------------------------------------------------------------- utilities
function rng(seed) {
  let a = seed >>> 0;
  return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hours(s) { const h = ((s / HOUR) % 24 + 24) % 24; return String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0'); }
function ptSegT(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
  const t = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0;
  return { t, d: Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy) };
}
function crossT(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]];
  const den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den;
  if (t <= 1e-6 || t >= 1 - 1e-6 || u <= 1e-6 || u >= 1 - 1e-6) return null;
  return { t, u };
}
// cubic Bezier [x0,z0, x1,z1, x2,z2, x3,z3]: split at t (de Casteljau), and the part between t0 and t1
function bezSplit(c, t) {
  const L = (a, b) => [c[a] + (c[b] - c[a]) * t, c[a + 1] + (c[b + 1] - c[a + 1]) * t];
  const p01 = L(0, 2), p12 = L(2, 4), p23 = L(4, 6);
  const q = (u, v) => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t];
  const p012 = q(p01, p12), p123 = q(p12, p23), m = q(p012, p123);
  return [[c[0], c[1], ...p01, ...p012, ...m], [...m, ...p123, ...p23, c[6], c[7]]];
}
function subCurve(c, t0, t1) { if (t1 < 1) c = bezSplit(c, t1)[0]; if (t0 > 0) c = bezSplit(c, t0 / t1)[1]; return c; }
class Heap {  // min-heap of [key, value]
  constructor() { this.k = []; this.v = []; }
  push(key, val) { const k = this.k, v = this.v; let i = k.length; k.push(key); v.push(val); while (i > 0) { const p = (i - 1) >> 1; if (k[p] <= key) break; k[i] = k[p]; v[i] = v[p]; i = p; } k[i] = key; v[i] = val; }
  pop() {
    const k = this.k, v = this.v, top = v[0], last = k.length - 1, lk = k[last], lv = v[last];
    k.pop(); v.pop();
    if (last > 0) { let i = 0; for (;;) { let c = 2 * i + 1; if (c >= last) break; if (c + 1 < last && k[c + 1] < k[c]) c++; if (k[c] >= lk) break; k[i] = k[c]; v[i] = v[c]; i = c; } k[i] = lk; v[i] = lv; }
    return top;
  }
  get size() { return this.k.length; }
}

// ---------------------------------------------------------------- read a layout from JSON or a model's HTML page
function readLayout(file) {
  const txt = fs.readFileSync(file, 'utf8');
  if (/\.json$/i.test(file)) return JSON.parse(txt);
  // an HTML page: run it in a sandbox and catch what it passes to CS2.mount / CS2.validate
  const vm = require('vm');
  let caught = null;
  const fake = { load: () => Promise.resolve(ASSETS), mount: (l) => { caught = caught || l; return Promise.resolve({}); },
    validate: (l) => { caught = caught || l; return CS2.validate(l, { data: ASSETS }); }, renderSVG: () => '', reportHTML: () => '' };
  const scripts = [...txt.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const el = () => ({ innerHTML: '', textContent: '', style: {}, appendChild() {}, addEventListener() {}, setAttribute() {}, classList: { add() {}, remove() {} } });
  const ctx = { CS2: fake, console: { log() {}, warn() {}, error() {} }, setTimeout: (f) => f(), JSON, Math,
    document: { getElementById: el, querySelector: el, querySelectorAll: () => [], createElement: el, addEventListener: (e, f) => { if (/DOMContentLoaded|load/.test(e)) f(); }, body: el() },
    fetch: () => Promise.resolve({ json: () => Promise.resolve(ASSETS) }) };
  ctx.window = ctx; ctx.addEventListener = ctx.document.addEventListener;
  vm.createContext(ctx);
  for (const s of scripts) { try { vm.runInContext(s, ctx, { timeout: 5000 }); } catch (e) { /* keep going */ } }
  if (!caught) for (const k of Object.keys(ctx)) if (ctx[k] && typeof ctx[k] === 'object' && Array.isArray(ctx[k].roads) && Array.isArray(ctx[k].zones)) caught = ctx[k];
  if (!caught) throw new Error('No layout found in ' + file + ' (it never calls CS2.mount/validate).');
  return JSON.parse(JSON.stringify(caught));
}

// ---------------------------------------------------------------- network
function buildNetwork(layout, result) {
  const W = layout.bounds ? layout.bounds.w : 0, H = layout.bounds ? layout.bounds.h : 0;
  const segs = [];
  result._roads.forEach((r) => {
    const s = SIM.roads[r.type.id];
    if (!s || s.track || s.lanesFwd + s.lanesBack === 0) return;
    const len = Math.hypot(r.b[0] - r.a[0], r.b[1] - r.a[1]);
    if (len < 1e-6) return;
    segs.push({ ref: r.ref, type: r.type, sim: s, a: r.a, b: r.b, len, w: r.type.widthCells, cuts: [], src: r });
  });
  // point records with union-find; each becomes a node
  const pts = [], par = [];
  function rec(x, y, kind) { pts.push({ x, y, kind }); par.push(par.length); return par.length - 1; }
  function find(i) { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; }
  function join(i, j) { i = find(i); j = find(j); if (i !== j) par[i] = j; }
  function cut(s, t, kind) { const id = rec(s.a[0] + t * (s.b[0] - s.a[0]), s.a[1] + t * (s.b[1] - s.a[1]), kind); s.cuts.push({ t, id }); return id; }
  segs.forEach((s) => { s.e0 = cut(s, 0, 'end'); s.e1 = cut(s, 1, 'end'); });
  // consecutive pieces of one road path share their joint
  for (let i = 0; i + 1 < segs.length; i++) {
    const s = segs[i], t = segs[i + 1];
    if (s.ref === t.ref && Math.hypot(s.b[0] - t.a[0], s.b[1] - t.a[1]) < 1e-6) join(s.e1, t.e0);
  }
  // crossings (highways cross other roads grade-separated)
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
    const s = segs[i], t = segs[j];
    if (s.sim.highway || t.sim.highway) continue;
    const c = crossT(s.a, s.b, t.a, t.b);
    if (c) join(cut(s, c.t, 'x'), cut(t, c.u, 'x'));
  }
  // road ends that meet another road (T-junctions, ramps, end-to-end)
  segs.forEach((s) => [[s.a, s.e0], [s.b, s.e1]].forEach(([p, id]) => {
    segs.forEach((t) => {
      if (t === s) return;
      const q = ptSegT(p, t.a, t.b), tol = Math.max(s.w, t.w) / 2 + 0.25;
      if (q.d > tol) return;
      if (s.ref === t.ref && (q.t < 1e-6 || q.t > 1 - 1e-6)) return;   // own neighbouring piece (already joined)
      const along = q.t * t.len;
      if (along < tol) join(id, t.e0); else if (t.len - along < tol) join(id, t.e1); else join(id, cut(t, q.t, 't'));
    });
  }));
  // wrap the tile: an end on one edge continues at the matching end on the opposite edge (the validator's rule)
  if (W && H) {
    const E = 0.01, ends = { w: [], e: [], n: [], s: [] };
    segs.forEach((s) => [[s.a, s.e0], [s.b, s.e1]].forEach(([p, id]) => {
      if (Math.abs(p[0]) < E) ends.w.push({ pos: p[1], id, ty: s.type.id });
      if (Math.abs(p[0] - W) < E) ends.e.push({ pos: p[1], id, ty: s.type.id });
      if (Math.abs(p[1]) < E) ends.n.push({ pos: p[0], id, ty: s.type.id });
      if (Math.abs(p[1] - H) < E) ends.s.push({ pos: p[0], id, ty: s.type.id });
    }));
    [['w', 'e'], ['n', 's']].forEach(([x, y]) => ends[x].forEach((a) => {
      const m = ends[y].find((b) => Math.abs(b.pos - a.pos) < 0.51 && b.ty === a.ty);
      if (m) { join(a.id, m.id); pts[a.id].wrap = pts[m.id].wrap = true; }
    }));
  }
  return { segs, pts, par, find, join, cut, W, H };
}

// lots: zone chunks and service buildings with their households, jobs and access node
function buildLots(layout, result, net) {
  const lots = [];
  const carSegs = net.segs.filter((s) => !s.sim.highway);
  function nearestSeg(p, among, maxCells) {
    let best = null;
    (among.length ? among : carSegs).forEach((s) => { const q = ptSegT(p, s.a, s.b); if (q.d <= maxCells && (!best || q.d < best.d)) best = { s, t: q.t, d: q.d }; });
    return best;
  }
  const parkCells = CONFIG.parkingSearchM / CELL;
  result._items.forEach((it) => {
    if (it.kind === 'zone') {
      const z = it.inst, zt = it.zone, C = CONFIG.lotChunkCells;
      const feedCar = (it.feeding || []).map((r) => carSegs.find((s) => s.src === r)).filter(Boolean);
      for (let x0 = 0; x0 < z.w - 1e-9; x0 += C) for (let y0 = 0; y0 < z.h - 1e-9; y0 += C) {
        const w = Math.min(C, z.w - x0), h = Math.min(C, z.h - y0), cells = w * h;
        const c = [z.x + x0 + w / 2, z.y + y0 + h / 2];
        let acc = feedCar.length ? nearestSeg(c, feedCar, Infinity) : null;
        if (!acc) acc = nearestSeg(c, [], parkCells + C);      // pedestrian-street lots park on the nearest car road
        lots.push({ ref: it.ref, kind: 'zone', family: zt.family, zone: zt.id, x: c[0], y: c[1], cells,
          households: cells * (zt.homesPerCell || 0), jobs: cells * (zt.jobsPerCell || 0), acc });
      }
    } else if (it.kind === 'building') {
      const a = it.asset, b = it.inst, st = a.stats || {};
      const rot = b.rotation || 0, fw = it.fp.w, fh = it.fp.h;
      const front = rot === 0 ? [b.x + fw / 2, b.y] : rot === 90 ? [b.x + fw, b.y + fh / 2] : rot === 180 ? [b.x + fw / 2, b.y + fh] : [b.x, b.y + fh / 2];
      const acc = nearestSeg(front, [], 2) || nearestSeg([b.x + fw / 2, b.y + fh / 2], [], parkCells + Math.max(fw, fh));
      lots.push({ ref: it.ref, kind: 'building', family: a.group, asset: a.id, name: a.name, x: b.x + fw / 2, y: b.y + fh / 2,
        households: st.households || 0, jobs: a.kind === 'signature' ? 0 : (st.workplaces || 0), students: st.students || 0,
        park: a.group === 'parks' || /park|plaza|square|garden/i.test(a.name), acc });
    }
  });
  // driveways: one access cut per road and 2-cell stretch
  const drive = new Map();
  lots.forEach((l) => {
    if (!l.acc) return;
    const s = l.acc.s, along = Math.round(l.acc.t * s.len / CONFIG.driveSpacingCells) * CONFIG.driveSpacingCells;
    const t = Math.max(0, Math.min(1, along / s.len)), key = net.segs.indexOf(s) + ':' + along;
    if (!drive.has(key)) drive.set(key, net.cut(s, t, 'access'));
    l.accessRec = drive.get(key);
  });
  return lots;
}

function finishGraph(net) {
  const { segs, pts, find } = net;
  // nodes from union-find roots
  const nodeOf = new Map(), nodes = [];
  pts.forEach((p, i) => {
    const r = find(i);
    if (!nodeOf.has(r)) { nodeOf.set(r, nodes.length); nodes.push({ x: 0, y: 0, n: 0, kinds: new Set(), out: [], inn: [], wrap: false }); }
    const nd = nodes[nodeOf.get(r)];
    nd.x += p.x; nd.y += p.y; nd.n++; nd.kinds.add(p.kind); if (p.wrap) nd.wrap = true;
  });
  nodes.forEach((n) => { n.x /= n.n; n.y /= n.n; });
  const N = (rec) => nodeOf.get(find(rec));
  const links = [];
  segs.forEach((s, si) => {
    const cuts = s.cuts.slice().sort((a, b) => a.t - b.t);
    const seq = [];
    cuts.forEach((c) => { const n = N(c.id); if (!seq.length || seq[seq.length - 1].n !== n) seq.push({ t: c.t, n }); });
    for (let k = 0; k + 1 < seq.length; k++) {
      const A = seq[k], B = seq[k + 1];
      const lenM = (B.t - A.t) * s.len * CELL;
      if (lenM < 0.5) continue;
      const pa = [s.a[0] + A.t * (s.b[0] - s.a[0]), s.a[1] + A.t * (s.b[1] - s.a[1])], pb = [s.a[0] + B.t * (s.b[0] - s.a[0]), s.a[1] + B.t * (s.b[1] - s.a[1])];
      [[A.n, B.n, s.sim.lanesFwd, pa, pb], [B.n, A.n, s.sim.lanesBack, pb, pa]].forEach(([from, to, lanes, p0, p1]) => {
        if (!lanes) return;
        const vmax = s.sim.speedKmh / 3.6;
        links.push({ id: links.length, from, to, lanes, lenM, vmax, seg: si, ref: s.ref, type: s.type.id, highway: s.sim.highway, tl: s.sim.trafficLights,
          p0, p1, store: Math.max(1, lenM * lanes / CONFIG.vehicleSpacingM),
          capLink: lanes * (s.sim.highway ? CONFIG.highwayLaneCapacityVps : CONFIG.laneCapacityVps) });
      });
    }
  });
  links.forEach((l) => { nodes[l.from].out.push(l.id); nodes[l.to].inn.push(l.id); });
  junctionControl(nodes, links);
  // physical roads for the game-style flow average: chains of links between real junctions / ends
  let road = 0;
  const isThrough = (n) => nodes[n].degree === 2 && !nodes[n].kinds.has('x') && !nodes[n].kinds.has('t');
  links.forEach((l) => { l.road = -1; });
  const bySeg = new Map(); links.forEach((l) => { if (!bySeg.has(l.seg)) bySeg.set(l.seg, []); bySeg.get(l.seg).push(l); });
  const visit = (start) => {
    const id = road++, stack = [start];
    while (stack.length) {
      const l = links[stack.pop()];
      if (l.road >= 0) continue;
      l.road = id;
      [l.from, l.to].forEach((n) => { if (!isThrough(n)) return; nodes[n].inn.concat(nodes[n].out).forEach((x) => { if (links[x].road < 0 && links[x].seg === l.seg) stack.push(x); }); });
      bySeg.get(l.seg).forEach((x) => { if (x.road < 0 && ((x.from === l.to && x.to === l.from) || (x.from === l.from && x.to === l.to))) stack.push(x.id); });
    }
  };
  links.forEach((l) => { if (l.road < 0) visit(l.id); });
  return { nodes, links, roads: road, nodeOfRec: N };
}

// junction control: capacity share of each approach, and the role of every road end at its junction
// (roleTo: how a link arrives at its end node, roleFrom: how it leaves its start node), which sets the time cars lose
// there (fitted to the game, see calibrate.js)
function junctionControl(nodes, links) {
  links.forEach((l) => { l.roleTo = 'none'; l.roleFrom = 'none'; });
  nodes.forEach((n) => {
    const pieces = new Set();
    n.inn.concat(n.out).forEach((id) => pieces.add(links[id].seg + ':' + (links[id].from === links[id].to ? 0 : Math.min(links[id].from, links[id].to) + '-' + Math.max(links[id].from, links[id].to))));
    n.degree = pieces.size;
    n.inn.forEach((id) => { links[id].share = 1; });
    const setRoles = (role) => { n.inn.forEach((id) => { links[id].roleTo = typeof role === 'function' ? role(id, true) : role; }); n.out.forEach((id) => { links[id].roleFrom = typeof role === 'function' ? role(id, false) : role; }); };
    if (n.degree <= 1) setRoles('end');
    if (n.degree <= 2 || !n.inn.length) { n.control = 'none'; return; }
    const tlRoads = new Set(n.inn.concat(n.out).filter((id) => links[id].tl).map((id) => links[id].seg));
    const allHighway = n.inn.concat(n.out).every((id) => links[id].highway);
    n.control = allHighway ? (n.inn.length > 1 ? 'merge' : 'split') : tlRoads.size >= 1 ? 'signal' : 'priority';  // CompositionSelectSystem: any PreferTrafficLights road, 3+ roads
    if (n.control !== 'priority') setRoles(n.control);
    if (n.control === 'split') return;
    // major axis: the approach with most lanes and the approach most opposite to it
    const heading = (id) => { const l = links[id]; return Math.atan2(l.p1[1] - l.p0[1], l.p1[0] - l.p0[0]); };
    const inn = n.inn.slice().sort((a, b) => links[b].lanes - links[a].lanes);
    const main = inn[0], h0 = heading(main);
    // approaches along the same line (driving the same or the opposite way) share a green phase / the major road
    const axisA = new Set([main]);
    inn.forEach((id) => { if (id !== main && Math.abs(Math.cos(heading(id) - h0)) > 0.7) axisA.add(id); });
    const B = inn.filter((id) => !axisA.has(id));
    if (n.control === 'priority') setRoles((id, arriving) => {
      if (arriving) return axisA.has(id) ? 'major' : 'minor';
      const back = n.inn.find((x) => links[x].seg === links[id].seg);
      return back != null ? (axisA.has(back) ? 'major' : 'minor') : Math.abs(Math.cos(heading(id) - h0)) > 0.7 ? 'major' : 'minor';
    });
    if (n.control === 'signal') {
      const la = Math.max(...[...axisA].map((id) => links[id].lanes)), lb = B.length ? Math.max(...B.map((id) => links[id].lanes)) : 0;
      const ga = lb ? la / (la + lb) : 1;
      [...axisA].forEach((id) => { links[id].share = Math.max(0.3, ga) * (1 - CONFIG.signalLostTime); });
      B.forEach((id) => { links[id].share = Math.max(0.3, 1 - ga) * (1 - CONFIG.signalLostTime); });
    } else if (n.control === 'merge') {
      // highway merges: ramps get their own lane through the merge in CS2, so no approach yields
      [...axisA].forEach((id) => { links[id].share = 1; });
      B.forEach((id) => { links[id].share = CONFIG.mergeRampShare; });
    } else {
      [...axisA].forEach((id) => { links[id].share = 0.9; });
      B.forEach((id) => { links[id].share = CONFIG.minorApproachShare; });
    }
  });
  // discharge into a junction: its own capacity per lane (city junctions, highway merges and splits), times the share
  links.forEach((l) => {
    const n = nodes[l.to];
    const sat = n.degree < 3 ? l.capLink : l.lanes * (n.control === 'merge' || n.control === 'split' ? CONFIG.highwayJunctionVps : CONFIG.junctionVps);
    l.cap = sat * l.share;
  });
}

// ---------------------------------------------------------------- routing
function dijkstra(g, origin, cost) {
  const n = g.nodes.length, dist = new Float64Array(n).fill(Infinity), pred = new Int32Array(n).fill(-1);
  const h = new Heap(); dist[origin] = 0; h.push(0, origin);
  while (h.size) {
    const u = h.pop(), du = dist[u];
    const out = g.nodes[u].out;
    for (let i = 0; i < out.length; i++) {
      const l = g.links[out[i]], nd = du + cost[l.id];
      if (nd < dist[l.to]) { dist[l.to] = nd; pred[l.to] = l.id; h.push(nd, l.to); }
    }
  }
  return { dist, pred };
}

// ---------------------------------------------------------------- demand
function householdMix() {
  const hh = SIM.households, W = hh.reduce((s, h) => s + h.weight, 0);
  const m = { adults: 0, children: 0, elderly: 0, students: 0, car: 0 };
  hh.forEach((h) => { m.adults += h.weight * h.adults / W; m.children += h.weight * h.children / W; m.elderly += h.weight * h.elderly / W; m.students += h.weight * h.students / W; m.car += h.weight * h.carProbability / W; });
  m.persons = m.adults + m.children + m.elderly + m.students;
  return m;
}

function simulate(layout, opts) {
  opts = opts || {};
  const result = CS2.validate(layout, { data: ASSETS });
  const net = buildNetwork(layout, result);
  const lots = buildLots(layout, result, net);
  const g = finishGraph(net);
  lots.forEach((l) => { l.node = l.accessRec != null ? g.nodeOfRec(l.accessRec) : -1; });
  const tileKm2 = layout.bounds ? layout.bounds.w * layout.bounds.h * CELL * CELL / 1e6 : 1;
  const gates = [];
  g.nodes.forEach((n, i) => { if (n.wrap) gates.push(i); });
  return runSim(g, lots, { layout, result, net, tileKm2, gates, name: layout.name || '' }, opts);
}

// a city exported from the real game by game-probe (export=...): run the same model on it to compare with the game
function simulateCity(city, opts) {
  opts = opts || {};
  // opts.config: temporary CONFIG values for this run (used by calibrate.js)
  const saved = opts.config ? Object.assign({}, CONFIG) : null;
  if (opts.config) Object.assign(CONFIG, opts.config);
  try {
    const c = cityGraph(city);
    return runSim(c.g, c.lots, { name: opts.name || 'exported city', city: true, gates: c.gates, cityPop: CAL ? CAL.city.population : undefined, skipped: c.skipped, tileKm2: c.tileKm2 }, opts);
  } finally { if (saved) Object.assign(CONFIG, saved); }
}

// the road graph, lots and outside connections of an exported city
function cityGraph(city) {
  const byPrefab = {};
  ASSETS.roads.forEach((r) => { byPrefab[r.prefab] = r; });
  const idx = new Map(), nodes = [];
  city.nodes.forEach((n) => { idx.set(n.id, nodes.length); nodes.push({ x: n.x / CELL, y: n.z / CELL, n: 1, kinds: new Set(['x']), out: [], inn: [], wrap: false, id: n.id }); });
  const links = [], skipped = {};
  const isSchool = (b) => /School|College|University/.test(b.prefab) && !/_Sub/.test(b.prefab);
  // buildings sit along their road: the edge is cut at their driveways (one access point per 16 m), so a car drives
  // only the part of the road it needs, as in the game
  const accessT = new Map();
  city.buildings.forEach((b) => { if ((b.households || b.jobs || isSchool(b)) && b.edge >= 0) { if (!accessT.has(b.edge)) accessT.set(b.edge, []); accessT.get(b.edge).push(b.t); } });
  const accessOf = new Map();
  city.edges.forEach((e, ei) => {
    const r = byPrefab[e.prefab], sd = r && SIM.roads[r.id];
    if (!sd || e.owned || !idx.has(e.a) || !idx.has(e.b)) { skipped[e.prefab] = (skipped[e.prefab] || 0) + 1; return; }
    const A = idx.get(e.a), B = idx.get(e.b), c = e.curve, spacing = CONFIG.driveSpacingCells * CELL;
    const ts = [0];
    (accessT.get(e.id) || []).map((t) => Math.round(t * e.len / spacing) * spacing / e.len).sort((x, y) => x - y)
      .forEach((t) => { if (t * e.len >= spacing / 2 && (1 - t) * e.len >= spacing / 2 && t > ts[ts.length - 1] + 1e-6) ts.push(t); });
    ts.push(1);
    const at = ts.map((t, k) => {
      if (k === 0) return A; if (k === ts.length - 1) return B;
      const p = bezSplit(c, t)[0];
      nodes.push({ x: p[6] / CELL, y: p[7] / CELL, n: 1, kinds: new Set(['access']), out: [], inn: [], wrap: false });
      return nodes.length - 1;
    });
    accessOf.set(e.id, ts.map((t, k) => ({ t, node: at[k] })));
    for (let k = 0; k + 1 < ts.length; k++) {
      const sub = subCurve(c, ts[k], ts[k + 1]), len = Math.max(1, e.len * (ts[k + 1] - ts[k]));
      const pa = [sub[0] / CELL, sub[1] / CELL], pb = [sub[6] / CELL, sub[7] / CELL];
      [[at[k], at[k + 1], sd.lanesFwd, pa, pb, sub], [at[k + 1], at[k], sd.lanesBack, pb, pa, [sub[6], sub[7], sub[4], sub[5], sub[2], sub[3], sub[0], sub[1]]]].forEach(([from, to, lanes, p0, p1, curve]) => {
        if (!lanes) return;
        links.push({ id: links.length, from, to, lanes, lenM: len, vmax: sd.speedKmh / 3.6, seg: ei, ref: String(e.id), type: r.id, highway: sd.highway, tl: sd.trafficLights,
          p0, p1, store: Math.max(1, len * lanes / CONFIG.vehicleSpacingM), capLink: lanes * (sd.highway ? CONFIG.highwayLaneCapacityVps : CONFIG.laneCapacityVps), road: ei, gameFlow: e.flow, curve });
      });
    }
  });
  links.forEach((l) => { nodes[l.from].out.push(l.id); nodes[l.to].inn.push(l.id); });
  junctionControl(nodes, links);
  const rid = new Map(); links.forEach((l) => { if (!rid.has(l.road)) rid.set(l.road, rid.size); l.road = rid.get(l.road); });
  const g = { nodes, links, roads: rid.size };
  // buildings -> lots at the access point of their driveway
  const lots = [];
  city.buildings.forEach((b) => {
    const school = isSchool(b);
    if (!(b.households || b.jobs || school)) return;
    const acc = accessOf.get(b.edge);
    const node = acc ? acc.reduce((best, x) => (Math.abs(x.t - b.t) < Math.abs(best.t - b.t) ? x : best)).node : -1;
    const family = b.commercialJobs ? 'commercial' : b.households ? 'residential' : /Industrial/.test(b.prefab) ? 'industrial' : 'work';
    lots.push({ ref: String(b.id), kind: 'building', family, x: b.x / CELL, y: b.z / CELL,
      households: b.households, jobs: b.jobs, students: school ? 1000 : 0, park: /Park|Plaza|Square/.test(b.prefab), node });
  });
  // outside connections: road ends at the map border
  const ext = Math.max(...nodes.map((n) => Math.max(Math.abs(n.x), Math.abs(n.y))));
  const gates = [];
  nodes.forEach((n, i) => { if (n.id != null && (Math.abs(n.x) > ext - 10 || Math.abs(n.y) > ext - 10) && n.inn.length + n.out.length <= 2) gates.push(i); });
  links.forEach((l) => { l.cls = linkClass(l); });
  return { g, lots, gates, skipped, tileKm2: (2 * ext * CELL / 1000) ** 2 };
}

// free driving and the time lost at road ends, from calibration.json (calibrate.js)
function freeFlow() {
  const f = CAL && CAL.freeFlow;
  return f || { speedShare: { street: 1, alley: 1, highway: 1, ramp: 1 }, arriveS: {}, departS: {} };
}
function linkTimes(links) {
  const f = freeFlow();
  links.forEach((l) => {
    l.cls = linkClass(l); l.base = f.speedShare[l.cls];
    l.endDelay = (f.arriveS[l.roleTo] || 0) + (f.departS[l.roleFrom] || 0);
  });
}

function linkClass(l) {
  if (l.highway) return l.lanes <= 1 ? 'ramp' : 'highway';
  return /alley/.test(l.type) ? 'alley' : 'street';
}

// the game's population gates (WorkerSystem.IsTodayOffDay; the 200/sqrt gate of shopping and leisure)
function gates(pop) {
  const root = Math.max(1, Math.sqrt(CONFIG.trafficReduction * pop));
  return { work: (Math.min(40, Math.round(100 / root)) + 1) / 100, leisure: (Math.min(80, Math.round(200 / root)) + 1) / 100 };
}

function runSim(g, lots, ctx, opts) {
  const t0 = Date.now();
  const R = rng(opts.seed || 1);
  const { nodes, links } = g;
  const mix = householdMix();
  const rates = CAL ? CAL.rates : null;
  if (!rates) throw new Error('tools/sim/calibration/calibration.json is missing (see README: Calibration).');
  const perHH = CAL.city.personsPerHousehold || mix.persons;
  // measured in the game (calibration/corwen_city.json): cars average a share of the speed limit between junctions
  // and lose time where a road arrives at or leaves a junction, by the kind of junction (braking, waiting for the
  // lights or a gap, turning, merging)
  linkTimes(links);

  // population and the game's traffic-reduction gates, relative to the calibration city
  const tileKm2 = ctx.tileKm2 || 1;
  const households = lots.reduce((s, l) => s + l.households, 0);
  const residentsTile = households * perHH;
  const cityPop = ctx.cityPop || residentsTile * (opts.cityKm2 || CONFIG.cityKm2) / tileKm2;
  const gNow = gates(cityPop), gRef = gates(CAL.city.population);
  const kWork = gNow.work / gRef.work, kLeisure = gNow.leisure / gRef.leisure;
  const pWork = Math.min(1, rates.workCarTripsPerWorker * kWork);
  const pLeisure = gNow.leisure;
  // an exported city: the share of shopping, leisure and other car trips that go out of the city, and of goods
  // trucks that come from outside (fitted to the traffic the game counts at its outside connections)
  const outsideShare = !ctx.city ? null : opts.outsideShare != null ? opts.outsideShare : CAL.city.outsideTripShare != null ? CAL.city.outsideTripShare : null;

  // free-flow costs and trees from every access node
  const ff = new Float64Array(links.length);
  links.forEach((l) => { ff[l.id] = l.lenM / l.vmax; });
  const accessNodes = [...new Set(lots.filter((l) => l.node >= 0).map((l) => l.node))];
  const ffTree = new Map();
  accessNodes.forEach((n) => ffTree.set(n, dijkstra(g, n, ff)));
  // gateways: where traffic from the wider region enters (tile edges, or the map border of an exported city)
  const gate = [], exitGate = [];
  (ctx.gates || []).forEach((i) => {
    const w = nodes[i].out.reduce((s, id) => s + links[id].lanes * links[id].vmax, 0), wi = nodes[i].inn.reduce((s, id) => s + links[id].lanes * links[id].vmax, 0);
    if (w > 0) gate.push({ node: i, w }); if (wi > 0) exitGate.push({ node: i, w: wi });
  });
  if (!gate.length) accessNodes.slice(0, 1).forEach((n) => gate.push({ node: n, w: 1 }));
  if (!exitGate.length) gate.forEach((x) => exitGate.push(x));
  gate.forEach((x) => { if (!ffTree.has(x.node)) ffTree.set(x.node, dijkstra(g, x.node, ff)); });
  const pickFrom = (arr) => { const tot = arr.reduce((s, x) => s + x.w, 0); let r = R() * tot; for (const x of arr) { r -= x.w; if (r <= 0) return x.node; } return arr[arr.length - 1].node; };
  const pickGate = () => pickFrom(gate), pickExit = () => pickFrom(exitGate);
  const isGate = new Set(gate.map((x) => x.node).concat(exitGate.map((x) => x.node)));
  const tff = (a, b) => (ffTree.get(a) ? ffTree.get(a).dist[b] : Infinity);

  // pick the cheapest target with the game's random 0.5–1 cost factor
  function choose(origin, cands, cost) {
    let best = null, bc = Infinity;
    for (const c of cands) {
      const t = cost(origin, c);
      if (!isFinite(t)) continue;
      const v = t * (CONFIG.pathRandom[0] + R() * (CONFIG.pathRandom[1] - CONFIG.pathRandom[0]));
      if (v < bc) { bc = v; best = c; }
    }
    return best;
  }
  const round = (x) => Math.floor(x) + (R() < x % 1 ? 1 : 0);
  const profile = CAL.startProfileByHour, profW = profile.reduce((s, x) => s + x, 0);
  const randomHour = () => { let r = R() * profW; for (let h = 0; h < 24; h++) { r -= profile[h]; if (r <= 0) return (h + R()) * HOUR; } return 23.5 * HOUR; };
  const pickWeighted = (arr, w) => { const tot = arr.reduce((s, x) => s + w(x), 0); let r = R() * tot; for (const x of arr) { r -= w(x); if (r <= 0) return x; } return arr[arr.length - 1]; };

  // workers -> jobs (greedy by cost, like FindJobSystem); outside commuters take the remaining jobs
  const homeLots = lots.filter((l) => l.households > 0 && l.node >= 0);
  const jobLots = lots.filter((l) => l.jobs > 0 && l.node >= 0);
  const free = new Map(jobLots.map((l) => [l, l.jobs]));
  const workers = [];
  const order = [];
  homeLots.forEach((h) => { const n = round(h.households * perHH * rates.workersPerResident); for (let i = 0; i < n; i++) order.push(h); });
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  let open = jobLots.slice(), unemployed = 0;
  for (const h of order) {
    const j = choose(h.node, open, (o, c) => tff(o, c.node) + 1);
    if (!j) { unemployed++; continue; }
    workers.push(newWorker(h.node, j));
    free.set(j, free.get(j) - 1);
    if (free.get(j) < 1) open = open.filter((x) => x !== j);
  }
  let outsideCommuters = 0;
  if (!ctx.city) open.forEach((j) => { const n = Math.floor(free.get(j)); for (let i = 0; i < n; i++) { workers.push(newWorker(-1, j)); outsideCommuters++; } });
  function shiftTimes(fam) {
    const sh = fam === 'commercial' || fam === 'office' ? SIM.familyShifts[fam] : fam === 'school' ? { evening: 0, night: 0 } : SIM.serviceShifts;
    const r = R(), shift = r < sh.night ? 2 : r < sh.night + sh.evening ? 1 : 0;
    const off = (-10922 + Math.floor(R() * 21845)) / 262144 + [0, 0.33, 0.67][shift];
    const start = (Math.round(24 * (CONFIG.workDayStart + off)) / 24 % 1 + 1) % 1, end = (Math.round(24 * (CONFIG.workDayEnd + off)) / 24 % 1 + 1) % 1;
    return { start: start * DAY, end: end * DAY };
  }
  function newWorker(home, j) {
    return Object.assign({ home, job: j.node, last: null, outside: home < 0 }, shiftTimes(j.kind === 'zone' ? j.family : 'service'));
  }
  const schools = lots.filter((l) => l.students > 0 && l.node >= 0);
  const shops = lots.filter((l) => l.family === 'commercial' && l.node >= 0);
  const leisureLots = lots.filter((l) => l.node >= 0 && (l.park || l.family === 'commercial'));
  const anyLots = lots.filter((l) => l.node >= 0);
  const serviceLots = lots.filter((l) => l.kind === 'building' && l.node >= 0 && /fire|police|health|garbage|deathcare|post|communications/.test(l.family || ''));
  const jobsTotal = jobLots.reduce((s, l) => s + l.jobs, 0);
  const industry = lots.filter((l) => l.family === 'industrial' && l.node >= 0);
  const pupils = round(households * rates.schoolCarTripsPerHousehold * kWork);
  const noSchool = schools.length ? 0 : pupils;

  // ---------------------------------------------------------------- dynamic simulation (1 s steps, game clock)
  const days = opts.days || 3, measureDay = days - 1, dt = 1;
  const L = links.length;
  const q = links.map(() => []);                     // vehicles on each link in FIFO order: [veh, ...]
  const credit = new Float64Array(L).fill(1);
  const flowEma = new Float64Array(L).fill(1);       // smoothed speed ratio (game: LaneFlow -> m_FlowOffset)
  const winDist = new Float64Array(L), winDur = new Float64Array(L);
  const NB = 4, roadDist = new Float64Array(g.roads * NB), roadDur = new Float64Array(g.roads * NB), roadVol = new Float64Array(g.roads);
  const linkVol = new Float64Array(L), linkMaxQ = new Float64Array(L), nodeWaitS = new Float64Array(nodes.length), nodeMaxQ = new Float64Array(nodes.length);
  const series = [], byClass = {};
  const roadTime = new Float64Array(g.roads), roadDistAll = new Float64Array(g.roads), roadDurVAll = new Float64Array(g.roads);
  const stats = { trips: 0, done: 0, walked: 0, despawned: 0, noPath: 0, byPurpose: {}, commuteS: [], tripS: [], spawnWaitS: 0, unfinished: 0 };
  // route search per trip, like the game's pathfinder: road cost = length / (speed limit × measured flow), refreshed
  // every game hour, and every road the search expands gets its own random factor 0.5–1 for this trip
  // (PathfindJobs.AddConnections), which spreads traffic over alternative routes
  const cost = ff.slice();
  let costEpoch = -1;
  const NN = nodes.length, rDist = new Float64Array(NN), rPred = new Int32Array(NN), rSeen = new Int32Array(NN), rDone = new Int32Array(NN);
  let rEpoch = 0;
  function routeFor(o, dst, now) {
    const ep = Math.floor(now / HOUR);
    if (ep !== costEpoch) { costEpoch = ep; for (let i = 0; i < L; i++) cost[i] = links[i].lenM / (links[i].vmax * Math.max(0.05, flowEma[i])); }
    const e = ++rEpoch, h = new Heap();
    rDist[o] = 0; rSeen[o] = e; rPred[o] = -1; h.push(0, o);
    while (h.size) {
      const u = h.pop();
      if (rDone[u] === e) continue;
      rDone[u] = e;
      if (u === dst) break;
      const du = rDist[u], out = nodes[u].out;
      for (let i = 0; i < out.length; i++) {
        const id = out[i], v = links[id].to;
        if (rDone[v] === e) continue;
        const nd = du + cost[id] * (CONFIG.pathRandom[0] + R() * (CONFIG.pathRandom[1] - CONFIG.pathRandom[0]));
        if (rSeen[v] !== e || nd < rDist[v]) { rSeen[v] = e; rDist[v] = nd; rPred[v] = id; h.push(nd, v); }
      }
    }
    if (rDone[dst] !== e) return [];
    const p = [];
    for (let n = dst; rPred[n] >= 0 && n !== o; n = links[rPred[n]].from) p.push(rPred[n]);
    return p.reverse();
  }
  // departures, ordered by time
  const events = new Heap();
  const scale = opts.demandScale || 1;
  function plan(dep, origin, dest, purpose, extra) { if (purpose !== 'home' && scale < 1 && R() > scale) return; events.push(dep, Object.assign({ dep, origin, dest, purpose }, extra || {})); }
  function planDay(d) {
    const base = d * DAY;
    const commute = (w, purpose) => {
      const o = w.outside ? w.oNode : w.home;
      const tt = w.last != null ? w.last : (tff(o, w.job) || 60) + 30;
      let dep = w.start - tt; if (dep < 0) dep += DAY;
      plan(base + dep, o, w.job, purpose, { worker: w, ret: base + (w.end > w.start ? w.end : w.end + DAY) });
    };
    // commutes: the measured car-commute rate per worker, scaled by the game's work gate for this city size
    workers.forEach((w) => { if (R() >= pWork) return; if (w.outside) w.oNode = pickGate(); commute(w, w.outside ? 'outside commuter' : 'work'); });
    for (let i = 0; i < pupils && homeLots.length; i++) {
      const h = pickWeighted(homeLots, (x) => x.households);
      const s = schools.length ? choose(h.node, schools, (o, c) => tff(o, c.node) + 1) : null;
      const w = Object.assign({ home: h.node, job: s ? s.node : pickGate(), last: null }, shiftTimes('school'));
      commute(w, 'school');
    }
    // an exported city: a measured share of these trips goes out of the city (outside connections), see calibration
    const away = () => outsideShare != null && R() < outsideShare;
    homeLots.forEach((h) => {
      const nShop = round(h.households * rates.shoppingCarTripsPerHousehold * kLeisure);
      for (let i = 0; i < nShop && shops.length; i++) {
        const s = away() ? { node: pickExit() } : choose(h.node, shops, (o, c) => tff(o, c.node) + 1);
        if (s) plan(base + randomHour(), h.node, s.node, 'shopping', { dwell: CONFIG.shoppingDwellH * HOUR });
      }
      const nLei = round(h.households * perHH * rates.leisureCarTripsPerResident * kLeisure);
      for (let i = 0; i < nLei && leisureLots.length; i++) {
        const s = away() ? { node: pickExit() } : choose(h.node, leisureLots, (o, c) => tff(o, c.node) + 1);
        if (s) plan(base + randomHour(), h.node, s.node, 'leisure', { dwell: CONFIG.leisureDwellH * HOUR });
      }
      const nOther = round(h.households * rates.otherCarTripsPerHousehold);
      for (let i = 0; i < nOther; i++) {
        const dest = (outsideShare != null ? away() : R() < CONFIG.otherToOutsideShare) ? pickExit() : anyLots[Math.floor(R() * anyLots.length)].node;
        plan(base + randomHour(), h.node, dest, 'other', { dwell: 1 * HOUR });
      }
    });
    // goods trucks: measured per shop or industry job (offices trade immaterial goods); to shops and industry,
    // from industry in the area or from the wider region (a tile without industry gets all of them from outside)
    const goodsLots = shops.concat(industry);
    const trucks = round(goodsLots.reduce((s, l) => s + l.jobs, 0) * rates.truckTripsPerGoodsJob);
    for (let i = 0; i < trucks && goodsLots.length; i++) {
      const s = pickWeighted(goodsLots, (x) => x.jobs);
      const local = industry.length && R() < (outsideShare != null ? 1 - outsideShare : CONFIG.localTruckShare);
      plan(base + randomHour(), local ? pickWeighted(industry, (x) => x.jobs).node : pickGate(), s.node, 'truck', { dwell: 0.25 * HOUR });
    }
    // city service vehicles (garbage, police, mail, hearses, ambulances)
    const svc = round(households * rates.serviceVehicleTripsPerHousehold);
    for (let i = 0; i < svc && homeLots.length; i++) {
      const h = homeLots[Math.floor(R() * homeLots.length)];
      const o = serviceLots.length ? serviceLots[Math.floor(R() * serviceLots.length)].node : pickGate();
      plan(base + R() * DAY, o, h.node, 'service vehicle', { dwell: 0.1 * HOUR });
    }
  }
  const waiting = nodes.map(() => []);               // cars waiting to enter the network at their origin
  let active = 0;
  const binW = (tod) => { const x = tod / DAY * 4; return [Math.max(0, Math.max(x - 3, 1 - x)), Math.max(0, 1 - Math.abs(x - 1)), Math.max(0, 1 - Math.abs(x - 2)), Math.max(0, 1 - Math.abs(x - 3))]; };

  // where a trip returns to: home, or out of the area through an exit when it came in from outside
  function back(e) { const o = e.worker && !e.worker.outside ? e.worker.home : e.origin; return isGate.has(o) ? pickExit() : o; }
  function depart(e, now) {
    const measuring = Math.floor(now / DAY) === measureDay;
    if (measuring) { stats.trips++; stats.byPurpose[e.purpose] = (stats.byPurpose[e.purpose] || 0) + 1; }
    // the calibrated rates are car trips already; a trip to its own driveway needs no car
    if (e.origin === e.dest || e.origin < 0 || e.dest < 0) {
      if (measuring) stats.walked++;
      if (e.worker && e.ret) plan(e.ret, e.dest, back(e), 'home');
      else if (e.dwell) plan(now + e.dwell + 60, e.dest, back(e), 'home');
      return;
    }
    const route = routeFor(e.origin, e.dest, now);
    if (!route.length || links[route[0]].from !== e.origin) { if (measuring) stats.noPath++; return; }
    const v = { route, k: 0, t0: now, tIn: now, tEnd: 0, e, measuring, head: 0 };
    waiting[e.origin].push(v);
  }
  function enter(v, l, now) {
    const lk = links[l], n = q[l].length;
    // free driving at the measured base speed; congestion comes from queues at the end of the road (capacity, storage,
    // junction shares), so the speed is not reduced again for density
    const speed = lk.vmax * lk.base;
    const prev = n ? q[l][n - 1].tEnd : 0;
    v.tIn = now; v.tEnd = Math.max(now + lk.lenM / speed + lk.endDelay, prev + 1 / lk.capLink);
    q[l].push(v); v.head = 0;
    if (v.measuring) linkVol[l]++;
  }
  function leaveLink(v, l, now) {
    const lk = links[l], dur = Math.max(1e-3, now - v.tIn);
    winDist[l] += lk.lenM; winDur[l] += dur * lk.vmax;
    if (Math.floor(now / DAY) === measureDay) {
      const w = binW(now % DAY), r = lk.road;
      for (let b = 0; b < NB; b++) { roadDist[r * NB + b] += w[b] * lk.lenM; roadDur[r * NB + b] += w[b] * dur * lk.vmax; }
      roadVol[r] += 1; roadTime[r] += dur; roadDistAll[r] += lk.lenM; roadDurVAll[r] += dur * lk.vmax;
      const c = byClass[lk.cls] || (byClass[lk.cls] = { time: 0, dist: 0, durV: 0 });
      c.time += dur; c.dist += lk.lenM; c.durV += dur * lk.vmax;
    }
  }
  function arrive(v, now) {
    active--;
    const e = v.e, dur = now - v.t0;
    if (v.measuring) { stats.done++; stats.tripS.push(dur); if (e.purpose === 'work' || e.purpose === 'school') stats.commuteS.push(dur); }
    if (e.worker && (e.purpose === 'work' || e.purpose === 'school' || e.purpose === 'outside commuter')) {
      e.worker.last = dur;
      const ret = Math.max(e.ret, now + 30);
      plan(ret, e.dest, back(e), 'home');
    } else if (e.dwell) plan(now + e.dwell, e.dest, back(e), 'home');
  }

  const order2 = new Int32Array(L).map((_, i) => i);
  const T = days * DAY;
  planDay(0);
  let nextDay = 1;
  for (let now = 0; now < T; now += dt) {
    if (now >= nextDay * DAY - 6 * HOUR && nextDay < days) { planDay(nextDay); nextDay++; }  // a little early: night-shift departures
    while (events.size && events.k[0] <= now) depart(events.pop(), now);
    // spawn waiting cars into their first link
    for (let n = 0; n < nodes.length; n++) {
      const w = waiting[n];
      for (let i = 0; i < w.length && i < 4;) {      // a lot's cars leave in order, but a car turning the other way isn't held up
        const v = w[i], l = v.route[0];
        if (q[l].length >= links[l].store) { i++; continue; }
        w.splice(i, 1); active++;
        if (v.measuring) stats.spawnWaitS += now - v.t0;
        enter(v, l, now);
      }
    }
    // move vehicles across nodes, links in random order
    for (let i = L - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const x = order2[i]; order2[i] = order2[j]; order2[j] = x; }
    for (let ii = 0; ii < L; ii++) {
      const l = order2[ii], Q = q[l];
      credit[l] = Math.min(credit[l] + links[l].cap * dt, Math.max(1, links[l].cap * dt));
      // one car per lane can be at the front: a car waiting to turn into a full road blocks its lane, not the whole road
      const lanes = links[l].lanes;
      let i = 0, blocked = 0;
      while (i < Q.length && blocked < lanes && Q[i].tEnd <= now) {
        const v = Q[i];
        if (v.k + 1 >= v.route.length) { Q.splice(i, 1); leaveLink(v, l, now); arrive(v, now); continue; }
        if (credit[l] < 1) break;
        const nx = v.route[v.k + 1];
        // StuckMovingObjectSystem: cars in a blocking loop are told to make space; here a car blocked for a while may
        // squeeze onto the full road ahead (one extra car per lane), which breaks gridlock loops
        const room = v.head >= CONFIG.squeezeAfterS ? links[nx].store + links[nx].lanes : links[nx].store;
        if (q[nx].length >= room) {
          v.head += dt;
          if (v.head >= CONFIG.stuckDespawnS) { Q.splice(i, 1); leaveLink(v, l, now); active--; if (v.measuring) stats.despawned++; continue; }
          blocked++; i++; continue;
        }
        credit[l] -= 1;
        Q.splice(i, 1); leaveLink(v, l, now);
        v.k++; enter(v, nx, now);
      }
    }
    // waiting time at junctions: cars that reached the end of their link but couldn't leave
    if (Math.floor(now / DAY) === measureDay) {
      for (let l = 0; l < L; l++) {
        const Q = q[l]; let w = 0;
        for (let i = 0; i < Q.length && Q[i].tEnd <= now; i++) w++;
        if (w) { nodeWaitS[links[l].to] += w * dt; if (w > linkMaxQ[l]) linkMaxQ[l] = w; if (w > nodeMaxQ[links[l].to]) nodeMaxQ[links[l].to] = w; }
      }
    }
    // smoothed flow per link (what the pathfinder sees), every 8 s like TrafficFlowSystem
    if (now % 8 === 0) {
      const a = 1 - Math.exp(-8 / CONFIG.flowSmoothingS);
      for (let l = 0; l < L; l++) {
        // cars still on the link count with the time they have spent so far
        let dist = winDist[l], dur = winDur[l];
        const Q = q[l];
        for (let i = 0; i < Q.length; i++) { const v = Q[i]; if (now - v.tIn > links[l].lenM / links[l].vmax) { dist += links[l].lenM * 0.5; dur += (now - v.tIn) * links[l].vmax * 0.5; } }
        const r = dur > 0 ? Math.min(1, dist / dur) : 1;
        flowEma[l] += a * (r - flowEma[l]); winDist[l] = 0; winDur[l] = 0;
      }
    }
    if (now % 30 === 0 && Math.floor(now / DAY) === measureDay) {
      let onRoad = 0, waitingN = 0; const byP = {};
      for (let l = 0; l < L; l++) { onRoad += q[l].length; for (const v of q[l]) byP[v.e.purpose] = (byP[v.e.purpose] || 0) + 1; }
      for (let n = 0; n < nodes.length; n++) waitingN += waiting[n].length;
      let fl = 0; for (let l = 0; l < L; l++) fl += flowEma[l];
      series.push({ t: now % DAY, onRoad, waiting: waitingN, flow: L ? fl / L : 1, byPurpose: byP });
    }
  }
  for (let n = 0; n < nodes.length; n++) stats.unfinished += waiting[n].filter((v) => v.measuring).length;
  for (let l = 0; l < L; l++) stats.unfinished += q[l].filter((v) => v.measuring).length;

  // ---------------------------------------------------------------- results
  const roadFlow = new Float64Array(g.roads);
  for (let r = 0; r < g.roads; r++) {
    let s = 0;
    for (let b = 0; b < NB; b++) { const d = roadDist[r * NB + b], u = roadDur[r * NB + b]; s += u > 0 ? Math.min(1, d / u) : 1; }
    roadFlow[r] = s / NB;
  }
  const cityFlow = g.roads ? roadFlow.reduce((s, x) => s + x, 0) / g.roads : 1;
  const linkFlow = links.map((l) => roadFlow[l.road]);
  const median = (a) => { if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const mean = (a) => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
  const roadsOut = [];
  for (let r = 0; r < g.roads; r++) {
    const ls = links.filter((l) => l.road === r);
    roadsOut.push({ road: r, ref: ls[0].ref, type: ls[0].type, flowPct: Math.round(roadFlow[r] * 100), vehicles: Math.round(ls.reduce((s, l) => s + linkVol[l.id], 0)),
      maxQueue: Math.round(Math.max(...ls.map((l) => linkMaxQ[l.id]))), lengthM: Math.round(ls.reduce((s, l) => s + l.lenM, 0) / (ls.length > 1 && ls.some((l) => l.from === ls[0].to && l.to === ls[0].from) ? 2 : 1)) });
  }
  const junctions = nodes.map((n, i) => ({ node: i, x: n.x, y: n.y, control: n.control, degree: n.degree, waitVehH: nodeWaitS[i] / HOUR, maxQueue: nodeMaxQ[i] }))
    .filter((j) => j.waitVehH > 0).sort((a, b) => b.waitVehH - a.waitVehH);
  const tripsCar = stats.trips - stats.walked - stats.noPath;
  const out = {
    name: ctx.name, valid: ctx.result ? ctx.result.ok : true, errors: ctx.result ? ctx.result.errors.length : 0, warnings: ctx.result ? ctx.result.warnings.length : 0,
    tile: { w: ctx.net ? ctx.net.W : 0, h: ctx.net ? ctx.net.H : 0, km2: Math.round(tileKm2 * 100) / 100 },
    network: { nodes: nodes.length, links: L, roads: g.roads, junctions: nodes.filter((n) => n.degree >= 3).length, signals: nodes.filter((n) => n.control === 'signal').length,
      wrapsAcrossEdges: nodes.some((n) => n.wrap), lotsWithoutCarAccess: lots.filter((l) => l.node < 0 && (l.households || l.jobs)).length },
    population: { households: Math.round(households), residentsTile: Math.round(residentsTile), cityPopulation: Math.round(cityPop), workers: workers.length - outsideCommuters,
      unemployed, outsideCommuters, jobs: Math.round(jobsTotal), pupils, withoutSchool: noSchool, pWork, pLeisure },
    trips: { total: stats.trips, byCar: tripsCar, walked: stats.walked, noRoute: stats.noPath, byPurpose: stats.byPurpose, completed: stats.done, despawned: stats.despawned, unfinished: stats.unfinished },
    result: {
      trafficFlowPct: Math.round(cityFlow * 100),
      completedPct: tripsCar ? Math.round(stats.done / tripsCar * 1000) / 10 : 100,
      despawnedPct: tripsCar ? Math.round(stats.despawned / tripsCar * 1000) / 10 : 0,
      medianCommuteMin: Math.round(median(stats.commuteS) / HOUR * 60), meanTripMin: Math.round(mean(stats.tripS) / HOUR * 60),
      meanSpawnWaitMin: tripsCar ? Math.round(stats.spawnWaitS / tripsCar / HOUR * 60 * 10) / 10 : 0,
      junctionDelayVehH: Math.round(junctions.reduce((s, j) => s + j.waitVehH, 0)),
      peakOnRoad: series.reduce((m, s) => Math.max(m, s.onRoad), 0),
    },
    worstRoads: roadsOut.slice().sort((a, b) => a.flowPct - b.flowPct || b.vehicles - a.vehicles).slice(0, 12),
    worstJunctions: junctions.slice(0, 10).map((j) => ({ x: Math.round(j.x * 10) / 10, y: Math.round(j.y * 10) / 10, control: j.control, roads: j.degree, delayVehH: Math.round(j.waitVehH * 10) / 10, maxQueue: j.maxQueue })),
    config: CONFIG, seconds: Math.round((Date.now() - t0) / 100) / 10,
  };
  // exported city: compare with the flow the game measured on the same roads
  if (ctx.city) {
    const gameRoad = new Float64Array(g.roads).fill(NaN);
    links.forEach((l) => { if (l.gameFlow) gameRoad[l.road] = l.gameFlow.reduce((x, y) => x + y, 0) / 4; });
    const pairs = [];
    for (let r = 0; r < g.roads; r++) if (!isNaN(gameRoad[r])) pairs.push([gameRoad[r], roadFlow[r], links.find((l) => l.road === r)]);
    const mg = mean(pairs.map((x) => x[0])), ms = mean(pairs.map((x) => x[1]));
    const cov = mean(pairs.map((x) => (x[0] - mg) * (x[1] - ms))), sg = Math.sqrt(mean(pairs.map((x) => (x[0] - mg) ** 2))), ss = Math.sqrt(mean(pairs.map((x) => (x[1] - ms) ** 2)));
    const byType = {};
    pairs.forEach(([gf, sf, l]) => { const k = l.highway ? 'highway' : l.type; (byType[k] = byType[k] || { n: 0, game: 0, sim: 0 }); byType[k].n++; byType[k].game += gf; byType[k].sim += sf; });
    Object.values(byType).forEach((v) => { v.game = Math.round(v.game / v.n * 100); v.sim = Math.round(v.sim / v.n * 100); });
    const congested = (f) => pairs.filter((x) => f(x)).length;
    // where the cars spend their time (share of car time on each road class) and how fast they go there
    const totT = Object.values(byClass).reduce((s, c) => s + c.time, 0) || 1;
    const carTime = {};
    Object.entries(byClass).forEach(([k, c]) => { carTime[k] = { share: +(c.time / totT).toFixed(3), speed: +(c.dist / Math.max(1e-9, c.durV)).toFixed(3) }; });
    const outsideVps = [...isGate].reduce((s, n) => s + nodes[n].inn.concat(nodes[n].out).reduce((t, id) => t + linkVol[id], 0), 0) / DAY;
    out.compare = { roads: pairs.length, gameMeanFlowPct: Math.round(mg * 100), simMeanFlowPct: Math.round(ms * 100), correlation: +(cov / (sg * ss || 1)).toFixed(2),
      meanAbsDiffPct: Math.round(mean(pairs.map((x) => Math.abs(x[0] - x[1]))) * 100), byType,
      gameBelow50: congested((x) => x[0] < 0.5), simBelow50: congested((x) => x[1] < 0.5), bothBelow50: congested((x) => x[0] < 0.5 && x[1] < 0.5),
      skippedEdges: ctx.skipped, gateways: gate.length, carTime, carsOnRoads: Math.round(totT / DAY), outsideVps: +outsideVps.toFixed(2), outsideShare };
  }
  // per road over the whole measured day: car time (s) and speed / limit, car-weighted (what the probe samples)
  const roadSpeed = Array.from(roadTime, (t, r) => (roadDurVAll[r] > 0 ? roadDistAll[r] / roadDurVAll[r] : null));
  out._draw = { occ: q.map((x) => x.length), headNext: q.map((x) => (x.length && x[0].k + 1 < x[0].route.length ? x[0].route[x[0].k + 1] : -1)), headWait: q.map((x) => (x.length ? x[0].head : 0)), links, linkFlow, linkVol, linkMaxQ, nodes, lots, series, result: ctx.result, layout: ctx.layout, junctions, roadFlow, roadTime, roadSpeed, gates: [...isGate] };
  return out;
}

// ---------------------------------------------------------------- report
function flowColor(f) { return f >= 0.85 ? '#2e9d4e' : f >= 0.7 ? '#9bc53d' : f >= 0.55 ? '#f2c12e' : f >= 0.4 ? '#f08a24' : '#d7263d'; }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
// map of an exported city: road curves coloured by the simulator's flow, or by the flow the game measured
function cityMapSVG(o, which) {
  const d = o._draw;
  // frame the built-up area (where the homes and jobs are); highways running off to the map border are cut off
  const lx = d.lots.map((l) => l.x).sort((p, q) => p - q), ly = d.lots.map((l) => l.y).sort((p, q) => p - q);
  const pct = (arr, f) => arr[Math.floor((arr.length - 1) * f)], pad = 40;
  const x0 = pct(lx, 0.005) - pad, x1 = pct(lx, 0.995) + pad, y0 = pct(ly, 0.005) - pad, y1 = pct(ly, 0.995) + pad;
  const S = 720 / Math.max(x1 - x0, y1 - y0), Wp = (x1 - x0) * S + 20, Hp = (y1 - y0) * S + 20;
  const X = (v) => ((v / CELL - x0) * S + 10).toFixed(1), Y = (v) => ((v / CELL - y0) * S + 10).toFixed(1);
  const maxVol = Math.max(1, ...d.linkVol);
  let svg = `<svg viewBox="0 0 ${Wp.toFixed(0)} ${Hp.toFixed(0)}" width="100%" style="max-width:${Wp.toFixed(0)}px;background:var(--map);overflow:hidden">`;
  const drawn = new Set();
  d.links.forEach((l) => {
    const piece = l.road + ':' + Math.min(l.from, l.to) + '-' + Math.max(l.from, l.to);
    if (which === 'game' && drawn.has(piece)) return;
    drawn.add(piece);
    const f = which === 'game' ? l.gameFlow.reduce((a, b) => a + b, 0) / 4 : d.linkFlow[l.id];
    const c = l.curve, w = which === 'game' ? (l.highway ? 2.2 : 1.4) : 0.8 + 2.6 * Math.sqrt(d.linkVol[l.id] / maxVol);
    svg += `<path d="M${X(c[0])} ${Y(c[1])}C${X(c[2])} ${Y(c[3])} ${X(c[4])} ${Y(c[5])} ${X(c[6])} ${Y(c[7])}" fill="none" stroke="${flowColor(f)}" stroke-width="${w.toFixed(1)}" stroke-linecap="round"><title>${esc(l.type)} · ${which === 'game' ? 'game' : 'simulator'} flow ${Math.round(f * 100)}%${which === 'game' ? '' : ' · ' + Math.round(d.linkVol[l.id]) + ' cars/day'}</title></path>`;
  });
  if (which !== 'game') d.junctions.slice(0, 10).forEach((j, i) => { svg += `<circle cx="${((j.x - x0) * S + 10).toFixed(1)}" cy="${((j.y - y0) * S + 10).toFixed(1)}" r="${(4 + Math.min(6, j.waitVehH / 40)).toFixed(1)}" fill="none" stroke="#d7263d" stroke-width="1.5"><title>Junction #${i + 1}: ${j.waitVehH.toFixed(1)} vehicle-hours of waiting</title></circle>`; });
  return svg + '</svg>';
}

function reportHTML(o) {
  if (o.compare) return cityReportHTML(o);
  const d = o._draw, lay = d.layout, W = lay.bounds ? lay.bounds.w : 200, H = lay.bounds ? lay.bounds.h : 200;
  const S = Math.min(720 / W, 720 / H);
  const maxVol = Math.max(1, ...d.linkVol);
  let svg = `<svg viewBox="0 0 ${W * S} ${H * S}" width="100%" style="max-width:${W * S}px;background:var(--map)">`;
  d.result._items.forEach((it) => {
    const p = it.poly.map((q) => (q[0] * S).toFixed(1) + ',' + (q[1] * S).toFixed(1)).join(' ');
    const col = it.kind === 'zone' ? ({ residential: '#5aa469', commercial: '#4f86c6', office: '#9b72cf' }[it.zone.family] || '#999') : '#8a8a8a';
    svg += `<polygon points="${p}" fill="${col}" fill-opacity="${it.kind === 'zone' ? 0.18 : 0.35}" stroke="none"/>`;
  });
  d.result._roads.forEach((r) => { const p = r.poly.map((q) => (q[0] * S).toFixed(1) + ',' + (q[1] * S).toFixed(1)).join(' '); svg += `<polygon points="${p}" fill="var(--road)"/>`; });
  d.links.forEach((l) => {
    const dx = l.p1[0] - l.p0[0], dy = l.p1[1] - l.p0[1], len = Math.hypot(dx, dy) || 1, off = Math.max(0.3, (SIM.roads[l.type].widthCells || 1) / 4);
    const nx = -dy / len * off, ny = dx / len * off;   // drive on the right
    const w = 0.8 + 3.2 * Math.sqrt(d.linkVol[l.id] / maxVol);
    svg += `<line x1="${((l.p0[0] + nx) * S).toFixed(1)}" y1="${((l.p0[1] + ny) * S).toFixed(1)}" x2="${((l.p1[0] + nx) * S).toFixed(1)}" y2="${((l.p1[1] + ny) * S).toFixed(1)}" stroke="${flowColor(d.linkFlow[l.id])}" stroke-width="${w.toFixed(1)}" stroke-linecap="round"><title>${esc(l.ref)} · ${esc(l.type)} · flow ${Math.round(d.linkFlow[l.id] * 100)}% · ${Math.round(d.linkVol[l.id])} cars/day</title></line>`;
  });
  d.junctions.slice(0, 10).forEach((j, i) => { svg += `<circle cx="${(j.x * S).toFixed(1)}" cy="${(j.y * S).toFixed(1)}" r="${(4 + Math.min(10, j.waitVehH)).toFixed(1)}" fill="none" stroke="#d7263d" stroke-width="2"><title>Junction #${i + 1}: ${j.waitVehH.toFixed(1)} vehicle-hours of waiting</title></circle>`; });
  svg += '</svg>';
  // day chart
  const ser = d.series, cw = 720, ch = 160, maxOn = Math.max(1, ...ser.map((s) => s.onRoad + s.waiting));
  let chart = `<svg viewBox="0 0 ${cw} ${ch + 24}" width="100%" style="max-width:${cw}px">`;
  const X = (t) => (t / DAY * cw).toFixed(1);
  chart += `<polyline fill="none" stroke="var(--accent)" stroke-width="2" points="${ser.map((s) => X(s.t) + ',' + (ch - s.onRoad / maxOn * ch).toFixed(1)).join(' ')}"/>`;
  chart += `<polyline fill="none" stroke="#d7263d" stroke-width="1.5" stroke-dasharray="4 3" points="${ser.map((s) => X(s.t) + ',' + (ch - s.waiting / maxOn * ch).toFixed(1)).join(' ')}"/>`;
  chart += `<polyline fill="none" stroke="#2e9d4e" stroke-width="1.5" points="${ser.map((s) => X(s.t) + ',' + (ch - s.flow * ch).toFixed(1)).join(' ')}"/>`;
  for (let h = 0; h <= 24; h += 3) chart += `<text x="${X(h * HOUR)}" y="${ch + 16}" font-size="11" text-anchor="middle" fill="currentColor">${String(h).padStart(2, '0')}:00</text>`;
  chart += '</svg>';
  const r = o.result, pp = o.population, tr = o.trips;
  const purpose = Object.entries(tr.byPurpose).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${esc(k)} ${v.toLocaleString('en')}`).join(' · ');
  const row = (cells) => '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Traffic simulation</title><style>
:root{--bg:#fff;--fg:#1d2330;--muted:#5f6b7a;--card:#f4f6f9;--map:#eef1f4;--road:#c9ced6;--accent:#2f6fd0;--line:#dde2e8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#14171c;--fg:#e6e9ee;--muted:#9aa5b4;--card:#1d2229;--map:#1a1f26;--road:#3a414b;--accent:#6ea2ff;--line:#2c333c}}
:root[data-theme="dark"]{--bg:#14171c;--fg:#e6e9ee;--muted:#9aa5b4;--card:#1d2229;--map:#1a1f26;--road:#3a414b;--accent:#6ea2ff;--line:#2c333c}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}main{max-width:780px;margin:0 auto;padding:20px 16px 48px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px}.muted{color:var(--muted)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:16px 0}.kpi{background:var(--card);border-radius:10px;padding:10px 12px}
.kpi b{display:block;font-size:24px}.kpi span{color:var(--muted);font-size:13px}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border-bottom:1px solid var(--line);padding:5px 6px;text-align:left}
th{color:var(--muted);font-weight:600}.legend span{display:inline-block;width:12px;height:12px;border-radius:2px;margin:0 4px 0 10px;vertical-align:-1px}.wrap{overflow-x:auto}
</style></head><body><main>
<h1>Traffic simulation</h1><div class="muted">${esc(o.name)} · tile ${o.tile.w}×${o.tile.h} cells (${o.tile.km2} km²) · validator: ${o.valid ? 'valid' : o.errors + ' errors'}, ${o.warnings} warnings</div>
<div class="kpis">
<div class="kpi"><b>${r.trafficFlowPct}%</b><span>traffic flow (game metric)</span></div>
<div class="kpi"><b>${r.completedPct}%</b><span>car trips completed</span></div>
<div class="kpi"><b>${r.medianCommuteMin} min</b><span>median commute (game time)</span></div>
<div class="kpi"><b>${r.junctionDelayVehH.toLocaleString('en')}</b><span>vehicle-hours waiting at junctions</span></div>
</div>
<h2>Road network over one day</h2>
<div class="wrap">${svg}</div>
<div class="legend muted" style="font-size:13px">Flow:<span style="background:#2e9d4e"></span>≥85%<span style="background:#9bc53d"></span>70–85<span style="background:#f2c12e"></span>55–70<span style="background:#f08a24"></span>40–55<span style="background:#d7263d"></span>&lt;40% · line width = cars per day · red circles = worst junctions</div>
<h2>Through the day</h2>
<div class="wrap">${chart}</div>
<div class="muted" style="font-size:13px"><span style="color:var(--accent)">━</span> cars driving <span style="color:#d7263d">┅</span> cars waiting to leave a lot <span style="color:#2e9d4e">━</span> average flow (0–100%)</div>
<h2>Demand</h2>
<table><tbody>
${row(['Households in the tile', pp.households.toLocaleString('en')])}
${row(['City size assumed', `${pp.cityPopulation.toLocaleString('en')} residents (${CONFIG.cityKm2} km² of this tile)`])}
${row(['Workers driving to work on a given day', Math.round(pp.pWork * 100) + '% (measured in the game, scaled by its city-size rule)'])}
${row(['Workers with a job in the tile / unemployed / commuting in', `${pp.workers.toLocaleString('en')} / ${pp.unemployed.toLocaleString('en')} / ${pp.outsideCommuters.toLocaleString('en')}`])}
${row(['Pupils with a school seat / without', `${pp.pupils.toLocaleString('en')} / ${pp.withoutSchool.toLocaleString('en')}`])}
${row(['Trips on the measured day', `${tr.total.toLocaleString('en')} (${tr.byCar.toLocaleString('en')} by car, ${tr.walked.toLocaleString('en')} walked)`])}
${row(['By purpose', purpose])}
${row(['Car trips removed after being stuck 10 min', `${tr.despawned.toLocaleString('en')} (${r.despawnedPct}%)`])}
${row(['Average wait before a car can leave its lot', r.meanSpawnWaitMin + ' min'])}
</tbody></table>
<h2>Worst roads</h2><div class="wrap"><table><thead><tr><th>Road</th><th>Type</th><th>Flow</th><th>Cars/day</th><th>Longest queue</th></tr></thead><tbody>
${o.worstRoads.map((x) => row([esc(x.ref), esc(x.type), x.flowPct + '%', x.vehicles.toLocaleString('en'), x.maxQueue])).join('')}
</tbody></table></div>
<h2>Worst junctions</h2><div class="wrap"><table><thead><tr><th>#</th><th>Cell</th><th>Control</th><th>Roads</th><th>Waiting (veh-h)</th><th>Longest queue</th></tr></thead><tbody>
${o.worstJunctions.map((x, i) => row([i + 1, x.x + ', ' + x.y, x.control, x.roads, x.delayVehH, x.maxQueue])).join('')}
</tbody></table></div>
<h2>How this was simulated</h2>
<p class="muted" style="font-size:14px">The tile repeats in every direction (an endless city of copies), so through-traffic from neighbouring tiles is included and roads that don't continue across the tile edges are dead ends. One game day lasts 4,369 s of driving, as in the game. Trip timing, shifts, the city-size gates, route choice on measured flow and the flow metric follow the game code; trip rates, base driving speeds and road capacities were measured in a real game city (see tools/sim/README.md). The last of ${o._days || 3} simulated days is reported; the days before let commute times and route choices settle. Simulated in ${o.seconds} s. Network: ${o.network.junctions} junctions (${o.network.signals} with signals), ${o.network.roads} road pieces${o.network.wrapsAcrossEdges ? '' : ', <b>no road continues across the tile edges</b>'}${o.network.lotsWithoutCarAccess ? `, ${o.network.lotsWithoutCarAccess} lots without car access` : ''}.</p>
</main></body></html>`;
}

function reportShell(body, title) {
  const css = reportHTML.toString().match(/<style>([\s\S]*?)<\/style>/)[1];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${css}.tabs{display:flex;gap:6px;margin:0 0 8px}.tabs button{font:inherit;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;padding:4px 12px;cursor:pointer}.tabs button.on{background:var(--accent);color:#fff;border-color:var(--accent)}</style></head><body><main>${body}</main></body></html>`;
}

// report for a city exported from the game: the simulator next to what the game measured
function cityReportHTML(o) {
  const k = o.compare, r = o.result, tr = o.trips, pp = o.population;
  const row = (cells) => '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>';
  const names = { highway: 'Highways', two_lane_road: 'Two-lane roads', four_lane_road: 'Four-lane roads', four_lane_divided_road: 'Four-lane divided roads', alley: 'Alleys', gravel_road: 'Gravel roads' };
  const purpose = Object.entries(tr.byPurpose).sort((a, b) => b[1] - a[1]).map(([x, v]) => `${esc(x)} ${v.toLocaleString('en')}`).join(' · ');
  return reportShell(`<h1>${esc(o.name)}</h1><div class="muted">A city exported from Cities: Skylines II, simulated with the same model as the layouts and compared with the flow the game measured on the same roads.</div>
<div class="kpis">
<div class="kpi"><b>${k.simMeanFlowPct}%</b><span>average road flow, simulator</span></div>
<div class="kpi"><b>${k.gameMeanFlowPct}%</b><span>average road flow, game</span></div>
<div class="kpi"><b>${pp.households.toLocaleString('en')}</b><span>households</span></div>
<div class="kpi"><b>${r.peakOnRoad.toLocaleString('en')}</b><span>cars on the road at peak (simulator)</span></div>
</div>
<h2>Road flow</h2>
<div class="tabs"><button class="on" data-map="sim">Simulator</button><button data-map="game">Game</button></div>
<div class="wrap map" id="map-sim">${cityMapSVG(o, 'sim')}</div>
<div class="wrap map" id="map-game" hidden>${cityMapSVG(o, 'game')}</div>
<div class="legend muted" style="font-size:13px">Flow:<span style="background:#2e9d4e"></span>≥85%<span style="background:#9bc53d"></span>70–85<span style="background:#f2c12e"></span>55–70<span style="background:#f08a24"></span>40–55<span style="background:#d7263d"></span>&lt;40% · simulator: line width = cars per day, red circles = worst junctions</div>
<h2>Simulator vs game by road type</h2>
<div class="wrap"><table><thead><tr><th>Road type</th><th>Pieces</th><th>Game</th><th>Simulator</th></tr></thead><tbody>
${Object.entries(k.byType).sort((a, b) => b[1].n - a[1].n).map(([t, v]) => row([names[t] || esc(t), v.n, v.game + '%', v.sim + '%'])).join('')}
${row(['<b>All</b>', k.roads, '<b>' + k.gameMeanFlowPct + '%</b>', '<b>' + k.simMeanFlowPct + '%</b>'])}
</tbody></table></div>
<p class="muted" style="font-size:14px">Road by road the two agree only loosely (correlation ${k.correlation}, average difference ${k.meanAbsDiffPct} points): the simulator knows how many trips the city makes, but not where each one really goes. Below 50 % flow: ${k.gameBelow50} pieces in the game, ${k.simBelow50} in the simulator, ${k.bothBelow50} in both.</p>
<h2>Simulated day</h2>
<table><tbody>
${row(['Trips on the measured day', tr.total.toLocaleString('en')])}
${row(['By purpose', purpose])}
${row(['Car trips completed', r.completedPct + '%'])}
${row(['Median commute (game time)', r.medianCommuteMin + ' min'])}
${row(['Vehicle-hours waiting at junctions', r.junctionDelayVehH.toLocaleString('en')])}
${row(['Network', `${o.network.junctions} junctions (${o.network.signals} with signals), ${o.network.roads} road pieces, ${k.gateways} outside connections`])}
</tbody></table>
<script>document.querySelectorAll('.tabs button').forEach(function(b){b.onclick=function(){document.querySelectorAll('.tabs button').forEach(function(x){x.classList.toggle('on',x===b)});document.querySelectorAll('.map').forEach(function(m){m.hidden=m.id!=='map-'+b.dataset.map})}})</script>`, o.name + ' traffic');
}

// ---------------------------------------------------------------- CLI
function main() {
  const a = process.argv.slice(2);
  const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  const days = +opt('--days', 3), seed = +opt('--seed', 1), cityKm2 = +opt('--city-km2', CONFIG.cityKm2);
  const run = (file) => { const lay = readLayout(file); const o = simulate(lay, { days, seed, cityKm2 }); o._days = days; return o; };
  if (a.includes('--city')) {
    const city = JSON.parse(fs.readFileSync(opt('--city'), 'utf8'));
    const name = opt('--name', path.basename(opt('--city')).replace(/\.json$/, '').replace(/_city$/, '').replace(/^./, (c) => c.toUpperCase()));
    const o = simulateCity(city, { days, seed, name });
    const outFile = opt('--out', path.join(__dirname, 'out', name.toLowerCase().replace(/\W+/g, '-') + '.html'));
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, reportHTML(o));
    const clean = Object.assign({}, o); delete clean._draw; delete clean.config;
    if (a.includes('--json')) console.log(JSON.stringify(clean, null, 1));
    else console.log(`${name}: simulator ${o.compare.simMeanFlowPct}% vs game ${o.compare.gameMeanFlowPct}% average road flow\n  report: ${outFile}`);
    return;
  }
  if (a.includes('--all')) {
    const dir = opt('--all'), outDir = path.join(__dirname, 'out');
    fs.mkdirSync(outDir, { recursive: true });
    const files = fs.readdirSync(dir).filter((f) => /\.(json|html)$/.test(f)).sort();
    console.log('layout          flow  done%  stuck%  commute  trips   cars  hh       city-pop  pWork  jdelay  secs');
    const rows = [];
    for (const f of files) {
      try {
        const o = run(path.join(dir, f));
        fs.writeFileSync(path.join(outDir, f.replace(/\.(json|html)$/, '.html')), reportHTML(o));
        const r = o.result;
        rows.push({ f, o });
        if (!o.trips.total) { console.log(f.replace(/\.(json|html)$/, '').padEnd(15) + ' no traffic (no homes or jobs in the layout)'); continue; }
        console.log(f.replace(/\.(json|html)$/, '').padEnd(15) + String(r.trafficFlowPct + '%').padStart(5) + String(r.completedPct).padStart(7) + String(r.despawnedPct).padStart(8) +
          String(r.medianCommuteMin + 'm').padStart(9) + String(o.trips.total).padStart(7) + String(o.trips.byCar).padStart(7) + String(o.population.households).padStart(8) +
          String(o.population.cityPopulation).padStart(11) + String(Math.round(o.population.pWork * 100) + '%').padStart(7) + String(r.junctionDelayVehH).padStart(8) + String(o.seconds).padStart(6));
      } catch (e) { console.log(f.padEnd(15) + ' ERROR ' + e.message); }
    }
    return;
  }
  const file = a.find((x) => !x.startsWith('--') && a[a.indexOf(x) - 1] !== '--out' && !/^\d/.test(x));
  if (!file) { console.log('usage: node tools/sim/simulate.js <layout.json|page.html> [--out report.html] [--json] [--days 3] [--seed 1] [--city-km2 16]\n       node tools/sim/simulate.js --all <dir>'); process.exit(1); }
  const o = run(file);
  const outFile = opt('--out', path.join(__dirname, 'out', path.basename(file).replace(/\.(json|html)$/i, '') + '.html'));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, reportHTML(o));
  const clean = Object.assign({}, o); delete clean._draw; delete clean._days;
  if (a.includes('--json')) console.log(JSON.stringify(clean, null, 1));
  else {
    const r = o.result;
    console.log(`${o.name}\n  traffic flow ${r.trafficFlowPct}% · car trips completed ${r.completedPct}% · stuck ${r.despawnedPct}% · median commute ${r.medianCommuteMin} min · junction delay ${r.junctionDelayVehH} veh-h`);
    console.log(`  ${o.trips.total} trips (${o.trips.byCar} by car) · ${o.population.households} households · city ${o.population.cityPopulation} · ${Math.round(o.population.pWork * 100)}% of workers commute per day`);
    console.log('  report: ' + outFile + `  (${o.seconds} s)`);
  }
}

module.exports = { simulate, simulateCity, cityGraph, linkTimes, reportHTML, readLayout, CONFIG, CAL };
if (require.main === module) main();
