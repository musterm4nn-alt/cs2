# CS2 catalog: parks parking (part 3 of 3)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## RoadsServices

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
road_maintenance_depot | Road Maintenance Depot | 10×12 |  |  | road |  | 15000 | jobs 30

- upgrades of `road_maintenance_depot` (no separate placement): `road_maintenance_depot_extra_garage`

## SportsParks

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
basketball_court | Basketball Court | 3×4 |  |  | road |  | 2500 | range m 3500; attract 5
outdoor_gym | Outdoor Gym | 2×2 |  |  | road |  | 3000 | range m 3500; attract 5
skate_park | Skate Park | 8×4 |  |  | road |  | 3000 | range m 3500; attract 5
tennis_court | Tennis Court | 4×7 |  |  | road |  | 2500 | range m 3500; attract 5

END OF FILE catalog/parks-parking-3.md | 6 entries | check 0d703e
