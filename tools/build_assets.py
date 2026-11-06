"""Build assets.json from the raw wiki extracts in data/raw/.

Run from the repo root:  python tools/build_assets.py
"""
import json
import re
import unicodedata
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"

# Service buildings that are believed to be one-per-city. The wiki does not state this, so these
# carry "uniqueVerified": false. Correct this list if the game says otherwise.
LIKELY_UNIQUE_SERVICES = {
    "City Hall", "Central Bank", "Central Intelligence Bureau", "Police Headquarters",
    "Disease Control Center", "Health Research Institute", "Medical University", "Technical University",
    "Radio Telescope", "Geological Research Center", "Large Hadron Collider", "Satellite Uplink",
    "Early Disaster Warning System", "ChirpX Space Center", "International Airport",
    "Observation Tower", "Bronze Statue", "Medieval Castle", "Water Park", "Nuclear Power Plant",
}

# Port modules from Bridges and Ports are placed inside a port's area rather than as stand-alone lots.
PORT_MODULES = {
    "Small Auxiliary Port Gate", "Medium Auxiliary Port Gate", "Passenger Terminal", "Employee Canteen",
    "Port Security", "Emergency Response", "Container Crane", "Container Crane (Striped)",
    "Intermodal Train Terminal", "Small Cargo Container Yard", "Medium Cargo Container Yard",
    "Large Cargo Container Yard", "Small Cargo Warehouse", "Medium Cargo Warehouse", "Large Cargo Warehouse",
    "Small Tank Farm", "Medium Tank Farm", "Large Tank Farm", "Small Bulk Storage Yard",
    "Medium Bulk Storage Yard", "Large Bulk Storage Yard",
}

# Buildings that must sit on or beside water (or a specific resource) rather than on a plain road lot.
WATER_PLACEMENT = {
    "Hydroelectric Power Plant", "Water Pumping Station", "Advanced Water Pumping Station", "Sewage Outlet",
    "Harbor", "Cargo Harbor", "Small Port", "Medium Port", "Large Port", "Ferry Depot", "Ferry Terminal",
    "Small Lighthouse", "Lighthouse", "Large Lighthouse", "Old Lighthouse",
}
RESOURCE_PLACEMENT = {"Geothermal Power Plant": "geothermal hotspot", "Groundwater Pumping Station": "groundwater"}

# Network-attached buildings: they sit on tracks/roads rather than beside a road.
TRACK_PLACEMENT = {
    "Small Train Station", "Medium Train Station", "Train Station", "Terminus Station", "Cargo Train Terminal",
    "Cargo Transfer Station", "Tram Junction Station", "Tram Parallel Station", "Tram Loop Station",
    "Small Overground Subway Station", "Overground Subway Station", "Underground Subway Station",
    "Small Elevated Subway Station", "Elevated Subway Station", "Railway Depot", "Rail Yard",
    "Terminal Subway Yard", "Subway Yard", "Tram Depot",
}

CATEGORY_GROUP = {
    "Post": "communications", "Telecom": "communications", "Education": "education", "Research": "research",
    "Electricity": "electricity", "Fire": "fire_rescue", "Disaster Control": "fire_rescue",
    "Garbage Management": "garbage", "Healthcare": "healthcare", "Deathcare": "deathcare",
    "Park maintenance": "parks", "Parks and tourist attractions": "parks", "Landmarks": "landmarks",
    "Police": "police", "Administration": "administration", "Road": "transport_road", "Train": "transport_train",
    "Tram": "transport_tram", "Subway": "transport_subway", "Water": "transport_water",
    "Ferry": "transport_ferry", "Air": "transport_air", "Water & Sewage": "water_sewage", "Parking": "parking",
}


