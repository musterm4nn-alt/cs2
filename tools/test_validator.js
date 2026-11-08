// Run from the repo root:  node tools/test_validator.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const CS2 = require('../validator.js');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets.json'), 'utf8'));
const sample = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'examples', 'sample-layout.json'), 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));
const msgs = (r) => r.errors.map((e) => e.ref + ': ' + e.message);
let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('ok   ' + name); }
  catch (e) { console.log('FAIL ' + name + '\n     ' + e.message); process.exitCode = 1; }
}

test('sample layout is valid', () => {
  const r = CS2.validate(sample, { data });
  assert.deepStrictEqual(msgs(r), []);
  console.log('     warnings:', r.warnings.map((w) => w.message));
  console.log('     stats:', JSON.stringify(r.stats));
});

test('unknown asset id is an error', () => {
  const l = clone(sample); l.buildings.push({ id: 'x', asset: 'mega_hospital_9000', x: 0, y: 0 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /Unknown asset/.test(m)));
});

test('signature building placed twice is an error', () => {
  const l = clone(sample); l.buildings.push({ id: 'sig2', asset: 'halo_heights', x: 80, y: 51, rotation: 0 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /unique but placed 2/.test(m)));
});

test('overlapping buildings are an error', () => {
  const l = clone(sample); l.buildings.push({ id: 'clash', asset: 'small_park', x: 45, y: 33, rotation: 0 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /Overlaps/.test(m)));
});

test('building on a road is an error', () => {
  const l = clone(sample); l.buildings.push({ id: 'onroad', asset: 'small_park', x: 110, y: 28, rotation: 0 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /Overlaps road/.test(m)));
});

test('building without road access is an error', () => {
  const l = clone(sample); l.buildings.push({ id: 'island', asset: 'small_park', x: 110, y: 40, rotation: 0 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /no road access/.test(m)));
});

test('building facing the wrong way is a warning', () => {
  const l = clone(sample); l.buildings.find((b) => b.id === 'fire').rotation = 90;
  const r = CS2.validate(l, { data });
  assert(r.warnings.some((w) => w.ref === 'fire' && /Rotate/.test(w.message)) || msgs(r).some((m) => /^fire:/.test(m)));
});

test('zone deeper than 6 cells is an error', () => {
  const l = clone(sample); l.zones.push({ id: 'deep', type: 'residential_low', x: 100, y: 51, w: 10, h: 8 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /deeper than 6/.test(m)));
});

test('industrial zoning is rejected', () => {
  const l = clone(sample); l.zones.push({ id: 'ind', type: 'industrial_manufacturing', x: 100, y: 51, w: 10, h: 6 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /Industrial zoning/.test(m)));
});

test('sub-building without parent is an error', () => {
  const l = clone(sample); delete l.buildings.find((b) => b.id === 'school_pg').parent;
  assert(msgs(CS2.validate(l, { data })).some((m) => /is a sub-building; set "parent"/.test(m)));
});

test('sub-building beyond the game\'s max distance is an error', () => {
  const l = clone(sample); const pg = l.buildings.find((b) => b.id === 'school_pg');
  Object.assign(pg, { x: 100, y: 51, rotation: 0 });  // ~60 cells away; the game allows 60 m
  assert(msgs(CS2.validate(l, { data })).some((m) => /at most 60 m/.test(m)));
});

test('sub-building on the wrong parent is an error', () => {
  const l = clone(sample); l.buildings.find((b) => b.id === 'school_pg').parent = 'hosp';
  assert(msgs(CS2.validate(l, { data })).some((m) => /cannot belong to/.test(m)));
});

test('in-building upgrade placed as a building is an error', () => {
  const l = clone(sample); l.buildings.push({ id: 'heli', asset: 'hospital_helipad', x: 100, y: 51 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /not placed on its own/.test(m)));
});

test('upgrade on the wrong building is an error', () => {
  const l = clone(sample); l.buildings.find((b) => b.id === 'fire').upgrades = ['hospital_helipad'];
  assert(msgs(CS2.validate(l, { data })).some((m) => /is not an upgrade of/.test(m)));
});

