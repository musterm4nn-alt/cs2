"""Build assets.json and CATALOG.md from data/game_data.json.

data/game_data.json is produced by tools/extract_game_data.py from a local Cities: Skylines II install.
Run from the repo root:  python tools/build_assets.py
"""
import json
import re
import unicodedata
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CELL = 8  # metres per cell

UI_GROUPS = {
    "Healthcare": "healthcare", "Deathcare": "deathcare", "Fire & Rescue": "fire_rescue", "DisasterControl": "fire_rescue",
    "Police": "police", "Administration": "administration", "Education": "education", "Research": "research",
    "Electricity": "electricity", "Water & Sewage": "water_sewage", "GarbageManagement": "garbage",
    "CommunicationsPost": "communications", "CommunicationsTelecom": "communications",
    "Parks & Recreation": "parks", "LargeParks": "parks", "SportsParks": "parks", "LargeSportsParks": "parks",
    "TouristAttractions": "attractions", "SignaturesLandmarks": "landmarks", "RoadsParking": "parking",
    "RoadsServices": "road_services", "Pathways": "pathways",
    "TransportationRoad": "transport_road", "TransportationTrain": "transport_train", "TransportationTram": "transport_tram",
    "TransportationSubway": "transport_subway", "TransportationShip": "transport_water", "TransportationFerry": "transport_water",
    "TransportationAir": "transport_air",
    "SignaturesResidential": "signature", "SignaturesResidentialMixed": "signature", "SignaturesCommercial": "signature",
    "SignaturesOffice": "signature", "SignaturesIndustrial": "signature",
}
EXCLUDED_UI = {"ZonesExtractors", "PropsNature"}
DLC_NAMES = {
    "BridgesAndPorts": "Bridges & Ports", "LandmarkBuildings": "Landmark Buildings", "DowntownMarketSet": "Downtown Market Set",
    "SanFranciscoSet": "San Francisco Set", "PDXAccount": "Paradox account reward", "CS1TreasureHunt": "CS1 owner reward",
    "CityStations": "Urban City Stations", "DragonGate": "Dragon Gate", "LeisureVenues": "Leisure Venues",
    "MediterraneanHeritage": "Mediterranean Heritage", "ModernArchitecture": "Modern Architecture",
    "OfficeEvolution": "Office Evolution", "Skyscrapers": "Skyscrapers", "SupplyChains": "Supply Chains",
    "UrbanPromenades": "Urban Promenades", "FreeUpdate02": None,
}
# component -> {field: output key}; first found wins. These become the asset's "stats".
STAT_FIELDS = {
    "Workplace": {"m_Workplaces": "workplaces"},
    "ServiceCoverage": {"m_Range": "serviceRangeM", "m_Capacity": "serviceCapacity"},
    "BuildingProperties": {"m_ResidentialProperties": "households"},
    "Hospital": {"m_PatientCapacity": "patients", "m_AmbulanceCapacity": "ambulances", "m_MedicalHelicopterCapacity": "medicalHelicopters"},
    "School": {"m_StudentCapacity": "students"},
    "PowerPlant": {"m_ElectricityProduction": "electricityKW"},
    "WindPowered": {"m_Production": "windProductionKW"},
    "SolarPowered": {"m_Production": "solarProductionKW"},
    "GroundWaterPowered": {"m_Production": "geothermalProductionKW"},
    "Battery": {"m_Capacity": "batteryKWh", "m_PowerOutput": "batteryOutputKW"},
    "Transformer": {},
    "WaterPumpingStation": {"m_Capacity": "waterOutput"},
    "SewageOutlet": {"m_Capacity": "sewageCapacity", "m_Purification": "sewagePurification"},
    "GarbageFacility": {"m_GarbageCapacity": "garbageStorage", "m_VehicleCapacity": "garbageTrucks", "m_ProcessingSpeed": "garbageProcessing"},
    "FireStation": {"m_FireEngineCapacity": "fireEngines", "m_FireHelicopterCapacity": "fireHelicopters"},
    "PoliceStation": {"m_PatrolCarCapacity": "patrolCars", "m_PoliceHelicopterCapacity": "policeHelicopters", "m_JailCapacity": "jailCapacity"},
    "Prison": {"m_PrisonerCapacity": "prisoners"},
    "DeathcareFacility": {"m_HearseCapacity": "hearses", "m_StorageCapacity": "deathcareStorage", "m_ProcessingRate": "deathcareProcessing"},
    "PostFacility": {"m_PostVanCapacity": "postVans", "m_MailStorageCapacity": "mailStorage", "m_SortingRate": "mailSorting"},
    "TelecomFacility": {"m_Range": "telecomRangeM", "m_NetworkCapacity": "networkCapacity"},
    "EmergencyShelter": {"m_ShelterCapacity": "shelterCapacity"},
    "Attraction": {"m_Attractiveness": "attractiveness"},
    "TransportDepot": {"m_VehicleCapacity": "depotVehicles"},
    "TransportStation": {"m_ComfortFactor": "comfort"},
    "MaintenanceDepot": {"m_VehicleCapacity": "maintenanceVehicles"},
    "ParkingFacility": {"m_ComfortFactor": "parkingComfort"},
    "Park": {"m_MaintenancePool": "parkMaintenancePool"},
    "Pollution": {"m_NoisePollution": "noisePollution", "m_AirPollution": "airPollution", "m_GroundPollution": "groundPollution"},
}