def slug(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    s = s.replace("&", "and").lower()
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")


def parse_size(s: str):
    m = re.match(r"^\s*(\d+)\s*[×x]\s*(\d+)\s*$", s or "")
    return (int(m.group(1)), int(m.group(2))) if m else None


def parse_money(s: str):
    s = (s or "").strip().replace(",", "")
    m = re.match(r"^([\d.]+)\s*([KM]?)$", s)
    if not m:
        return None
    v = float(m.group(1)) * {"": 1, "K": 1_000, "M": 1_000_000}[m.group(2)]
    return int(round(v))


def parse_extra(s: str):
    out = {}
    for part in (s or "").split(";"):
        if "=" not in part:
            continue
        k, v = part.split("=", 1)
        k, v = k.strip(), v.strip()
        try:
            out[k] = float(v) if "." in v else int(v)
        except ValueError:
            out[k] = v
    if "range" in out:
        out["serviceRangeM"] = out.pop("range")
    if "capacity" in out:
        out["serviceCapacity"] = out.pop("capacity")
    if "jobs" in out:
        out["workplaces"] = out.pop("jobs")
    for p in ("noise", "air", "ground"):
        if p in out:
            out[p + "Pollution"] = out.pop(p)
    return out


def build_services():
    assets = []
    category, headers, mains = None, [], []
    for line in (RAW / "service_buildings.txt").read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#") and not line.startswith("##"):
            continue
        if line.startswith("## "):
            category, cols = line[3:].split(" :: ")
            headers = cols.split("|")
            mains = []
            continue
        main_part, _, extra = line.partition(" || ")
        cells = main_part.split("|")
        row = dict(zip(headers, cells + [""] * (len(headers) - len(cells))))
        name = row["Name"].strip()
        size = parse_size(row.get("Size (cells)", ""))
        dlc = (row.get("DLC") or "").strip() or None
        req = (row.get("Requirements") or "").strip() or None

        # Upgrade detection: name starts with an earlier main building's name in this category.
        parent = None
        for m in sorted(mains, key=len, reverse=True):
            if name.startswith(m + " ") and not name[len(m) + 1:].startswith("("):
                parent = m
                break

        skip = {"Name", "Size (cells)", "DLC", "Requirements", "Upkeep per month"}
        stats = {k: v.strip() for k, v in row.items() if k not in skip and v and v.strip() not in ("", "0", "0.0")}
        stats.update(parse_extra(extra))

        a = {
            "id": slug(name),
            "name": name,
            "group": CATEGORY_GROUP.get(category, slug(category)),
            "category": category,
            "dlc": dlc,
            "requirement": req,
            "upkeepPerMonth": parse_money(row.get("Upkeep per month", "")),
            "stats": stats,
        }
        if parent:
            a["kind"] = "extension" if size else "upgrade"
            a["parent"] = slug(parent)
        elif name in PORT_MODULES:
            a["kind"] = "port_module"
            a["parent"] = "small_port|medium_port|large_port"
        else:
            a["kind"] = "landmark" if category == "Landmarks" else "service"
            mains.append(name)

        if size:
            a["size"] = {"w": size[0], "d": size[1]}
            a["placeable"] = a["kind"] != "upgrade"
        else:
            a["placeable"] = False
            a["note"] = "In-building upgrade with no footprint of its own; it never takes up extra cells."
            if a["kind"] not in ("upgrade",):
                a["note"] = "Size unknown on the wiki."

        if category == "Landmarks":
            a["unique"], a["uniqueVerified"] = True, True
        elif name in LIKELY_UNIQUE_SERVICES:
            a["unique"], a["uniqueVerified"] = True, False
        else:
            a["unique"] = False

        if name in WATER_PLACEMENT:
            a["placement"] = "water"
        elif name in RESOURCE_PLACEMENT:
            a["placement"] = "resource:" + RESOURCE_PLACEMENT[name]
        elif name in TRACK_PLACEMENT:
            a["placement"] = "track"
        elif a["kind"] in ("extension", "upgrade"):
            a["placement"] = "attached"
        elif a["kind"] == "port_module":
            a["placement"] = "port_area"
        else:
            a["placement"] = "road"
        assets.append(a)
    return assets


def build_signatures():
    assets, zone = [], None
    zone_map = {"residential": "residential", "mixed": "residential_mixed", "commercial": "commercial", "office": "office"}
    for line in (RAW / "signature_buildings.txt").read_text(encoding="utf-8").splitlines():
        if not line.strip() or (line.startswith("#") and not line.startswith("##")):
            continue
        if line.startswith("## "):
            zone = line[3:].strip()
            continue
        name, dlc, size, req, effects, households, employees = (line.split("|") + [""] * 7)[:7]
        w, d = parse_size(size)
        a = {
            "id": slug(name),
            "name": name,
            "group": "signature",
            "category": "Signature " + zone,
            "kind": "signature",
            "zone": zone_map[zone],
            "dlc": dlc or None,
            "requirement": None if req == "unknown" else req,
            "size": {"w": w, "d": d},
            "placeable": True,
            "placement": "road",
            "unique": True,
            "uniqueVerified": True,
            "effects": effects,
            "stats": {},
        }
        if households:
            a["stats"]["households"] = int(households.replace(",", ""))
        if employees:
            a["stats"]["workplaces"] = int(employees.replace(",", ""))
        assets.append(a)
    return assets


ZONES = [
    # Lot sizes are width (along the road) x depth (away from the road), in cells. Source: wiki Zoning page.
    {"id": "residential_low", "name": "Low Density Housing", "family": "residential", "milestone": 0, "lot": {"minW": 2, "maxW": 4, "minD": 2, "maxD": 6}},
    {"id": "residential_row", "name": "Medium Density Row Housing", "family": "residential", "milestone": 1, "lot": {"minW": 1, "maxW": 1, "minD": 2, "maxD": 6}},
    {"id": "residential_medium", "name": "Medium Density Housing", "family": "residential", "milestone": 2, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}},
    {"id": "residential_high", "name": "High Density Housing", "family": "residential", "milestone": 8, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}},
    {"id": "residential_mixed", "name": "Mixed Housing", "family": "residential", "milestone": 5, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}, "note": "Shops on the ground floor, apartments above."},
    {"id": "residential_lowrent", "name": "Low Rent Housing", "family": "residential", "milestone": 4, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}},
    {"id": "residential_low_waterfront", "name": "Low Density Waterfront Housing", "family": "residential", "dlc": "Beach Properties", "lot": None, "note": "Lot sizes not on the wiki. Must face water."},
    {"id": "residential_medium_mediterranean", "name": "Medium Density Mediterranean Housing", "family": "residential", "dlc": "Beach Properties", "lot": None, "note": "Lot sizes not on the wiki; assume same as Medium Density Housing."},
    {"id": "commercial_low", "name": "Low Density Business", "family": "commercial", "milestone": 0, "lot": {"minW": 2, "maxW": 5, "minD": 2, "maxD": 6}},
    {"id": "commercial_high", "name": "High Density Business", "family": "commercial", "milestone": 9, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}},
    {"id": "commercial_low_chinese", "name": "Low Density Chinese Business", "family": "commercial", "dlc": "region pack", "lot": None, "note": "Lot sizes not on the wiki; assume same as Low Density Business."},
    {"id": "office_low", "name": "Low Density Offices", "family": "office", "milestone": 4, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}},
    {"id": "office_high", "name": "High Density Offices", "family": "office", "milestone": 10, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}},
    {"id": "industrial_manufacturing", "name": "Industrial Manufacturing", "family": "industrial", "milestone": 0, "lot": {"minW": 2, "maxW": 6, "minD": 2, "maxD": 6}},
]

