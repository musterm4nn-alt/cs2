# CS2 catalog: services

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
fire_house_disaster_facility | Fire House Disaster Facility | 3×2 |  | Modern Architecture | near_parent | community_fire_house (≤40 m) | 1850 | jobs 3; range m 5000
fire_house_watch_tower | Fire House Watch Tower | 2×2 |  | Modern Architecture | near_parent | community_fire_house (≤80 m) | 2280 | jobs 2
fire_station_disaster_response_unit | Fire Station Disaster Response Unit | 7×7 |  |  | near_parent | fire_station (≤40 m) | 37500 | jobs 40
fire_station_watch_tower | Fire Station Watch Tower | 2×2 |  | Modern Architecture | near_parent | community_fire_station (≤80 m) | 2560 | jobs 2

- upgrades of `urban_fire_station` (no separate placement): `disaster_response_unit`, `training_tower`
- upgrades of `fire_house` (no separate placement): `fire_house_garage_extension`
- upgrades of `community_fire_house` (no separate placement): `fire_house_garage_extension_rs_firehouse01_ext01`
- upgrades of `fire_station` (no separate placement): `fire_station_garage_extension`, `fire_station_helipad`, `fire_station_training_facilities`
- upgrades of `community_fire_station` (no separate placement): `fire_station_gate_with_helipad`

## Healthcare

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
disease_control_center | Disease Control Center | 25×20 | U |  | road |  | 175000 | jobs 100; patients 250
health_research_institute | Health Research Institute | 21×9 | U |  | road |  | 80000 | jobs 100
hospital | Hospital | 23×10 |  |  | road |  | 225000 | jobs 120; range m 7500; patients 500
medical_clinic | Medical Clinic | 11×6 |  |  | road |  | 20000 | jobs 18; range m 5000; patients 100
modern_hospital | Modern Hospital | 16×8 |  | Modern Architecture | road |  | 180000 | jobs 32; range m 7500; patients 500
modern_medical_clinic | Modern Medical Clinic | 6×7 |  | Modern Architecture | road |  | 18000 | jobs 12; range m 5000; patients 90
small_medical_clinic | Small Medical Clinic | 5×5 |  |  | road |  | 10000 | jobs 6; range m 2500; patients 25
urban_medical_center | Urban Medical Center | 9×5 |  | Urban Promenades | road |  | 180000 | jobs 60; range m 5000; patients 500
additional_clinic_center | Additional Clinic Center | 3×3 |  | Modern Architecture | near_parent | modern_medical_clinic (≤50 m) | 4800 | jobs 12; range m 5000; patients 20
medical_center | Medical Center | 5×6 |  | Modern Architecture | near_parent | modern_hospital (≤88 m) | 80000 | jobs 18; range m 5500; patients 60
medical_clinic_extension_wing | Medical Clinic Extension Wing | 6×3 |  |  | near_parent | medical_clinic (≤40 m) | 12500 | jobs 8; patients 25

- upgrades of `urban_medical_center` (no separate placement): `ambulance_depot`, `specialized_clinics`
- upgrades of `modern_hospital` (no separate placement): `extension_tower`
- upgrades of `hospital` (no separate placement): `hospital_helipad`, `hospital_specialized_treatment_ward`, `hospital_trauma_center`
- upgrades of `medical_clinic` (no separate placement): `medical_clinic_ambulance_depot`
- upgrades of `modern_medical_clinic` (no separate placement): `specialized_treatment_wing`

## Police

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
central_intelligence_bureau | Central Intelligence Bureau | 34×34 | U |  | road |  | 160000 | jobs 200; patrol cars 25
city_police_station | City Police Station | 6×6 |  |  | road |  | 25000 | jobs 20; range m 5000; patrol cars 16
mediterranean_police_station | Mediterranean Police Station | 9×9 |  | Mediterranean Heritage | road |  | 30000 | jobs 50; range m 5000; patrol cars 4
modern_police_station | Modern Police Station | 8×10 |  | Modern Architecture | road |  | 18000 | jobs 16; range m 6000; patrol cars 8
police_headquarters | Police Headquarters | 18×20 |  |  | road |  | 155000 | jobs 120; range m 10000; patrol cars 20
police_station | Police Station | 12×7 |  |  | road |  | 19000 | jobs 18; range m 5000; patrol cars 6
prison | Prison | 26×24 |  |  | road |  | 100000 | jobs 80; crime -0.05 within 800 m
small_police_station | Small Police Station | 5×5 |  |  | road |  | 15000 | jobs 8; range m 5000; patrol cars 6
urban_police_headquarters | Urban Police Headquarters | 7×13 |  | Urban Promenades | road |  | 140000 | jobs 90; range m 10000; patrol cars 10
investigating_team_building | Investigating Team Building | 5×4 |  | Modern Architecture | near_parent | modern_police_station (≤88 m) | 12500 | jobs 15; range m 3000; patrol cars 4
police_headquarters_extra_jails | Police Headquarters Extra Jails | 6×8 |  |  | near_parent | police_headquarters (≤60 m) | 30000 | jobs 15
prison_wing | Prison wing | 14×14 |  |  | near_parent | prison (≤60 m) | 40000 | jobs 30
small_jail | Small Jail | 5×4 |  | Modern Architecture | near_parent | modern_police_station (≤88 m) | 11100 | jobs 4; range m 3000

- upgrades of `mediterranean_police_station` (no separate placement): `garage_and_jail_extension`
- upgrades of `urban_police_headquarters` (no separate placement): `garage_extension`, `helipad_ubpr_policehq01_ext01`
- upgrades of `city_police_station` (no separate placement): `helipad`
- upgrades of `police_headquarters` (no separate placement): `police_headquarters_garage_extension`, `police_headquarters_helipad`
- upgrades of `police_station` (no separate placement): `police_station_garage_extension`
- upgrades of `prison` (no separate placement): `prison_library_and_recreation_center`
- upgrades of `modern_police_station` (no separate placement): `station_gate_with_helipad`

## Research

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
geological_research_center | Geological Research Center | 12×12 | U |  | road |  | 115000 | jobs 64
large_hadron_collider | Large Hadron Collider | 54×64 | U |  | road |  | 200000 | jobs 100
radio_telescope | Radio Telescope | 8×8 | U |  | road |  | 160000 | jobs 30

END OF FILE catalog/services.md | 112 entries | check 826349
