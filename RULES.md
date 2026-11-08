# Rules for AI models designing a Cities: Skylines II layout

Read this whole file before you design anything. These rules let a validator check your layout
automatically, so follow the format exactly.

## Data

- Catalog index: https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.2.0/CATALOG.md
  It lists about 20 catalog files, each under 7,000 characters (web fetch tools may cut longer pages off). Always read
  the `zones-roads` files, then the files for the buildings you need (services, education & culture, parks & parking,
  utilities, transport, signature buildings).
- Asset list, full JSON (what the validator uses): https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v3.2.0/assets.json
- Validator script: https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v3.2.0/validator.js

All sizes, road widths, unique flags and upgrade rules were extracted from the game files (base game + DLC).
Only use asset, zone and road ids that appear in that data. Never invent buildings or sizes.

**Every catalog file ends with a line starting `END OF FILE`.** If a file you fetched doesn't end with that line, it
was cut off: fetch it again or in parts before using it. Copy the END OF FILE line of each file you read completely,
exactly as written, into the layout's `"catalogMarkers"` list. The validator report shows which files were read in full.

## The grid

- 1 cell = 8 m. All coordinates and sizes are in cells. x grows east, y grows south.
- A building's `size` is `w × d`: `w` = lot width along its road (its front), `d` = lot depth away from the road.
- A building's `x, y` is its **top-left cell** after rotation.
- `rotation` is 0, 90, 180 or 270 and says which way the **front** faces:
  0 = north (−y), 90 = east (+x), 180 = south (+y), 270 = west (−x).
  At 0 or 180 the footprint is `w` wide and `d` tall. At 90 or 270 it is `d` wide and `w` tall.

## Kinds of assets

| kind | how to use it |
|---|---|
| `service`, `landmark`, `signature` | Place as a building. Front edge on a road (see placement). |
| `sub_building` | Its own lot, placed by you **within `maxDistanceM` metres of its parent**. Set `"parent": "<instance id>"`. |
| `upgrade` | No footprint. Add its id to the parent's `"upgrades"` array. |
| `fixed_extension` | Attached by the game at a fixed spot. Add it to the parent's `"upgrades"` array. |

## Hard rules (errors)

1. **Real ids and sizes only.** Every building uses an `asset` id from the data; its footprint comes from the data.
2. **No overlaps.** Buildings, zone blocks and roads may not overlap each other. Touching edges is fine.
3. **Unique buildings once.** Assets with `unique: true` (`U` in the catalog) appear at most once. This includes every
   signature building and landmark, plus unique services such as City Hall or the Space Center.
4. **Road access.** A building with placement `road` must have its front edge touching a road that has building access.
   Highways and tracks do not give access.
5. **Zoning depth.** A zone block must touch a road that allows zoning, and reaches at most **6 cells** from it
   (up to 12 if the block is between two parallel roads). Lots grow inside zones at the sizes in the catalog.
6. **Sub-buildings and upgrades.** A `sub_building` needs a matching `parent` and must be within its `maxDistanceM`.
   `upgrade` / `fixed_extension` ids go only in the `upgrades` list of a matching parent, each at most once.
7. **Zoning required, no industry.** The layout must contain residential, commercial and office zone blocks.
   No `industrial_*` zones and no industrial signature buildings.
   High-density zones (`density: high` in the catalog) must be fed by a road wider than 1 cell or a pedestrian
   street: along alleys and gravel roads only low or medium density is allowed.
8. **One connected road network.** Every normal road must connect to the others. Roads connect where their centre
   lines cross or where one ends against another (at its centre line or its edge). Highways and tracks are separate
   networks and are not checked.
9. **No roads on top of roads.** Two roads or tracks may cross at an angle (an intersection), but may not run along
   each other overlapping. To put trams on a road, use separate tram track next to it, not on top of it.
10. **Repeatable tiles.** With `"repeatable": true` and `bounds`, every road or track that ends on a tile edge must
    continue on the opposite edge at the same position with the same type. Roads matched this way also count as
    connected through the neighbouring tile. Without `"repeatable": true`, mismatches are only warnings.

Special sites the validator cannot see (it only warns): placement `water` needs a shoreline (set `"onWater": true`),
`track` buildings must touch a matching rail/tram/subway track, `resource:*` needs that natural resource,
`over_road` crosses an existing road.

## How layouts are ranked

The validator report ends with a scorecard. Two layouts are compared in this order; the first difference decides:
1. fewer errors, 2. fewer warnings, 3. higher zoned share of the tile, 4. higher average coverage of fire, police,
health, education, parks and telecom, 5. lower upkeep per zoned cell.

## Roads

Roads are polylines along their **centre line**: `{"id":"r1","type":"four_lane_road","path":[[0,20],[120,20]]}`.
A road covers `widthCells / 2` on each side of the centre line. For a four-lane road (24 m = 3 cells) centred on
y = 20, its edges are y = 18.5 and y = 21.5; put buildings and zones flush against those edges. Straight, axis-aligned
segments are easiest to validate. Road widths come from the game's road sections.

## Layout format

```json
{
  "name": "Repeatable district block",
  "bounds": { "w": 160, "h": 160 },
  "repeatable": true,
  "roads": [
    { "id": "main", "type": "four_lane_road", "path": [[0, 20], [160, 20]] }
  ],
  "zones": [
    { "id": "z1", "type": "residential_high", "x": 10, "y": 21.5, "w": 30, "h": 6 },
    { "id": "z2", "type": "commercial_high", "x": 10, "y": 12.5, "w": 30, "h": 6 },
    { "id": "z3", "type": "office_high", "x": 45, "y": 12.5, "w": 30, "h": 6 }
  ],
  "buildings": [
    { "id": "hosp", "asset": "hospital", "x": 60, "y": 21.5, "rotation": 0, "upgrades": ["hospital_helipad"] },
    { "id": "school", "asset": "elementary_school", "x": 90, "y": 21.5, "rotation": 0 },
    { "id": "pg", "asset": "elementary_school_playground", "x": 108, "y": 21.5, "rotation": 0, "parent": "school" }
  ]
}
```

`bounds` is optional; with it, anything outside the box is an error. `repeatable` is optional (see rule 10). `catalogMarkers` is optional but shows which catalog files you read completely.

## Using the validator in your HTML page

```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v3.2.0/validator.js"></script>
<script>
  const layout = { /* your layout JSON */ };
  CS2.mount(layout, document.getElementById('app')).then(result => {
    console.log(result.ok, result.errors, result.stats);
  });
</script>
```

`CS2.mount` downloads the data, checks every rule above, draws the layout to scale and prints a report with errors,
warnings, zoned cells, upkeep and approximate service coverage. Fix every error before you finish. You can also call
`await CS2.load()` and then `CS2.validate(layout)` or `CS2.asset('hospital')` to read sizes in your own code.