test('industrial signature building is rejected', () => {
  const l = clone(sample); l.buildings.push({ id: 'ind_sig', asset: 'casting_fabricator', x: 100, y: 51, rotation: 0 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /industrial signature/.test(m)));
});

test('highway gives no access', () => {
  const l = clone(sample);
  l.roads.push({ id: 'hw', type: 'two_lane_one_way_highway', path: [[0, 70], [120, 70]] });
  l.bounds = { w: 120, h: 80 };
  l.buildings.push({ id: 'hwpark', asset: 'small_park', x: 10, y: 71, rotation: 0 });
  assert(msgs(CS2.validate(l, { data })).some((m) => /highway/.test(m)));
});

test('sample layout has matching tile edges and one road network', () => {
  const l = clone(sample); l.repeatable = true;
  const r = CS2.validate(l, { data });
  assert.deepStrictEqual(msgs(r), []);
});

test('road leaving one edge with no partner: warning, or error when repeatable', () => {
  const l = clone(sample);
  l.roads.push({ id: 'spur', type: 'two_lane_road', path: [[100, 0], [100, 9]] });
  let r = CS2.validate(l, { data });
  assert(r.warnings.some((w) => /Tile edge mismatch: spur leaves the north edge/.test(w.message)), JSON.stringify(r.warnings));
  assert(!msgs(r).some((m) => /Tile edge mismatch/.test(m)));
  l.repeatable = true;
  r = CS2.validate(l, { data });
  assert(msgs(r).some((m) => /Tile edge mismatch: spur/.test(m)));
});

test('road type changing across the tile edge is a mismatch', () => {
  const l = clone(sample); l.repeatable = true;
  l.roads.find((r) => r.id === 'north_st').path = [[0, 10], [60, 10]];
  l.roads.push({ id: 'north_st_e', type: 'four_lane_road', path: [[60, 10], [120, 10]] });
  assert(msgs(CS2.validate(l, { data })).some((m) => /continues on the (east|west) edge as/.test(m)));
});

test('road matched across the edge counts as connected', () => {
  const l = clone(sample); l.repeatable = true;
  // a stub that reaches the south edge, connected only via the matching stub on the north edge
  l.roads.push({ id: 'stub_s', type: 'two_lane_road', path: [[110, 51], [110, 60]] });
  l.roads.push({ id: 'stub_n', type: 'two_lane_road', path: [[110, 0], [110, 9]] });
  assert(!msgs(CS2.validate(l, { data })).some((m) => /not connected/.test(m)));
});

test('road not connected to the network is an error', () => {
  const l = clone(sample);
  l.roads.push({ id: 'island_rd', type: 'two_lane_road', path: [[100, 38], [115, 38]] });
  assert(msgs(CS2.validate(l, { data })).some((m) => /island_rd is not connected/.test(m)));
});

test('track running along a road is an error, crossing is fine', () => {
  const l = clone(sample);
  l.roads.push({ id: 'tram_on_avenue', type: 'double_tram_track', path: [[10, 30], [110, 30]] });
  assert(msgs(CS2.validate(l, { data })).some((m) => /tram_on_avenue: Runs along avenue/.test(m) || /avenue: Runs along tram_on_avenue/.test(m)));
  const k = clone(sample);
  k.roads.push({ id: 'tram_cross', type: 'double_tram_track', path: [[90, 0], [90, 60]] });
  assert(!msgs(CS2.validate(k, { data })).some((m) => /Runs along/.test(m)));
});

test('catalog markers: exact lines confirm files, altered ones warn', () => {
  const l = clone(sample);
  const zr = data.meta.catalog.find((c) => c.file === 'catalog/zones-roads-1.md');
  const sv = data.meta.catalog.find((c) => c.file === 'catalog/services-1.md');
  l.catalogMarkers = [zr.marker, sv.marker, sv.marker.replace(/check \w+/, 'check 000000')];
  const r = CS2.validate(l, { data });
  assert.deepStrictEqual(r.stats.catalogRead.confirmed, ['catalog/zones-roads-1.md', 'catalog/services-1.md']);
  assert(r.warnings.some((w) => /zones-roads-2/.test(w.message)));
  assert(r.warnings.some((w) => /altered catalog marker/.test(w.message)));
  assert(CS2.reportHTML(r).includes('2 of ' + data.meta.catalog.length));
  delete l.catalogMarkers;
  assert(CS2.validate(l, { data }).info.some((i) => /No "catalogMarkers"/.test(i.message)));
});