def slug(name):
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().replace("&", "and").lower()
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")


def ref_name(v):
    return v.split(":", 1)[1] if isinstance(v, str) and ":" in v else None


def comp(p, name):
    c = p["components"].get(name)
    return c if isinstance(c, dict) else {}


def num(v):
    if isinstance(v, bool) or v is None:
        return None
    if isinstance(v, float) and v.is_integer():
        return int(v)
    return v if isinstance(v, (int, float)) else None


def stats_of(p):
    out = {}
    for c, fields in STAT_FIELDS.items():
        cd = comp(p, c)
        for f, key in fields.items():
            v = num(cd.get(f))
            if v not in (None, 0) and key not in out:
                out[key] = v
    return out


def requirements(p):
    u = comp(p, "Unlockable")
    names = [ref_name(x) for x in (u.get("m_RequireAll") or []) + (u.get("m_RequireAny") or []) if isinstance(x, str)]
    return [n for n in names if n] or None


def dlc_of(p):
    cp = ref_name(comp(p, "ContentPrerequisite").get("m_ContentPrerequisite"))
    if cp:
        return DLC_NAMES.get(cp, cp)
    if p["source"] != "base":
        return DLC_NAMES.get(p["source"], p["source"])
    return None


def zone_key(ref):
    """Normalise a zone prefab reference to (zone id)."""
    n = ref_name(ref) or ""
    return ZONE_ALIAS.get(n)


ZONE_ALIAS = {}


