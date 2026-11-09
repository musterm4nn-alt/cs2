// Smoke tests for the traffic simulator: node tools/sim/test_sim.js
'use strict';
const assert = require('assert');
const path = require('path');
const S = require('./simulate.js');
const L = (f) => S.readLayout(path.join(__dirname, '..', 'calibration', 'layouts', f));
let n = 0;
const t = (name, fn) => { fn(); n++; console.log('ok', name); };

const a = S.simulate(L('03-01-A.json'), { days: 2 });
t('a valid tile runs and reports the game flow metric', () => {
  assert(a.trips.total > 1000);
  assert(a.result.trafficFlowPct > 0 && a.result.trafficFlowPct <= 100);
  assert(a.network.wrapsAcrossEdges, 'roads continue across the tile edges');
});
t('same seed, same result', () => {
  const b = S.simulate(L('03-01-A.json'), { days: 2 });
  assert.strictEqual(b.result.trafficFlowPct, a.result.trafficFlowPct);
  assert.strictEqual(b.trips.total, a.trips.total);
});
t('less demand flows better', () => {
  const low = S.simulate(L('06-04-B.json'), { days: 2, demandScale: 0.2 });
  const full = S.simulate(L('06-04-B.json'), { days: 2 });
  assert(low.result.trafficFlowPct > full.result.trafficFlowPct);
});
t('the game city export runs and is compared with the game', () => {
  const city = require('./calibration/corwen_city.json');
  const o = S.simulateCity(city, { days: 1 });
  assert(o.compare && o.compare.roads > 1000);
  assert(Math.abs(o.compare.simMeanFlowPct - o.compare.gameMeanFlowPct) < 20);
});
t('the report renders', () => {
  const html = S.reportHTML(a);
  assert(/<title>Traffic simulation<\/title>/.test(html) && /traffic flow/.test(html));
});
console.log(n + ' tests passed');
