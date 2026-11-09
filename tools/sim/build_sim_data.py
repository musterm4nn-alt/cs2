"""Build tools/sim/sim_data.json for the traffic simulator from the extracted game data.

Inputs (both gitignored, made from a local game install):
  data/game_data.json       tools/extract_game_data.py
  data/sim_params_raw.json  tools/sim/extract_sim_params.py

Output (committed, so the simulator runs from a clone): tools/sim/sim_data.json with
  roads:      car lanes per direction, speed limit, highway rules, traffic lights (from the road prefabs)
  zones:      evening / night shift shares of the growables that spawn in each zone (Workplace components)
  households: the game's household mix (HouseholdPrefab weights and members)
  params:     economy, trip and parking parameters the simulation logic uses

Run: python tools/sim/build_sim_data.py
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "tools"))
import build_assets as BA  # noqa: E402


def lanes_by_direction(p):
    """Car lanes per direction from the road's default-active drive sections (m_Invert = 1 runs backwards)."""
    flags = set()
    for e in p["fields"].get("m_EdgeStates", []) or []:
        if not e.get("m_RequireAll") and not e.get("m_RequireAny") and not e.get("m_RequireNone"):
            flags.update(e.get("m_SetState") or [])

    def active(s):
        ra, rany, rn = set(s.get("m_RequireAll") or []), set(s.get("m_RequireAny") or []), set(s.get("m_RequireNone") or [])
        return ra <= flags and (not rany or bool(rany & flags)) and not (rn & flags)

    fwd = back = 0
    for s in p["fields"].get("m_Sections", []):
        name = BA.ref_name(s.get("m_Section")) or ""
        if not active(s) or "Drive" not in name:
            continue
        if s.get("m_Invert"):
            back += 1
        else:
            fwd += 1
    return fwd, back


def main():
    src = json.loads((ROOT / "data" / "game_data.json").read_text(encoding="utf-8"))
    raw = json.loads((ROOT / "data" / "sim_params_raw.json").read_text(encoding="utf-8"))
    prefabs, names = src["prefabs"], src["names"]
    by = defaultdict(dict)
    for p in prefabs:
        by[p["class"]][p["prefab"]] = p
    zones = BA.build_zones(prefabs, names)          # also fills BA.ZONE_ALIAS
    roads = BA.build_roads(prefabs, names, by)

    out_roads = {}
    for r in roads:
        p = by["RoadPrefab"].get(r["prefab"]) or by["TrackPrefab"].get(r["prefab"])
        f = p["fields"]
        fwd, back = lanes_by_direction(p)
        pedestrian = "Pedestrian" in r["prefab"]
        track = r["category"] == "track"
        transit = r["category"] == "transit_lane"
        car = not (pedestrian or track or transit)
        if car and back == 0 and fwd == 0:
            car = False
        out_roads[r["id"]] = {
            "lanesFwd": fwd if car else 0, "lanesBack": back if car else 0,
            "speedKmh": r["speedKmh"], "highway": r["category"] == "highway",
            "trafficLights": bool(f.get("m_TrafficLights")), "pedestrian": pedestrian, "track": track,
            "category": r["category"], "widthCells": r["widthCells"],
        }

    # evening / night shift shares of the companies that move into commercial and office zones (CompanyPrefab
    # Workplace components); city service buildings use their own Workplace components
    fam = {"commercial": [0.0, 0.0, 0], "office": [0.0, 0.0, 0]}
    for x in raw:
        w = (x.get("components") or {}).get("Workplace")
        if x["class"] != "CompanyPrefab" or not w:
            continue
        f = "commercial" if x["prefab"].startswith("Commercial_") else "office" if x["prefab"].startswith("Office_") else None
        if f:
            fam[f][0] += float(w.get("m_EveningShiftProbability") or 0)
            fam[f][1] += float(w.get("m_NightShiftProbability") or 0)
            fam[f][2] += 1
    shifts = {f: {"evening": round(a[0] / a[2], 3), "night": round(a[1] / a[2], 3)} for f, a in fam.items() if a[2]}
    service_shift = [0.0, 0.0, 0.0]
    for p in prefabs:
        w = BA.comp(p, "Workplace")
        if p["class"] == "BuildingPrefab" and w and not BA.comp(p, "SpawnableBuilding"):
            n = float(w.get("m_Workplaces") or 1)
            service_shift[0] += n * float(w.get("m_EveningShiftProbability") or 0)
            service_shift[1] += n * float(w.get("m_NightShiftProbability") or 0)
            service_shift[2] += n

    hh = []
    for x in raw:
        if x["class"] == "HouseholdPrefab" and x.get("fields") and not x["fields"].get("m_DynamicHousehold"):
            f = x["fields"]
            if f.get("m_Weight"):
                hh.append({"name": x["prefab"], "weight": f["m_Weight"], "adults": f["m_AdultCount"], "children": f["m_ChildCount"],
                           "elderly": f["m_ElderlyCount"], "students": f["m_StudentCount"], "carProbability": f["m_InitialCarProbability"] / 100})

    def first(cls, prefab=None):
        for x in raw:
            if x["class"] == cls and (prefab is None or x["prefab"] == prefab):
                return x.get("fields") or {}
        return {}

    eco = first("EconomyPrefab")
    lei = first("LeisureParametersPrefab")
    park = first("ParkingParametersPrefab")
    out = {
        "source": "Built by tools/sim/build_sim_data.py from the game files (game version in data/game_data.json).",
        "params": {
            "framesPerDay": 262144, "framesPerSecond": 60,
            "workDayStart": eco["m_WorkDayStart"], "workDayEnd": eco["m_WorkDayEnd"],
            "trafficReduction": eco["m_TrafficReduction"],
            "leisureRandomFactor": lei.get("m_LeisureRandomFactor"),
            "chanceCitizenDecreaseLeisureCounter": lei.get("m_ChanceCitizenDecreaseLeisureCounter"),
            "maxParkingSearchDistanceM": park.get("m_MaxParkingSearchDistance"),
        },
        "roads": out_roads,
        "familyShifts": shifts,
        "serviceShifts": {"evening": round(service_shift[0] / service_shift[2], 3), "night": round(service_shift[1] / service_shift[2], 3)},
        "households": hh,
    }
    (HERE / "sim_data.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    print("roads", len(out_roads), "families with shifts", len(shifts), "household types", len(hh))


if __name__ == "__main__":
    main()
