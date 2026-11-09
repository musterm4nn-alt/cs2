#!/usr/bin/env node
// Calibrate the simulator against a city measured in the game (game-probe), and write calibration/calibration.json:
//
//   capacity   cars per second per lane along a road (city roads, highways) and out of an approach into a junction
//              (city junctions, highway merges and splits), the share of a signal cycle lost to change-over, the
//              capacity share of minor approaches and of ramps at merges
//   city.outsideTripShare   the share of shopping, leisure and other car trips (and of goods trucks) that cross the
//              city's outside connections
//   freeFlow   cars drive at a share of the speed limit between junctions (per road class) and lose time where a road
//              arrives at / leaves a junction (per kind of road end: lights, major or minor road, merge, split, dead end)
//
// Targets, all measured in the game:
//   - the flow % of every road piece (the game's traffic-flow metric; city export) and the city average,
//   - the speed of the cars on every road piece and where the cars spend their time, by road class (the probe samples
//     every moving car once a game minute: calibration/<city>_drive.json),
//   - the traffic through the outside connections (city export).
// Capacities and the outside share are fitted by coordinate search with the simulator itself; the free-driving model
// is fitted on all road pieces in flow space, then refined: the time the simulator's queues add on top of free
// driving is taken out of the target and the model is fitted again.
//
//   node tools/sim/calibrate.js [--city calibration/corwen_city.json] [--drive calibration/corwen_drive.json] [--quick]
'use strict';
const fs = require('fs');
const path = require('path');
const S = require('./simulate.js');

const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const cityFile = opt('--city', path.join(__dirname, 'calibration', 'corwen_city.json'));
const driveFile = opt('--drive', path.join(__dirname, 'calibration', 'corwen_drive.json'));
const quick = a.includes('--quick');
const DAYS = 2;
const city = JSON.parse(fs.readFileSync(cityFile, 'utf8'));
const drive = fs.existsSync(driveFile) ? JSON.parse(fs.readFileSync(driveFile, 'utf8')) : null;
const DAY = 262144 / 60;

// ---------------------------------------------------------------- targets
const { g } = S.cityGraph(city);
const CLASSES = ['street', 'alley', 'highway', 'ramp'];
const ROLES = ['end', 'signal', 'major', 'minor', 'merge', 'split'];
const roads = new Map();
g.links.forEach((l) => {
  if (!roads.has(l.road)) roads.set(l.road, { id: l.road, seg: l.seg, links: [], game: l.gameFlow.reduce((x, y) => x + y, 0) / 4, cls: l.cls });
  roads.get(l.road).links.push(l);
});
const R = [...roads.values()];
// probe: car-weighted speed per road piece, and car time per road class
const dEdge = drive ? drive.edges : {};
const totalSamples = Object.values(dEdge).reduce((s, e) => s + e.n, 0);
R.forEach((r) => { const e = dEdge[city.edges[r.seg].id]; r.driveN = e ? e.n : 0; r.driveSpeed = e && e.n ? e.r / e.n : null; });
const gameShare = {};
R.forEach((r) => { gameShare[r.cls] = (gameShare[r.cls] || 0) + r.driveN / Math.max(1, totalSamples); });
const gameCars = drive && drive.calls ? drive.samples / drive.calls : null;   // cars on road pieces, on average
const gamePeak = drive && drive.carsMoving ? drive.carsMoving.max : null;     // most cars on the move at once
// traffic through the outside connections: vehicles per second on the road pieces at the map border
const ext = Math.max(...g.nodes.map((n) => Math.max(Math.abs(n.x), Math.abs(n.y))));
const borderSegs = new Set();
g.nodes.forEach((n) => { if (n.id != null && (Math.abs(n.x) > ext - 10 || Math.abs(n.y) > ext - 10) && n.inn.length + n.out.length <= 2) n.inn.concat(n.out).forEach((id) => borderSegs.add(g.links[id].seg)); });
// the export's "volume" (TrafficFlowSystem: (distance0 + distance1) × 8/3) × 3 = cars per game day on that road
// piece, checked against the probe (cars on the piece × their speed / its length: median 3.1)
const VOLUME_TO_DAY = 3;
const gameOutside = [...borderSegs].reduce((s, seg) => s + VOLUME_TO_DAY * city.edges[seg].volume.reduce((x, y) => x + y, 0) / 4 / DAY, 0);

const corr = (x, y) => { const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n; let c = 0, vx = 0, vy = 0; for (let i = 0; i < n; i++) { c += (x[i] - mx) * (y[i] - my); vx += (x[i] - mx) ** 2; vy += (y[i] - my) ** 2; } return c / Math.sqrt(vx * vy || 1); };

