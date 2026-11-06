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
