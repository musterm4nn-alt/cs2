# Prompt for model battles

Paste this into Code Arena (or any model with web access):

---

Design a repeatable district tile for an end-game Cities: Skylines II city. Think about traffic, utilities and services. Zoning should include residential, commercial and office, no industry. I have all the DLC.

Before you design anything, fetch and read these:
- Rules and layout format: https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.3.0/RULES.md
- Asset catalog index (real in-game sizes): https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.3.0/CATALOG.md, then the catalog files it lists that you need

Requirements:
- The tile is exactly 200 × 200 cells (1.6 × 1.6 km). Set "bounds": {"w": 200, "h": 200} and "repeatable": true. Everything must fit inside.
- The tile must repeat: roads that reach an edge must continue on the opposite edge at the same position and with the same road type, so copies can be placed side by side.
- Use only asset, zone and road ids from the catalog, with their real sizes, and follow every rule in RULES.md.
- Put the END OF FILE line of every catalog file you read completely into the layout's "catalogMarkers" list.
- Utilities that serve a whole city (power, water, sewage, garbage) may sit in the tile or be described as provided elsewhere. Say which.

Present it as a single standalone index.html page. Define the layout as a JSON object in the page, load the validator with
<script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v3.3.0/validator.js"></script>
and call CS2.mount(layout, element) so the page draws the layout to scale and shows the validator report. The finished page must show zero validator errors.

Also explain on the page, briefly:
1. The road hierarchy (which roads carry through traffic, which are local) and how traffic enters and leaves the tile.
2. How the tile connects to copies of itself.
3. Your mix: zoned cells per zone type and which services cover them.

---

## Judging tips

- The validator report at the bottom of each page gives an objective score: errors, warnings, zoned cells per type,
  upkeep and rough service coverage. With the fixed 200 × 200 tile these numbers are directly comparable.
- The validator report shows the points breakdown. Fewer errors wins; between equal errors, more points wins.
- Check the tile edges yourself: roads leaving one edge should line up with the opposite edge.
- To re-check any model's layout yourself, copy its layout JSON into `examples/index.html` and press Check.
- Models that can't browse will fail to read the catalog; their validator report will be full of "Unknown asset" errors.
- "Catalog files confirmed read completely" in the report shows whether a model saw the whole data. A low number with
  few errors means it got lucky; a low number with many errors may mean its web tool cut files off.

## Changelog that affects comparisons

- **v3.3.0 (frozen, record version):** new scoring. Battles are decided by fewer errors, then more points out of 100:
  capacity 25 (households/jobs from the game's zone factors, capped), balance 15 (jobs per household), services 25
  (coverage + capacity per household), traffic 20 (arterial frame, zoning on big roads, road lanes per household),
  cost 15 (upkeep per household), −3 per warning. Zoning more no longer wins on its own. Rules and data unchanged
  apart from per-zone homes/jobs factors. Results from v3.2.0 stay in their own record section.
- **v3.2.0:** as v3.1.0, but small pedestrian streets no longer limit density. They are
  1 cell wide but carry no car traffic, so high-density zoning may face them; alleys, gravel roads and the one-lane
  port gate road still allow only low or medium density. Record section for rounds 5–6.
- **v3.1.0:** high-density zones must be fed by a road wider than 1 cell; along alleys,
  gravel roads and small pedestrian streets only low or medium density is allowed. Closes the alley-grid strategy
  (a round-4 run reached 83% zoned with high density on 8 m alleys). Zones now carry a density in the catalog.
  Superseded by v3.2.0 before any battle was recorded.
- **v3.0.0 (frozen):** same rules, data and scoring as v2.5.0. Superseded by v3.1.0 before any battle was recorded.
- **v2.5.0:** the report ends with a scorecard and `CS2.compare(a, b)` applies the fixed tie-break order (errors,
  warnings, zoned share, core service coverage, upkeep per zoned cell). Validation is unchanged.
- **v2.4.0:** a battle transcript showed Code Arena's `web_fetch` silently cuts every page at 8,000 characters. The
  catalog is now about 20 files of under 7,000 characters each (RULES.md and CATALOG.md fit too), so every file can be
  read in one fetch. New rule: a layout must contain residential, commercial and office zoning; a roads-only or
  zone-less layout is an error (round 3's 03-01-B passed with no zones at all).
- **v2.3.0:** catalog split into 9 small files (each under 14 KB) with END OF FILE markers; the prompt asks
  models to report the markers, and the validator shows how many catalog files each model read completely.
  No change to data or scoring rules.
- **v2.2.0:** new checks: one connected road network, no roads/tracks on top of each other, and tile edges must
  line up when the layout sets `"repeatable": true` (the prompt now asks for it). Round-2 layouts would score the
  same except 02-04-A, which gets one more error for its tram track running along a boulevard.
- **v2.1.0:** corrected road widths. Pedestrian Street 24 → 16 m, Four-Lane Divided 38 → 24 m, Six-Lane Divided
  46 → 32 m, Eight-Lane Divided 56 → 40 m, one-way parking alleys 21 → 16 m. Results from v2.0.x used the old widths.
