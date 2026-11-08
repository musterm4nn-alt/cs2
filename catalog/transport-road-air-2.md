# CS2 catalog: transport road air (part 2 of 2)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## TransportationSubway (continued)

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
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

END OF FILE catalog/transport-road-air-2.md | 19 entries | check 055938
