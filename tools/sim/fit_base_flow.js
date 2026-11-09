#!/usr/bin/env node
// Fit the simulator's base driving speed and junction losses to a city exported from the game (game-probe export).
// On the quieter half of each road class: time per car = (length / limit) / speedShare + junctionEndS × junction ends,
// least squares, then written into calibration/calibration.json as "baseFlow".
//   node tools/sim/fit_base_flow.js [calibration/corwen_city.json]
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const file = process.argv[2] || path.join(__dirname, 'calibration', 'corwen_city.json');
const city = JSON.parse(fs.readFileSync(file, 'utf8'));
const assets = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets.json'), 'utf8'));
const sim = JSON.parse(fs.readFileSync(path.join(__dirname, 'sim_data.json'), 'utf8'));
const byPrefab = {}; assets.roads.forEach((r) => { byPrefab[r.prefab] = r; });
const deg = {}; city.edges.forEach((e) => { deg[e.a] = (deg[e.a] || 0) + 1; deg[e.b] = (deg[e.b] || 0) + 1; });
const cls = (r, sd) => sd.highway ? (sd.lanesFwd + sd.lanesBack <= 1 ? 'ramp' : 'highway') : /alley/.test(r.id) ? 'alley' : 'street';
const rows = [];
city.edges.forEach((e) => {
  const r = byPrefab[e.prefab], sd = r && sim.roads[r.id];
  if (!sd || e.owned) return;
  const f = e.flow.reduce((x, y) => x + y, 0) / 4, vol = e.volume.reduce((x, y) => x + y, 0) / 4;
  const t0 = e.len / (sd.speedKmh / 3.6);
  // a road piece ends at a junction where 3+ pieces meet; the car passes one junction per piece (its downstream end)
  const ends = ((deg[e.a] >= 3 ? 1 : 0) + (deg[e.b] >= 3 ? 1 : 0)) / 2;
  rows.push({ c: cls(r, sd), t0, dur: t0 / Math.max(f, 0.02), ends, vol, f });
});
const out = {};
for (const c of ['street', 'alley', 'highway', 'ramp']) {
  const rs = rows.filter((r) => r.c === c).sort((a, b) => a.vol - b.vol);
  const use = rs.slice(0, Math.ceil(rs.length / 2));
  let s11 = 0, s12 = 0, s22 = 0, y1 = 0, y2 = 0;
  use.forEach((r) => { s11 += r.t0 * r.t0; s12 += r.t0 * r.ends; s22 += r.ends * r.ends; y1 += r.t0 * r.dur; y2 += r.ends * r.dur; });
  const det = s11 * s22 - s12 * s12;
  let u = (y1 * s22 - y2 * s12) / det, D = (s11 * y2 - s12 * y1) / det;
  // highway and ramp merges are modelled by merge priority in the simulator (waiting there depends on the main
  // road's traffic), so only street and alley junctions get a fixed loss
  if (D < 0 || c === 'highway' || c === 'ramp') { D = 0; u = y1 / s11; }
  if (u < 1) u = 1;
  out[c] = { speedShare: +(1 / u).toFixed(3), junctionEndS: +D.toFixed(1), roads: use.length, gameMeanFlowQuiet: +(use.reduce((s, r) => s + r.f, 0) / use.length).toFixed(2) };
}
const calFile = path.join(__dirname, 'calibration', 'calibration.json');
const cal = JSON.parse(fs.readFileSync(calFile, 'utf8'));
cal.baseFlow = out;
cal.baseFlowSource = 'Fitted by tools/sim/fit_base_flow.js on the quieter half of each road class in ' + path.basename(file);
fs.writeFileSync(calFile, JSON.stringify(cal, null, 1));
console.log(JSON.stringify(out, null, 1));