def build_zones(prefabs, names):
    zones = {}
    for p in prefabs:
        if p["class"] != "ZonePrefab" or p["prefab"] == "Unzoned":
            continue
        internal = p["prefab"]
        base = re.sub(r"^(EU|NA) ", "", internal)
        display = names.get(internal) or names.get("EU " + internal) or internal
        display = re.sub(r"^(EU|NA) ", "", display)
        if p["source"] == "base":
            zid = slug(base)
        else:
            zid = slug(display)
        area = p["fields"].get("m_AreaType")
        if area is None:  # DLC zones: infer from name
            area = 1 if "Residential" in internal else 2 if "Commercial" in internal else 3
        office = bool(p["fields"].get("m_Office")) or "Office" in internal
        family = "office" if office else {1: "residential", 2: "commercial", 3: "industrial"}.get(area, "other")
        if family == "industrial" and base != "Industrial Manufacturing":
            continue  # specialised industry areas are not zones you paint
        ZONE_ALIAS[internal] = zid
        z = zones.setdefault(zid, {"id": zid, "name": display, "family": family, "themes": [], "dlc": dlc_of(p),
                                   "waterfront": "Waterfront" in internal, "lot": None})
        theme = internal.split(" ")[0] if internal.startswith(("EU ", "NA ")) else None
        if theme and theme not in z["themes"]:
            z["themes"].append(theme)
    # lot size ranges from the growable buildings that spawn in each zone
    lots = defaultdict(list)
    for p in prefabs:
        sb = comp(p, "SpawnableBuilding")
        if p["class"] == "BuildingPrefab" and sb:
            zid = zone_key(sb.get("m_ZoneType"))
            w, d = p["fields"].get("m_LotWidth"), p["fields"].get("m_LotDepth")
            if zid and w and d:
                lots[zid].append((w, d))
    for zid, z in zones.items():
        if lots.get(zid):
            ws, ds = [w for w, _ in lots[zid]], [d for _, d in lots[zid]]
            z["lot"] = {"minW": min(ws), "maxW": max(ws), "minD": min(ds), "maxD": max(ds), "buildingCount": len(lots[zid])}
    return sorted(zones.values(), key=lambda z: (z["family"], z["id"]))


def road_width(p, by):
    def piece_w(n):
        pc = by["NetPiecePrefab"].get(n)
        b = pc and pc["fields"].get("m_Bounds")
        return (b["max"]["x"] - b["min"]["x"]) if b else 0

    def section_w(n):
        s = by["NetSectionPrefab"].get(n)
        if not s:
            return 0
        ws = [piece_w(ref_name(pc.get("m_Piece"))) for pc in s["fields"].get("m_Pieces", []) if not pc.get("m_RequireAll") and not pc.get("m_RequireAny")]
        if ws:
            return max(ws)
        subs = s["fields"].get("m_SubSections", [])
        return max([section_w(ref_name(x.get("m_SubSection") or x.get("m_Section"))) for x in subs] or [0])

    # Default road state: the flags set by unconditional edge states (e.g. 51). A section is part of the default
    # road when all of RequireAll are set, at least one of RequireAny is set (if any listed), and none of RequireNone.
    flags = set()
    for e in p["fields"].get("m_EdgeStates", []) or []:
        if not e.get("m_RequireAll") and not e.get("m_RequireAny") and not e.get("m_RequireNone"):
            flags.update(e.get("m_SetState") or [])

    def active(s):
        ra, rany, rn = set(s.get("m_RequireAll") or []), set(s.get("m_RequireAny") or []), set(s.get("m_RequireNone") or [])
        return ra <= flags and (not rany or bool(rany & flags)) and not (rn & flags)

    secs = [s for s in p["fields"].get("m_Sections", []) if active(s)]
    width = sum(section_w(ref_name(s.get("m_Section"))) for s in secs)
    lanes = sum(1 for s in secs if "Drive" in (ref_name(s.get("m_Section")) or ""))
    return round(width, 2), lanes


