# Traffic simulator (local evaluation)

A tool for judging battle layouts after the fact, on your own machine. The models never see it, and it doesn't
change the validator or the battle rules.

```bash
node tools/sim/simulate.js tools/calibration/layouts/06-01-B.json      # one layout -> tools/sim/out/06-01-B.html
node tools/sim/simulate.js path/to/model-page.html                     # a model's page works too
node tools/sim/simulate.js --all tools/calibration/layouts             # one line per layout, a report for each
```

Options: `--days 3` (simulated days, the last one is reported; the first two let traffic settle), `--seed 1`, `--city-km2 16`, `--json`,
`--city <exported city>.json` (run a city exported from the game and compare it with the game; writes
tools/sim/out/<city>.html with simulator and game flow maps; see Calibration).

## What it does

1. **Network.** The validator's road pieces become a graph: crossings and T-junctions are junctions; highways cross
   other roads without a junction (they connect only where a road ends on them). Lanes per direction, speed limits
   and which roads get traffic lights come from the game's road prefabs (`sim_data.json`). Every road end at a
   junction gets a role: traffic lights, the major or minor road of a junction without lights, a highway merge or
   split, a dead end.
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
   simulated in 1-second steps. Between junctions cars drive at a measured share of the speed limit; where a road
   arrives at or leaves a junction they lose a measured time that depends on the kind of road end. Each road has a
   lane capacity and a storage of one car per 7.5 m of lane; an approach discharges into a junction at the junction's
   capacity per lane times its share (signal phases, or priority for the major road: the bigger road, and among
   equals the one that goes straight on); queues spill back. Every trip searches its own route the way the game's
   pathfinder does: road cost = length / (speed limit × remembered flow), and every road the search looks at gets its
   own random factor 0.5–1 for that trip, which spreads traffic over alternative routes. The remembered flow is the
   game's: four time-of-day values per road, blended 32 times a day, so it carries over several days. A car in a
   gridlock loop (the chain of cars blocking each other never reaches one that can move) is taken off the road, as
   the game does; these trips are counted as "stuck".
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
| Lights run short phases (about 6 s of green, longer while cars keep coming) with a change-over between groups | `TrafficLightSystem` |
| Lanes per direction, speed limits | road prefabs (default sections) |
| Route search: cost = length / (limit × measured flow), each road × random 0.5–1 per trip; targets × random 0.5–1 | `PathUtils.CalculateSpeed`, `PathfindJobs.AddConnections`, `TrafficFlowSystem` |
| Flow memory: per lane, driving time × limit and distance, blended 32× a day into four time-of-day values (lerp 0.125); pathfinder speed = limit × that flow | `TrafficFlowSystem`, `PathUtils.CalculateSpeed` |
| A car whose chain of blockers comes back to itself (or is 100 blocked cars long) is parked at home and its trip ends | `StuckMovingObjectSystem`, `PersonalCarAISystem` |
| Traffic flow metric (speed against min(the car's top speed, the limit)) | `TrafficFlowSystem`, `CarNavigationSystem.ApplySideEffects` |

Measured in the real game (`calibration/`, see below): car trips per household / worker / resident for every
purpose (work, school, shopping, leisure, other, trucks per shop or industry job, city service vehicles), the
hourly start profile, workers per resident, persons per household; and, fitted to a whole city: the share of the
speed limit cars reach between junctions per road class, the time lost at each kind of road end, lane capacity on
highways, junction capacities, the time traffic lights lose to change-over, the capacity of minor approaches and
merging ramps, and the share of trips that cross the city's outside connections.

Assumed: the city around the tile (16 km² of copies of it, which sets the city-size gates), lane capacity along city
roads (0.5 cars/s), dwell times, how trips are spread over destinations. All are in `CONFIG` at the top of
`simulate.js` (fitted values come from `calibration.json`).

Not modelled: public transport and bicycles (their effect is inside the measured car-trip rates), parking search,
lane-level turning, pedestrians at crossings, accidents.

## Calibration against the real game

`game-probe/` is a small game mod (CS2SimProbe). With it, the game itself was measured on a real city (Corwen,
102,000 residents, game 1.6.2):

- `calibration/corwen_probe.jsonl`: 30 game hours of samples: cars on the road by type and by the driver's purpose,
  trips started per purpose, households, workers, jobs, and the game's city traffic flow (42 %).
- `calibration/corwen_city.json`: the city's road network, buildings (households, jobs, the road and the spot on it
  they use), and the flow the game measured on every road piece.
- `calibration/corwen_drive.json`: 48 game hours of every moving car sampled once a game minute (7.2 million
  samples): per road piece, the cars' speed against the limit and what the game says holds them up (following
  another car, crossing traffic, lights, braking for a turn or curve, a car pulling out, ...).