// ---------------------------------------------------------------- one simulator run and its distance to the game
function evaluate(cap, outsideShare, freeFlow) {
  S.CAL.freeFlow = freeFlow;
  const o = S.simulateCity(city, { days: DAYS, seed: 1, config: cap, outsideShare });
  const d = o._draw;
  const flowRmse = Math.sqrt(R.reduce((s, r) => s + (d.roadFlow[r.id] - r.game) ** 2, 0) / R.length);
  let sw = 0, se = 0;
  R.forEach((r) => { if (r.driveSpeed == null || !r.driveN) return; const sp = d.roadSpeed[r.id] == null ? 1 : d.roadSpeed[r.id]; sw += r.driveN; se += r.driveN * (sp - r.driveSpeed) ** 2; });
  const speedRmse = sw ? Math.sqrt(se / sw) : 0;
  const ct = o.compare.carTime;
  const shareErr = CLASSES.reduce((s, c) => s + Math.abs((ct[c] ? ct[c].share : 0) - (gameShare[c] || 0)), 0);
  const simOutside = o.compare.outsideVps;   // the same border road pieces (simulator gateways)
  const outsideErr = Math.abs(Math.log(Math.max(0.01, simOutside) / Math.max(0.01, gameOutside)));
  // the city's average flow is the headline number: an offset there counts twice
  const biasErr = Math.abs(o.compare.simMeanFlowPct - o.compare.gameMeanFlowPct) / 100;
  // how many cars are on the roads (a gridlocked simulation piles them up)
  const carsErr = gameCars ? Math.abs(Math.log(Math.max(1, o.compare.carsOnRoads) / gameCars)) : 0;
  // the game's traffic is steady (cars on the move stay within its measured range); a simulation that keeps
  // piling up cars beyond the game's peak is overloaded
  const peakErr = gamePeak ? Math.max(0, Math.log(Math.max(1, o.result.peakOnRoad) / gamePeak)) : 0;
  const J = flowRmse + 2 * biasErr + (drive ? speedRmse + 0.5 * shareErr + 0.5 * carsErr + peakErr : 0) + 0.25 * outsideErr;
  return { J, flowRmse, speedRmse, shareErr, outsideErr, biasErr, carsErr, peakErr, simOutside, o };
}
const fmt = (e) => `J ${e.J.toFixed(3)} · road flow rmse ${(e.flowRmse * 100).toFixed(1)} · car speed rmse ${(e.speedRmse * 100).toFixed(1)} · car time by class off by ${(e.shareErr * 50).toFixed(0)}% · cars ${e.o.compare.carsOnRoads}/${gameCars ? Math.round(gameCars) : '-'} · outside ${e.simOutside.toFixed(2)}/${gameOutside.toFixed(2)} veh/s · mean flow ${e.o.compare.simMeanFlowPct}/${e.o.compare.gameMeanFlowPct}% corr ${e.o.compare.correlation} · peak ${e.o.result.peakOnRoad}/${gamePeak || "-"} · done ${e.o.result.completedPct}%`;

