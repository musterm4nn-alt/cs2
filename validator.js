/*!
 * CS2 layout validator + renderer for Cities: Skylines II city layouts.
 * Data: assets.json (derived from the CS2 Wiki, CC BY-NC-SA 3.0). https://github.com/musterm4nn-alt/cs2
 *
 * Browser:  <script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v1/validator.js"></script>
 *           CS2.mount(layout, document.getElementById('app'))   // loads data, validates, draws, reports
 * Node:     const CS2 = require('./validator.js'); CS2.validate(layout, { data })
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CS2 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SCRIPT_BASE = (function () {
    try {
      var s = document.currentScript && document.currentScript.src;
      if (s) return s.replace(/[^/]*$/, '');
    } catch (e) {}
    return 'https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v1/';
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
      if (!a.placeable) { err(id, '"' + a.name + '" has no footprint of its own (in-building upgrade); list it under its parent\'s "upgrades" instead.'); return; }
      var rot = b.rotation || 0;
      if ([0, 90, 180, 270].indexOf(rot) < 0) { err(id, 'Rotation must be 0, 90, 180 or 270.'); return; }
      if (typeof b.x !== 'number' || typeof b.y !== 'number') { err(id, 'Building needs numeric x and y (top-left cell).'); return; }
      var fp = footprint(a, rot);
      counts[a.id] = (counts[a.id] || 0) + 1;
      items.push({ ref: id, kind: 'building', asset: a, inst: b, fp: fp, poly: rectPoly(b.x, b.y, fp.w, fp.h) });
      (b.upgrades || []).forEach(function (u) {
        var ua = data._byId[u];
        if (!ua) err(id, 'Unknown upgrade "' + u + '".');
        else if (ua.parent !== a.id) err(id, '"' + ua.name + '" is not an upgrade of "' + a.name + '".');
        else if (ua.kind !== 'upgrade') warn(id, '"' + ua.name + '" has its own footprint; place it as a building with "parent".');
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
      if (a.unique && counts[aid] > 1) {
        var m = '"' + a.name + '" is unique but placed ' + counts[aid] + ' times.';
        if (a.uniqueVerified) err(aid, m); else warn(aid, m + ' (uniqueness not verified in the data)');
      }
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

    var byRef = {}; items.forEach(function (it) { byRef[it.ref] = it; });
    function touchingRoads(poly) {
      return roads.filter(function (r) { return overlap(poly, r.poly) > EPS; });
    }

    items.forEach(function (it) {
      if (it.kind === 'building') {
        var a = it.asset, b = it.inst;
        if (a.kind === 'extension' || a.kind === 'port_module') {
          var parentOk = a.kind === 'port_module' ? /_port$/ : null;
          var p = b.parent && byRef[b.parent];
          if (!p || p.kind !== 'building') { err(it.ref, '"' + a.name + '" must name its parent building instance in "parent".'); return; }
          var okType = parentOk ? parentOk.test(p.asset.id) : p.asset.id === a.parent;
          if (!okType) { err(it.ref, '"' + a.name + '" cannot attach to "' + p.asset.name + '" (needs ' + a.parent + ').'); return; }
          var grown = rectPoly(p.inst.x - REACH, p.inst.y - REACH, p.fp.w + 2 * REACH, p.fp.h + 2 * REACH);
          if (a.kind === 'extension' && !overlap(it.poly, grown)) err(it.ref, 'Extension must touch its parent ' + b.parent + '.');
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

    // ---------- stats ----------
    var stats = { zoneCells: {}, buildings: 0, uniqueBuildings: 0, households: 0, serviceWorkplaces: 0, upkeepPerMonth: 0, coverage: {} };
    items.forEach(function (it) {
      if (it.kind === 'zone') { var f = it.zone.id; stats.zoneCells[f] = (stats.zoneCells[f] || 0) + it.inst.w * it.inst.h; }
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
        var covered = 0;
        zoneItems.forEach(function (z) {
          for (var x = 0; x < z.inst.w; x++) for (var y = 0; y < z.inst.h; y++) {
            var px = z.inst.x + x + 0.5, py = z.inst.y + y + 0.5;
            if (groups[g].some(function (s) { return Math.hypot(px - s.cx, py - s.cy) <= s.r; })) covered++;
          }
        });
        stats.coverage[g] = Math.round(covered / totalCells * 100);
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

    return { ok: errors.length === 0, errors: errors, warnings: warnings, info: info, stats: stats, _items: items, _roads: roads };
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
    var cv = Object.keys(s.coverage);
    if (cv.length) h.push('<div><b>Service coverage of zoned cells</b> (straight-line, optimistic): ' + cv.map(function (k) { return k + ' ' + s.coverage[k] + '%'; }).join(' · ') + '</div>');
    h.push('<div style="color:#868e96;font-size:12px;margin-top:6px">Checked by cs2 validator · data from the Cities: Skylines II Wiki (CC BY-NC-SA)</div></div>');
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

  return { version: '1.0.0', load: load, validate: validate, renderSVG: renderSVG, reportHTML: reportHTML, mount: mount, asset: asset, footprint: footprint, _index: index };
});
