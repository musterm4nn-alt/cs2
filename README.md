# cs2: asset data and layout validator for Cities: Skylines II

A dataset of placeable Cities: Skylines II assets (lot sizes, functions, uniqueness, upgrades, DLC), extracted from
the game files, plus a small JavaScript validator that checks and draws a city layout. It is built so AI models with
web access (for example in Code Arena) can design layouts that respect real building sizes and game rules, and so
their results can be compared objectively.

## What's here

| File | What it is |
|---|---|
| [`RULES.md`](RULES.md) | Rules and layout format, written for AI models. |
| [`CATALOG.md`](CATALOG.md) | Compact one-line-per-asset list: id, size, unique, DLC, placement, parent, upkeep, key stats. |
| [`assets.json`](assets.json) | Full data: 732 buildings, sub-buildings and upgrades (incl. 144 signature buildings), 18 zones, 102 roads/tracks. |
| [`validator.js`](validator.js) | Validator + SVG renderer. Works in the browser and in Node. |
| [`PROMPT.md`](PROMPT.md) | Ready-to-paste battle prompt that points models at the files above. |
| [`examples/`](examples) | Sample layout and a page to check any layout JSON by hand. |
| [`tools/`](tools) | Game-data extractor, build script and tests. |

## Use it in a page

```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v2/validator.js"></script>
<script>
  CS2.mount({ roads: [...], zones: [...], buildings: [...] }, document.getElementById('app'));
</script>
```

The validator checks:

- every asset, zone and road id exists in the data
- no overlaps between buildings, zones and roads
- unique buildings (the game's unique flag, all signature buildings and landmarks) placed at most once
- the building's front edge touches a road (highways and tracks don't count)
- zone blocks touch a zonable road and are at most 6 cells deep
- sub-buildings sit within the game's maximum distance of a matching parent; upgrades go on a matching parent, once
- no industrial zoning or industrial signature buildings (default; pass `{ noIndustry: false }` to allow them)
- the layout stays inside its bounds

It also reports zoned cells per type, upkeep, service jobs and straight-line service coverage.

## Where the data comes from

`tools/extract_game_data.py` reads a local install:

- **Base game:** Unity prefab objects in `Cities2_Data/resources.assets`, decoded with
  [UnityPy](https://github.com/K0lb3/UnityPy) using field layouts rebuilt from the game's own DLLs.
- **DLC:** Colossal-format prefabs inside `Cities2_Data/Content/<DLC>/Prefabs.cok`, read with a small parser.
- **Names:** the game's English localization files.

What is taken directly from the game: lot width/depth (`m_LotWidth`/`m_LotDepth`), the unique flag (`UniqueObject`),
signature buildings and their zone, upgrades and sub-buildings with their parents and maximum placement distance,
upkeep, construction cost, workplaces, service range/capacity, capacities (patients, students, power, water…),
local and city-wide effects, DLC, road widths (sum of the road's section widths), lanes, speed and zoning.
Zone lot ranges are the min/max sizes of the growable buildings in each zone.

## Limits

- Effect types are only named where a known in-game value confirms them (well-being, crime, attractiveness, import
  costs, office efficiency, university interest/graduation); others appear as raw type numbers.
- Households of signature buildings aren't stored in the prefabs (the game computes them), so they're not listed.
- Terrain, water, slopes and natural resources aren't modelled; special sites only produce warnings.
- Service coverage in the report is straight-line; the game uses road distance.
- The data reflects the game version and DLC installed when it was extracted.

## Rebuild and test

Needs a local Cities: Skylines II install for the extraction step.

```bash
pip install UnityPy TypeTreeGeneratorAPI
python tools/extract_game_data.py "C:/Program Files (x86)/Steam/steamapps/common/Cities Skylines II"
python tools/build_assets.py
node tools/test_validator.js
```

`data/game_data.json` (the raw extraction) is not committed. After changing the data, tag a new version
(`v2.x.y`, and move `v2`) so jsDelivr serves it.

## Disclaimer

Unofficial fan project. Cities: Skylines II is a trademark of Paradox Interactive and Colossal Order. This repository
contains only facts about the game's assets (sizes, numbers, names) for planning purposes, not game assets themselves.
