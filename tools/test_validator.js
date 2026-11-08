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

test('renderer produces an SVG and a report', () => {
  const r = CS2.validate(sample, { data });
  const svg = CS2.renderSVG(r);
  assert(svg.startsWith('<svg') && svg.includes('Hospital'));
  fs.writeFileSync(path.join(__dirname, '..', 'examples', 'sample-layout.svg'), svg);
  assert(CS2.reportHTML(r).includes('Valid layout'));
});

console.log(`\n${passed} passed`);
