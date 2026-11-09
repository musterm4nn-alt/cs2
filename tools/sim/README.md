# Traffic simulator (local evaluation)

A tool for judging battle layouts after the fact, on your own machine. The models never see it, and it doesn't
change the validator or the battle rules.

```bash
node tools/sim/simulate.js tools/calibration/layouts/06-01-B.json      # one layout -> tools/sim/out/06-01-B.html
node tools/sim/simulate.js path/to/model-page.html                     # a model's page works too
node tools/sim/simulate.js --all tools/calibration/layouts             # one line per layout, a report for each
```

Options: `--days 3` (simulated days, the last one is reported), `--seed 1`, `--city-km2 16`, `--json`,
`--city <exported city>.json` (run a city exported from the game; see Calibration).

## What it does

1. **Network.** The validator's road pieces become a graph: crossings and T-junctions are junctions; highways cross
   other roads without a junction (they connect only where a road ends on them). Lanes per direction, speed limits
   and which roads get traffic lights come from the game's road prefabs (`sim_data.json`).
2. **Endless city.** The tile is a torus: a road leaving the east edge continues at the matching point of the west
   edge (same rule as the validator's edge matching), likewise north and south. That is an infinite city made of
   copies of the tile, so through-traffic from the neighbouring tiles is included. A road that doesn't continue
   across the edge is a dead end.
3. **Lots.** Zone blocks are cut into lots of up to 6×6 cells; each lot gets households and jobs from the zone's
   game factors (`homesPerCell`, `jobsPerCell` in assets.json) and a driveway on the road that feeds it. Service
   buildings get a driveway on the road their front faces.
4. **Demand.** Workers are matched to jobs, pupils to school seats, shoppers to shops and leisure trips to parks and
   shops, picking the cheapest target with the game's random 0.5–1 cost factor. Jobs that the tile's own workers
   can't fill are taken by commuters from the wider city, who enter at the tile edges, as do goods trucks.
5. **Driving.** One game day lasts 4,369 seconds of driving, as in the game (262,144 frames at 60 frames per second),
   simulated in 1-second steps. Each road has a lane capacity and a storage of one car per 7.5 m of lane; junction
   approaches get a share of the capacity (signal phases, or priority for the major road); queues spill back. Cars
   pick routes by speed limit × measured flow, which is how the game's pathfinder sees congestion. A car blocked at
   the front of a queue for 10 minutes is removed (counted as "stuck").
6. **Result.** The headline is the game's own **traffic flow %**: for each road, the distance driven divided by the
   distance that could have been driven at the speed limit in the same time, averaged over four times of day, then
   averaged over all roads (`TrafficFlowSystem`). The report also shows trips completed, the median commute, waiting
   at junctions, the worst roads and junctions, and a map coloured by flow.

## What comes from the game, what is measured, what is assumed

From the decompiled game code (`Game.dll`, game version 1.6.2) and prefab data:

| Rule | Source |
|---|---|
| Work day 08:24–16:24, ±1 h per citizen, start rounded to the hour; evening +8 h, night +16 h | `WorkerSystem.GetTimeToWork`, `EconomyParameters` |
| City-size gates: workers commuting `min(40, round(100 / sqrt(0.0005 × pop)))` %, shopping/leisure `min(80, round(200 / sqrt(…)))` % | `WorkerSystem.IsTodayOffDay`, `HouseholdBehaviorSystem`, `CitizenBehaviorSystem.DoLeisure` |
| Evening/night shift shares of shops and offices | company prefabs (`Workplace`) |
| Traffic lights where a road that prefers lights meets 2+ other roads | `CompositionSelectSystem` |
| Lanes per direction, speed limits | road prefabs (default sections) |
| Pathfinding speed = limit × measured flow, flow smoothed over ~68 s | `PathUtils.CalculateSpeed`, `TrafficFlowSystem` |
| Gridlock loops are broken (cars make space) | `StuckMovingObjectSystem` |
| Traffic flow metric | `TrafficFlowSystem`, `CarNavigationSystem` |

Measured in the real game (`calibration/`, see below): car trips per household / worker / resident for every
purpose (work, school, shopping, leisure, other, trucks per shop or industry job, city service vehicles), the
hourly start profile, workers per resident, persons per household, the base driving speed on quiet roads per road
class (cars average 57 % of the limit on streets, 46 % in alleys, 73 % on highways, 52 % on ramps) and road
capacities (fitted so the simulated city matches the game).

Assumed: the city around the tile (16 km² of copies of it, which sets the city-size gates), junction capacity
shares, dwell times, how trips are spread over destinations. All are in `CONFIG` at the top of `simulate.js`.

Not modelled: public transport and bicycles (their effect is inside the measured car-trip rates), parking search,
lane-level turning, pedestrians at crossings, accidents.

## Calibration against the real game

`game-probe/` is a small game mod (CS2SimProbe). With it, the game itself was measured on a real city (Corwen,
102,000 residents, game 1.6.2):

- `calibration/corwen_probe.jsonl`: 30 game hours of samples: cars on the road by type and by the driver's purpose,
  trips started per purpose, households, workers, jobs, and the game's city traffic flow (42 %).
- `calibration/corwen_city.json`: the city's road network, buildings (households, jobs, the road they use), and
  the flow the game measured on every road piece.
- `calibration/calibration.json`: trip rates (`read_probe.js`) and base speeds (`fit_base_flow.js`) from those.

Check: `node tools/sim/simulate.js --city tools/sim/calibration/corwen_city.json --days 2` runs the same model on
the game city and compares it road by road with the game:

| | Game | Simulator |
|---|---|---|
| Average flow over all road pieces | 54 % | 49 % |
| Highways / small roads / alleys | 62 / 48 / 44 % | 46 / 49 / 54 % |
| Cars on the road (average / peak) | ~2,800 / ~3,300 | peak ~2,900 |
| Road-by-road correlation | | 0.29 |

So the overall level and the road types are close; which individual road jams is only loosely matched (the
simulator doesn't know where each of the city's trips really goes). Treat results as a comparison between layouts
under the same rules, not as an exact prediction.

### Running the probe

```bash
cd tools/sim/game-probe && dotnet build -c Release
```

Copy `bin/Release/CS2SimProbe.dll` and a `probe_config.txt` into
`%USERPROFILE%\AppData\LocalLow\Colossal Order\Cities Skylines II\Mods\CS2SimProbe\` and start the game with
`-continuelastsave` (for example from a `runOnce.txt` with that text in the LocalLow folder). The mod switches off
auto-save for its session, never saves, and quits when done. Remove the folder afterwards: a local mod loads in
every playset.

`probe_config.txt` for measuring: `speed=4`, `sampleEveryMinutes=20`, `scanEveryMinutes=2`, `durationHours=30`,
`quit=1`. For exporting the city: `speed=0`, `export=<full path>.json`, `exportOnly=1`, `quit=1`.

Then:

```bash
node tools/sim/read_probe.js <probe_out.jsonl>          # trip rates
node tools/sim/fit_base_flow.js <exported city>.json    # base speeds into calibration.json
```

## Rebuilding the data

`sim_data.json` is built from the game files: `python tools/sim/extract_sim_params.py "<game folder>"` (needs
UnityPy, like `tools/extract_game_data.py`), then `python tools/sim/build_sim_data.py`.
