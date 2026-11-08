# CS2 catalog: transport 1

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## TransportationAir

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
airport | Airport | 142×47 |  |  | road |  | 50000 | jobs 80
chirpx_space_center | ChirpX Space Center | 36×46 | U |  | road |  | 240000 | jobs 100; attract 200; vehicles 1
international_airport | International Airport | 170×158 | U |  | road |  | 200000 | jobs 250

- upgrades of `airport` (no separate placement): `airport_business_terminal`, `airport_cargo_train_terminal`, `airport_services`

## TransportationRoad

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
bus_depot | Bus Depot | 18×9 |  |  | road |  | 31000 | jobs 40; vehicles 25
bus_station | Bus Station | 13×13 |  |  | road |  | 28000 | jobs 28
city_bus_station | City Bus Station | 8×10 |  |  | road |  | 21000 | jobs 12
city_center_bus_station | City Center Bus Station | 32×16 | U | Urban City Stations | road |  | 35000 | jobs 42; range m 6000; attract 10; vehicles 8
compact_bus_depot | Compact Bus Depot | 6×12 |  | Urban City Stations | road |  | 15000 | jobs 20; vehicles 10
large_city_bus_station | Large City Bus Station | 18×14 |  | Urban City Stations | road |  | 28000 | jobs 28; range m 4000; attract 5
large_storage_yard | Large Storage Yard | 9×23 |  | Bridges & Ports | road |  | 18750 | jobs 24
local_bus_station | Local Bus Station | 12×13 |  | Modern Architecture | road |  | 33000 | jobs 20
medium_storage_yard | Medium Storage Yard | 9×14 |  | Bridges & Ports | road |  | 9375 | jobs 12
small_bus_station | Small Bus Station | 4×6 |  |  | road |  | 14000 | 
small_city_bus_station | Small City Bus Station | 8×7 |  | Urban City Stations | road |  | 16000 | jobs 9; vehicles 2
small_storage_yard | Small Storage Yard | 3×14 |  | Bridges & Ports | road |  | 3750 | jobs 6
small_taxi_depot | Small Taxi Depot | 2×6 |  |  | road |  | 3500 | jobs 8; vehicles 8
taxi_depot | Taxi Depot | 9×7 |  |  | road |  | 10000 | jobs 25; vehicles 25
bus_depot_extra_garage | Bus Depot Extra Garage | 7×7 |  |  | near_parent | bus_depot (≤40 m) | 15000 | jobs 10; vehicles 10
bus_service_station | Bus service station | 6×4 |  | Modern Architecture | near_parent | local_bus_station (≤65 m) | 12000 | jobs 8
station_services | Station Services | 3×2 |  |  | near_parent | small_bus_station (≤20 m) | 5000 | jobs 2
taxi_depot_taxi_garage | Taxi Depot Taxi Garage | 3×3 |  |  | near_parent | taxi_depot (≤40 m) | 3200 | jobs 10; vehicles 10

- upgrades of `city_bus_station` (no separate placement): `additional_parking_levels`, `subway_interface`, `taxi_stop_busstation03_taxi_stop`
- upgrades of `bus_depot` (no separate placement): `bus_depot_electric_bus_maintenance`
- upgrades of `bus_station` (no separate placement): `bus_station_extra_platforms`, `bus_station_recharging_station`, `bus_station_taxi_stop`
- upgrades of `compact_bus_depot` (no separate placement): `electric_bus_maintenance_upgrade`
- upgrades of `small_bus_station` (no separate placement): `extra_platforms`, `taxi_stop`
- upgrades of `large_city_bus_station` (no separate placement): `extra_platforms_pack7_busstation02_ext01`, `subway_interface_pack7_subwayinterface01`
- upgrades of `city_center_bus_station` (no separate placement): `extra_platforms_pack7_busstation03_ext01`, `subway_interface_pack7_subwayinterface01`
- upgrades of `local_bus_station` (no separate placement): `extra_platforms_rs_busstation01_ext01`
- upgrades of `small_taxi_depot` (no separate placement): `small_taxi_depot_dispatch_center`, `small_taxi_depot_electric_taxis`, `small_taxi_depot_garage_extension`
- upgrades of `sunken_bypass_train_station` (no separate placement): `subway_interface_pack7_subwayinterface01`
- upgrades of `elevated_bypass_train_station` (no separate placement): `subway_interface_pack7_subwayinterface01`
- upgrades of `tram_terminal_plaza` (no separate placement): `subway_interface_pack7_subwayinterface01`
- upgrades of `taxi_depot` (no separate placement): `taxi_depot_dispatch_center`, `taxi_depot_electric_taxis`