- `calibration/calibration.json`: trip rates (`read_probe.js`) and everything fitted by `calibrate.js`.

What the probe shows about Corwen:

- 70 % of all car time is spent on highways, where cars average 19 % of the limit; 77 of the 81 lost points are
  "following the car in front". These are a few long queues that back up from two interchanges where ramps merge and
  highways end at traffic lights (the one on the east highway is about 5 km long).
- On streets (25 % of car time, 41 % of the limit) braking for turns and curves costs 30 points and following other
  cars 21; traffic lights, crossing traffic, stopping service vehicles and cars pulling out of buildings cost 1–2
  points each.
- The game agrees with itself: a second export 48 game hours later (population 100,000 → 108,000) matches the first
  road by road with a correlation of 0.97 (6.8 points rms). The flow of each road is a stable property of the city,
  not noise.
- The export's "volume" number × 3 is the cars per game day on a road piece (checked against the probe: cars on the
  piece × their speed / its length).

`node tools/sim/calibrate.js` fits the capacities, the outside share and the free-driving model so that the
simulator reproduces, on the same city, the game's flow on every road piece and its average, the cars' speed on every
road piece, where the cars spend their time, how many cars are on the road (steady over the measured day, without
exceeding the game's peak), and the traffic through the outside connections, while taking few cars off the road as
stuck. Free driving is fitted only on the 980 road pieces where the game's cars were not queued. Each run simulates
three days and compares the third. The result
(`node tools/sim/simulate.js --city tools/sim/calibration/corwen_city.json`, seeds 1–5):

| | Game | Simulator |
|---|---|---|
| Average flow over all road pieces | 54 % | 52–54 % |
| Highways / two-lane roads / alleys | 62 / 48 / 44 % | 62–64 / 39–42 / 46–49 % |
| Road-by-road correlation | 0.97 (with itself, 48 h later) | 0.47–0.59 |
| Road-by-road difference (rms) | 6.8 points (with itself) | about 25 points |
| Cars on road pieces, average / peak | 2,490 / 3,646 | 2,770–3,350 / 3,370–4,120 |
| Car time on highways and ramps / streets | 74 / 25 % | 46–56 / 42–52 % |
| Speed of the cars on highways (share of the limit) | 19 % | 18–28 % |
| Traffic through the outside connections | 1.1 cars/s | 0.65–1.0 cars/s |
| Car trips taken off the road as stuck | not measured | 1–16 % |

The simulator is steady: 2, 3, 5 or 8 simulated days give the same city (51–54 % flow), and the 39 battle layouts
differ by 1 point on average between 3 and 5 days. (Until November 10 it was not: with the old rule for blocked cars
the city slid into gridlock when more than two days were simulated, 58 % → 31 % after six, and the calibration had
matched day two of that slide.) The highway queues of the game now form in the right place, behind the interchange
at the city's west end, and move at the game's speed. They are still shorter than in the game (the game's east queue
is 5 km long), the two-lane streets are 6–9 points too slow, and how many cars get stuck varies a lot from seed to
seed. Since the game agrees with itself at 0.97, the remaining per-road differences are real, not noise.

The lane capacity along city roads can't be measured in Corwen, because none of its streets carries much traffic per
lane (at most 0.09 cars/s); it stays at an assumed 0.5 cars/s. An overloaded layout no longer freezes at 1–6 % flow:
it keeps moving at a low flow and loses a large share of its trips as stuck, so read the flow together with the
"stuck" and "completed" numbers. Treat results as a comparison between layouts under the same rules, not as an exact
prediction.

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
`quit=1`; add `driveEveryMinutes=1` (and optionally `driveOut=<path>`) for the per-road car samples and
`exportAtEnd=<path>.json` to export the city again when done. For exporting the city at once: `speed=0`,
`export=<full path>.json`, `exportOnly=1`, `quit=1`.

Then:

```bash
node tools/sim/read_probe.js <probe_out.jsonl>          # trip rates
node tools/sim/calibrate.js --city <exported city>.json --drive <drive_stats>.json
```

## Rebuilding the data

`sim_data.json` is built from the game files: `python tools/sim/extract_sim_params.py "<game folder>"` (needs
UnityPy, like `tools/extract_game_data.py`), then `python tools/sim/build_sim_data.py`.