# Road data from the wiki Roads page (lanes, speed, category). Widths are NOT on the wiki: widthCells is an
# estimate (1 cell = 8 m) and is marked widthVerified: false. Fix these if you measure them in game.
ROADS = [
    ("alley", "Alley", "small", 2, 30, 1.0), ("one_way_alley", "One-Way Alley", "small", 1, 30, 1.0),
    ("pedestrian_street", "Pedestrian Street", "small", 2, 20, 2.0), ("small_pedestrian_street", "Small Pedestrian Street", "small", 1, 20, 1.0),
    ("gravel_road", "Gravel Road", "small", 2, 30, 2.0),
    ("one_lane_one_way_road", "One-Lane One-Way Road", "small", 1, 40, 1.5),
    ("two_lane_road", "Two-Lane Road", "small", 2, 40, 2.0), ("two_lane_one_way_road", "Two-Lane One-Way Road", "small", 2, 40, 2.0),
    ("three_lane_asymmetric_road", "Three-Lane Asymmetric Road", "small", 3, 40, 2.5), ("three_lane_one_way_road", "Three-Lane One-Way Road", "small", 3, 40, 2.5),
    ("two_lane_parking_road", "Two-Lane Perpendicular/Angled Parking Road", "small", 2, 40, 3.0),
    ("four_lane_road", "Four-Lane Road", "medium", 4, 50, 3.0), ("four_lane_divided_road", "Four-Lane Divided Road", "medium", 4, 50, 3.5),
    ("four_lane_one_way_road", "Four-Lane One-Way Road", "medium", 4, 50, 3.0), ("five_lane_asymmetric_road", "Five-Lane Asymmetric Road", "medium", 5, 50, 3.5),
    ("five_lane_one_way_road", "Five-Lane One-Way Road", "medium", 5, 50, 3.5),
    ("six_lane_road", "Six-Lane Road", "large", 6, 50, 4.0), ("six_lane_divided_road", "Six-Lane Divided Road", "large", 6, 60, 4.5),
    ("six_lane_one_way_road", "Six-Lane One-Way Road", "large", 6, 50, 4.0), ("seven_lane_asymmetric_road", "Seven-Lane Asymmetric Road", "large", 7, 50, 4.5),
    ("eight_lane_divided_road", "Eight-Lane Divided Road", "large", 8, 60, 5.5),
    ("one_lane_one_way_highway", "One-Lane One-Way Highway", "highway", 1, 80, 1.5), ("two_lane_one_way_highway", "Two-Lane One-Way Highway", "highway", 2, 120, 2.0),
    ("three_lane_one_way_highway", "Three-Lane One-Way Highway", "highway", 3, 120, 2.5), ("four_lane_one_way_highway", "Four-Lane One-Way Highway", "highway", 4, 120, 3.0),
    ("five_lane_one_way_highway", "Five-Lane One-Way Highway", "highway", 5, 120, 3.5),
    ("two_lane_two_way_highway", "Two-Lane Two-Way Highway", "highway", 2, 100, 2.0), ("four_lane_two_way_highway", "Four-Lane Two-Way Highway", "highway", 4, 100, 3.5),
]
TRACKS = [
    ("train_track_double", "Double Train Track", 2.0), ("tram_track_double", "Double Tram Track", 1.5),
    ("subway_track_double", "Double Subway Track", 2.0),
]


