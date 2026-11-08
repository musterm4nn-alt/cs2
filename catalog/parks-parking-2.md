# CS2 catalog: parks parking (part 2 of 3)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## Parks & Recreation (continued)

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
small_playground | Small Playground | 2×2 |  |  | road |  | 1000 | range m 2000; attract 1
small_plaza | Small Plaza | 6×6 |  |  | road |  | 4000 | range m 4000; attract 5
square_pocket_park | Square Pocket Park | 2×2 |  |  | road |  | 1000 | range m 2000; attract 1
sweet_station_truck | Sweet Station Truck | 1×1 |  | Downtown Market Set | road |  | 1000 | jobs 2; range m 1000; attract 5
the_dockyard_lounge_park | The Dockyard Lounge Park | 4×8 |  | Leisure Venues | road |  | 6000 | jobs 5; range m 4000; attract 35
the_hub | The Hub | 3×3 | U | Downtown Market Set | road |  | 15000 | jobs 6; range m 3000; attract 20
tiny_city_park | Tiny City Park | 2×3 |  |  | road |  | 1500 | range m 2250; attract 1
tiny_park | Tiny Park | 1×1 |  |  | road |  | 400 | range m 500; attract 1
urban_parkette | Urban Parkette | 2×1 |  |  | road |  | 600 | range m 1000; attract 1
urban_pocket_park | Urban Pocket Park | 2×2 |  |  | road |  | 1000 | range m 2000; attract 1
wide_pocket_park | Wide Pocket Park | 6×1 |  |  | road |  | 1500 | range m 2250; attract 1
cloudloft_cafe | Cloudloft Cafe | 3×2 |  | Downtown Market Set | near_parent | the_hub (≤100 m) | 10000 | jobs 1; attract 10
juice_bar | Juice Bar | 2×2 |  | Downtown Market Set | near_parent | the_hub (≤100 m) | 10000 | jobs 4; attract 10
park_maintenance_depot_extra_garage | Park Maintenance Depot Extra Garage | 6×5 |  |  | near_parent | park_maintenance_depot (≤40 m) | 6250 | jobs 10
street_ramen | Street Ramen | 2×2 |  | Downtown Market Set | near_parent | the_hub (≤100 m) | 5000 | jobs 4; attract 10
tasty_tofu | Tasty Tofu | 1×1 |  | Downtown Market Set | near_parent | the_hub (≤100 m) | 2000 | jobs 2; attract 5

- upgrades of `park_maintenance_depot` (no separate placement): `park_maintenance_depot_supply_storage`

## Pathways

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
extra_large_pedestrian_overpass | Extra Large Pedestrian Overpass | 3×5 |  | Urban City Stations | over_road |  | 5300 | attract 1
large_pedestrian_overpass | Large Pedestrian Overpass | 3×4 |  | Urban City Stations | over_road |  | 5200 | attract 1
medium_pedestrian_overpass | Medium Pedestrian Overpass | 3×3 |  | Urban City Stations | over_road |  | 5100 | attract 1
small_pedestrian_overpass | Small Pedestrian Overpass | 3×2 |  | Urban City Stations | over_road |  | 5000 | attract 1

- upgrades of `medium_pedestrian_overpass` (no separate placement): `median_staircase`
- upgrades of `large_pedestrian_overpass` (no separate placement): `median_staircase`
- upgrades of `extra_large_pedestrian_overpass` (no separate placement): `median_staircase`

## RoadsParking

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
automated_parking_building | Automated Parking Building | 13×9 | U |  | road |  | 65000 | jobs 12
bicycle_parking_area | Bicycle Parking Area | 1×1 |  |  | road |  | 180 | 
bicycle_parking_hall | Bicycle Parking Hall | 5×2 |  |  | road |  | 1440 | jobs 2
canopy_covered_parking_lot | Canopy-Covered Parking Lot | 6×2 |  |  | road |  | 1800 | 
large_bicycle_parking_hall | Large Bicycle Parking Hall | 5×5 |  |  | road |  | 7800 | jobs 3
large_bicycle_shelter | Large Bicycle Shelter | 2×1 |  |  | road |  | 600 | 
large_bicycle_storage | Large Bicycle Storage | 1×3 |  |  | road |  | 700 | 
large_parking_lot | Large Parking Lot | 10×8 |  |  | road |  | 7000 | jobs 2
long_parking_lot | Long Parking Lot | 3×8 |  |  | road |  | 2200 | 
medium_bicycle_storage | Medium Bicycle Storage | 1×2 |  |  | road |  | 520 | 
medium_gravel_parking_lot | Medium Gravel Parking Lot | 3×6 |  |  | road |  | 1400 | 
medium_parking_lot | Medium Parking Lot | 7×5 |  |  | road |  | 3000 | 
medium_single_row_parking_lot | Medium Single-Row Parking Lot | 12×2 |  |  | road |  | 1600 | 
medium_solar_panel_covered_parking_lot | Medium Solar Panel-Covered Parking Lot | 7×6 |  |  | road |  | 4400 | 
moderate_parking_lot | Moderate Parking Lot | 9×5 |  |  | road |  | 4000 | 
modest_parking_lot | Modest Parking Lot | 5×3 |  |  | road |  | 1800 | 
motorcycle_parking_lot | Motorcycle Parking Lot | 2×2 |  |  | road |  | 740 | 
multi_level_parking_building | Multi-Level Parking Building | 8×6 |  |  | road |  | 40000 | jobs 20
overground_parking_building | Overground Parking Building | 12×14 |  |  | road |  | 30000 | jobs 24
small_bicycle_shelter | Small Bicycle Shelter | 1×1 |  |  | road |  | 200 | 
small_bicycle_storage | Small Bicycle Storage | 1×1 |  |  | road |  | 300 | 
small_gravel_parking_lot | Small Gravel Parking Lot | 6×2 |  |  | road |  | 600 | 
small_parking_building | Small Parking Building | 3×6 |  |  | road |  | 8000 | jobs 10
small_parking_lot | Small Parking Lot | 5×5 |  |  | road |  | 2200 | jobs 2
small_single_row_parking_lot | Small Single-Row Parking Lot | 6×2 |  |  | road |  | 800 | 
small_solar_panel_covered_parking_lot | Small Solar Panel-Covered Parking Lot | 3×6 |  |  | road |  | 2800 | 
tiny_parking_lot | Tiny Parking Lot | 3×2 |  |  | road |  | 740 | 
underground_bicycle_parking_hall | Underground Bicycle Parking Hall | 2×3 |  |  | road |  | 10800 | jobs 2
underground_parking_building | Underground Parking Building | 6×10 |  |  | road |  | 40000 | jobs 24
very_large_parking_lot | Very Large Parking Lot | 18×10 |  |  | road |  | 16000 | jobs 4
wide_parking_lot | Wide Parking Lot | 16×3 |  |  | road |  | 3400 | 
side_entrance | Side Entrance | 1×2 |  |  | near_parent | underground_bicycle_parking_hall (≤40 m) | 1200 | jobs 1

- upgrades of `bicycle_parking_hall` (no separate placement): `additional_storage_space`, `changing_rooms`
- upgrades of `large_bicycle_parking_hall` (no separate placement): `additional_storage_space_bicycleparkinghall02_bicycle_maintenance`, `changing_rooms_bicycleparkinghall02_changing_rooms`, `rear_entrance`
- upgrades of `multi_level_parking_building` (no separate placement): `multi_level_parking_building_additional_levels`
- upgrades of `overground_parking_building` (no separate placement): `parking_hall_car_wash`

END OF FILE catalog/parks-parking-2.md | 60 entries | check 4bf000