## TransportationSubway

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
compact_subway_yard | Compact Subway Yard | 42×8 |  | Urban City Stations | track |  | 15000 | jobs 18; vehicles 6
elevated_bypass_subway_station | Elevated Bypass Subway Station | 6×6 |  | Urban City Stations | track |  | 15000 | jobs 10
elevated_subway_station | Elevated Subway Station | 12×7 |  |  | track |  | 15000 | jobs 10
modern_metro_station | Modern Metro Station | 2×6 |  | Modern Architecture | track |  | 10000 | jobs 4
modern_subway_station | Modern Subway Station | 25×6 |  | Modern Architecture | track |  | 6600 | jobs 3
overground_subway_station | Overground Subway Station | 21×6 |  |  | track |  | 10000 | 
small_elevated_subway_station | Small Elevated Subway Station | 19×1 |  |  | track |  | 10000 | 
small_overground_subway_station | Small Overground Subway Station | 19×4 |  |  | track |  | 5000 | 
small_subway_plaza | Small Subway Plaza | 6×6 |  | Urban City Stations | track |  | 28000 | jobs 5; range m 4000; attract 5
subway_yard | Subway Yard | 44×20 |  |  | track |  | 24000 | jobs 30; vehicles 10
sunken_subway_park | Sunken Subway Park | 24×24 | U | Urban City Stations | track |  | 35000 | jobs 18; range m 10000; attract 50
terminal_subway_yard | Terminal Subway Yard | 4×23 |  |  | track |  | 12000 | jobs 15; vehicles 5
underground_subway_station | Underground Subway Station | 3×2 |  |  | track |  | 20000 | 
extra_tracks_terminal | Extra Tracks - Terminal | 4×23 |  |  | near_parent | terminal_subway_yard (≤200 m) | 4000 | jobs 2; vehicles 2
extra_tracks_through_tracks | Extra Tracks - Through Tracks | 23×4 |  |  | near_parent | terminal_subway_yard (≤200 m) | 4000 | jobs 2; vehicles 2
maintenance_hall_terminal | Maintenance Hall - Terminal | 4×23 |  |  | near_parent | terminal_subway_yard (≤200 m) | 12000 | jobs 8
subway_yard_maintenance_hall | Subway Yard Maintenance Hall | 30×7 |  |  | near_parent | subway_yard (≤80 m) | 17000 | jobs 18

- upgrades of `sunken_subway_park` (no separate placement): `architectural_roof`, `extra_platforms_pack7_subwaystation03_ext02`
- upgrades of `modern_metro_station` (no separate placement): `entrance_roof`, `extra_platforms_rs_subwaystation01_ext02`
- upgrades of `elevated_bypass_subway_station` (no separate placement): `extra_platforms_pack7_subwaystation02_ext01`, `small_bus_terminal`
- upgrades of `compact_subway_yard` (no separate placement): `extra_tracks_pack7_subwayyard01_ext01`
- upgrades of `small_subway_plaza` (no separate placement): `lower_extra_platforms`, `small_bus_terminal`
- upgrades of `modern_subway_station` (no separate placement): `platform_roof_rs_subwaystation02_ext01`, `underground_subway_interface_rs_subwaystation02_ext02`
- upgrades of `underground_subway_station` (no separate placement): `subway_station_1_station_services`
- upgrades of `overground_subway_station` (no separate placement): `subway_station_2_station_services`
- upgrades of `subway_yard` (no separate placement): `subway_yard_extra_rails`

## TransportationTram

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
compact_refurbished_tram_depot | Compact Refurbished Tram Depot | 10×12 |  | Urban City Stations | track |  | 11500 | jobs 20; vehicles 12
large_tram_plaza | Large Tram Plaza | 12×12 |  | Urban City Stations | track |  | 28000 | jobs 28; range m 3500; attract 10
small_tram_plaza | Small Tram Plaza | 4×6 |  | Urban City Stations | track |  | 10000 | jobs 6; range m 4000; attract 5
tram_depot | Tram Depot | 19×17 |  |  | track |  | 11500 | jobs 20; vehicles 10
tram_junction_station | Tram Junction Station | 6×6 |  |  | track |  | 14000 | 
tram_loop_station | Tram Loop Station | 6×6 |  |  | track |  | 14000 | 
tram_parallel_station | Tram Parallel Station | 6×6 |  |  | track |  | 14000 | 
tram_terminal_plaza | Tram Terminal Plaza | 18×12 | U | Urban City Stations | track |  | 35000 | jobs 35; range m 5000; attract 5

- upgrades of `compact_refurbished_tram_depot` (no separate placement): `new_tram_shed`
- upgrades of `tram_depot` (no separate placement): `tram_depot_garage_extension`
- upgrades of `large_tram_plaza` (no separate placement): `tram_yard`

END OF FILE catalog/transport-1.md | 84 entries | check ec5652