def build_roads(prefabs, names, by):
    roads, seen = [], set()
    for p in prefabs:
        if p["class"] not in ("RoadPrefab", "TrackPrefab") or p["source"] != "base":
            continue
        group = ref_name(comp(p, "UIObject").get("m_Group"))
        if not group or not group.startswith(("Roads", "Transportation")):
            continue
        name = names.get(p["prefab"], p["prefab"])
        rid = slug(name)
        if rid in seen:
            rid = slug(name + " " + p["prefab"])
        seen.add(rid)
        width, lanes = road_width(p, by)
        if width <= 0:
            continue
        f = p["fields"]
        is_track = p["class"] == "TrackPrefab"
        highway = bool(f.get("m_HighwayRules"))
        zoning = bool(ref_name(f.get("m_ZoneBlock"))) if not is_track else False
        roads.append({
            "id": rid, "name": name, "prefab": p["prefab"],
            "category": "track" if is_track else "highway" if highway else {
                "RoadsSmallRoads": "small", "RoadsMediumRoads": "medium", "RoadsLargeRoads": "large",
                "TransportationRoad": "transit_lane", "TransportationShip": "port"}.get(group, group),
            "lanes": lanes or None,
            "speedKmh": round(f["m_SpeedLimit"] / 2) if f.get("m_SpeedLimit") else None,
            "widthM": width, "widthCells": round(width / CELL, 3),
            "allowsZoning": zoning, "buildingAccess": not highway and not is_track,
            "dlc": dlc_of(p), "upkeepNote": None,
        })
        roads[-1].pop("upkeepNote")
    return sorted(roads, key=lambda r: (r["category"], r["widthM"], r["id"]))


def build_assets(prefabs, names):
    blds = [p for p in prefabs if p["class"] in ("BuildingPrefab", "BuildingExtensionPrefab")]
    by_prefab = {p["prefab"]: p for p in blds}
    included, assets = {}, []

    def group_of(p):
        return ref_name(comp(p, "UIObject").get("m_Group"))

    # 1) top-level placeable buildings from the build menus
    for p in blds:
        if p["class"] != "BuildingPrefab" or "SpawnableBuilding" in p["components"] or "ServiceUpgrade" in p["components"]:
            continue
        g = group_of(p)
        if not g or g in EXCLUDED_UI or g not in UI_GROUPS:
            continue
        included[p["prefab"]] = p

    ids = {}

    def make_id(p):
        name = names.get(p["prefab"]) or p["prefab"]
        i = slug(name)
        if i in ids.values():
            i = slug(name + " " + p["prefab"])
        ids[p["prefab"]] = i
        return i

    for pf in sorted(included):
        make_id(included[pf])

    # 2) upgrades / sub-buildings whose parent is included
    upgrades = []
    for p in blds:
        su = comp(p, "ServiceUpgrade")
        parents = [ref_name(x) for x in (su.get("m_Buildings") or []) if isinstance(x, str)]
        parents = [x for x in parents if x in included]
        if su and parents:
            upgrades.append((p, parents))
            make_id(p)

    for pf, p in sorted(included.items(), key=lambda kv: ids[kv[0]]):
        g = group_of(p)
        group = UI_GROUPS[g]
        sig = comp(p, "SignatureBuilding")
        zone = zone_key(sig.get("m_ZoneType")) if sig else None
        kind = "signature" if sig else "landmark" if group == "landmarks" else "service"
        a = base_asset(p, names, ids[pf], group, g)
        a["kind"] = kind
        if sig:
            a["zone"] = zone
            a["industrial"] = bool(zone and zone.startswith("industrial"))
        a["placement"] = placement_of(p, group, zone)
        assets.append(a)

    for p, parents in sorted(upgrades, key=lambda t: ids[t[0]["prefab"]]):
        su = comp(p, "ServiceUpgrade")
        parent = included[parents[0]]
        g = group_of(parent)
        a = base_asset(p, names, ids[p["prefab"]], UI_GROUPS[g], g)
        a["parents"] = [ids[x] for x in parents]
        a["forbidMultiple"] = bool(su.get("m_ForbidMultiple"))
        a["upgradeCost"] = num(su.get("m_UpgradeCost"))
        if p["class"] == "BuildingPrefab":
            a["kind"] = "sub_building"
            dist = num(su.get("m_MaxPlacementDistance")) or 0
            a["maxDistanceM"] = dist
            a["placement"] = "near_parent"
        else:
            f = p["fields"]
            ov = f.get("m_OverrideLotSize") or {}
            if f.get("m_ExternalLot") or (ov.get("x") or 0) > 0:
                a["kind"] = "fixed_extension"
                a["placeable"] = False
                if ov.get("x"):
                    a["size"] = {"w": ov["x"], "d": ov["y"]}
                a["note"] = "Attached automatically at a fixed spot on the parent; list it in the parent's upgrades."
            else:
                a["kind"] = "upgrade"
                a["placeable"] = False
                a.pop("size", None)
                a["note"] = "In-building upgrade with no footprint; list it in the parent's upgrades."
            a["placement"] = "attached"
        assets.append(a)
    return assets


