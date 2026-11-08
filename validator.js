/*!
 * CS2 layout validator + renderer for Cities: Skylines II city layouts.
 * Data: assets.json (derived from the CS2 Wiki, CC BY-NC-SA 3.0). https://github.com/musterm4nn-alt/cs2
 *
 * Browser:  <script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v3.0.0/validator.js"></script>
 *           CS2.mount(layout, document.getElementById('app'))   // loads data, validates, draws, reports
 * Node:     const CS2 = require('./validator.js'); CS2.validate(layout, { data })
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CS2 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var VERSION = '3.0.0';

  var SCRIPT_BASE = (function () {
    try {
      var s = document.currentScript && document.currentScript.src;
      if (s) return s.replace(/[^/]*$/, '');
    } catch (e) {}
    return 'https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v3.0.0/';
  })();
  var EPS = 0.01;      // overlap tolerance in cells (touching edges are fine)
  var REACH = 0.6;     // how far (cells) a building edge may be from a road edge and still count as touching
  var cache = null;

  // ---------- data ----------
  function load(url) {
    if (cache && !url) return Promise.resolve(cache);
    return fetch(url || SCRIPT_BASE + 'assets.json').then(function (r) {
      if (!r.ok) throw new Error('Could not load assets.json (' + r.status + ')');
      return r.json();
    }).then(function (d) { cache = index(d); return cache; });
  }
  function index(d) {
    if (d._byId) return d;
    d._byId = {}; d._roadById = {}; d._zoneById = {};
    d.assets.forEach(function (a) { d._byId[a.id] = a; });
    d.roads.forEach(function (r) { d._roadById[r.id] = r; });
    d.zones.forEach(function (z) { d._zoneById[z.id] = z; });
    return d;
  }

  // ---------- geometry ----------
  function rectPoly(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
  function footprint(asset, rot) {
    var w = asset.size.w, d = asset.size.d;
    return (rot === 90 || rot === 270) ? { w: d, h: w } : { w: w, h: d };
  }
  // Strip just outside the front edge. rotation 0 = front faces north (-y).
  function frontStrip(b, fp) {
    switch (b.rotation || 0) {
      case 0: return rectPoly(b.x, b.y - REACH, fp.w, REACH);
      case 90: return rectPoly(b.x + fp.w, b.y, REACH, fp.h);
      case 180: return rectPoly(b.x, b.y + fp.h, fp.w, REACH);
      default: return rectPoly(b.x - REACH, b.y, REACH, fp.h);
    }
  }
  function sideStrips(x, y, w, h) {
    return {
      north: rectPoly(x, y - REACH, w, REACH), south: rectPoly(x, y + h, w, REACH),
      west: rectPoly(x - REACH, y, REACH, h), east: rectPoly(x + w, y, REACH, h)
    };
  }
  function segPoly(a, b, width) {
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    var nx = -dy / L * width / 2, ny = dx / L * width / 2;
    return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]];
  }
  // Separating-axis test; returns penetration depth (0 = no overlap).
  function overlap(p, q) {
    var min = Infinity, polys = [p, q];
    for (var k = 0; k < 2; k++) {
      var poly = polys[k];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length];
        var ax = -(b[1] - a[1]), ay = b[0] - a[0], L = Math.hypot(ax, ay);
        if (!L) continue; ax /= L; ay /= L;
        var r1 = proj(p, ax, ay), r2 = proj(q, ax, ay);
        var o = Math.min(r1[1], r2[1]) - Math.max(r1[0], r2[0]);
        if (o <= 0) return 0;
        if (o < min) min = o;
      }
    }
    return min;
  }
  function proj(poly, ax, ay) {
    var lo = Infinity, hi = -Infinity;
    poly.forEach(function (pt) { var v = pt[0] * ax + pt[1] * ay; if (v < lo) lo = v; if (v > hi) hi = v; });
    return [lo, hi];
  }
  function bbox(poly) {
    var xs = poly.map(function (p) { return p[0]; }), ys = poly.map(function (p) { return p[1]; });
    return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
  }

  // ---------- road network checks ----------
  function ptSegDist(p, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
    var t = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0;
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }
  function segsCross(a, b, c, d) {
    function o(p, q, r) { var v = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return Math.abs(v) < 1e-9 ? 0 : v > 0 ? 1 : -1; }
    return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
  }
  function segDist(s, t) {
    if (segsCross(s.a, s.b, t.a, t.b)) return 0;
    return Math.min(ptSegDist(s.a, t.a, t.b), ptSegDist(s.b, t.a, t.b), ptSegDist(t.a, s.a, s.b), ptSegDist(t.b, s.a, s.b));
  }
  function dir(s) { var dx = s.b[0] - s.a[0], dy = s.b[1] - s.a[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; }

  function checkNetwork(layout, roads, err, warn, info) {
    if (!roads.length) return;
    var n = roads.length, i, j;

    // 1) roads or tracks running along each other (crossing at an angle is a normal intersection)
    var reported = {};
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      var s = roads[i], t = roads[j];
      if (s.ref === t.ref) continue;
      var da = dir(s), db = dir(t);
      if (Math.abs(da[0] * db[1] - da[1] * db[0]) > 0.17) continue;   // not parallel (> ~10 degrees apart)
      var pen = overlap(s.poly, t.poly);
      if (pen <= EPS) continue;
      // length of the shared stretch along the road direction
      var pa = [s.a, s.b].map(function (p) { return p[0] * da[0] + p[1] * da[1]; }).sort(function (x, y) { return x - y; });
      var pb = [t.a, t.b].map(function (p) { return p[0] * da[0] + p[1] * da[1]; }).sort(function (x, y) { return x - y; });
      var shared = Math.min(pa[1], pb[1]) - Math.max(pa[0], pb[0]);
      var key = s.ref + '|' + t.ref;
      if (shared > 1 && !reported[key]) {
        reported[key] = true;
        err(s.ref, 'Runs along ' + t.ref + ' for ' + Math.round(shared) + ' cells (overlapping). Parallel roads/tracks need their own space; ' +
          'only crossings at an angle form intersections.');
      }
    }

    // 2) connectivity of the normal road network (highways and tracks are separate networks)
    var normal = roads.map(function (r, k) { return k; }).filter(function (k) { return roads[k].type.buildingAccess; });
    var parent = {};
    normal.forEach(function (k) { parent[k] = k; });
    function find(k) { while (parent[k] !== k) { parent[k] = parent[parent[k]]; k = parent[k]; } return k; }
    function join(a, b) { parent[find(a)] = find(b); }
    normal.forEach(function (a, x) {
      normal.slice(x + 1).forEach(function (b) {
        var lim = Math.max(roads[a].type.widthCells, roads[b].type.widthCells) / 2 + 0.25;
        if (segDist(roads[a], roads[b]) <= lim) join(a, b);
      });
    });

    // 3) edge matching for tiles: an end on one edge needs a partner of the same type on the opposite edge
    var B = layout.bounds;
    if (B) {
      var E = 0.01, ends = { w: [], e: [], n: [], s: [] };
      roads.forEach(function (r, k) {
        [r.a, r.b].forEach(function (p) {
          if (Math.abs(p[0]) < E) ends.w.push({ pos: p[1], k: k });
          if (Math.abs(p[0] - B.w) < E) ends.e.push({ pos: p[1], k: k });
          if (Math.abs(p[1]) < E) ends.n.push({ pos: p[0], k: k });
          if (Math.abs(p[1] - B.h) < E) ends.s.push({ pos: p[0], k: k });
        });
      });
      var strict = layout.repeatable === true, problems = 0;
      [['w', 'e', 'west', 'east'], ['e', 'w', 'east', 'west'], ['n', 's', 'north', 'south'], ['s', 'n', 'south', 'north']].forEach(function (q) {
        ends[q[0]].forEach(function (x) {
          var r = roads[x.k];
          var same = ends[q[1]].filter(function (y) { return Math.abs(y.pos - x.pos) < 0.51; });
          var match = same.filter(function (y) { return roads[y.k].type.id === r.type.id; })[0];
          if (match) {
            if (normal.indexOf(x.k) >= 0 && normal.indexOf(match.k) >= 0) join(x.k, match.k);  // connected through the neighbouring tile
            return;
          }
          problems++;
          var msg = same.length
            ? r.ref + ' leaves the ' + q[2] + ' edge at ' + x.pos + ' as ' + r.type.id + ', but ' + roads[same[0].k].ref + ' continues on the ' + q[3] + ' edge as ' + roads[same[0].k].type.id + '.'
            : r.ref + ' leaves the ' + q[2] + ' edge at ' + x.pos + ' but nothing continues on the ' + q[3] + ' edge at that position.';
          (strict ? err : warn)(r.ref, 'Tile edge mismatch: ' + msg);
        });
      });
      if (!strict && problems) info.push({ ref: 'tile', message: 'Set "repeatable": true on the layout to make tile edge mismatches errors.' });
    }

    var comps = {};
    normal.forEach(function (k) { var c = find(k); (comps[c] = comps[c] || []).push(roads[k].ref); });
    var groups = Object.keys(comps).map(function (c) {
      return comps[c].filter(function (v, x, arr) { return arr.indexOf(v) === x; });
    }).sort(function (a, b) { return b.length - a.length; });
    groups.slice(1).forEach(function (g) {
      err(g[0], 'Road' + (g.length > 1 ? 's ' + g.join(', ') + ' are' : ' ' + g[0] + ' is') + ' not connected to the main road network.');
    });
  }

  // ---------- validation ----------
  function validate(layout, opts) {
    opts = opts || {};
    var data = index(opts.data || cache);
    if (!data) throw new Error('No asset data: call CS2.load() first or pass { data }.');
    var noIndustry = opts.noIndustry !== false;
    var errors = [], warnings = [], info = [];
    function err(id, msg) { errors.push({ ref: id, message: msg }); }
    function warn(id, msg) { warnings.push({ ref: id, message: msg }); }

    var roads = [], items = [], seenIds = {};
    function checkId(obj, kind, i) {
      var id = obj.id || (kind + '#' + i);
      if (seenIds[id]) err(id, 'Duplicate instance id "' + id + '".');
      seenIds[id] = true;
      return id;
    }

    (layout.roads || []).forEach(function (r, i) {
      var id = checkId(r, 'road', i), rt = data._roadById[r.type];
      if (!rt) { err(id, 'Unknown road type "' + r.type + '". Use an id from assets.json "roads".'); return; }
      var path = r.path || (r.from && r.to ? [r.from, r.to] : null);
      if (!path || path.length < 2) { err(id, 'Road needs "path": [[x,y],[x,y],...] with at least 2 points.'); return; }
      for (var k = 0; k + 1 < path.length; k++)
        roads.push({ ref: id, type: rt, poly: segPoly(path[k], path[k + 1], rt.widthCells), a: path[k], b: path[k + 1] });
    });

    var counts = {};
    (layout.buildings || []).forEach(function (b, i) {
      var id = checkId(b, 'building', i), a = data._byId[b.asset];
      if (!a) { err(id, 'Unknown asset "' + b.asset + '". Every building must use an id from assets.json.'); return; }
      if (!a.placeable) { err(id, '"' + a.name + '" is not placed on its own (upgrade of ' + (a.parents || []).join('/') + '); list it in its parent\'s "upgrades" instead.'); return; }
      if (noIndustry && a.industrial) err(id, '"' + a.name + '" is an industrial signature building; industry is not allowed in this layout.');
      var rot = b.rotation || 0;
      if ([0, 90, 180, 270].indexOf(rot) < 0) { err(id, 'Rotation must be 0, 90, 180 or 270.'); return; }
      if (typeof b.x !== 'number' || typeof b.y !== 'number') { err(id, 'Building needs numeric x and y (top-left cell).'); return; }
      var fp = footprint(a, rot);
      counts[a.id] = (counts[a.id] || 0) + 1;
      items.push({ ref: id, kind: 'building', asset: a, inst: b, fp: fp, poly: rectPoly(b.x, b.y, fp.w, fp.h) });
      var seenUp = {};
      (b.upgrades || []).forEach(function (u) {
        var ua = data._byId[u];
        if (!ua) err(id, 'Unknown upgrade "' + u + '".');
        else if ((ua.parents || []).indexOf(a.id) < 0) err(id, '"' + ua.name + '" is not an upgrade of "' + a.name + '".');
        else if (ua.kind === 'sub_building') err(id, '"' + ua.name + '" is a sub-building with its own lot; place it as a building with "parent": "' + id + '".');
        else if (seenUp[u]) err(id, 'Upgrade "' + ua.name + '" listed twice.');
        seenUp[u] = true;
      });
    });

    (layout.zones || []).forEach(function (z, i) {
      var id = checkId(z, 'zone', i), zt = data._zoneById[z.type];
      if (!zt) { err(id, 'Unknown zone type "' + z.type + '".'); return; }
      if (noIndustry && zt.family === 'industrial') err(id, 'Industrial zoning is not allowed in this layout.');
      if (!(z.w > 0 && z.h > 0)) { err(id, 'Zone needs positive w and h.'); return; }
      items.push({ ref: id, kind: 'zone', zone: zt, inst: z, poly: rectPoly(z.x, z.y, z.w, z.h) });
    });

    // unique buildings
    Object.keys(counts).forEach(function (aid) {
      var a = data._byId[aid];
      if (a.unique && counts[aid] > 1) err(aid, '"' + a.name + '" is unique but placed ' + counts[aid] + ' times.');
    });

    // bounds
    if (layout.bounds) {
      var B = rectPoly(0, 0, layout.bounds.w, layout.bounds.h), bb = bbox(B);
      items.concat(roads).forEach(function (it) {
        var q = bbox(it.poly);
        if (q.x0 < bb.x0 - EPS || q.y0 < bb.y0 - EPS || q.x1 > bb.x1 + EPS || q.y1 > bb.y1 + EPS) err(it.ref, 'Outside the layout bounds.');
      });
    }

    // overlaps: item vs item, item vs road
    for (var i = 0; i < items.length; i++) {
      for (var j = i + 1; j < items.length; j++) {
        if (overlap(items[i].poly, items[j].poly) > EPS) err(items[i].ref, 'Overlaps ' + items[j].ref + '.');
      }
      for (var r = 0; r < roads.length; r++) {
        if (overlap(items[i].poly, roads[r].poly) > EPS) { err(items[i].ref, 'Overlaps road ' + roads[r].ref + '.'); break; }
      }
    }

    checkNetwork(layout, roads, err, warn, info);

    var byRef = {}; items.forEach(function (it) { byRef[it.ref] = it; });
    function touchingRoads(poly) {
      return roads.filter(function (r) { return overlap(poly, r.poly) > EPS; });
    }

    function rectGap(p, q) {
      var A = bbox(p), B = bbox(q);
      var dx = Math.max(0, A.x0 - B.x1, B.x0 - A.x1), dy = Math.max(0, A.y0 - B.y1, B.y0 - A.y1);
      return Math.hypot(dx, dy);
    }
    var subCount = {};
    items.forEach(function (it) {
      if (it.kind === 'building') {
        var a = it.asset, b = it.inst;
        if (a.kind === 'sub_building') {
          var p = b.parent && byRef[b.parent];
          if (!p || p.kind !== 'building') { err(it.ref, '"' + a.name + '" is a sub-building; set "parent" to the instance id of its ' + (a.parents || []).join(' / ') + '.'); return; }
          if ((a.parents || []).indexOf(p.asset.id) < 0) { err(it.ref, '"' + a.name + '" cannot belong to "' + p.asset.name + '" (needs ' + (a.parents || []).join(' / ') + ').'); return; }
          var key = b.parent + '|' + a.id;
          subCount[key] = (subCount[key] || 0) + 1;
          if (a.forbidMultiple && subCount[key] === 2) err(it.ref, '"' + a.name + '" can only be added once to ' + b.parent + '.');
          if (a.maxDistanceM > 0) {
            var gapM = rectGap(it.poly, p.poly) * data.grid.cellMeters;
            if (gapM > a.maxDistanceM + 0.5) err(it.ref, '"' + a.name + '" is ' + Math.round(gapM) + ' m from its parent; the game allows at most ' + a.maxDistanceM + ' m.');
          }
          var fr = touchingRoads(frontStrip(b, it.fp)).filter(function (r) { return r.type.buildingAccess; });
          if (!fr.length) warn(it.ref, 'Sub-building front does not touch a road; check that it can still be reached.');
          return;
        }
        if (a.placement === 'road') {
          var front = touchingRoads(frontStrip(b, it.fp));
          var access = front.filter(function (r) { return r.type.buildingAccess; });
          if (!access.length) {
            var S = sideStrips(b.x, b.y, it.fp.w, it.fp.h), anySide = false;
            Object.keys(S).forEach(function (k) { if (touchingRoads(S[k]).some(function (r) { return r.type.buildingAccess; })) anySide = true; });
            if (front.length) err(it.ref, 'Front faces only a highway/track; highways give no building access.');
            else if (anySide) warn(it.ref, 'A road touches a side but not the front. Rotate it so the front (rotation ' + (b.rotation || 0) + ') faces the road.');
            else err(it.ref, '"' + a.name + '" has no road access: its front edge must touch a road.');
          }
        } else if (a.placement === 'water' && !b.onWater) {
          warn(it.ref, '"' + a.name + '" must be placed at water; set "onWater": true once it is on a shoreline.');
        } else if (/^resource:/.test(a.placement) && !b.onResource) {
          warn(it.ref, '"' + a.name + '" needs ' + a.placement.slice(9) + '; set "onResource": true if the site has it.');
        } else if (a.placement === 'track') {
          var onTrack = roads.some(function (r) { return r.type.category === 'track' && overlap(rectPoly(b.x - REACH, b.y - REACH, it.fp.w + 2 * REACH, it.fp.h + 2 * REACH), r.poly) > EPS; });
          if (!onTrack) warn(it.ref, '"' + a.name + '" is a rail/tram/subway building; connect it to a matching track.');
        }
      } else if (it.kind === 'zone') {
        var z = it.inst, S2 = sideStrips(z.x, z.y, z.w, z.h), sides = {};
        Object.keys(S2).forEach(function (k) {
          sides[k] = touchingRoads(S2[k]).some(function (r) { return r.type.allowsZoning; });
        });
        var maxD = data.rules.maxZoneDepthCells;
        var depthNS = (sides.north && sides.south) ? 2 * maxD : (sides.north || sides.south) ? maxD : Infinity;
        var depthWE = (sides.west && sides.east) ? 2 * maxD : (sides.west || sides.east) ? maxD : Infinity;
        var okNS = depthNS !== Infinity && z.h <= depthNS + EPS, okWE = depthWE !== Infinity && z.w <= depthWE + EPS;
        if (depthNS === Infinity && depthWE === Infinity) err(it.ref, 'Zone does not touch any zonable road (highways and tracks do not count).');
        else if (!okNS && !okWE) err(it.ref, 'Zone is deeper than ' + maxD + ' cells from its road (' + z.w + '×' + z.h + '). Zoning only reaches 6 cells from a road.');
      }
    });

    // the task asks for residential, commercial and office zoning; an empty or partial layout must not pass
    var required = opts.requireZoneFamilies || ['residential', 'commercial', 'office'];
    var famCells = {};
    items.forEach(function (it) { if (it.kind === 'zone') famCells[it.zone.family] = (famCells[it.zone.family] || 0) + it.inst.w * it.inst.h; });
    if (!items.some(function (it) { return it.kind === 'zone'; })) err('zones', 'The layout has no zone blocks. Zoning is required.');
    else required.forEach(function (f) { if (!famCells[f]) err('zones', 'No ' + f + ' zoning in the layout; it must include ' + required.join(', ') + '.'); });

    // ---------- stats ----------
    var stats = { zoneCells: {}, buildings: 0, uniqueBuildings: 0, households: 0, serviceWorkplaces: 0, upkeepPerMonth: 0, coverage: {} };
    items.forEach(function (it) {
      if (it.kind === 'zone') { var f = it.zone.id; stats.zoneCells[f] = Math.round(((stats.zoneCells[f] || 0) + it.inst.w * it.inst.h) * 100) / 100; }
      else {
        stats.buildings++;
        if (it.asset.unique) stats.uniqueBuildings++;
        stats.households += (it.asset.stats && it.asset.stats.households) || 0;
        if (it.asset.kind !== 'signature') stats.serviceWorkplaces += (it.asset.stats && it.asset.stats.workplaces) || 0;
        stats.upkeepPerMonth += it.asset.upkeepPerMonth || 0;
      }
    });
    // Straight-line service coverage of zoned cells (the game uses road distance, so this is optimistic).
    var zoneItems = items.filter(function (it) { return it.kind === 'zone'; });
    var totalCells = zoneItems.reduce(function (s, it) { return s + it.inst.w * it.inst.h; }, 0);
    if (totalCells) {
      var groups = {};
      items.forEach(function (it) {
        if (it.kind !== 'building') return;
        var rng = it.asset.stats && it.asset.stats.serviceRangeM;
        if (!rng) return;
        (groups[it.asset.group] = groups[it.asset.group] || []).push({ cx: it.inst.x + it.fp.w / 2, cy: it.inst.y + it.fp.h / 2, r: rng / data.grid.cellMeters });
      });
      Object.keys(groups).forEach(function (g) {
        var covered = 0, sampled = 0;
        zoneItems.forEach(function (z) {
          // sample the centre of each whole or partial cell; count samples and hits the same way (fractional zones)
          for (var x = 0; x < z.inst.w; x++) for (var y = 0; y < z.inst.h; y++) {
            var px = z.inst.x + Math.min(x + 0.5, z.inst.w), py = z.inst.y + Math.min(y + 0.5, z.inst.h);
            sampled++;
            if (groups[g].some(function (s) { return Math.hypot(px - s.cx, py - s.cy) <= s.r; })) covered++;
          }
        });
        stats.coverage[g] = Math.round(covered / sampled * 100);
      });
      ['fire_rescue', 'police', 'healthcare', 'education', 'parks'].forEach(function (g) {
        if (!(g in stats.coverage)) { stats.coverage[g] = 0; warn(g, 'No ' + g.replace('_', ' & ') + ' building with a service range in the layout.'); }
      });
    }
    var needs = { electricity: 'power source', water_sewage: 'water/sewage building', garbage: 'garbage facility' };
    Object.keys(needs).forEach(function (g) {
      if (!items.some(function (it) { return it.kind === 'building' && it.asset.group === g; }))
        info.push({ ref: g, message: 'No ' + needs[g] + ' in this layout (fine if it is served from elsewhere in the city).' });
    });

    // which catalog files the model confirms it read to the end (their END OF FILE lines)
    var catalog = (data.meta && data.meta.catalog) || [];
    if (catalog.length) {
      var given = (layout.catalogMarkers || []).map(function (m) { return String(m).trim(); });
      var confirmed = catalog.filter(function (c) { return given.indexOf(c.marker) >= 0; }).map(function (c) { return c.file; });
      given.forEach(function (g) {
        if (!catalog.some(function (c) { return c.marker === g; }))
          warn('catalogMarkers', 'Unknown or altered catalog marker "' + g.slice(0, 90) + '". Copy each END OF FILE line exactly.');
      });
      stats.catalogRead = { confirmed: confirmed, total: catalog.length };
      if (!given.length) info.push({ ref: 'catalog', message: 'No "catalogMarkers" given, so it is unknown which catalog files were read completely.' });
      else {
        var zr = catalog.filter(function (c) { return /^catalog\/zones-roads/.test(c.file) && confirmed.indexOf(c.file) < 0; });
        if (zr.length) warn('catalog', 'Zones/roads catalog file(s) not confirmed as read completely: ' + zr.map(function (c) { return c.file; }).join(', ') + '.');
      }
    }

    stats.score = scorecard(layout, errors, warnings, stats);
    return { ok: errors.length === 0, errors: errors, warnings: warnings, info: info, stats: stats, _items: items, _roads: roads };
  }

  // ---------- scorecard ----------
  // Fixed tie-break order for comparing two layouts (first difference decides):
  //   1. fewer errors  2. fewer warnings  3. higher zoned share of the tile (whole %)
  //   4. higher average coverage of the six core services (whole %)  5. lower upkeep per zoned cell (whole ₡)
  var CORE_SERVICES = ['fire_rescue', 'police', 'healthcare', 'education', 'parks', 'communications'];
  var TIE_BREAK = [
    { key: 'errors', label: 'errors', better: 'lower' },
    { key: 'warnings', label: 'warnings', better: 'lower' },
    { key: 'zonedSharePct', label: 'zoned share of the tile', better: 'higher' },
    { key: 'coreCoveragePct', label: 'core service coverage', better: 'higher' },
    { key: 'upkeepPerZonedCell', label: 'upkeep per zoned cell', better: 'lower' }
  ];
  function scorecard(layout, errors, warnings, stats) {
    var zoned = Object.keys(stats.zoneCells).reduce(function (s, k) { return s + stats.zoneCells[k]; }, 0);
    var area = layout.bounds ? layout.bounds.w * layout.bounds.h : null;
    var cov = CORE_SERVICES.map(function (g) { return stats.coverage[g] || 0; });
    return {
      errors: errors.length,
      warnings: warnings.length,
      zonedSharePct: area ? Math.round(zoned / area * 100) : null,
      coreCoveragePct: Math.round(cov.reduce(function (a, b) { return a + b; }, 0) / CORE_SERVICES.length),
      upkeepPerZonedCell: zoned ? Math.round(stats.upkeepPerMonth / zoned) : null
    };
  }
  // compare(resultA, resultB) -> { winner: 'A' | 'B' | 'tie', decidedBy, a, b }
  function compare(ra, rb) {
    var a = ra.stats ? ra.stats.score : ra, b = rb.stats ? rb.stats.score : rb;
    for (var i = 0; i < TIE_BREAK.length; i++) {
      var t = TIE_BREAK[i], x = a[t.key], y = b[t.key];
      if (x === y || x == null || y == null) continue;
      var aWins = t.better === 'lower' ? x < y : x > y;
      return { winner: aWins ? 'A' : 'B', decidedBy: t.label, step: i + 1, a: a, b: b };
    }
    return { winner: 'tie', decidedBy: null, step: null, a: a, b: b };
  }

  // ---------- rendering ----------
  var COLORS = {
    residential_low: '#9be39b', residential_row: '#7fd67f', residential_medium: '#5cc35c', residential_high: '#2f9e44',
    residential_mixed: '#66b48a', residential_lowrent: '#8fbf6a', commercial_low: '#74c0fc', commercial_high: '#1c7ed6',
    office_low: '#d0a6f5', office_high: '#9c36b5', industrial_manufacturing: '#f1c40f'
  };
  var GROUP_COLORS = {
    signature: '#e8590c', landmarks: '#c2255c', parks: '#40c057', education: '#f59f00', healthcare: '#fa5252',
    fire_rescue: '#e03131', police: '#364fc7', administration: '#5f3dc4', electricity: '#fcc419', water_sewage: '#22b8cf',
    garbage: '#868e96', deathcare: '#495057', communications: '#15aabf', research: '#7048e8', parking: '#adb5bd'
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderSVG(result, opts) {
    opts = opts || {};
    var all = result._items.map(function (i) { return bbox(i.poly); }).concat(result._roads.map(function (r) { return bbox(r.poly); }));
    if (!all.length) return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>';
    var x0 = Math.min.apply(null, all.map(function (b) { return b.x0; })) - 2, y0 = Math.min.apply(null, all.map(function (b) { return b.y0; })) - 2;
    var x1 = Math.max.apply(null, all.map(function (b) { return b.x1; })) + 2, y1 = Math.max.apply(null, all.map(function (b) { return b.y1; })) + 2;
    var bad = {}; result.errors.forEach(function (e) { bad[e.ref] = 'err'; });
    result.warnings.forEach(function (w) { if (!bad[w.ref]) bad[w.ref] = 'warn'; });
    var pts = function (p) { return p.map(function (q) { return q[0] + ',' + q[1]; }).join(' '); };
    var out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + [x0, y0, x1 - x0, y1 - y0].join(' ') + '" style="width:100%;height:auto;background:#f1f3f5;font-family:system-ui,sans-serif">'];
    out.push('<defs><pattern id="cs2grid" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#dee2e6" stroke-width="0.04"/></pattern></defs>');
    out.push('<rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '" fill="url(#cs2grid)"/>');
    result._items.filter(function (i) { return i.kind === 'zone'; }).forEach(function (z) {
      out.push('<polygon points="' + pts(z.poly) + '" fill="' + (COLORS[z.zone.id] || '#ccc') + '" fill-opacity="0.55" stroke="' + (bad[z.ref] === 'err' ? '#e03131' : '#495057') + '" stroke-width="' + (bad[z.ref] ? 0.3 : 0.06) + '"><title>' + esc(z.ref + ': ' + z.zone.name + ' ' + z.inst.w + '×' + z.inst.h) + '</title></polygon>');
    });
    result._roads.forEach(function (r) {
      var hw = r.type.category === 'highway', tr = r.type.category === 'track';
      out.push('<polygon points="' + pts(r.poly) + '" fill="' + (hw ? '#495057' : tr ? '#8d6e63' : '#6c757d') + '"><title>' + esc(r.ref + ': ' + r.type.name) + '</title></polygon>');
    });
    result._items.filter(function (i) { return i.kind === 'building'; }).forEach(function (b) {
      var c = GROUP_COLORS[b.asset.group] || '#adb5bd', bb = bbox(b.poly), f = bbox(frontStrip(b.inst, b.fp));
      out.push('<g><title>' + esc(b.ref + ': ' + b.asset.name + ' (' + b.asset.size.w + '×' + b.asset.size.d + ')') + '</title>');
      out.push('<polygon points="' + pts(b.poly) + '" fill="' + c + '" fill-opacity="0.9" stroke="' + (bad[b.ref] === 'err' ? '#e03131' : bad[b.ref] ? '#f08c00' : '#212529') + '" stroke-width="' + (bad[b.ref] ? 0.35 : 0.08) + '"/>');
      if (b.asset.placement === 'road') out.push('<rect x="' + Math.max(f.x0, bb.x0) + '" y="' + Math.max(f.y0, bb.y0) + '" width="' + (Math.min(f.x1, bb.x1) - Math.max(f.x0, bb.x0) || 0.25) + '" height="' + (Math.min(f.y1, bb.y1) - Math.max(f.y0, bb.y0) || 0.25) + '" fill="#212529" opacity="0.5"/>');
      if (opts.labels !== false && b.fp.w >= 4 && b.fp.h >= 3) {
        var fs = Math.min(1.4, b.fp.w / Math.max(6, b.asset.name.length * 0.55));
        out.push('<text x="' + (bb.x0 + b.fp.w / 2) + '" y="' + (bb.y0 + b.fp.h / 2) + '" font-size="' + fs + '" text-anchor="middle" dominant-baseline="middle" fill="#fff" stroke="#000" stroke-width="' + fs * 0.12 + '" paint-order="stroke">' + esc(b.asset.name) + '</text>');
      }
      out.push('</g>');
    });
    out.push('</svg>');
    return out.join('');
  }

  function reportHTML(result) {
    var s = result.stats, h = [];
    h.push('<div style="font:14px/1.45 system-ui,sans-serif;color:#212529">');
    h.push('<div style="font-weight:600;font-size:16px;margin:8px 0;color:' + (result.ok ? '#2b8a3e' : '#c92a2a') + '">' +
      (result.ok ? '✔ Valid layout' : '✖ ' + result.errors.length + ' error(s)') + ' · ' + result.warnings.length + ' warning(s)</div>');
    function list(arr, color) {
      if (!arr.length) return;
      h.push('<ul style="margin:4px 0 8px;padding-left:20px;color:' + color + '">');
      arr.slice(0, 200).forEach(function (e) { h.push('<li><b>' + esc(e.ref) + '</b>: ' + esc(e.message) + '</li>'); });
      if (arr.length > 200) h.push('<li>… ' + (arr.length - 200) + ' more</li>');
      h.push('</ul>');
    }
    list(result.errors, '#c92a2a'); list(result.warnings, '#e8590c'); list(result.info, '#495057');
    h.push('<div style="margin-top:6px"><b>Buildings:</b> ' + s.buildings + ' (' + s.uniqueBuildings + ' unique) · <b>Signature households:</b> ' + s.households +
      ' · <b>Service jobs:</b> ' + s.serviceWorkplaces + ' · <b>Upkeep:</b> ₡' + s.upkeepPerMonth.toLocaleString() + '/month</div>');
    var zc = Object.keys(s.zoneCells);
    if (zc.length) h.push('<div><b>Zoned cells:</b> ' + zc.map(function (k) { return k + ' ' + s.zoneCells[k]; }).join(' · ') + '</div>');
    if (s.catalogRead) h.push('<div><b>Catalog files confirmed read completely:</b> ' + s.catalogRead.confirmed.length + ' of ' + s.catalogRead.total +
      (s.catalogRead.confirmed.length ? ' (' + s.catalogRead.confirmed.map(function (f) { return esc(f.replace('catalog/', '')); }).join(', ') + ')' : '') + '</div>');
    var cv = Object.keys(s.coverage);
    if (cv.length) h.push('<div><b>Service coverage of zoned cells</b> (straight-line, optimistic): ' + cv.map(function (k) { return k + ' ' + s.coverage[k] + '%'; }).join(' · ') + '</div>');
    var sc = s.score;
    if (sc) {
      var cell = 'padding:2px 10px;border-top:1px solid #dee2e6';
      h.push('<table style="border-collapse:collapse;margin-top:8px;font-size:13px"><caption style="text-align:left;font-weight:600;padding-bottom:2px">' +
        'Scorecard (tie-break order, first difference decides)</caption>' +
        [['1. Errors', sc.errors, 'fewer'], ['2. Warnings', sc.warnings, 'fewer'],
         ['3. Zoned share of tile', sc.zonedSharePct == null ? 'n/a (no bounds)' : sc.zonedSharePct + '%', 'higher'],
         ['4. Core service coverage', sc.coreCoveragePct + '%', 'higher'],
         ['5. Upkeep per zoned cell', sc.upkeepPerZonedCell == null ? 'n/a' : '₡' + sc.upkeepPerZonedCell, 'lower']
        ].map(function (r) { return '<tr><td style="' + cell + '">' + r[0] + '</td><td style="' + cell + ';font-weight:600">' + r[1] + '</td><td style="' + cell + ';color:#868e96">' + r[2] + ' is better</td></tr>'; }).join('') +
        '</table>');
    }
    h.push('<div style="color:#868e96;font-size:12px;margin-top:6px">Checked by cs2 validator ' + VERSION + ' · data extracted from the Cities: Skylines II game files</div></div>');
    return h.join('');
  }

  function mount(layout, el, opts) {
    opts = opts || {};
    if (typeof el === 'string') el = document.querySelector(el);
    el.innerHTML = '<div style="font:14px system-ui;color:#868e96">Loading CS2 asset data…</div>';
    return load(opts.dataUrl).then(function (data) {
      var res = validate(layout, Object.assign({ data: data }, opts));
      el.innerHTML = '<div class="cs2-map">' + renderSVG(res, opts) + '</div><div class="cs2-report">' + reportHTML(res) + '</div>';
      return res;
    }).catch(function (e) {
      el.innerHTML = '<div style="color:#c92a2a;font:14px system-ui">CS2 validator failed: ' + esc(e.message) + '</div>';
      throw e;
    });
  }

  function asset(id) { return cache && cache._byId[id]; }

  return { version: VERSION, load: load, validate: validate, compare: compare, renderSVG: renderSVG, reportHTML: reportHTML, mount: mount, asset: asset, footprint: footprint, _index: index };
});
