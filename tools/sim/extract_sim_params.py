"""Extract the game's simulation parameter prefabs (economy, citizens, pathfinding, traffic) for the traffic simulator.

Writes data/sim_params_raw.json (gitignored, like game_data.json); tools/sim/build_sim_data.py turns it and
data/game_data.json into tools/sim/sim_data.json, which the simulator reads.

Run:  python tools/sim/extract_sim_params.py "C:/Program Files (x86)/Steam/steamapps/common/Cities Skylines II"
      python tools/sim/extract_sim_params.py <game> --list     (list all prefab classes and counts)
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "sim_params_raw.json"
WANT = re.compile(r"Parameter|Economy|Pathfind|Traffic|Citizen|Household|Workplace|Time|Demand|CarData|Vehicle|Personal|Spawn|Leisure|Commut|Outside|Transport|Parking|Trip|CarLane|Settings", re.I)


def main():
    import UnityPy
    from UnityPy.helpers.TypeTreeGenerator import TypeTreeGenerator
    game = Path(sys.argv[1])
    data_dir = game / "Cities2_Data"
    version = list(UnityPy.load(str(data_dir / "globalgamemanagers")).files.values())[0].unity_version
    gen = TypeTreeGenerator(version)
    gen.load_local_game(str(game))
    env = UnityPy.load(str(data_dir / "resources.assets"))
    env.typetree_generator = gen
    objs = list(env.files.values())[0].objects
    scripts, cls_of, name_of = {}, {}, {}

    def cls(o):
        if o.path_id not in cls_of:
            h = o.parse_monobehaviour_head()
            pid = h.m_Script.m_PathID
            if pid not in scripts:
                scripts[pid] = h.m_Script.deref_parse_as_object().m_ClassName
            cls_of[o.path_id] = scripts[pid]
            name_of[o.path_id] = h.m_Name
        return cls_of[o.path_id]

    def clean(v):
        if isinstance(v, dict):
            if set(v) == {"m_FileID", "m_PathID"}:
                o = objs.get(v["m_PathID"]) if v["m_FileID"] == 0 else None
                if o is None or o.type.name != "MonoBehaviour":
                    return None
                try:
                    return cls(o) + ":" + name_of[o.path_id]
                except Exception:
                    return None
            return {k: clean(x) for k, x in v.items() if k not in ("m_GameObject", "m_Enabled", "m_Script", "m_Name")}
        if isinstance(v, list):
            return [clean(x) for x in v[:200]]
        return v

    counts = {}
    mbs = [o for o in objs.values() if o.type.name == "MonoBehaviour"]
    for o in mbs:
        try:
            counts[cls(o)] = counts.get(cls(o), 0) + 1
        except Exception:
            pass
    if "--list" in sys.argv:
        for k, n in sorted(counts.items()):
            print(n, k)
        return
    out = []
    for o in mbs:
        c = cls_of.get(o.path_id)
        if not c or not (WANT.search(c) and counts[c] <= 60 or c == "CompanyPrefab"):
            continue
        try:
            d = o.parse_as_dict()
        except Exception as e:  # noqa: BLE001
            out.append({"class": c, "prefab": name_of[o.path_id], "_error": str(e)[:100]})
            continue
        comps = {}
        for r in d.get("components", []):
            co = objs.get(r["m_PathID"])
            if co is not None and co.type.name == "MonoBehaviour":
                try:
                    comps[cls(co)] = clean(co.parse_as_dict())
                except Exception:  # noqa: BLE001
                    pass
        d.pop("components", None)
        out.append({"class": c, "prefab": name_of[o.path_id], "fields": clean(d), "components": comps})
    OUT.write_text(json.dumps(out, indent=1))
    print(len(out), "records ->", OUT)


if __name__ == "__main__":
    main()
