"""Extract building, road and zone data from a local Cities: Skylines II install.

Writes data/game_data.json, which tools/build_assets.py turns into assets.json and CATALOG.md.

Needs:  pip install UnityPy TypeTreeGeneratorAPI
Run:    python tools/extract_game_data.py "C:/Program Files (x86)/Steam/steamapps/common/Cities Skylines II"

Base-game prefabs are Unity objects in Cities2_Data/resources.assets (read with UnityPy, field layouts rebuilt
from the game's own DLLs). DLC prefabs are Colossal binary files inside Content/<DLC>/Prefabs.cok (zip archives),
read with a small heuristic parser below. Display names come from the en-US localization files.
"""
import json
import re
import struct
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "game_data.json"

# Components that carry no layout/function information; skipped to keep the output small.
SKIP_COMPONENTS = {
    "ObsoleteIdentifiers", "ColorProperties", "EffectSource", "ObjectSubObjects", "ObjectSubLanes", "ObjectSubNets",
    "ObjectSubAreas", "LodProperties", "BuildingTerraformOverride", "SubObjectDefaultProbability",
    "EmissiveProperties", "AssetPackItem", "SpawnableObject", "BrandObject", "ProceduralAnimationProperties",
    "EditorAssetCategoryOverride", "ObjectAchievementComponent", "AnimationProperties",
}
SCALAR = (int, float, bool, str)


# ---------------------------------------------------------------- localization
def read_7bit(b, p):
    n = shift = 0
    while True:
        x = b[p]; p += 1
        n |= (x & 0x7F) << shift
        if x < 0x80:
            return n, p
        shift += 7


def read_str(b, p):
    n, p = read_7bit(b, p)
    return b[p:p + n].decode("utf-8", "replace"), p + n


def load_locale(cok):
    out = {}
    try:
        z = zipfile.ZipFile(cok)
    except (OSError, zipfile.BadZipFile):
        return out
    name = next((n for n in z.namelist() if n.endswith("en-US.loc")), None)
    if not name:
        return out
    b = z.read(name)
    p = 2
    for _ in range(3):
        _, p = read_str(b, p)
    count = struct.unpack_from("<i", b, p)[0]; p += 4
    for _ in range(count):
        k, p = read_str(b, p)
        v, p = read_str(b, p)
        out[k] = v
    return out


