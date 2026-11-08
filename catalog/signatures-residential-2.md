# CS2 catalog: signatures residential (part 2 of 2)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## SignaturesResidentialMixed (continued)

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
hurston_yards | Hurston Yards | 26×16 | U | Skyscrapers | road |  |  | zone residential_mixed; homes 2100; attract 120
ironpress_building | Ironpress Building | 4×4 | U |  | road |  |  | zone residential_mixed; homes 8; attract 5; wellbeing +4 within 750 m
ludo_square | Ludo Square | 4×8 | U |  | road |  |  | zone residential_mixed; homes 16; attract 15; wellbeing +10 within 2000 m
hurston_tower_c | Hurston Tower C | 10×10 | U | Skyscrapers | near_parent | hurston_yards (≤200 m) |  | 

- upgrades of `emerald_towers` (no separate placement): `elementary_school_pack10_msignature03_ext01`
- upgrades of `docklands_tower` (no separate placement): `fire_station_headquarters`
- upgrades of `hurston_yards` (no separate placement): `observation_deck`

END OF FILE catalog/signatures-residential-2.md | 7 entries | check f2abf8