# Effect type ids, mapped only where a known in-game value confirms them (e.g. Halo Heights: +10 well-being within
# 2.5 km = local type 3; Principiis: -2 crime within 500 m = local type 0). Others are kept as raw type numbers.
LOCAL_EFFECTS = {0: "crime", 3: "wellbeing"}
CITY_EFFECTS = {0: "attractiveness", 26: "importCosts", 32: "officeEfficiency", 14: "universityInterest", 25: "universityGraduation"}


def effects_of(p):
    out = []
    for cname, table in (("LocalEffects", LOCAL_EFFECTS), ("CityEffects", CITY_EFFECTS)):
        for e in comp(p, cname).get("m_Effects") or []:
            if not isinstance(e, dict) or e.get("m_Type") is None:
                continue
            t = e["m_Type"]
            eff = {"scope": "local" if cname == "LocalEffects" else "city",
                   "type": table.get(t, f"{cname[:-7].lower()}Type{t}"), "delta": round(e.get("m_Delta") or 0, 4)}
            if e.get("m_Radius"):
                eff["radiusM"] = num(e["m_Radius"])
            out.append(eff)
    return out or None


def base_asset(p, names, aid, group, ui):
    f = p["fields"]
    sc, po = comp(p, "ServiceConsumption"), comp(p, "PlaceableObject")
    a = {
        "id": aid, "name": names.get(p["prefab"]) or p["prefab"], "prefab": p["prefab"],
        "group": group, "category": ui, "dlc": dlc_of(p),
        # UniqueObject = one per city; signature buildings are also limited to one each by the game.
        "unique": "UniqueObject" in p["components"] or "SignatureBuilding" in p["components"],
        "placeable": True,
        "constructionCost": num(po.get("m_ConstructionCost")),
        "upkeepPerMonth": num(sc.get("m_Upkeep")),
        "xp": num(po.get("m_XPReward")) or num(comp(p, "SignatureBuilding").get("m_XPReward")),
        "requires": requirements(p),
        "stats": stats_of(p),
        "effects": effects_of(p),
        "theme": ref_name(comp(p, "ThemeObject").get("m_Theme")),
    }
    if f.get("m_LotWidth") and f.get("m_LotDepth"):
        a["size"] = {"w": f["m_LotWidth"], "d": f["m_LotDepth"]}
    else:
        a["placeable"] = False
    return a


def placement_of(p, group, zone):
    c = p["components"]
    if any(k in c for k in ("ShorelineObject", "FloatingObject", "UnderwaterObject", "SewageOutlet")):
        return "water"
    wp = comp(p, "WaterPumpingStation")
    if wp.get("m_AllowedWaterTypes") == 1:
        return "resource:groundwater"
    if wp.get("m_AllowedWaterTypes") == 2 or "Hydroelectric" in p["prefab"]:
        return "water"
    if "GroundWaterPowered" in c:
        return "resource:geothermal"
    if group in ("transport_water",) or (zone and "waterfront" in zone):
        return "water"
    if group in ("transport_train", "transport_tram", "transport_subway"):
        return "track"
    if group == "pathways":
        return "over_road"
    return "road"


