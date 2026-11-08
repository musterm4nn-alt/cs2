# CS2 catalog: transport rail water (part 2 of 2)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## TransportationTrain (continued)

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
sunken_bypass_train_station | Sunken Bypass Train Station | 38×12 |  | Urban City Stations | track |  | 15000 | jobs 10
terminus_station | Terminus Station | 15×30 |  |  | track |  | 18500 | jobs 20
train_station | Train Station | 25×14 |  |  | track |  | 18500 | jobs 20
cargo_train_terminal_storage_warehouse | Cargo Train Terminal Storage Warehouse | 16×12 |  |  | near_parent | cargo_train_terminal | 6000 | jobs 12
extra_tracks | Extra Tracks | 34×12 |  |  | near_parent | railway_depot (≤200 m) | 10000 | jobs 8; vehicles 8
extra_tracks_pack7_railyard01_ext01 | Extra tracks | 44×5 |  | Urban City Stations | near_parent | compact_rail_yard (≤80 m) | 6000 | jobs 12; vehicles 4
office_building | Office Building | 7×5 |  | Modern Architecture | near_parent | central_train_station (≤88 m) | 18500 | jobs 72
storage_warehouse_with_extra_tracks | Storage Warehouse with Extra Tracks | 26×7 |  |  | near_parent | cargo_transfer_station (≤200 m) | 12500 | jobs 6

- upgrades of `city_central_train_station` (no separate placement): `botanical_gardens`, `subway_interface_pack7_trainstation03_ext03`, `tunnel_link`
- upgrades of `sunken_bypass_train_station` (no separate placement): `bus_terminal_pack7_businterface01`, `island_platform_pack7_trainstation01_ext01`
- upgrades of `elevated_bypass_train_station` (no separate placement): `bus_terminal_pack7_businterface01`, `island_platform`
- upgrades of `terminus_station` (no separate placement): `bus_terminal_trainstationterminus01_bus_terminal`, `extra_platforms_trainstationterminus01_extra_platforms`, `station_services_trainstationterminus01_services`, `tram_terminal`
- upgrades of `cargo_train_terminal` (no separate placement): `cargo_train_terminal_extra_tracks`
- upgrades of `central_train_station` (no separate placement): `elevated_concourse`, `underground_subway_interface`
- upgrades of `mediterranean_train_station` (no separate placement): `extra_platforms_ccp5_trainstation_ext01`, `train_shed`
- upgrades of `local_train_station` (no separate placement): `extra_platforms_rs_trainstation02_ext02`, `modern_train_station_entrance`, `platform_roof`, `underground_subway_interface_rs_trainstation02_ext04`
- upgrades of `railway_depot` (no separate placement): `maintenance_hall`
- upgrades of `rail_yard` (no separate placement): `rail_yard_extra_rails`, `rail_yard_maintenance_hall`
- upgrades of `medium_train_station` (no separate placement): `station_services_trainstation03_services`, `ticket_machines_trainstation03_ticket_machines`
- upgrades of `small_train_station` (no separate placement): `ticket_machines`
- upgrades of `train_station` (no separate placement): `train_station_extra_platforms`, `train_station_services`, `train_station_subway_interface`, `train_station_taxi_stop`

END OF FILE catalog/transport-rail-water-2.md | 21 entries | check dab1ef