test('every catalog file is under 7,000 characters and ends with its marker', () => {
  data.meta.catalog.forEach((c) => {
    const text = fs.readFileSync(path.join(__dirname, '..', c.file), 'utf8');
    assert(text.length <= 7000, c.file + ' is ' + text.length + ' characters');
    assert.strictEqual(text.trim().split('\n').pop(), c.marker);
  });
});

test('every file the prompt sends models to fits in one 8,000-character fetch', () => {
  ['RULES.md', 'CATALOG.md'].forEach((f) => {
    const n = fs.readFileSync(path.join(__dirname, '..', f), 'utf8').length;
    assert(n <= 7500, f + ' is ' + n + ' characters');
  });
});

test('layout without zones, or missing a required zone family, is an error', () => {
  const l = clone(sample); l.zones = [];
  assert(msgs(CS2.validate(l, { data })).some((m) => /no zone blocks/.test(m)));
  const k = clone(sample); k.zones = k.zones.filter((z) => z.type !== 'office_high');
  assert(msgs(CS2.validate(k, { data })).some((m) => /No office zoning/.test(m)));
  assert.deepStrictEqual(msgs(CS2.validate(k, { data, requireZoneFamilies: ['residential', 'commercial'] })), []);
});

test('coverage never exceeds 100% with fractional zone sizes', () => {
  const l = clone(sample); l.zones.push({ id: 'frac', type: 'residential_high', x: 100, y: 51, w: 5.5, h: 3.5 });
  const r = CS2.validate(l, { data });
  assert(Object.values(r.stats.coverage).every((v) => v <= 100), JSON.stringify(r.stats.coverage));
});

test('scorecard values for the sample layout', () => {
  const sc = CS2.validate(sample, { data }).stats.score;
  assert.strictEqual(sc.errors, 0);
  assert.strictEqual(sc.zonedSharePct, Math.round(936 / (120 * 60) * 100));   // 4 zones of 39x6 on a 120x60 tile
  assert.strictEqual(sc.coreCoveragePct, Math.round(500 / 6));               // 5 of 6 core services at 100%, no telecom
  assert.strictEqual(sc.upkeepPerZonedCell, Math.round(295500 / 936));
});

test('compare follows the published tie-break order', () => {
  const base = { errors: 0, warnings: 0, zonedSharePct: 40, coreCoveragePct: 90, upkeepPerZonedCell: 50 };
  const v = (o) => ({ stats: { score: Object.assign({}, base, o) } });
  let c = CS2.compare(v({ errors: 1, zonedSharePct: 80 }), v({}));
  assert.deepStrictEqual([c.winner, c.decidedBy], ['B', 'errors']);
  c = CS2.compare(v({ warnings: 2 }), v({ warnings: 1 }));
  assert.deepStrictEqual([c.winner, c.decidedBy], ['B', 'warnings']);
  c = CS2.compare(v({ zonedSharePct: 41, upkeepPerZonedCell: 999 }), v({}));
  assert.deepStrictEqual([c.winner, c.decidedBy], ['A', 'zoned share of the tile']);
  c = CS2.compare(v({ coreCoveragePct: 85 }), v({}));
  assert.deepStrictEqual([c.winner, c.decidedBy], ['B', 'core service coverage']);
  c = CS2.compare(v({ upkeepPerZonedCell: 49 }), v({}));
  assert.deepStrictEqual([c.winner, c.decidedBy], ['A', 'upkeep per zoned cell']);
  assert.strictEqual(CS2.compare(v({}), v({})).winner, 'tie');
});

test('report shows the scorecard', () => {
  const html = CS2.reportHTML(CS2.validate(sample, { data }));
  assert(html.includes('Scorecard') && html.includes('Zoned share of tile') && html.includes('game files'));
});

