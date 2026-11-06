# cs2: asset data and layout validator for Cities: Skylines II

A dataset of placeable Cities: Skylines II assets (real footprint sizes, functions, uniqueness, DLC) plus a small
JavaScript validator that checks and draws a city layout. It is built so AI models with web access (for example in
Code Arena) can design layouts that respect real building sizes and game rules, and so their results can be compared
objectively.

## What's here

| File | What it is |
|---|---|
| [`RULES.md`](RULES.md) | Rules and layout format, written for AI models. |
| [`CATALOG.md`](CATALOG.md) | Compact one-line-per-asset list: id, size, unique, DLC, placement, key stats. |
| [`assets.json`](assets.json) | Full data: 338 service assets (incl. extensions and upgrades), 91 signature buildings, zones, roads. |
| [`validator.js`](validator.js) | Validator + SVG renderer. Works in the browser and in Node. |
| [`PROMPT.md`](PROMPT.md) | Ready-to-paste battle prompt that points models at the files above. |
| [`examples/`](examples) | Sample layout and a page to check any layout JSON by hand. |
| `data/raw/`, `tools/` | Raw wiki extracts, the build script and tests. |

## Use it in a page

```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v1/validator.js"></script>
<script>
  CS2.mount({ roads: [...], zones: [...], buildings: [...] }, document.getElementById('app'));
</script>
```

The validator checks:

- every asset, zone and road id exists in the data
- no overlaps between buildings, zones and roads
- unique buildings (all signature buildings and landmarks) placed at most once
- the building's front edge touches a road (highways and tracks don't count)
- zone blocks touch a road and are at most 6 cells deep
- extensions are attached to a matching parent, and in-building upgrades aren't placed as buildings
- no industrial zoning (default; pass `{ noIndustry: false }` to allow it)
- the layout stays inside its bounds

It also reports zoned cells per type, upkeep, households and straight-line service coverage.

## Accuracy: read this

- Building sizes, stats, DLC and requirements come from the
  [Cities: Skylines II Wiki](https://cs2.paradoxwikis.com/Service_buildings). Some wiki sections were last checked
  for game version 1.5, so a few numbers may be outdated.
- **Road widths are estimates** (`widthVerified: false`); the wiki doesn't list them.
- **Which side of `w × d` is the frontage is assumed**, not confirmed, for service buildings
  (`sizeConventionVerified: false`). The validator warns, rather than fails, when a road touches a side but not the front.
- **Unique service buildings** (`U?` in the catalog) are a best guess; only signature buildings and landmarks are
  confirmed unique. Edit `LIKELY_UNIQUE_SERVICES` in `tools/build_assets.py` to correct them.
- Region-pack variants and newer DLC content appear only where the wiki tables list them.
- Terrain, water, slopes and natural resources aren't modelled; special sites only produce warnings.

Corrections are welcome: edit the files in `data/raw/` or the tables in `tools/build_assets.py`, then rebuild.

## Rebuild and test

```bash
python tools/build_assets.py
node tools/test_validator.js
```

After changing the data, move the `v1` tag (or create `v1.x.y`) so jsDelivr serves the new version.

## License

The data is derived from the Cities: Skylines II Wiki and is licensed under
[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/); non-commercial use only, with attribution.
Cities: Skylines II is a trademark of Paradox Interactive and Colossal Order; this project is unofficial.