# ---------------------------------------------------------------- base game (Unity)
def extract_base(game):
    import UnityPy
    from UnityPy.helpers.TypeTreeGenerator import TypeTreeGenerator

    data_dir = game / "Cities2_Data"
    version = list(UnityPy.load(str(data_dir / "globalgamemanagers")).files.values())[0].unity_version
    gen = TypeTreeGenerator(version)
    gen.load_local_game(str(game))
    env = UnityPy.load(str(data_dir / "resources.assets"))
    env.typetree_generator = gen
    f = list(env.files.values())[0]
    objs = f.objects
    scripts, cls_of, name_of = {}, {}, {}

    def cls(o):
        if o.path_id not in cls_of:
            h = o.parse_monobehaviour_head()
            pid = h.m_Script.m_PathID
            if pid not in scripts:
                s = h.m_Script.deref_parse_as_object()
                scripts[pid] = s.m_ClassName
            cls_of[o.path_id] = scripts[pid]
            name_of[o.path_id] = h.m_Name
        return cls_of[o.path_id]

    def ref(r):
        if isinstance(r, dict) and set(r) == {"m_FileID", "m_PathID"}:
            o = objs.get(r["m_PathID"]) if r["m_FileID"] == 0 else None
            if o is None or o.type.name != "MonoBehaviour":
                return None
            try:
                return cls(o) + ":" + name_of[o.path_id]
            except Exception:
                return None
        return r

    def clean(v, depth=0):
        if isinstance(v, dict):
            if set(v) == {"m_FileID", "m_PathID"}:
                return ref(v)
            return {k: clean(x, depth + 1) for k, x in v.items()
                    if k not in ("m_GameObject", "m_Enabled", "m_Script", "active", "version", "m_prefabFormat", "m_Name")}
        if isinstance(v, list):
            return [clean(x, depth + 1) for x in v[:80]]
        return v

    # GUID -> prefab name, used to resolve references inside DLC prefabs.
    guid_map = {}
    for o in objs.values():
        if o.type.name == "MonoBehaviour" and cls(o) == "UnityObjectsMap":
            raw = o.get_raw_data()
            i = 0
            while i < len(raw) - 40:
                n = struct.unpack_from("<i", raw, i)[0]
                if 1000 < n < 2_000_000 and struct.unpack_from("<i", raw, i + 4)[0] == 32 and re.fullmatch(rb"[0-9a-f]{32}", raw[i + 8:i + 40]):
                    break
                i += 4
            p, guids = i + 4, []
            for _ in range(n):
                L = struct.unpack_from("<i", raw, p)[0]
                guids.append(raw[p + 4:p + 4 + L].decode()); p = (p + 4 + L + 3) & ~3
            cnt = struct.unpack_from("<i", raw, p)[0]; q = p + 4
            for g in guids[:cnt]:
                fid, pid = struct.unpack_from("<iq", raw, q); q += 12
                o2 = objs.get(pid) if fid == 0 else None
                if o2 is not None and o2.type.name == "MonoBehaviour":
                    try:
                        guid_map[g] = cls(o2) + ":" + name_of[o2.path_id]
                    except Exception:
                        pass
            break

    want = {"BuildingPrefab", "BuildingExtensionPrefab", "RoadPrefab", "TrackPrefab", "ZonePrefab",
            "NetSectionPrefab", "NetPiecePrefab"}
    records = []
    for o in objs.values():
        if o.type.name != "MonoBehaviour" or cls(o) not in want:
            continue
        d = o.parse_as_dict()
        rec = {"class": cls(o), "prefab": d.get("m_Name"), "source": "base", "fields": {}, "components": {}}
        for k, v in d.items():
            if k in ("components", "m_Meshes", "m_GameObject", "m_Script", "m_Enabled", "m_Name", "active", "version", "m_prefabFormat"):
                continue
            rec["fields"][k] = clean(v)
        for r in d.get("components", []):
            co = objs.get(r["m_PathID"])
            if co is None or co.type.name != "MonoBehaviour":
                continue
            cc = cls(co)
            if cc in SKIP_COMPONENTS:
                continue
            try:
                rec["components"][cc] = clean(co.parse_as_dict())
            except Exception as e:  # noqa: BLE001
                rec["components"][cc] = {"_error": str(e)[:80]}
        records.append(rec)
    return records, guid_map


# ---------------------------------------------------------------- DLC (Colossal binary prefabs)
FIELD = re.compile(rb"(?=([\x00-\xff])\x01([\x01-\x7f])\x00\x00\x00)", re.S)
TYPE = re.compile(rb"\x01([\x10-\x7f])\x00\x00\x00((?:[ -~]\x00){8,120})")
ROOT_FIELDS = {"m_LotWidth", "m_LotDepth", "m_AccessType", "m_Circular", "m_ExternalLot", "m_OverrideHeight"}
PRINTABLE_UTF16 = re.compile(rb"(?:[ -~]\x00)+")