// ---------------------------------------------------------------- free-driving model (fit in flow space)
const fnames = CLASSES.map((c) => 's:' + c).concat(ROLES.map((r) => 'in:' + r), ROLES.map((r) => 'out:' + r));
const flo = fnames.map((n) => (n.startsWith('s:') ? 0.1 : 0)), fhi = fnames.map((n) => (n.startsWith('s:') ? 1 : 60));
const used = (k) => g.links.some((l) => l.roleTo === k || l.roleFrom === k);
const toModel = (p) => {
  const m = { speedShare: {}, arriveS: {}, departS: {} };
  CLASSES.forEach((c, i) => { m.speedShare[c] = +p[i].toFixed(3); });
  ROLES.forEach((r, i) => { m.arriveS[r] = +p[CLASSES.length + i].toFixed(2); m.departS[r] = +p[CLASSES.length + ROLES.length + i].toFixed(2); });
  return m;
};
function predict(p, r) {
  let num = 0, den = 0;
  const s = p[CLASSES.indexOf(r.cls)];
  r.links.forEach((l) => {
    const ia = ROLES.indexOf(l.roleTo), id = ROLES.indexOf(l.roleFrom);
    const lost = (ia >= 0 ? p[CLASSES.length + ia] : 0) + (id >= 0 ? p[CLASSES.length + ROLES.length + id] : 0);
    num += l.lenM; den += l.lenM / s + l.vmax * lost;
  });
  return Math.min(1, num / den);
}
function fitFree(target, subset) {
  const p = fnames.map((n) => (n.startsWith('s:') ? 0.7 : 2));
  const err = () => subset.reduce((e, r) => e + (predict(p, r) - target.get(r.id)) ** 2, 0);
  const active = fnames.map((n) => n.startsWith('s:') || used(n.split(':')[1]));
  for (let sweep = 0; sweep < 12; sweep++) {
    for (let i = 0; i < p.length; i++) {
      if (!active[i]) { p[i] = 0; continue; }
      let x0 = flo[i], x1 = fhi[i];
      const gr = (Math.sqrt(5) - 1) / 2, at = (x) => { p[i] = x; return err(); };
      let c = x1 - gr * (x1 - x0), d = x0 + gr * (x1 - x0), fc = at(c), fd = at(d);
      for (let k = 0; k < 40; k++) { if (fc < fd) { x1 = d; d = c; fd = fc; c = x1 - gr * (x1 - x0); fc = at(c); } else { x0 = c; c = d; fc = fd; d = x0 + gr * (x1 - x0); fd = at(d); } }
      p[i] = (x0 + x1) / 2;
    }
  }
  return p;
}
// free driving is fitted where the game's cars were not standing in a queue (probe: they moved at a quarter of the
// limit or more); the queues are the capacities' job
const moving = R.filter((r) => !(r.driveSpeed != null && r.driveN > 300 && r.driveSpeed < 0.25));
// fit, simulate, take the simulator's queueing time out of the target, fit again (the target carries over passes)
let target = new Map(R.map((r) => [r.id, r.game]));
function refineFree(cap, outsideShare, rounds) {
  let best = null;
  for (let round = 0; round <= rounds; round++) {
    const p = fitFree(target, moving);
    const ev = evaluate(cap, outsideShare, toModel(p));
    console.log(`  free driving, round ${round}: ${fmt(ev)}`);
    if (!best || ev.J < best.ev.J) best = { ev, model: toModel(p) };
    if (round === rounds) break;
    const sim = ev.o._draw.roadFlow, next = new Map();
    R.forEach((r) => {
      const num = r.links.reduce((s, l) => s + l.lenM, 0), freeDen = num / predict(p, r);
      const vol = r.links.reduce((s, l) => s + ev.o._draw.linkVol[l.id], 0);
      const queue = vol > 0 && sim[r.id] < 1 ? Math.max(0, num / sim[r.id] - freeDen) : 0;
      next.set(r.id, Math.min(1, num / Math.max(num, num / Math.max(0.02, r.game) - queue)));
    });
    target = next;
  }
  return best;
}

// ---------------------------------------------------------------- capacities and outside share (coordinate search)
// lane capacity along a road can't be below what the game's moving highways carry (probe: up to 0.22 cars/s per lane).
// Along city roads it is not fitted: no street in the measured city carries more than 0.09 cars/s per lane, so the
// data can't tell it, and it decides whether dense layouts jam; it stays at 0.5 (fixed)
const P = [
  { k: 'laneCapacityVps', lo: 0.15, hi: 1.5, mul: true, fixed: true },
  { k: 'highwayLaneCapacityVps', lo: 0.25, hi: 1.5, mul: true },
  { k: 'junctionVps', lo: 0.05, hi: 1.5, mul: true },
  { k: 'highwayJunctionVps', lo: 0.05, hi: 1.5, mul: true },
  { k: 'signalLostTime', lo: 0, hi: 0.6, step: 0.1 },
  { k: 'minorApproachShare', lo: 0.1, hi: 0.95, step: 0.15 },
  { k: 'mergeRampShare', lo: 0.2, hi: 1, step: 0.2 },
  { k: 'outsideShare', lo: 0, hi: 0.8, step: 0.1 },
];
function searchCap(start, freeFlow, sweeps) {
  let x = Object.assign({}, start);
  const run = (v) => evaluate(Object.fromEntries(P.filter((p) => p.k !== 'outsideShare').map((p) => [p.k, v[p.k]])), v.outsideShare, freeFlow);
  let best = run(x);
  console.log(`  start: ${fmt(best)}`);
  const steps = Object.fromEntries(P.map((p) => [p.k, p.mul ? 1.6 : p.step]));
  for (let sw = 0; sw < sweeps; sw++) {
    let improved = false;
    for (const p of P) {
      if (p.fixed) continue;
      // try both directions, keep the better one if it beats the current point; keep going while it improves
      for (let moves = 0; moves < 4; moves++) {
        let cand = null;
        for (const dir of [1, -1]) {
          const y = Object.assign({}, x);
          y[p.k] = p.mul ? x[p.k] * (dir > 0 ? steps[p.k] : 1 / steps[p.k]) : x[p.k] + dir * steps[p.k];
          y[p.k] = +Math.min(p.hi, Math.max(p.lo, y[p.k])).toFixed(3);
          if (y[p.k] === x[p.k]) continue;
          const e = run(y);
          if (!cand || e.J < cand.e.J) cand = { y, e };
        }
        if (!cand || cand.e.J >= best.J - 1e-4) break;
        x = cand.y; best = cand.e; improved = true;
        console.log(`  ${p.k} = ${x[p.k]}: ${fmt(best)}`);
      }
    }
    if (!improved) P.forEach((p) => { steps[p.k] = p.mul ? Math.sqrt(steps[p.k]) : steps[p.k] / 2; });
  }
  return { x, best };
}

