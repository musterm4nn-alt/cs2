// Run every layout in tools/calibration/layouts through the validator and print its points breakdown.
//   node tools/calibrate.js            table of all layouts
//   node tools/calibrate.js --battles  also re-score the recorded battles (rounds 5-6)
const fs = require('fs');
const path = require('path');
const CS2 = require('../validator.js');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets.json'), 'utf8'));
const dir = path.join(__dirname, 'calibration', 'layouts');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
const res = {};
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const num = (v, n) => String(v).padStart(n);

console.log(pad('layout', 15) + num('err', 4) + num('wrn', 4) + num('homes', 7) + num('jobs', 7) + num('j/hh', 6) +
  num('frame', 13) + num('big%', 5) + num('lane/hh', 8) + num('₡/hh', 6) + ' | cap  bal  svc  trf  cost | total  (old: zoned%)');
for (const f of files) {
  const layout = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  // older layouts carry catalog markers from older versions; ignore those warnings when re-scoring
  delete layout.catalogMarkers;
  const r = CS2.validate(layout, { data });
  const name = f.replace('.json', '');
  res[name] = r;
  const p = r.stats.points, m = p.metrics;
  console.log(pad(name, 15) + num(r.errors.length, 4) + num(r.warnings.length, 4) + num(m.households, 7) + num(m.jobs, 7) +
    num(m.jobsPerHousehold, 6) + num(m.arterialFrame, 13) + num(m.zonedOnBigRoadsPct, 5) + num(m.laneCellsPerHousehold, 8) +
    num(m.upkeepPerHousehold, 6) + ' | ' + ['capacity', 'balance', 'services', 'traffic', 'cost'].map((k) => num(p.parts[k], 4)).join(' ') +
    ' | ' + num(p.total, 5) + '  (' + r.stats.score.zonedSharePct + '%)');
}

if (process.argv.includes('--battles')) {
  const battles = [
    ['05-01', '05-01-A', null], ['05-02', '05-02-A', '05-02-B'], ['05-03', '05-03-A', '05-03-B'], ['05-04', '05-04-A', null],
    ['06-01', '06-01-A', '06-01-B'], ['06-02', '06-02-A', '06-02-B'], ['06-03', '06-03-A', '06-03-B'], ['06-04', '06-04-A', '06-04-B'],
  ];
  console.log('\nbattle  A                         B                         old winner  new winner');
  for (const [b, a, bb] of battles) {
    const ra = res[a], rb = bb && res[bb];
    const fmt = (r) => r ? `${r.errors.length}e ${r.stats.points.total} pts (${r.stats.score.zonedSharePct}%)` : 'no layout';
    const old = !rb ? 'A' : CS2.compare({ stats: { score: ra.stats.score } }, { stats: { score: rb.stats.score } }).winner;
    const neu = !rb ? 'A' : CS2.compare(ra, rb).winner;
    console.log(`${b}   ${pad(fmt(ra), 26)}${pad(fmt(rb), 26)}${pad(old, 12)}${neu}`);
  }
}
