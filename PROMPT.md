# Prompt for model battles

Paste this into Code Arena (or any model with web access):

---

Design a repeatable district tile for an end-game Cities: Skylines II city. Think about traffic, utilities and services. Zoning should include residential, commercial and office, no industry. I have all the DLC.

Before you design anything, fetch and read these:
- Rules and layout format: https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/RULES.md
- Asset catalog with real in-game sizes: https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/CATALOG.md

Requirements:
- The tile is exactly 200 × 200 cells (1.6 × 1.6 km). Set "bounds": {"w": 200, "h": 200}. Everything must fit inside.
- The tile must repeat: roads that reach an edge must continue on the opposite edge at the same position and with the same road type, so copies can be placed side by side.
- Use only asset, zone and road ids from the catalog, with their real sizes, and follow every rule in RULES.md.
- Utilities that serve a whole city (power, water, sewage, garbage) may sit in the tile or be described as provided elsewhere. Say which.

Present it as one standalone HTML page. Define the layout as a JSON object in the page, load the validator with
<script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v2.1.0/validator.js"></script>
and call CS2.mount(layout, element) so the page draws the layout to scale and shows the validator report. The finished page must show zero validator errors.

Also explain on the page, briefly:
1. The road hierarchy (which roads carry through traffic, which are local) and how traffic enters and leaves the tile.
2. How the tile connects to copies of itself.
3. Your mix: zoned cells per zone type and which services cover them.

---

## Judging tips

- The validator report at the bottom of each page gives an objective score: errors, warnings, zoned cells per type,
  upkeep and rough service coverage. With the fixed 200 × 200 tile these numbers are directly comparable.
- Check the tile edges yourself: roads leaving one edge should line up with the opposite edge.
- To re-check any model's layout yourself, copy its layout JSON into `examples/index.html` and press Check.
- Models that can't browse will fail to read the catalog; their validator report will be full of "Unknown asset" errors.

## Changelog that affects comparisons

- **v2.1.0:** corrected road widths. Pedestrian Street 24 → 16 m, Four-Lane Divided 38 → 24 m, Six-Lane Divided
  46 → 32 m, Eight-Lane Divided 56 → 40 m, one-way parking alleys 21 → 16 m. Results from v2.0.x used the old widths.
