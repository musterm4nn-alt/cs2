# CS2 catalog: transport 2

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## TransportationFerry

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
ferry_depot | Ferry Depot | 24×22 |  | Bridges & Ports | water |  | 21000 | jobs 42; vehicles 20
ferry_stop_quay | Ferry Stop - Quay | 2×1 |  | Bridges & Ports | water |  |  | 
ferry_stop_shoreline | Ferry Stop - Shoreline | 4×3 |  | Bridges & Ports | water |  |  | 
ferry_terminal | Ferry Terminal | 11×8 |  | Bridges & Ports | water |  | 30000 | jobs 24

- upgrades of `ferry_terminal` (no separate placement): `bus_terminal`
- upgrades of `ferry_depot` (no separate placement): `extra_hall`

## TransportationShip

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
cargo_harbor | Cargo Harbor | 56×33 |  |  | water |  | 33500 | jobs 75
harbor | Harbor | 38×11 |  |  | water |  | 30000 | jobs 50
large_port | Large Port | 18×16 |  | Bridges & Ports | water |  | 50000 | jobs 75
medium_port | Medium Port | 10×10 |  | Bridges & Ports | water |  | 25000 | jobs 35
small_port | Small Port | 4×4 |  | Bridges & Ports | water |  | 12500 | jobs 15
cargo_harbor_warehouses | Cargo Harbor Warehouses | 19×13 |  |  | near_parent | cargo_harbor (≤100 m) | 12500 | jobs 12
container_crane | Container Crane | 4×4 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 15000 | jobs 20
container_crane_striped | Container Crane (Striped) | 4×4 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 15000 | jobs 20
emergency_response | Emergency Response | 4×3 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 12500 | jobs 12; range m 3750
employee_canteen | Employee Canteen | 6×3 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 8750 | jobs 9
intermodal_train_terminal | Intermodal Train Terminal | 42×6 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 20000 | jobs 20
large_bulk_storage_yard | Large Bulk Storage Yard | 17×48 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 44000 | jobs 20
large_cargo_container_yard | Large Cargo Container Yard | 42×4 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 13750 | jobs 16
large_cargo_warehouse | Large Cargo Warehouse | 42×10 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 25000 | jobs 24
large_tank_farm | Large Tank Farm | 10×6 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 4700 | jobs 8
medium_auxiliary_port_gate | Medium Auxiliary Port Gate | 3×3 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 5000 | jobs 8
medium_bulk_storage_yard | Medium Bulk Storage Yard | 8×26 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 11000 | jobs 10
medium_cargo_container_yard | Medium Cargo Container Yard | 21×4 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 6875 | jobs 8
medium_cargo_warehouse | Medium Cargo Warehouse | 21×10 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 12500 | jobs 12
medium_tank_farm | Medium Tank Farm | 6×8 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 3750 | jobs 6
passenger_terminal | Passenger Terminal | 6×11 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 25000 | jobs 35
port_security | Port Security | 4×4 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 14250 | jobs 12; range m 3750
small_auxiliary_port_gate | Small Auxiliary Port Gate | 2×2 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 2500 | jobs 4
small_bulk_storage_yard | Small Bulk Storage Yard | 5×8 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 2200 | jobs 4
small_cargo_container_yard | Small Cargo Container Yard | 14×4 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 3750 | jobs 6
small_cargo_warehouse | Small Cargo Warehouse | 14×10 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 8750 | jobs 9
small_tank_farm | Small Tank Farm | 2×2 |  | Bridges & Ports | near_parent | small_port, medium_port, large_port (≤1000 m) | 300 | jobs 1

- upgrades of `cargo_harbor` (no separate placement): `cargo_harbor_cargo_cranes`, `cargo_harbor_railway_connection`
- upgrades of `medium_port` (no separate placement): `customs_office`
- upgrades of `large_port` (no separate placement): `customs_office_cargoharborcomplex03_ext01`, `reach_stacker_garage`
- upgrades of `harbor` (no separate placement): `harbor_extra_pier`, `harbor_transit_terminal`

## TransportationTrain

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
cargo_train_terminal | Cargo Train Terminal | 38×17 |  |  | track |  | 15000 | jobs 32
cargo_transfer_station | Cargo Transfer Station | 34×20 |  |  | track |  | 20000 | jobs 32
central_train_station | Central Train Station | 28×26 |  | Modern Architecture | track |  | 42500 | jobs 16
city_central_train_station | City Central Train Station | 18×90 | U | Urban City Stations | track |  | 35000 | jobs 60; range m 3600; attract 15; vehicles 8
compact_rail_yard | Compact Rail Yard | 7×44 |  | Urban City Stations | track |  | 9000 | jobs 18; vehicles 7
elevated_bypass_train_station | Elevated Bypass Train Station | 38×12 |  | Urban City Stations | track |  | 18000 | jobs 10
local_train_station | Local Train Station | 28×14 |  | Modern Architecture | track |  | 12000 | jobs 7
mediterranean_train_station | Mediterranean Train Station | 12×37 |  | Mediterranean Heritage | track |  | 12000 | jobs 10
medium_train_station | Medium Train Station | 25×5 |  |  | track |  | 10000 | jobs 2
rail_yard | Rail Yard | 44×28 |  |  | track |  | 15000 | jobs 30; vehicles 10
railway_depot | Railway Depot | 34×15 |  |  | track |  | 12000 | jobs 24; vehicles 8
small_train_station | Small Train Station | 25×4 |  |  | track |  | 7500 | 
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

END OF FILE catalog/transport-2.md | 89 entries | check 7198c2
