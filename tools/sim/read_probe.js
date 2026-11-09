#!/usr/bin/env node
// Summarise a CS2SimProbe run (game-probe/Mod.cs) into trip rates the simulator can use.
//   node tools/sim/read_probe.js <probe_out.jsonl> [--skip-hours 2] [--json out.json]
'use strict';
const fs = require('fs');
const a = process.argv.slice(2);
const file = a[0];
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const skip = +opt('--skip-hours', 2);
const rows = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.hoursSinceStart != null);
const use = rows.filter((r) => r.hoursSinceStart > skip);
if (!use.length) { console.log('no samples after the warm-up'); process.exit(1); }
const hours = use[use.length - 1].hoursSinceStart - (rows[rows.indexOf(use[0]) - 1] || use[0]).hoursSinceStart;
const days = hours / 24;
const avg = (k) => use.reduce((s, r) => s + (r[k] || 0), 0) / use.length;
const sumObj = (k) => { const o = {}; use.forEach((r) => Object.entries(r[k] || {}).forEach(([p, v]) => { o[p] = (o[p] || 0) + v; })); return o; };
const hh = avg('households'), pop = avg('population'), workers = avg('workers'), jobs = avg('jobs'), cjobs = avg('commercialJobs');
const starts = sumObj('personalStartsByPurpose');
const moving = sumObj('personalCarsByPurpose');
const svc = ['taxi', 'publicTransport', 'garbageTruck', 'policeCar', 'ambulance', 'fireEngine', 'hearse', 'postVan', 'maintenance', 'workVehicle'];
const out = {
  file, hoursMeasured: Math.round(hours * 10) / 10, population: Math.round(pop), households: Math.round(hh), workers: Math.round(workers), jobs: Math.round(jobs), commercialJobs: Math.round(cjobs),
  personsPerHousehold: +(avg('citizens') / hh).toFixed(2),
  cityTrafficFlowPct: Math.round(avg('cityTrafficFlow')),
  carsMovingAvg: Math.round(avg('carsMoving')), personalCarsMovingAvg: Math.round(Object.values(moving).reduce((s, v) => s + v, 0) / use.length),
  deliveryTrucksMovingAvg: Math.round(avg('deliveryTrucks')),
  serviceVehiclesMovingAvg: Object.fromEntries(svc.map((k) => [k, Math.round(avg(k) * 10) / 10])),
  personalCarTripsPerDay: Object.fromEntries(Object.entries(starts).sort((x, y) => y[1] - x[1]).map(([k, v]) => [k, Math.round(v / days)])),
  rates: {
    workCarTripsPerWorkerPerDay: +((starts.GoingToWork || 0) / days / workers).toFixed(4),
    schoolCarTripsPerHouseholdPerDay: +((starts.GoingToSchool || 0) / days / hh).toFixed(4),
    shoppingCarTripsPerHouseholdPerDay: +((starts.Shopping || 0) / days / hh).toFixed(4),
    leisureCarTripsPerResidentPerDay: +(((starts.Leisure || 0) + (starts.VisitAttractions || 0) + (starts.Sightseeing || 0) + (starts.Relaxing || 0)) / days / pop).toFixed(4),
    homeCarTripsPerHouseholdPerDay: +((starts.GoingHome || 0) / days / hh).toFixed(4),
    allCarTripsPerHouseholdPerDay: +(Object.values(starts).reduce((s, v) => s + v, 0) / days / hh).toFixed(4),
    truckTripsPerJobPerDay: +(use.reduce((s, r) => s + (r.truckStarts || 0), 0) / days / jobs).toFixed(4),
    truckTripsPerCommercialJobPerDay: +(use.reduce((s, r) => s + (r.truckStarts || 0), 0) / days / cjobs).toFixed(4),
    allVehicleStartsPerHouseholdPerDay: +(use.reduce((s, r) => s + (r.carStartsAll || 0), 0) / days / hh).toFixed(4),
  },
  byHour: [],
};
// average personal cars on the road and trip starts by hour of day
for (let h = 0; h < 24; h++) {
  const rs = use.filter((r) => Math.floor(r.timeOfDay * 24) === h);
  if (!rs.length) continue;
  const mv = rs.reduce((s, r) => s + Object.values(r.personalCarsByPurpose || {}).reduce((x, y) => x + y, 0), 0) / rs.length;
  const st = rs.reduce((s, r) => s + Object.values(r.personalStartsByPurpose || {}).reduce((x, y) => x + y, 0), 0) / rs.length;
  out.byHour.push({ hour: h, personalCarsMoving: Math.round(mv), deliveryTrucks: Math.round(rs.reduce((s, r) => s + r.deliveryTrucks, 0) / rs.length), startsPerSample: Math.round(st), flow: Math.round(rs.reduce((s, r) => s + r.cityTrafficFlow, 0) / rs.length) });
}
if (a.includes('--json')) fs.writeFileSync(opt('--json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