def parse_colossal(b):
    toks = []
    for m in FIELD.finditer(b):
        n = m.group(2)[0]
        start = m.start() + 6
        raw = b[start:start + 2 * n]
        if len(raw) != 2 * n or not PRINTABLE_UTF16.fullmatch(raw):
            continue
        name = raw.decode("utf-16-le")
        if name.startswith(("Game.", "Unity.", "System.", "Colossal.")) or ", " in name:
            continue  # a type declaration, handled by TYPE below
        toks.append((m.start(), "f", m.group(1)[0], name, start + 2 * n))
    for m in TYPE.finditer(b):
        n, raw = m.group(1)[0], m.group(2)
        if len(raw) >= 2 * n:
            s = raw[:2 * n].decode("utf-16-le", "ignore")
            if s.startswith("Game.") and ", Game" in s:
                toks.append((m.start(), "t", s.split(",")[0].split(".")[-1], None, None))
    toks.sort(key=lambda t: t[0])
    root, comps, fields, cur, list_target = None, {}, {}, None, None
    last_vec = None
    for pos, kind, a, name, end in toks:
        if kind == "t":
            if root is None:
                root = a
            elif not a.endswith("[]") and a not in ("LocalEffectInfo", "CityEffectInfo", "ResourceInEditor") and a != root:
                cur = a
                comps.setdefault(cur, {})
            continue
        tag = a
        if name.startswith(("CID:", "UnityGUID:")):
            if list_target is not None:
                list_target.append(name)
            continue
        if tag == 0x17:
            val = struct.unpack_from("<i", b, end)[0]
        elif tag == 0x19:
            val = struct.unpack_from("<I", b, end)[0]
        elif tag == 0x1F:
            val = round(struct.unpack_from("<f", b, end)[0], 4)
        elif tag == 0x2B:
            val = bool(b[end])
        elif tag in (0x27, 0x32, 0x33) and b[end] == 1:
            n = struct.unpack_from("<i", b, end + 1)[0]
            val = b[end + 5:end + 5 + 2 * n].decode("utf-16-le", "ignore") if 0 <= n < 300 else None
        elif tag == 0x01:
            val = []
            list_target = val
        else:
            val = None
        if tag != 0x01:
            list_target = None if name not in ("x", "y", "z") else list_target
        if name in ("x", "y", "z") and last_vec is not None:
            last_vec[name] = val
            continue
        if tag == 0x03:
            last_vec = {}
            val = last_vec
        elif name not in ("x", "y", "z"):
            last_vec = None
        if name in ROOT_FIELDS or cur is None:
            fields.setdefault(name, val)
        elif name not in ("name", "active"):
            comps[cur].setdefault(name, val)
    return root, fields, comps


def extract_dlc(game):
    content = game / "Cities2_Data" / "Content"
    archives = sorted(content.glob("*/Prefabs.cok")) + sorted(content.glob("Game/Prefabs_*.cok"))
    cid_map, raw = {}, []
    for arc in archives:
        z = zipfile.ZipFile(arc)
        dlc = arc.parent.name if arc.parent.name != "Game" else arc.stem.replace("Prefabs_", "")
        for n in z.namelist():
            if not n.endswith(".Prefab") or " Mesh" in n:
                continue
            prefab = n.rsplit("/", 1)[-1][:-len(".Prefab")]
            try:
                cid = z.read(n + ".cid").decode().strip()
                cid_map[cid] = prefab
            except KeyError:
                pass
            raw.append((dlc, prefab, z.read(n)))
    records = []
    for dlc, prefab, b in raw:
        root, fields, comps = parse_colossal(b)
        if root not in ("BuildingPrefab", "BuildingExtensionPrefab", "RoadPrefab", "TrackPrefab", "ZonePrefab"):
            continue
        records.append({"class": root, "prefab": prefab, "source": dlc, "fields": fields,
                        "components": {k: v for k, v in comps.items() if k not in SKIP_COMPONENTS}})
    return records, cid_map


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    game = Path(sys.argv[1])
    base, guid_map = extract_base(game)
    dlc, cid_map = extract_dlc(game)

    def resolve(v):
        if isinstance(v, str):
            if v.startswith("UnityGUID:"):
                return guid_map.get(v[10:], v)
            if v.startswith("CID:"):
                return "Prefab:" + cid_map.get(v[4:], v)
            return v
        if isinstance(v, list):
            return [resolve(x) for x in v]
        if isinstance(v, dict):
            return {k: resolve(x) for k, x in v.items()}
        return v

    for r in dlc:
        r["fields"] = resolve(r["fields"]); r["components"] = resolve(r["components"])

    locale = {}
    for cok in [game / "Cities2_Data/Content/Game/Locale.cok"] + sorted((game / "Cities2_Data/Content").glob("*/Locale.cok")):
        locale.update(load_locale(cok))
    names = {k[12:-1]: v for k, v in locale.items() if k.startswith("Assets.NAME[")}
    for k, v in locale.items():
        if k.startswith("Assets.UPGRADE_NAME["):
            names.setdefault(k[20:-1], v)

    out = {"gameVersionNote": "Extracted from a local install; re-run after game updates.",
           "names": names, "prefabs": base + dlc}
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {OUT}: {len(base)} base + {len(dlc)} DLC prefabs, {len(names)} names")


if __name__ == "__main__":
    main()