// ---------------------------------------------------------------- run
console.log(`game: ${R.length} road pieces, ${drive ? totalSamples + ' car samples' : 'no probe samples'}, outside connections ${gameOutside.toFixed(2)} veh/s; car time ` +
  CLASSES.map((c) => `${c} ${Math.round((gameShare[c] || 0) * 100)}%`).join(' '));
// fixed starting point (so a calibration run is reproducible): plain capacities, free driving fitted to the game
let x = { laneCapacityVps: 0.5, highwayLaneCapacityVps: 0.5, junctionVps: 0.5, highwayJunctionVps: 0.5, signalLostTime: 0.25, minorApproachShare: 0.4, mergeRampShare: 1, outsideShare: 0.3 };
let ff = toModel(fitFree(new Map(R.map((r) => [r.id, r.game])), moving));
console.log(`free driving is fitted on the ${moving.length} road pieces where the game's cars were not queued`);
const capOf = (v) => Object.fromEntries(P.filter((p) => p.k !== 'outsideShare').map((p) => [p.k, v[p.k]]));
// the best point seen anywhere (capacities, outside share and free driving together)
let top = { J: Infinity };
const keep = (cap, outsideShare, freeFlow, ev) => { if (ev.J < top.J) top = { J: ev.J, x: Object.assign({}, cap, { outsideShare }), ff: JSON.parse(JSON.stringify(freeFlow)), ev }; };
const evaluate0 = evaluate;
evaluate = (cap, outsideShare, freeFlow) => { const ev = evaluate0(cap, outsideShare, freeFlow); keep(cap, outsideShare, freeFlow, ev); return ev; };
for (let it = 0; it < (quick ? 1 : 2); it++) {
  console.log(`\npass ${it + 1}: capacities and outside share`);
  x = searchCap(top.x || x, top.ff || ff, quick ? 2 : 4).x;
  console.log(`pass ${it + 1}: free driving`);
  refineFree(capOf(top.x), top.x.outsideShare, 1);
}
x = top.x; ff = top.ff;
const final = top.ev;
console.log(`\nbest: ${fmt(final)}`);

const calFile = path.join(__dirname, 'calibration', 'calibration.json');
const cal = JSON.parse(fs.readFileSync(calFile, 'utf8'));
delete cal.baseFlow; delete cal.baseFlowSource;
cal.capacity = Object.assign(capOf(x), { source: 'Fitted by tools/sim/calibrate.js to the queues and car speeds measured in ' + path.basename(cityFile) + (drive ? ' and ' + path.basename(driveFile) : '') });
cal.city.outsideTripShare = x.outsideShare;
cal.freeFlow = Object.assign(ff, { source: `Fitted by tools/sim/calibrate.js on the ${moving.length} road pieces of ${path.basename(cityFile)} where the game's cars were not queued` });
const k = final.o.compare;
cal.check = {
  gameMeanFlowPct: k.gameMeanFlowPct, simMeanFlowPct: k.simMeanFlowPct, roadCorrelation: k.correlation, roadFlowRmsePct: +(final.flowRmse * 100).toFixed(1),
  carSpeedRmsePct: +(final.speedRmse * 100).toFixed(1), outsideVps: { game: +gameOutside.toFixed(2), sim: +final.simOutside.toFixed(2) },
  carTime: Object.fromEntries(CLASSES.map((c) => [c, { gameShare: +(gameShare[c] || 0).toFixed(3), simShare: k.carTime[c] ? k.carTime[c].share : 0, gameSpeed: null, simSpeed: k.carTime[c] ? k.carTime[c].speed : null }])),
};
if (drive) CLASSES.forEach((c) => { const rs = R.filter((r) => r.cls === c && r.driveN); const n = rs.reduce((s, r) => s + r.driveN, 0); cal.check.carTime[c].gameSpeed = n ? +(rs.reduce((s, r) => s + r.driveN * r.driveSpeed, 0) / n).toFixed(3) : null; });
fs.writeFileSync(calFile, JSON.stringify(cal, null, 1));
console.log('\nwritten', calFile, '\n', JSON.stringify({ capacity: cal.capacity, outsideTripShare: x.outsideShare, freeFlow: cal.freeFlow, check: cal.check }, null, 1));