def main():
    services = build_services()
    signatures = build_signatures()
    ids = [a["id"] for a in services + signatures]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        raise SystemExit(f"duplicate ids: {dupes}")

    roads = [
        {"id": i, "name": n, "category": c, "lanes": l, "speedKmh": s, "widthCells": w, "widthVerified": False,
         "allowsZoning": c != "highway", "buildingAccess": c != "highway"}
        for i, n, c, l, s, w in ROADS
    ] + [
        {"id": i, "name": n, "category": "track", "widthCells": w, "widthVerified": False, "allowsZoning": False, "buildingAccess": False}
        for i, n, w in TRACKS
    ]

    out = {
        "meta": {
            "name": "Cities: Skylines II placeable asset dataset",
            "generated": date.today().isoformat(),
            "source": ["https://cs2.paradoxwikis.com/Service_buildings", "https://cs2.paradoxwikis.com/Signature_buildings",
                       "https://cs2.paradoxwikis.com/Zoning", "https://cs2.paradoxwikis.com/Roads"],
            "license": "Data derived from the Cities: Skylines II Wiki, CC BY-NC-SA 3.0. Non-commercial use only.",
            "wikiDataVersionNote": "Some wiki sections were last verified for game version 1.5; DLC coverage depends on the wiki.",
            "counts": {"services": len(services), "signatures": len(signatures), "zones": len(ZONES), "roads": len(roads)},
        },
        "grid": {
            "cellMeters": 8,
            "sizeConvention": "size.w = width along the road (frontage), size.d = depth away from the road, in cells.",
            "sizeConventionVerified": False,
            "rotation": "0 = front faces north (-y), 90 = east (+x), 180 = south (+y), 270 = west (-x).",
        },
        "rules": {
            "maxZoneDepthCells": 6,
            "uniqueBuildingsOnce": "Every asset with unique: true may be placed at most once.",
            "noOverlap": "Footprints of buildings, roads and zones may not overlap.",
            "roadAccess": "Every building with placement 'road' and every zone block must touch a road that has buildingAccess true.",
            "extensions": "kind 'extension' must be placed touching its parent building instance; kind 'upgrade' has no footprint.",
            "highways": "Highways do not give buildings or zones road access.",
        },
        "zones": ZONES,
        "roads": roads,
        "assets": services + signatures,
    }
    (ROOT / "assets.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    write_catalog(out)
    print(f"wrote assets.json: {len(services)} service assets, {len(signatures)} signature buildings, {len(roads)} road types")


def key_stats(a):
    s = a.get("stats", {})
    parts = []
    for k, label in (("households", "homes"), ("workplaces", "jobs"), ("serviceRangeM", "range m"),
                     ("Student capacity", "students"), ("Patient capacity", "patients"),
                     ("Electricity production", "power"), ("Water output", "water"), ("Sewage treatment", "sewage"),
                     ("Garbage processing capacity", "garbage"), ("Shelter Capacity", "shelter"), ("Leisure", "leisure"),
                     ("Attractiveness", "attract"), ("Range", "range"), ("Network Capacity", "network")):
        if s.get(k) not in (None, ""):
            v = s[k]
            if isinstance(v, float) and v.is_integer():
                v = int(v)
            parts.append(f"{label} {v}")
    if a.get("effects"):
        parts.append(a["effects"])
    return "; ".join(parts)


def write_catalog(out):
    lines = [
        "# CS2 asset catalog (compact)",
        "",
        "Generated from assets.json. One row per asset. Size = width (along road) × depth, in 8 m cells.",
        "U = unique (place at most once; U? = believed unique, unverified). Placement: road = front edge must touch a road;",
        "attached = extension, must touch its parent; water / track / port_area / resource = special sites.",
        "In-building upgrades (no footprint) are listed per parent at the end of each section.",
        "",
        "## Zones (lot = width×depth range in cells, zoning reaches at most 6 cells from a road)",
        "",
        "id | name | lot sizes | milestone",
        "---|---|---|---",
    ]
    for z in out["zones"]:
        lot = z["lot"]
        lot_s = f"{lot['minW']}×{lot['minD']} to {lot['maxW']}×{lot['maxD']}" if lot else "unknown"
        lines.append(f"{z['id']} | {z['name']} | {lot_s} | {z.get('milestone', z.get('dlc', ''))}")
    lines += ["", "## Roads (widthCells are estimates, not verified)", "", "id | name | lanes | km/h | width cells | zoning/access",
              "---|---|---|---|---|---"]
    for r in out["roads"]:
        lines.append(f"{r['id']} | {r['name']} | {r.get('lanes', '')} | {r.get('speedKmh', '')} | {r['widthCells']} | "
                     f"{'yes' if r['allowsZoning'] else 'no'}")
    groups = {}
    for a in out["assets"]:
        groups.setdefault(a["category"], []).append(a)
    for cat, items in groups.items():
        lines += ["", f"## {cat}", "", "id | name | size | U | DLC | placement | parent | stats", "---|---|---|---|---|---|---|---"]
        upgrades = {}
        for a in items:
            if not a["placeable"]:
                upgrades.setdefault(a.get("parent", "?"), []).append(a["id"])
                continue
            u = ("U" if a.get("uniqueVerified") else "U?") if a["unique"] else ""
            size = f"{a['size']['w']}×{a['size']['d']}"
            lines.append(f"{a['id']} | {a['name']} | {size} | {u} | {a['dlc'] or ''} | {a['placement']} | "
                         f"{a.get('parent', '')} | {key_stats(a)}")
        if upgrades:
            lines.append("")
            for p, ups in upgrades.items():
                lines.append(f"- upgrades of `{p}` (no footprint): " + ", ".join(f"`{u}`" for u in ups))
    (ROOT / "CATALOG.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
