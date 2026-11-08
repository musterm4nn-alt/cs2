# CS2 catalog: utilities (part 2 of 2)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## Water & Sewage (continued)

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
- upgrades of `sewage_outlet` (no separate placement): `sewage_outlet_chemical_purification`
- upgrades of `water_pumping_station` (no separate placement): `water_pumping_station_extra_pump`
- upgrades of `water_tower` (no separate placement): `water_tower_viewing_deck`

END OF FILE catalog/utilities-2.md | 3 entries | check 396c61
