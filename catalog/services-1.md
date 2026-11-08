# CS2 catalog: services (part 1 of 2)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## Administration

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
central_bank | Central Bank | 28×20 | U |  | road |  | 120000 | jobs 80
citizen_service_center | Citizen Service Center | 18×12 |  | Modern Architecture | road |  | 35000 | jobs 12; range m 4000
city_hall | City Hall | 16×20 | U |  | road |  | 80000 | jobs 50
modern_city_hall | Modern City Hall | 14×14 | U | Modern Architecture | road |  | 200000 | jobs 64
terminal_city_bank | Terminal City Bank | 5×14 | U | Skyscrapers | road |  | 150000 | jobs 240; attract 125
welfare_office | Welfare Office | 15×16 |  |  | road |  | 22500 | jobs 50; range m 4000

- upgrades of `city_hall` (no separate placement): `city_hall_court`, `city_hall_planning_offices`
- upgrades of `modern_city_hall` (no separate placement): `extension_wing_rs_cityhall01_ext01`
- upgrades of `terminal_city_bank` (no separate placement): `subway_terminal`

## CommunicationsPost

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
post_office | Post Office | 10×8 |  |  | road |  | 22500 | jobs 40; range m 2000; post vans 20
post_sorting_facility | Post Sorting Facility | 28×28 |  |  | road |  | 40000 | jobs 80
small_post_office | Small Post Office | 3×4 |  |  | road |  | 7500 | jobs 6; range m 1000; post vans 4
westmont_tower | Westmont Tower | 12×14 |  | Skyscrapers | road |  | 35000 | jobs 60; range m 3500; post vans 30; attract 50
post_office_mail_storage_extension | Post Office Mail Storage Extension | 6×4 |  |  | near_parent | post_office (≤40 m) | 2500 | jobs 10
post_office_post_van_garage | Post Office Post Van Garage | 7×6 |  |  | near_parent | post_office (≤40 m) | 3000 | jobs 20; post vans 10
post_sorting_facility_mail_storage_extension | Post Sorting Facility Mail Storage Extension | 17×11 |  |  | near_parent | post_sorting_facility (≤80 m) | 5000 | jobs 20

- upgrades of `small_post_office` (no separate placement): `mail_storage_extension`
- upgrades of `westmont_tower` (no separate placement): `pack10_postoffice01_ext01`, `pack10_postoffice01_ext02`
- upgrades of `post_sorting_facility` (no separate placement): `post_sorting_facility_automated_sorting`, `post_sorting_facility_extra_loading_ramps`

## CommunicationsTelecom

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
modern_telecom_building | Modern Telecom Building | 9×6 |  | Modern Architecture | road |  | 27500 | jobs 70; telecom range m 7500; network 40000
radio_mast | Radio Mast | 4×3 |  |  | road |  | 5000 | jobs 10; telecom range m 1000; network 3000
satellite_uplink | Satellite Uplink | 7×4 | U |  | road |  | 160000 | jobs 30
server_farm | Server Farm | 24×18 |  |  | road |  | 20000 | jobs 40; telecom range m 2000; network 30000
telecom_tower | Telecom Tower | 7×7 |  |  | road |  | 12500 | jobs 30; telecom range m 5000; network 20000

- upgrades of `radio_mast` (no separate placement): `radio_mast_bandwidth_increase`, `radio_mast_wireless_network_antenna`
- upgrades of `server_farm` (no separate placement): `server_farm_fiber_optic_cable`, `server_farm_server_upgrade`

## Deathcare

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
cemetery | Cemetery | 16×25 |  |  | road |  | 27500 | jobs 18; hearses 15; wellbeing +3 within 300 m
crematorium | Crematorium | 8×10 |  |  | road |  | 22500 | jobs 20; hearses 10
small_cemetery | Small Cemetery | 14×6 |  |  | road |  | 12000 | jobs 10; hearses 8; wellbeing +2 within 200 m
additional_burial_lot | Additional Burial Lot | 6×6 |  |  | near_parent | small_cemetery (≤100 m) | 4000 | jobs 4
cemetery_columbarium | Cemetery Columbarium | 8×8 |  |  | near_parent | cemetery (≤80 m) | 9000 | jobs 8
cemetery_mausoleum | Cemetery Mausoleum | 6×6 |  |  | near_parent | cemetery (≤80 m) | 3500 | jobs 3; attract 20
cemetery_temple | Cemetery Temple | 8×8 |  |  | near_parent | cemetery (≤80 m) | 5500 | jobs 6; wellbeing +2 within 300 m
crematorium_hearse_garage | Crematorium Hearse Garage | 4×6 |  |  | near_parent | crematorium (≤40 m) | 5000 | jobs 10; hearses 5
small_columbarium | Small Columbarium | 3×3 |  |  | near_parent | small_cemetery (≤100 m) | 3000 | jobs 2

- upgrades of `crematorium` (no separate placement): `crematorium_additional_incinerator`, `crematorium_refrigerator_expansion`

## DisasterControl

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
early_disaster_warning_system | Early Disaster Warning System | 10×7 | U |  | road |  | 120000 | jobs 40
large_emergency_shelter | Large Emergency Shelter | 5×7 |  |  | road |  | 30000 | jobs 28; range m 3000; shelter 25000
small_emergency_shelter | Small Emergency Shelter | 1×2 |  |  | road |  | 7500 | range m 1500; shelter 1000

- upgrades of `small_emergency_shelter` (no separate placement): `emergency_shelter_advanced_air_recycling`, `emergency_shelter_extra_consumables`

## Fire & Rescue

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
city_fire_house | City Fire House | 3×4 |  |  | road |  | 12000 | jobs 10; range m 5000; fire engines 6
community_fire_house | Community Fire House | 6×6 |  | Modern Architecture | road |  | 10000 | jobs 10; range m 5000; fire engines 3
community_fire_station | Community Fire Station | 12×6 |  | Modern Architecture | road |  | 80000 | jobs 30; range m 10000; fire engines 7
fire_house | Fire House | 5×5 |  |  | road |  | 10000 | jobs 12; range m 5000; fire engines 4
fire_station | Fire Station | 14×18 |  |  | road |  | 117500 | jobs 120; range m 10000; fire engines 10
firefighting_helicopter_depot | Firefighting Helicopter Depot | 11×16 |  |  | road |  | 72500 | jobs 48
firewatch_tower | Firewatch Tower | 2×2 |  |  | road |  | 12500 | 
urban_fire_station | Urban Fire Station | 6×5 |  | Urban Promenades | road |  | 90000 | jobs 60; range m 10000; fire engines 10
additional_fire_engine_hall | Additional Fire Engine Hall | 6×4 |  | Modern Architecture | near_parent | community_fire_station (≤60 m) | 42500 | jobs 16; fire engines 5

END OF FILE catalog/services-1.md | 49 entries | check f3531b