def main():
    src = json.loads((ROOT / "data" / "game_data.json").read_text(encoding="utf-8"))
    prefabs, names = src["prefabs"], src["names"]
    by = defaultdict(dict)
    for p in prefabs:
        by[p["class"]][p["prefab"]] = p
    zones = build_zones(prefabs, names)
    roads = build_roads(prefabs, names, by)
    assets = build_assets(prefabs, names)
    for z in zones:
        if z["lot"] is None:
            z["note"] = "No growable buildings found for this zone in the extracted data."

    out = {
        "meta": {
            "name": "Cities: Skylines II placeable asset dataset",
            "generated": date.today().isoformat(),
            "source": "Extracted from the game files of a local Cities: Skylines II install (base game + installed DLC) "
                      "with tools/extract_game_data.py. Names are the game's English (en-US) names.",
            "counts": {"assets": len(assets), "zones": len(zones), "roads": len(roads)},
            "disclaimer": "Unofficial. Cities: Skylines II is a trademark of Paradox Interactive / Colossal Order.",
        },
        "grid": {
            "cellMeters": CELL,
            "sizeConvention": "size.w = lot width along the road (the building's front), size.d = lot depth, in cells "
                              "(the game's m_LotWidth / m_LotDepth).",
            "rotation": "0 = front faces north (-y), 90 = east (+x), 180 = south (+y), 270 = west (-x).",
        },
        "rules": {
            "maxZoneDepthCells": 6,
            "uniqueBuildingsOnce": "Assets with unique: true (the game's UniqueObject flag) may be placed at most once.",
            "noOverlap": "Footprints of buildings, roads and zones may not overlap.",
            "roadAccess": "Buildings with placement 'road' need their front edge on a road with buildingAccess true.",
            "subBuildings": "kind 'sub_building' is placed by the player within maxDistanceM of its parent; "
                            "kind 'upgrade' and 'fixed_extension' go in the parent's upgrades list.",
            "highways": "Highways and tracks do not give buildings or zones road access.",
        },
        "zones": zones,
        "roads": roads,
        "assets": assets,
    }
    out["meta"]["catalog"] = write_catalog(out)
    (ROOT / "assets.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    kinds = defaultdict(int)
    for a in assets:
        kinds[a["kind"]] += 1
    print(f"wrote assets.json: {len(assets)} assets {dict(kinds)}, {len(zones)} zones, {len(roads)} roads")


KEY_STATS = [("households", "homes"), ("workplaces", "jobs"), ("serviceRangeM", "range m"), ("students", "students"),
             ("patients", "patients"), ("electricityKW", "power kW"), ("windProductionKW", "wind kW"),
             ("solarProductionKW", "solar kW"), ("geothermalProductionKW", "geothermal kW"), ("batteryKWh", "battery kWh"),
             ("waterOutput", "water"), ("sewageCapacity", "sewage"), ("garbageProcessing", "garbage/month"),
             ("fireEngines", "fire engines"), ("patrolCars", "patrol cars"), ("hearses", "hearses"), ("postVans", "post vans"),
             ("telecomRangeM", "telecom range m"), ("networkCapacity", "network"), ("shelterCapacity", "shelter"),
             ("attractiveness", "attract"), ("depotVehicles", "vehicles")]


CATALOG_MAX_BYTES = 18_000  # keep every file well below typical web-fetch limits
# group -> catalog file; signature categories are mapped individually below
PACKS = {
    "fire_rescue": "services", "police": "services", "healthcare": "services", "deathcare": "services",
    "administration": "services", "research": "services", "communications": "services",
    "education": "education-culture", "landmarks": "education-culture", "attractions": "education-culture",
    "parks": "parks-parking", "parking": "parks-parking", "pathways": "parks-parking", "road_services": "parks-parking",
    "electricity": "utilities", "water_sewage": "utilities", "garbage": "utilities",
    "transport_road": "transport-1", "transport_tram": "transport-1", "transport_subway": "transport-1", "transport_air": "transport-1",
    "transport_train": "transport-2", "transport_water": "transport-2",
}
PACK_OF_CATEGORY = {
    "SignaturesResidential": "signatures-residential", "SignaturesResidentialMixed": "signatures-residential",
    "SignaturesCommercial": "signatures-business", "SignaturesOffice": "signatures-business",
    "SignaturesIndustrial": "signatures-business",
}
PACK_ORDER = ["services", "education-culture", "parks-parking", "utilities", "transport-1", "transport-2",
              "signatures-residential", "signatures-business", "other"]
RAW_BASE = "https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/"
LEGEND = [
    "Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.",
    "U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,",
    "place within the given distance of its parent; water / track / resource / over_road = special sites.",
    "Upgrades with no footprint are listed under their parent at the end of each section.",
]
ASSET_HEADER = ["id | name | size | U | DLC | placement | parent | upkeep/mo | stats", "---|---|---|---|---|---|---|---|---"]


def asset_row(a):
    st = a["stats"]
    parts = [f"{label} {st[k]}" for k, label in KEY_STATS if k in st]
    if a.get("zone"):
        parts.insert(0, "zone " + a["zone"])
    for e in a.get("effects") or []:
        if e["type"] in ("wellbeing", "crime") and e.get("radiusM"):
            parts.append(f"{e['type']} {e['delta']:+g} within {e['radiusM']} m")
    par = ", ".join(a.get("parents", []))
    if a.get("maxDistanceM"):
        par += f" (≤{a['maxDistanceM']} m)"
    return (f"{a['id']} | {a['name']} | {a['size']['w']}×{a['size']['d']} | {'U' if a['unique'] else ''} | "
            f"{a['dlc'] or ''} | {a['placement']} | {par} | {a['upkeepPerMonth'] or ''} | {'; '.join(parts)}")


def category_blocks(cat, items):
    """Rows for one UI category: placeable assets, then upgrade lists. Returns (rows, upgrade_lines, entry_count)."""
    rows, ups = [], defaultdict(list)
    for a in items:
        if a["placeable"]:
            rows.append(asset_row(a))
        else:
            for par in a.get("parents", ["?"]):
                ups[par].append(a["id"])
    up_lines = [f"- upgrades of `{p}` (no separate placement): " + ", ".join(f"`{u}`" for u in lst) for p, lst in ups.items()]
    return rows, up_lines, len(items)


def finish_file(name, title, intro, body, entries):
    """Write catalog/<name>.md with a closing marker line; return its meta record."""
    import hashlib
    text = "\n".join([f"# {title}", ""] + intro + [""] + body).rstrip() + "\n"
    check = hashlib.sha1(text.encode("utf-8")).hexdigest()[:6]
    marker = f"END OF FILE catalog/{name}.md | {entries} entries | check {check}"
    text += "\n" + marker + "\n"
    (ROOT / "catalog" / f"{name}.md").write_text(text, encoding="utf-8")
    return {"file": f"catalog/{name}.md", "title": title, "entries": entries, "bytes": len(text.encode("utf-8")), "marker": marker}


def write_catalog(out):
    cat_dir = ROOT / "catalog"
    cat_dir.mkdir(exist_ok=True)
    for old in cat_dir.glob("*.md"):
        old.unlink()
    files = []

    # zones and roads
    body = ["## Zones", "", "Lot = width×depth range of buildings that grow there; zoning reaches at most 6 cells from a road.", "",
            "id | name | family | lot sizes | themes | DLC", "---|---|---|---|---|---"]
    for z in out["zones"]:
        lot = z["lot"]
        lot_s = f"{lot['minW']}×{lot['minD']} to {lot['maxW']}×{lot['maxD']}" if lot else "unknown"
        body.append(f"{z['id']} | {z['name']} | {z['family']} | {lot_s} | {'/'.join(z['themes'])} | {z['dlc'] or ''}")
    body += ["", "## Roads and tracks", "", "Width from the game's road sections; roads are drawn along their centre line.", "",
             "id | name | category | lanes | km/h | width m | width cells | zoning | building access",
             "---|---|---|---|---|---|---|---|---"]
    for r in out["roads"]:
        body.append(f"{r['id']} | {r['name']} | {r['category']} | {r['lanes'] or ''} | {r['speedKmh'] or ''} | {r['widthM']:g} | "
                    f"{r['widthCells']:g} | {'yes' if r['allowsZoning'] else 'no'} | {'yes' if r['buildingAccess'] else 'no'}")
    files.append(finish_file("zones-roads", "CS2 zones, roads and tracks", [], body, len(out["zones"]) + len(out["roads"])))
    files[-1]["contents"] = "zone types, roads, highways, tracks (read this first)"

    # buildings: one file per group (signatures: one per category), split further if too big
    by_cat = defaultdict(list)
    for a in out["assets"]:
        by_cat[a["category"]].append(a)
    groups = defaultdict(list)
    for cat in by_cat:
        key = PACK_OF_CATEGORY.get(cat) or PACKS.get(UI_GROUPS.get(cat, ""), "other")
        groups[key].append(cat)
    for key in sorted(groups, key=lambda k: PACK_ORDER.index(k) if k in PACK_ORDER else 99):
        sections = []  # list of (cat, rows, up_lines, entries)
        for cat in sorted(groups[key]):
            sections.append((cat,) + category_blocks(cat, by_cat[cat]))
        # pack rows into parts under the size limit
        parts, cur, cur_entries, size = [], [], 0, 0
        for cat, rows, up_lines, entries in sections:
            chunk = ["", f"## {cat}", ""] + ASSET_HEADER + rows + ([""] + up_lines if up_lines else [])
            csize = len("\n".join(chunk).encode("utf-8"))
            if cur and size + csize > CATALOG_MAX_BYTES:
                parts.append((cur, cur_entries)); cur, cur_entries, size = [], 0, 0
            if csize > CATALOG_MAX_BYTES:  # a single huge category: split its rows
                for i in range(0, len(rows), 60):
                    sub = ["", f"## {cat} (rows {i + 1}–{min(i + 60, len(rows))})", ""] + ASSET_HEADER + rows[i:i + 60]
                    if i + 60 >= len(rows) and up_lines:
                        sub += [""] + up_lines
                    parts.append((sub, min(60, len(rows) - i) + (len(up_lines) if i + 60 >= len(rows) else 0)))
                continue
            cur += chunk; cur_entries += entries; size += csize
        if cur:
            parts.append((cur, cur_entries))
        for n, (body, entries) in enumerate(parts, 1):
            name = key if len(parts) == 1 else f"{key}-{n}"
            title = f"CS2 catalog: {key.replace('-', ' ')}" + (f" (part {n} of {len(parts)})" if len(parts) > 1 else "")
            files.append(finish_file(name, title, LEGEND, body, entries))
            cats = [line[3:].split(" (rows")[0] for line in body if line.startswith("## ")]
            files[-1]["contents"] = ", ".join(dict.fromkeys(cats))

    # index
    idx = [
        "# CS2 asset catalog (index)",
        "",
        "The catalog is split into small files so web tools don't cut it off. Read `catalog/zones-roads.md` first, then the",
        "files for the kinds of buildings you need. Every file ends with a line starting `END OF FILE`. If a file you",
        "fetched does not end with that line, it was cut off: fetch it again or in parts. Copy the END OF FILE line of every",
        "file you read completely into your layout's `\"catalogMarkers\"` list; the validator reports which files you read.",
        "",
    ] + LEGEND + [
        "",
        "file | contents | entries | size",
        "---|---|---|---",
    ]
    for f in files:
        idx.append(f"[{f['file']}]({RAW_BASE}{f['file']}) | {f['contents']} | {f['entries']} | {round(f['bytes'] / 1024, 1)} KB")
    (ROOT / "CATALOG.md").write_text("\n".join(idx) + "\n", encoding="utf-8")
    return [{k: f[k] for k in ("file", "entries", "marker")} for f in files]


if __name__ == "__main__":
    main()