test('high-density zoning only along 1-cell roads is an error; medium is fine; a wider road fixes it', () => {
  const base = () => ({
    bounds: { w: 60, h: 30 },
    roads: [
      { id: 'street', type: 'two_lane_road', path: [[0, 5], [60, 5]] },
      { id: 'lane', type: 'alley', path: [[30, 6], [30, 30]] }
    ],
    zones: [], buildings: []
  });
  const narrowMsg = (l) => msgs(CS2.validate(l, { data })).filter((m) => /fed only by 1-cell-wide car roads/.test(m));
  let l = base(); l.zones.push({ id: 'hi', type: 'residential_high', x: 30.5, y: 12, w: 6, h: 12 });
  assert.strictEqual(narrowMsg(l).length, 1, 'high density on an alley must fail');
  l = base(); l.zones.push({ id: 'mid', type: 'residential_mixed', x: 30.5, y: 12, w: 6, h: 12 });
  assert.strictEqual(narrowMsg(l).length, 0, 'medium density on an alley is allowed');
  l = base(); l.zones.push({ id: 'low', type: 'commercial_low', x: 30.5, y: 12, w: 6, h: 12 });
  assert.strictEqual(narrowMsg(l).length, 0, 'low density on an alley is allowed');
  // v3.2: small pedestrian streets are 1 cell wide but carry no cars, so high density may face them
  l = base(); l.roads.find((r) => r.id === 'lane').type = 'small_pedestrian_street';
  l.zones.push({ id: 'ped', type: 'commercial_high', x: 30.5, y: 12, w: 6, h: 12 });
  assert.strictEqual(narrowMsg(l).length, 0, 'high density along a small pedestrian street is allowed');
  l = base(); l.zones.push({ id: 'corner', type: 'office_high', x: 24, y: 6, w: 5.5, h: 6 });
  assert.strictEqual(narrowMsg(l).length, 0, 'high density touching a two-lane road as well is allowed');
  // loophole: a long strip fed by an alley along its long side that only touches a real road at its short end
  l = base(); l.roads.push({ id: 'lane2', type: 'alley', path: [[0, 20], [29.5, 20]] });
  l.zones.push({ id: 'strip', type: 'residential_high', x: 0, y: 20.5, w: 29.5, h: 6 });
  assert.strictEqual(narrowMsg(l).length, 1, 'a strip fed by an alley must fail even if its short end touches another road');
  // a strip between an alley and a two-lane road (depth 6) is fed by the two-lane road: allowed
  l = base(); l.roads.push({ id: 'lane3', type: 'alley', path: [[0, 12.5], [29.5, 12.5]] });
  l.zones.push({ id: 'between', type: 'residential_high', x: 0, y: 6, w: 29.5, h: 6 });
  assert.strictEqual(narrowMsg(l).length, 0, 'high density fronting a two-lane road is allowed even with an alley behind');
});

test('every zone has a density and roads say whether they are 1 cell wide', () => {
  data.zones.forEach((z) => assert(['low', 'medium', 'high', 'industrial'].includes(z.density), z.id));
  const narrowZonable = data.roads.filter((r) => r.narrow && r.allowsZoning).map((r) => r.id).sort();
  assert(narrowZonable.includes('alley') && narrowZonable.includes('small_pedestrian_street'));
  assert(!data.roads.find((r) => r.id === 'two_lane_road').narrow);
  const limiting = data.roads.filter((r) => r.limitsDensity).map((r) => r.id);
  assert(limiting.includes('alley') && limiting.includes('gravel_road') && !limiting.includes('small_pedestrian_street'));
});

test('renderer produces an SVG and a report', () => {
  const r = CS2.validate(sample, { data });
  const svg = CS2.renderSVG(r);
  assert(svg.startsWith('<svg') && svg.includes('Hospital'));
  fs.writeFileSync(path.join(__dirname, '..', 'examples', 'sample-layout.svg'), svg);
  assert(CS2.reportHTML(r).includes('Valid layout'));
});

console.log(`\n${passed} passed`);
