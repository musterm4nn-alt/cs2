# Rules for AI models designing a Cities: Skylines II layout

Read this whole file before you design anything. These rules let a validator check your layout
automatically, so follow the format exactly.

## Data

- Asset list, compact (best for reading): https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/CATALOG.md
- Asset list, full JSON (what the validator uses): https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v1/assets.json
- Validator script: https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v1/validator.js

Only use asset, zone and road ids that appear in that data. Never invent buildings or sizes.

## The grid

- 1 cell = 8 m. All coordinates and sizes are in cells. x grows east, y grows south.
- A building's `size` is `w × d`: `w` = width along its road (frontage), `d` = depth away from the road.
- A building's `x, y` is its **top-left cell** after rotation.
- `rotation` is 0, 90, 180 or 270 and says which way the **front** faces:
  0 = north (−y), 90 = east (+x), 180 = south (+y), 270 = west (−x).
  At 0 or 180 the footprint is `w` wide and `d` tall. At 90 or 270 it is `d` wide and `w` tall.

## Hard rules (errors)

1. **Real ids and sizes only.** Every building uses an `asset` id from the data; its footprint comes from the data, not from you.
2. **No overlaps.** Buildings, zone blocks and roads may not overlap each other. Touching edges is fine.
3. **Unique buildings once.** Assets marked unique (`U` in the catalog, `unique: true` in JSON) appear at most once.
   All signature buildings and landmarks are unique. (`U?` = believed unique; the validator warns instead of failing.)
4. **Road access.** A building with placement `road` must have its front edge touching a normal road.
   Highways and tracks do not give access.
5. **Zoning depth.** A zone block must touch a road that allows zoning, and reaches at most **6 cells** from it
   (up to 12 if the block is between two parallel roads). Lots grow inside zones at the sizes in the catalog.
6. **Extensions attach.** Assets with kind `extension` (placement `attached`) need `"parent": "<instance id>"` of a
   matching parent building and must touch it. In-building upgrades have no footprint: list them in the parent's
   `"upgrades"` array instead.
7. **No industry** for this task: no `industrial_*` zones.

Special sites the validator cannot see (it only warns): placement `water` needs a shoreline (set `"onWater": true`),
`track` buildings sit on rail/tram/subway track, `resource:*` needs that natural resource.

## Roads

Roads are polylines along their **centre line**: `{"id":"r1","type":"four_lane_road","path":[[0,20],[120,20]]}`.
A road covers `widthCells / 2` on each side of the centre line. Road widths are estimates (see the catalog), so leave
buildings and zones flush against the road edge: for a road of width 3 centred on y = 20, its edges are y = 18.5
and y = 21.5. Straight, axis-aligned segments are easiest to validate.

## Layout format

```json
{
  "name": "Repeatable district block",
  "bounds": { "w": 160, "h": 160 },
  "roads": [
    { "id": "main", "type": "four_lane_road", "path": [[0, 20], [160, 20]] }
  ],
  "zones": [
    { "id": "z1", "type": "residential_high", "x": 10, "y": 21.5, "w": 30, "h": 6 }
  ],
  "buildings": [
    { "id": "hosp", "asset": "hospital", "x": 60, "y": 21.5, "rotation": 0, "upgrades": ["hospital_helipad"] },
    { "id": "pp1",  "asset": "small_park", "x": 50, "y": 14.5, "rotation": 180 }
  ]
}
```

`bounds` is optional; with it, anything outside the box is an error.

## Using the validator in your HTML page

```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/gh/musterm4nn-alt/cs2@v1/validator.js"></script>
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
