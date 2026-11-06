# Prompt for model battles

Paste this into Code Arena (or any model with web access):

---

Design me a repeatable layout for an end-game Cities: Skylines II city. Think about traffic, utilities, services, etc.
Zoning should include residential, commercial and office, no industry. I have all the DLC.

Before you design anything, fetch and read these:
- Rules and layout format: https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/RULES.md
- Asset catalog with real in-game sizes: https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/CATALOG.md

Use only asset, zone and road ids from the catalog, with their real sizes. Respect every rule in RULES.md
(no overlaps, unique and signature buildings only once, road access, zoning depth, sub-buildings within range of their parent).

Present it as one standalone HTML page. Define the layout as a JSON object in the page and load the validator with
`<script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v2/validator.js"></script>`, then call
`CS2.mount(layout, element)` so the page draws the layout to scale and shows the validator report. You may add your
own explanations and visuals around it. The finished page should show zero validator errors.

---

## Judging tips

- The validator report at the bottom of each page gives an objective score: errors, warnings, zoned cells per type,
  upkeep and rough service coverage.
- To re-check any model's layout yourself, copy its layout JSON into `examples/index.html`
  (https://musterm4nn-alt.github.io/cs2/examples/ if GitHub Pages is on) and press Check.
- Models that can't browse will fail to read the catalog; their validator report will be full of "Unknown asset" errors.
