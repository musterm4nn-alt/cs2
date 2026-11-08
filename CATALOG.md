# CS2 asset catalog (compact)

Generated from assets.json (extracted from the game files). One row per asset.
Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.

## Zones (lot = width×depth range of buildings that grow there; zoning reaches at most 6 cells from a road)

id | name | family | lot sizes | themes | DLC
---|---|---|---|---|---
commercial_high | High Density Business | commercial | 2×2 to 6×6 | EU/NA | 
commercial_low | Low Density Business | commercial | 2×2 to 6×6 | EU/NA | 
commercial_low_waterfront | Low Density Waterfront Business | commercial | 2×2 to 5×6 | EU/NA | Bridges & Ports
dragon_gate_low_density_business | Dragon Gate Low Density Business | commercial | 2×2 to 6×6 |  | Dragon Gate
industrial_manufacturing | Industrial Manufacturing | industrial | 2×2 to 6×6 |  | 
high_density_office_evolution | High Density Office Evolution | office | 2×2 to 5×6 |  | Office Evolution
office_high | High Density Offices | office | 2×2 to 6×6 |  | 
office_low | Low Density Offices | office | 2×2 to 6×6 |  | 
mediterranean_heritage_medium_density_housing | Mediterranean Heritage Medium Density Housing | residential | 2×2 to 3×3 |  | Mediterranean Heritage
residential_high | High Density Housing | residential | 2×2 to 6×6 | EU/NA | 
residential_low | Low Density Housing | residential | 2×2 to 4×6 | EU/NA | 
residential_low_waterfront | Low Density Waterfront Housing | residential | 2×2 to 4×6 | EU/NA | 
residential_lowrent | Low Rent Housing | residential | 2×2 to 6×6 |  | 
residential_medium | Medium Density Housing | residential | 2×2 to 6×6 | EU/NA | 
residential_medium_row | Medium Density Row Housing | residential | 1×2 to 1×6 | EU/NA | 
residential_mixed | Mixed Housing | residential | 2×2 to 6×6 | EU/NA | 
residential_mixed_old_town | Mixed Old Town-Style Apartment Buildings | residential | 1×2 to 4×4 | EU/NA | 
urban_promenades_mixed_housing | Urban Promenades Mixed Housing | residential | 2×2 to 4×6 |  | Urban Promenades

## Roads and tracks (width from the game's road sections)

id | name | category | lanes | km/h | width m | width cells | zoning | building access
---|---|---|---|---|---|---|---|---
one_lane_one_way_highway | One-Lane One-Way Highway | highway | 1 | 80 | 8 | 1 | no | no
two_lane_highway_one_way_suspension_bridge | Two-Lane Highway One-Way Suspension Bridge | highway | 2 | 100 | 12 | 1.5 | no | no
two_lane_highway_truss_arch_bridge | Two-Lane Highway Truss Arch Bridge | highway | 2 | 100 | 12 | 1.5 | no | no
two_lane_one_way_highway | Two-Lane One-Way Highway | highway | 2 | 120 | 12 | 1.5 | no | no
two_lane_two_way_highway | Two-Lane Two-Way Highway | highway | 2 | 100 | 12 | 1.5 | no | no
three_lane_highway_double_decked_suspension_bridge | Three-Lane Highway Double-Decked Suspension Bridge | highway | 3 | 100 | 16 | 2 | no | no
three_lane_highway_one_way_suspension_bridge | Three-Lane Highway One-Way Suspension Bridge | highway | 3 | 100 | 16 | 2 | no | no
three_lane_one_way_highway | Three-Lane One-Way Highway | highway | 3 | 120 | 16 | 2 | no | no
three_lane_two_way_highway | Three-Lane Two-Way Highway | highway | 3 | 100 | 16 | 2 | no | no
grand_bridge | Grand Bridge | highway | 4 | 80 | 19 | 2.375 | no | no
four_lane_asymmetric_highway | Four-Lane Asymmetric Highway | highway | 4 | 100 | 20 | 2.5 | no | no
four_lane_highway_double_train_track_double_decked_extradosed_bridge | Four-Lane Highway Double Train Track Double-Decked Extradosed Bridge | highway | 4 | 100 | 20 | 2.5 | no | no
four_lane_highway_double_train_track_double_decked_lift_bridge | Four-Lane Highway Double Train Track Double-Decked Lift Bridge | highway | 4 | 80 | 20 | 2.5 | no | no
four_lane_highway_one_way_suspension_bridge | Four-Lane Highway One-Way Suspension Bridge | highway | 4 | 100 | 20 | 2.5 | no | no
four_lane_one_way_highway | Four-Lane One-Way Highway | highway | 4 | 120 | 20 | 2.5 | no | no
four_lane_two_way_highway | Four-Lane Two-Way Highway | highway | 4 | 100 | 20 | 2.5 | no | no
five_lane_asymmetric_highway | Five-Lane Asymmetric Highway | highway | 5 | 100 | 24 | 3 | no | no
five_lane_highway_one_way_suspension_bridge | Five-Lane Highway One-Way Suspension Bridge | highway | 5 | 100 | 24 | 3 | no | no
five_lane_one_way_highway | Five-Lane One-Way Highway | highway | 5 | 120 | 24 | 3 | no | no
golden_gate_bridge | Golden Gate Bridge | highway | 6 | 80 | 25 | 3.125 | no | no
six_lane_drawbridge | Six-Lane Drawbridge | large | 6 | 50 | 25 | 3.125 | no | yes
six_lane_one_way_suspension_bridge | Six-Lane One-Way Suspension Bridge | large | 6 | 40 | 25 | 3.125 | no | yes
six_lane_suspension_bridge | Six-Lane Suspension Bridge | large | 6 | 40 | 25 | 3.125 | no | yes
seven_lane_asymmetric_road | Seven-Lane Asymmetric Road | large | 7 | 50 | 32 | 4 | yes | yes
seven_lane_asymmetric_road_large_road_asymmetric | Seven-Lane Asymmetric Road | large | 7 | 50 | 32 | 4 | yes | yes
seven_lane_one_way_road | Seven-Lane One-Way Road | large | 7 | 50 | 32 | 4 | yes | yes
six_lane_asymmetric_road | Six-Lane Asymmetric Road | large | 6 | 50 | 32 | 4 | yes | yes
six_lane_divided_extradosed_bridge | Six-Lane Divided Extradosed Bridge | large | 6 | 60 | 32 | 4 | no | yes
six_lane_divided_road | Six-Lane Divided Road | large | 6 | 60 | 32 | 4 | yes | yes
six_lane_one_way_road | Six-Lane One-Way Road | large | 6 | 50 | 32 | 4 | yes | yes
six_lane_road | Six-Lane Road | large | 6 | 50 | 32 | 4 | yes | yes
eight_lane_divided_cable_stayed_bridge | Eight-Lane Divided Cable-Stayed Bridge | large | 8 | 60 | 40 | 5 | no | yes
eight_lane_divided_road | Eight-Lane Divided Road | large | 8 | 60 | 40 | 5 | yes | yes
four_lane_drawbridge | Four-Lane Drawbridge | medium | 4 | 50 | 19 | 2.375 | no | yes
four_lane_extradosed_bridge | Four-Lane Extradosed Bridge | medium | 4 | 50 | 19 | 2.375 | no | yes
four_lane_one_way_extradosed_bridge | Four-Lane One-Way Extradosed Bridge | medium | 4 | 50 | 19 | 2.375 | no | yes
four_lane_tied_arch_bridge | Four-Lane Tied Arch Bridge | medium | 4 | 40 | 19 | 2.375 | no | yes
four_lane_truss_arch_bridge | Four-Lane Truss Arch Bridge | medium | 4 | 50 | 19 | 2.375 | no | yes
two_lane_four_lane_double_decked_extradosed_bridge | Two-Lane + Four-Lane Double-Decked Extradosed Bridge | medium | 4 | 50 | 19 | 2.375 | no | yes
five_lane_asymmetric_road | Five-Lane Asymmetric Road | medium | 5 | 50 | 24 | 3 | yes | yes
five_lane_one_way_road | Five-Lane One-Way Road | medium | 5 | 50 | 24 | 3 | yes | yes
four_lane_asymmetric_road | Four-Lane Asymmetric Road | medium | 4 | 50 | 24 | 3 | yes | yes
four_lane_divided_road | Four-Lane Divided Road | medium | 4 | 50 | 24 | 3 | yes | yes
four_lane_one_way_road | Four-Lane One-Way Road | medium | 4 | 50 | 24 | 3 | yes | yes
four_lane_road | Four-Lane Road | medium | 4 | 50 | 24 | 3 | yes | yes
wide_quay_with_four_lane_road | Wide Quay With Four-Lane Road | medium | 4 | 50 | 24 | 3 | yes | yes
wide_quay_with_four_lane_road_quaylarge02 | Wide Quay With Four-Lane Road | medium | 4 | 50 | 24 | 3 | yes | yes
wide_quay_with_four_lane_road_quaylarge03 | Wide Quay With Four-Lane Road | medium | 4 | 50 | 24 | 3 | yes | yes
four_lane_angled_parking_road | Four-Lane Angled Parking Road | medium | 4 | 50 | 32 | 4 | yes | yes
four_lane_perpendicular_parking_road | Four-Lane Perpendicular Parking Road | medium | 4 | 50 | 32 | 4 | yes | yes
one_lane_one_way_port_gate_road | One-Lane One-Way Port Gate Road | port | 1 | 40 | 8 | 1 | yes | yes
two_lane_one_way_port_gate_road | Two-Lane One-Way Port Gate Road | port | 2 | 40 | 16 | 2 | yes | yes
two_lane_port_gate_road | Two-Lane Port Gate Road | port | 2 | 40 | 16 | 2 | yes | yes
port_quay | Port Quay | port | 2 | 40 | 24 | 3 | yes | yes
three_lane_asymmetric_port_gate_road | Three-Lane Asymmetric Port Gate Road | port | 3 | 40 | 24 | 3 | yes | yes
two_lane_one_way_port_road | Two-Lane One-Way Port Road | port | 2 | 40 | 24 | 3 | yes | yes
two_lane_port_road | Two-Lane Port Road | port | 2 | 40 | 24 | 3 | yes | yes
four_lane_one_way_port_gate_road | Four-Lane One-Way Port Gate Road | port | 4 | 40 | 32 | 4 | yes | yes
alley | Alley | small | 2 | 30 | 8 | 1 | yes | yes
gravel_one_way_road | Gravel One-Way Road | small | 1 | 30 | 8 | 1 | yes | yes
gravel_road | Gravel Road | small | 2 | 30 | 8 | 1 | yes | yes
one_way_alley | One-Way Alley | small | 1 | 30 | 8 | 1 | yes | yes
small_pedestrian_street | Small Pedestrian Street | small | 1 | 20 | 8 | 1 | yes | yes
two_lane_wooden_covered_bridge | Two-Lane Wooden Covered Bridge | small | 2 | 30 | 8 | 1 | no | yes
two_lane_drawbridge | Two-Lane Drawbridge | small | 2 | 40 | 13 | 1.625 | no | yes
two_lane_suspension_bridge | Two-Lane Suspension Bridge | small | 2 | 40 | 13 | 1.625 | no | yes
medium_quay_with_two_way_road | Medium Quay With Two-Way Road | small | 2 | 40 | 16 | 2 | yes | yes
medium_quay_with_two_way_road_quaymedium02 | Medium Quay With Two-Way Road | small | 2 | 40 | 16 | 2 | yes | yes
medium_quay_with_two_way_road_quaymedium03 | Medium Quay With Two-Way Road | small | 2 | 40 | 16 | 2 | yes | yes
one_lane_one_way_angled_parking_road | One-Lane One-Way Angled Parking Road | small | 1 | 40 | 16 | 2 | yes | yes
one_lane_one_way_perpendicular_parking_road | One-Lane One-Way Perpendicular Parking Road | small | 1 | 40 | 16 | 2 | yes | yes
one_lane_one_way_road | One-Lane One-Way Road | small | 1 | 40 | 16 | 2 | yes | yes
one_way_angled_parking_alley | One-Way Angled Parking Alley | small | 1 | 30 | 16 | 2 | yes | yes
one_way_perpendicular_parking_alley | One-Way Perpendicular Parking Alley | small | 1 | 30 | 16 | 2 | yes | yes
pedestrian_street | Pedestrian Street | small | 2 | 20 | 16 | 2 | yes | yes
three_lane_asymmetric_road | Three-Lane Asymmetric Road | small | 3 | 40 | 16 | 2 | yes | yes
three_lane_one_way_road | Three-Lane One-Way Road | small | 3 | 40 | 16 | 2 | yes | yes
two_lane_one_way_road | Two-Lane One-Way Road | small | 2 | 40 | 16 | 2 | yes | yes
two_lane_road | Two-Lane Road | small | 2 | 40 | 16 | 2 | yes | yes
two_lane_truss_arch_bridge | Two-Lane Truss Arch Bridge | small | 2 | 40 | 16 | 2 | no | yes
angled_parking_alley | Angled Parking Alley | small | 2 | 30 | 24 | 3 | yes | yes
perpendicular_parking_alley | Perpendicular Parking Alley | small | 2 | 30 | 24 | 3 | yes | yes
two_lane_angled_parking_road | Two-Lane Angled Parking Road | small | 2 | 40 | 24 | 3 | yes | yes
two_lane_perpendicular_parking_road | Two-Lane Perpendicular Parking Road | small | 2 | 40 | 24 | 3 | yes | yes
two_lane_divided_angled_parking_road | Two-Lane Divided Angled Parking Road | small | 2 | 40 | 31 | 3.875 | yes | yes
two_lane_divided_perpendicular_parking_road | Two-Lane Divided Perpendicular Parking Road | small | 2 | 40 | 31 | 3.875 | yes | yes
one_way_tram_track | One-Way Tram Track | track |  | 80 | 5 | 0.625 | no | no
double_tram_track | Double Tram Track | track |  | 80 | 8 | 1 | no | no
double_tram_track_lift_bridge | Double Tram Track Lift Bridge | track |  | 40 | 8 | 1 | no | no
one_way_subway_track | One-Way Subway Track | track |  | 120 | 8 | 1 | no | no
one_way_train_track | One-Way Train Track | track |  | 160 | 8 | 1 | no | no
two_way_subway_track | Two-Way Subway Track | track |  | 120 | 8 | 1 | no | no
two_way_train_track | Two-Way Train Track | track |  | 160 | 8 | 1 | no | no
two_way_train_track_lift_bridge | Two-Way Train Track Lift Bridge | track |  | 80 | 8 | 1 | no | no
double_train_track_lift_bridge | Double Train Track Lift Bridge | track |  | 80 | 10.93 | 1.366 | no | no
double_subway_track | Double Subway Track | track |  | 120 | 12 | 1.5 | no | no
double_subway_track_lift_bridge | Double Subway Track Lift Bridge | track |  | 120 | 12 | 1.5 | no | no
double_subway_track_truss_arch_bridge | Double Subway Track Truss Arch Bridge | track |  | 120 | 12 | 1.5 | no | no
double_train_track | Double Train Track | track |  | 160 | 12 | 1.5 | no | no
double_train_track_truss_arch_bridge | Double Train Track Truss Arch Bridge | track |  | 160 | 12 | 1.5 | no | no
one_way_public_transport_lane | One-Way Public Transport Lane | transit_lane |  | 50 | 6 | 0.75 | no | yes
double_public_transport_lane | Double Public Transport Lane | transit_lane |  | 50 | 8 | 1 | no | yes

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

## TouristAttractions

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
bronze_statue | Bronze Statue | 9×9 | U |  | road |  | 160000 | jobs 20; range m 5000; attract 50
large_chinese_gate | Large Chinese Gate | 1×3 |  | Dragon Gate | road |  | 3000 | range m 7500; attract 5
medieval_castle | Medieval Castle | 26×24 | U | Paradox account reward | road |  | 240000 | jobs 30; range m 7500; attract 85
modern_art_museum | Modern Art Museum | 14×14 | U | Modern Architecture | road |  | 120000 | jobs 16; range m 6000; attract 50
observation_tower | Observation Tower | 19×14 | U |  | road |  | 160000 | jobs 40; range m 7500; attract 40
old_lighthouse | Old Lighthouse | 2×2 | U | Bridges & Ports | road |  | 25000 | jobs 8; range m 3000; attract 75
small_chinese_gate | Small Chinese Gate | 1×2 |  | Dragon Gate | road |  | 2500 | range m 7500; attract 5
traditional_chinese_temple | Traditional Chinese Temple | 7×12 |  | Dragon Gate | road |  | 220000 | jobs 20; range m 7500; attract 50
water_park | Water Park | 12×6 | U |  | road |  | 40000 | jobs 28; range m 5000; attract 75
lighthouse_museum | Lighthouse Museum | 8×3 |  | Bridges & Ports | near_parent | old_lighthouse (≤100 m) | 20000 | jobs 4; attract 20
lighthouse_restaurant | Lighthouse Restaurant | 3×4 |  | Bridges & Ports | near_parent | old_lighthouse (≤100 m) | 20000 | jobs 4; attract 20

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

## Education

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
chinese_high_school | Chinese High School | 13×11 |  | Dragon Gate | road |  | 30000 | jobs 80; students 800
city_elementary_school | City Elementary School | 6×8 |  |  | road |  | 17500 | jobs 50; range m 3500; students 1500
city_high_school | City High School | 12×6 |  |  | road |  | 22500 | jobs 40; students 800
college | College | 22×16 |  |  | road |  | 75000 | jobs 100; students 10000
community_elementary_school | Community Elementary School | 7×5 |  | Modern Architecture | road |  | 6000 | jobs 30; range m 2000; students 600
elementary_school | Elementary School | 18×8 |  |  | road |  | 12500 | jobs 50; range m 3500; students 1000
high_school | High School | 22×16 |  |  | road |  | 22500 | jobs 80; students 800
medical_university | Medical University | 62×18 | U |  | road |  | 120000 | jobs 150; students 15000
mediterranean_elementary_school | Mediterranean Elementary School | 10×5 |  | Mediterranean Heritage | road |  | 10000 | jobs 50; range m 3500; students 1000
mediterranean_high_school | Mediterranean High School | 9×7 |  | Mediterranean Heritage | road |  | 30000 | jobs 40; students 800; attract 10
modern_community_college | Modern Community College | 20×8 |  | Modern Architecture | road |  | 40000 | jobs 24; students 5000
modern_high_school | Modern High School | 12×6 |  | Modern Architecture | road |  | 50000 | jobs 130; students 1750
modern_technical_university | Modern Technical University | 24×16 | U | Modern Architecture | road |  | 63600 | jobs 100; students 9850
modern_university | Modern University | 16×8 |  | Modern Architecture | road |  | 50000 | jobs 85; students 8500
small_elementary_school | Small Elementary School | 9×6 |  |  | road |  | 5000 | jobs 20; range m 1500; students 400
small_high_school | Small High School | 12×8 |  |  | road |  | 11250 | jobs 20; students 400
technical_university | Technical University | 53×38 | U |  | road |  | 80000 | jobs 150; students 15000
university | University | 40×28 |  |  | road |  | 100000 | jobs 170; students 15000
urban_elementary_school | Urban Elementary School | 7×7 |  | Urban Promenades | road |  | 14000 | jobs 50; range m 4000; students 1200
urban_high_school | Urban High School | 9×8 |  | Urban Promenades | road |  | 20000 | jobs 60; students 800
academy_building | Academy Building | 4×6 |  | Modern Architecture | near_parent | modern_university (≤200 m) | 10000 | jobs 24; students 2000
additional_teaching_building | Additional Teaching Building | 6×4 |  | Modern Architecture | near_parent | modern_high_school (≤88 m) | 20000 | jobs 85; students 1000
college_dormitory | College Dormitory | 10×5 |  | Modern Architecture | near_parent | modern_community_college (≤96 m) | 12000 | jobs 32; students 800
college_library | College Library | 10×8 |  |  | near_parent | college (≤100 m) | 25000 | jobs 24
community_playground | Community Playground | 7×5 |  | Modern Architecture | near_parent | community_elementary_school (≤88 m) | 5000 | jobs 4; attract 15
elementary_school_childrens_clinic | Elementary School Childrens Clinic | 6×8 |  |  | near_parent | elementary_school (≤60 m) | 5000 | jobs 15
elementary_school_playground | Elementary School Playground | 6×4 |  |  | near_parent | elementary_school (≤60 m) | 2500 | attract 1; wellbeing +1 within 300 m
extension_wing | Extension Wing | 3×9 |  |  | near_parent | small_elementary_school (≤60 m) | 1000 | jobs 5; students 100
extension_wing_highschool02_classroom_extension_building | Extension Wing | 6×6 |  |  | near_parent | small_high_school (≤60 m) | 3000 | jobs 5; students 100
gymnasium | Gymnasium | 6×11 |  |  | near_parent | small_elementary_school (≤60 m) | 2000 | jobs 5; attract 1; wellbeing +1 within 200 m
high_school_sports_field | High School Sports Field | 26×20 |  |  | near_parent | high_school (≤100 m) | 7500 | jobs 16; attract 25; wellbeing +4 within 500 m
high_school_sports_park | High School Sports Park | 13×24 |  |  | near_parent | small_high_school (≤60 m) | 1500 | jobs 5; attract 10; wellbeing +3 within 300 m
lecture_hall | Lecture Hall | 10×12 |  | Modern Architecture | near_parent | modern_technical_university (≤200 m) | 25000 | jobs 12; students 500
medical_university_practice_clinic | Medical University Practice Clinic | 15×7 |  |  | near_parent | medical_university (≤120 m) | 50000 | jobs 40; patients 100
medical_university_research_facilities | Medical University Research Facilities | 16×8 |  |  | near_parent | medical_university (≤120 m) | 75000 | jobs 70
sports_field | Sports Field | 20×12 |  | Modern Architecture | near_parent | modern_community_college (≤200 m) | 7500 | jobs 20; attract 25
student_dormitory | Student Dormitory | 6×4 |  | Modern Architecture | near_parent | modern_high_school (≤88 m) | 5000 | jobs 20; students 200
technical_academy_building | Technical Academy Building | 4×12 |  | Modern Architecture | near_parent | modern_technical_university (≤250 m) | 22500 | jobs 28; students 2110
university_library | University Library | 12×12 |  |  | near_parent | university (≤100 m) | 47500 | jobs 50
university_library_rs_university01_sub01 | University Library | 8×10 |  | Modern Architecture | near_parent | modern_university (≤200 m) | 70000 | jobs 16; students 8500
university_park | University Park | 18×18 |  |  | near_parent | university (≤100 m) | 20000 | jobs 20; attract 10; wellbeing +4 within 500 m

- upgrades of `mediterranean_high_school` (no separate placement): `additional_floor`
- upgrades of `college` (no separate placement): `college_extension_wing`
- upgrades of `city_elementary_school` (no separate placement): `courtyard_playground`, `extension_floors`
- upgrades of `elementary_school` (no separate placement): `elementary_school_extension_wing`
- upgrades of `city_high_school` (no separate placement): `extension_floors_highschool03_extension_floors`, `rooftop_sports_park`
- upgrades of `mediterranean_elementary_school` (no separate placement): `extension_wing_ccp5_elementaryschool_ext01`
- upgrades of `chinese_high_school` (no separate placement): `extension_wing_ccp6_servicebuilding04_ext01`
- upgrades of `modern_community_college` (no separate placement): `extension_wing_rs_college01_ext01`
- upgrades of `community_elementary_school` (no separate placement): `extension_wing_rs_elementaryschool01_ext01`
- upgrades of `modern_technical_university` (no separate placement): `extension_wing_rs_techuniversity01_ext02`, `extension_wing_rs_techuniversity01_ext03`, `modern_student_plaza`
- upgrades of `modern_university` (no separate placement): `extension_wing_rs_university01_ext01`
- upgrades of `urban_elementary_school` (no separate placement): `extension_wing_ubpr_elementaryschool01_ext01`, `urban_playground`
- upgrades of `urban_high_school` (no separate placement): `extension_wing_ubpr_highschool01_ext01`, `gym_extension`
- upgrades of `high_school` (no separate placement): `high_school_extension_wing`, `high_school_library`
- upgrades of `medical_university` (no separate placement): `medical_university_extension_wing`
- upgrades of `modern_high_school` (no separate placement): `mindfulness_room`
- upgrades of `technical_university` (no separate placement): `technical_university_extension_wing`, `technical_university_workshop_upgrade`
- upgrades of `university` (no separate placement): `university_extension_wing`

## Electricity

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
coal_power_plant | Coal Power Plant | 50×40 |  |  | road |  | 75000 | jobs 140; power kW 3000000
emergency_battery_station | Emergency Battery Station | 22×10 |  |  | road |  | 25000 | jobs 32; battery kWh 5000000
gas_power_plant | Gas Power Plant | 27×38 |  |  | road |  | 300000 | jobs 100; power kW 2500000
geothermal_power_plant | Geothermal Power Plant | 44×35 |  |  | resource:geothermal |  | 150000 | jobs 70; geothermal kW 1500000
nuclear_power_plant | Nuclear Power Plant | 72×41 | U |  | road |  | 500000 | jobs 300; power kW 7500000
small_coal_power_plant | Small Coal Power Plant | 14×16 |  |  | road |  | 5000 | jobs 37; power kW 200000
small_transformer_station | Small Transformer Station | 3×4 |  |  | road |  | 3000 | 
small_wind_turbine | Small Wind Turbine | 8×8 |  |  | water |  | 5000 | wind kW 40000
solar_power_plant | Solar Power Plant | 36×69 |  |  | road |  | 150000 | jobs 32; solar kW 2000000; battery kWh 500000
transformer_station | Transformer Station | 6×7 |  |  | road |  | 3000 | 
wind_turbine | Wind Turbine | 15×15 |  |  | water |  | 7500 | wind kW 60000
windmill | Windmill | 3×3 |  |  | road |  | 2500 | wind kW 20000
coal_power_plant_coal_storage_yard | Coal Power Plant Coal Storage Yard | 25×33 |  |  | near_parent | coal_power_plant (≤200 m) | 12500 | jobs 10
emergency_battery_station_diesel_generator | Emergency Battery Station Diesel Generator | 5×4 |  |  | near_parent | emergency_battery_station (≤40 m) | 4250 | 
gas_power_plant_fuel_storage_extension | Gas Power Plant Fuel Storage Extension | 9×9 |  |  | near_parent | gas_power_plant (≤200 m) | 75000 | jobs 10
geothermal_power_plant_additional_transformer_station | Geothermal Power Plant Additional Transformer Station | 4×4 |  |  | near_parent | geothermal_power_plant (≤40 m) | 1500 | 
solar_power_station_additional_transformer_station | Solar Power Station Additional Transformer Station | 5×4 |  |  | near_parent | solar_power_plant (≤150 m) | 1500 | 
solar_power_station_backup_battery | Solar Power Station Backup Battery | 16×6 |  |  | near_parent | solar_power_plant (≤150 m) | 10500 | jobs 8; battery kWh 500000

- upgrades of `coal_power_plant` (no separate placement): `coal_power_plant_additional_turbine_building`, `coal_power_plant_advanced_furnace`, `coal_power_plant_exhaust_filter`
- upgrades of `emergency_battery_station` (no separate placement): `emergency_battery_station_additional_battery_bank`
- upgrades of `gas_power_plant` (no separate placement): `gas_power_plant_additional_turbine`, `gas_power_plant_advanced_furnace`, `gas_power_plant_exhaust_filter`
- upgrades of `geothermal_power_plant` (no separate placement): `geothermal_power_plant_additional_turbine`, `geothermal_power_plant_binary_cycle_power_station`
- upgrades of `solar_power_plant` (no separate placement): `solar_power_station_advanced_tracking_system`
- upgrades of `wind_turbine` (no separate placement): `wind_turbine_advanced_rotor_system`, `wind_turbine_battery_extension`, `wind_turbine_solar_assisted`

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

## GarbageManagement

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
incineration_plant | Incineration Plant | 25×27 |  |  | road |  | 105000 | jobs 60; garbage/month 3000000
industrial_waste_processing_site | Industrial Waste Processing Site | 19×16 | U |  | road |  | 225000 | jobs 250; garbage/month 50000000
landfill | Landfill | 17×15 |  |  | road |  | 15000 | jobs 30; garbage/month 100000
recycling_center | Recycling Center | 22×18 |  |  | road |  | 80000 | jobs 60; garbage/month 1500000
incineration_plant_storage_extension | Incineration Plant Storage Extension | 8×6 |  |  | near_parent | incineration_plant (≤100 m) | 10000 | jobs 10
landfill_hazardous_waste_collection_point | Landfill Hazardous Waste Collection Point | 12×8 |  |  | near_parent | landfill (≤100 m) | 3000 | jobs 12; garbage/month 20000
recycling_center_hazardous_waste_collection_point | Recycling Center Hazardous Waste Collection Point | 8×10 |  |  | near_parent | recycling_center (≤100 m) | 20000 | jobs 20; garbage/month 250000
recycling_center_storage_extension | Recycling Center Storage Extension | 16×7 |  |  | near_parent | recycling_center (≤100 m) | 10000 | jobs 10

- upgrades of `incineration_plant` (no separate placement): `incineration_plant_extra_incinerator_furnace`, `incineration_plant_garbage_truck_depot`
- upgrades of `landfill` (no separate placement): `landfill_garbage_truck_depot`, `landfill_waste_recycling_unit`
- upgrades of `recycling_center` (no separate placement): `recycling_center_garbage_truck_depot`

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

## SignaturesLandmarks

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
bell_tower_of_xi_an | Bell Tower of Xi'an  | 16×16 | U | Landmark Buildings | road |  | 280000 | jobs 40; range m 10000; attract 125
botanical_garden | Botanical Garden | 12×16 | U | Landmark Buildings | road |  | 80000 | jobs 40; range m 10000; attract 125
ferris_wheel | Ferris Wheel | 20×16 | U | Landmark Buildings | road |  | 560000 | jobs 18; range m 6000; attract 110
fountain_plaza | Fountain Plaza | 14×14 | U | CS1 owner reward | road |  | 80000 | jobs 12; range m 7500; attract 100
grand_hotel | Grand Hotel | 14×10 | U | Landmark Buildings | road |  | 80000 | jobs 50; range m 10000; attract 115
namdaemun | Namdaemun | 14×14 | U | Landmark Buildings | road |  | 280000 | jobs 40; range m 10000; attract 125
nasinneula | Näsinneula | 18×15 | U | Landmark Buildings | road |  | 240000 | jobs 46; range m 6000; attract 115
national_diet_building | National Diet Building | 33×31 | U | Landmark Buildings | road |  | 280000 | jobs 60; range m 10000; attract 125
national_gallery_of_art | National Gallery of Art | 42×18 | U | Landmark Buildings | road |  | 160000 | jobs 50; range m 7500; attract 120
notre_dame | Notre-Dame | 10×25 | U | Landmark Buildings | road |  | 280000 | jobs 40; range m 7500; attract 175

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

## LargeParks

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
bouncy_castle_park | Bouncy Castle Park | 7×10 |  | Bridges & Ports | road |  | 6500 | range m 2500; attract 10
business_plaza | Business Plaza | 8×10 |  |  | road |  | 18000 | range m 6000; attract 25
chirper_adventure_park | Chirper Adventure Park | 6×8 |  |  | road |  | 6750 | range m 2400; attract 8
chirper_fun_time_complex | Chirper Fun Time Complex | 8×10 |  |  | road |  | 8500 | range m 3000; attract 10
community_city_park | Community City Park | 15×15 |  | Modern Architecture | road |  | 15000 | range m 4000; attract 18
dog_activity_park | Dog Activity Park | 10×6 |  |  | road |  | 8500 | range m 3000; attract 10
grand_city_plaza | Grand City Plaza | 28×20 |  | Modern Architecture | road |  | 30000 | range m 5000; attract 99
haunted_house_park | Haunted House Park | 7×10 |  | Bridges & Ports | road |  | 10000 | jobs 6; range m 3000; attract 15
hedge_park | Hedge Park | 8×8 |  |  | road |  | 6750 | range m 2400; attract 8
jetset_jubilee_carousel_park | Jetset Jubilee Carousel Park | 6×10 |  | Bridges & Ports | road |  | 8500 | range m 3000; attract 12
large_city_park | Large City Park | 10×8 |  |  | road |  | 8500 | range m 3000; attract 10
large_lighthouse | Large Lighthouse | 1×1 |  | Bridges & Ports | road |  | 8500 | range m 2800; attract 10
large_playground | Large Playground | 3×4 |  |  | road |  | 2500 | range m 2500; attract 5
large_plaza | Large Plaza | 12×16 |  |  | road |  | 12500 | range m 4000; attract 15
merry_mare_go_round_carousel_park | Merry Mare-Go-Round Carousel Park | 6×10 |  | Bridges & Ports | road |  | 7500 | range m 2500; attract 10
multipurpose_park | Multipurpose Park | 8×16 |  |  | road |  | 10000 | range m 3600; attract 13
neo_barracks | Neo Barracks | 10×15 |  | Leisure Venues | road |  | 10000 | jobs 10; range m 4000; attract 40
old_ferris_ride_park | Old Ferris Ride Park | 6×10 |  | Bridges & Ports | road |  | 8500 | jobs 2; range m 3000; attract 12
parkside_cafe | Parkside Cafe | 5×10 |  | Bridges & Ports | road |  | 2000 | jobs 4; range m 2500; attract 8
passage_park | Passage Park | 4×12 |  |  | road |  | 3360 | range m 2000; attract 4
spin_vista_park | Spin Vista Park | 10×10 |  | Bridges & Ports | road |  | 12500 | jobs 4; range m 4000; attract 20
terrace_plaza | Terrace Plaza | 6×8 |  |  | road |  | 14000 | range m 5000; attract 20
the_parkview_eatery | The Parkview Eatery | 6×10 |  | Bridges & Ports | road |  | 4000 | jobs 8; range m 3000; attract 10
the_pavillion_restaurant | The Pavillion Restaurant | 7×10 |  | Bridges & Ports | road |  | 5000 | jobs 12; range m 3000; attract 12
winding_park | Winding Park | 12×12 |  |  | road |  | 14000 | range m 5000; attract 20

## LargeSportsParks

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
american_football_field | American Football Field | 20×12 |  |  | road |  | 15000 | jobs 20; range m 4000; attract 25
apex_climbing | Apex Climbing | 12×12 |  | Leisure Venues | road |  | 6500 | jobs 5; range m 4000; attract 40
basketball_center | Basketball Center | 8×6 |  |  | road |  | 8000 | jobs 10; range m 3500; attract 15
community_pool | Community Pool | 7×7 |  |  | road |  | 8000 | jobs 10; range m 3500; attract 15
game_set_match | Game Set Match | 12×14 |  | Leisure Venues | road |  | 12000 | jobs 10; range m 6000; attract 50
soccer_field | Soccer Field | 12×15 |  |  | road |  | 15000 | jobs 20; range m 4000; attract 25
sportshub_pavilion | SportsHub Pavilion | 12×12 |  | Leisure Venues | road |  | 10000 | jobs 10; range m 4000; attract 50
sportspark_complex | SportsPark Complex | 25×32 |  | Leisure Venues | road |  | 15000 | jobs 10; range m 4000; attract 80

## Parks & Recreation

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
activity_playground | Activity Playground | 3×3 |  |  | road |  | 2000 | range m 2500; attract 1
bicycle_park | Bicycle Park | 4×4 |  |  | road |  | 2000 | range m 2500; attract 1
campfire_site | Campfire Site | 8×14 |  |  | road |  | 6000 | range m 6000; attract 10
canopy_covered_corridor_park | Canopy-Covered Corridor Park | 1×6 |  |  | road |  | 1500 | range m 2250; attract 1
canopy_covered_parkette | Canopy-Covered Parkette | 2×1 |  |  | road |  | 600 | range m 1000; attract 1
canopy_covered_pocket_park | Canopy-Covered Pocket Park | 4×1 |  |  | road |  | 1000 | range m 2000; attract 1
chirper_park | Chirper Park | 4×4 |  |  | road |  | 2000 | range m 2500; attract 1
chirplet_park | Chirplet Park | 2×2 |  |  | road |  | 1000 | range m 2500; attract 1
color_plaza | Color Plaza | 7×5 |  | Leisure Venues | road |  | 3500 | jobs 2; range m 4000; attract 30
daily_toast_truck | Daily Toast Truck | 1×1 |  | Downtown Market Set | road |  | 1000 | jobs 2; range m 1000; attract 5
dog_park | Dog Park | 4×3 |  |  | road |  | 2000 | range m 3500; attract 1
hilly_playground | Hilly Playground | 4×4 |  |  | road |  | 2000 | range m 2500; attract 1
hot_tacos_truck | Hot Tacos Truck | 1×1 |  | Downtown Market Set | road |  | 1000 | jobs 2; range m 1000; attract 5
humble_potato_truck | Humble Potato Truck | 1×1 |  | Downtown Market Set | road |  | 1000 | jobs 2; range m 1000; attract 5
large_campfire_site | Large Campfire Site | 11×10 |  |  | road |  | 6000 | range m 6000; attract 10
lighthouse | Lighthouse | 1×1 |  | Bridges & Ports | road |  | 4000 | range m 2500; attract 5
mini_park | Mini Park | 1×1 |  |  | road |  | 400 | range m 500; attract 1
modern_pocket_park | Modern Pocket Park | 1×4 |  |  | road |  | 1000 | range m 2000; attract 1
park_cafe | Park Cafe | 6×6 |  |  | road |  | 4000 | range m 4000; attract 5
park_maintenance_depot | Park Maintenance Depot | 7×10 |  |  | road |  | 20000 | jobs 30
play_round | Play Round | 3×3 |  |  | road |  | 2000 | range m 2500; attract 1
ring_park | Ring Park | 5×5 |  |  | road |  | 3000 | range m 3200; attract 3
sausage_works_truck | Sausage Works Truck | 1×1 |  | Downtown Market Set | road |  | 100 | jobs 2; range m 1000; attract 5
small_lighthouse | Small Lighthouse | 1×1 |  | Bridges & Ports | road |  | 2000 | range m 2500; attract 1
small_park | Small Park | 4×4 |  |  | road |  | 2000 | range m 2500; attract 1
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

## SportsParks

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
basketball_court | Basketball Court | 3×4 |  |  | road |  | 2500 | range m 3500; attract 5
outdoor_gym | Outdoor Gym | 2×2 |  |  | road |  | 3000 | range m 3500; attract 5
skate_park | Skate Park | 8×4 |  |  | road |  | 3000 | range m 3500; attract 5
tennis_court | Tennis Court | 4×7 |  |  | road |  | 2500 | range m 3500; attract 5

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

## RoadsServices

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
road_maintenance_depot | Road Maintenance Depot | 10×12 |  |  | road |  | 15000 | jobs 30

- upgrades of `road_maintenance_depot` (no separate placement): `road_maintenance_depot_extra_garage`

## SignaturesCommercial

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
activity_plaza | Activity Plaza | 8×9 | U |  | road |  |  | zone commercial_high; attract 20; wellbeing +5 within 1500 m
antique_store | Antique Store | 3×4 | U | Supply Chains | road |  |  | zone commercial_low; attract 40
apotheke | Apotheke | 3×4 | U | Leisure Venues | road |  |  | zone commercial_high; attract 20
auto_center | Auto Center | 12×10 | U |  | road |  |  | zone commercial_low; attract 10; wellbeing +3 within 1000 m
bait_and_bistro | Bait & Bistro | 5×9 | U | Bridges & Ports | water |  |  | zone commercial_low_waterfront; attract 10; wellbeing +10 within 1000 m
baker_and_confectionary | Baker and Confectionary | 4×10 | U | Supply Chains | road |  |  | zone commercial_low; attract 40
canopy_cafe | Canopy Café | 6×6 | U | Leisure Venues | road |  |  | zone commercial_low; attract 20
cinevista | Cinevista | 12×10 | U | Leisure Venues | road |  |  | zone commercial_low; attract 35
conference_center | Conference Center | 30×22 | U | Bridges & Ports | road |  |  | zone commercial_low; attract 25; wellbeing +10 within 1000 m
corner_theatre | Corner Theatre | 7×8 | U | Leisure Venues | road |  |  | zone commercial_high; attract 35
deep_blue_oceanarium | Deep Blue Oceanarium | 9×10 | U | Leisure Venues | road |  |  | zone commercial_high; attract 60
eclipse_nightlife | Eclipse Nightlife | 6×7 | U | Leisure Venues | road |  |  | zone commercial_low; attract 25
espresso_on_the_go | Espresso On-The-Go | 4×9 | U | Leisure Venues | road |  |  | zone commercial_low; attract 5
farmers_market | Farmers Market | 9×17 | U | Supply Chains | road |  |  | zone commercial_low; attract 30
fashion_square | Fashion Square | 10×7 | U |  | road |  |  | zone commercial_high; attract 10; wellbeing +5 within 1000 m
fleur_de_the | Fleur de thé | 2×3 | U | Leisure Venues | road |  |  | zone commercial_low; attract 10
food_station | Food Station | 6×10 | U |  | road |  |  | zone commercial_low; attract 10; wellbeing +3 within 1000 m
grand_dynasty_hotel | Grand Dynasty Hotel | 19×12 | U | Dragon Gate | road |  |  | zone commercial_high; attract 20
gusto_gelato | Gusto Gelato | 5×4 | U | Leisure Venues | road |  |  | zone commercial_low; attract 30
horizon_lounge | Horizon Lounge | 8×4 | U | Leisure Venues | road |  |  | zone commercial_low; attract 25
iceflake_arena | Iceflake Arena | 24×17 | U |  | road |  |  | zone commercial_high; attract 80; wellbeing +5 within 2000 m
kansai_tower | Kansai Tower | 16×13 | U | Skyscrapers | road |  |  | zone commercial_high; attract 100
la_cuillere_d_argent | La Cuillère d'Argent | 4×6 | U | Leisure Venues | road |  |  | zone commercial_low; attract 8
majestic | Majestic | 12×9 | U | Leisure Venues | road |  |  | zone commercial_low; attract 45
maritime_museum | Maritime Museum | 9×18 | U | Bridges & Ports | road |  |  | zone commercial_low; attract 25; wellbeing +10 within 1000 m
marketplace | Marketplace | 17×25 | U |  | road |  |  | zone commercial_low; attract 15; wellbeing +3 within 1500 m
mermaid_s_tea_lounge | Mermaid's Tea Lounge | 2×5 | U | Leisure Venues | road |  |  | zone commercial_low; attract 20
muscle_car_garage | Muscle Car Garage | 13×10 | U | San Francisco Set | road |  |  | zone commercial_low; attract 5; wellbeing +3 within 500 m
nitro_kingdom | Nitro Kingdom | 14×14 | U | Leisure Venues | road |  |  | zone commercial_low; attract 55
oasis_kitchen | Oasis Kitchen | 8×8 | U | Leisure Venues | road |  |  | zone commercial_low; attract 15
one_stop_station | One Stop Station | 12×10 | U |  | road |  |  | zone commercial_low; attract 15; wellbeing +3 within 1500 m
pinfall_palace | Pinfall Palace | 10×12 | U | Leisure Venues | road |  |  | zone commercial_low; attract 30
riverside_grill | Riverside Grill | 8×6 | U | Leisure Venues | road |  |  | zone commercial_low; attract 15
shard_arena | Shard Arena | 27×24 | U | Leisure Venues | road |  |  | zone commercial_high; attract 120
skylines_heritage_museum | Skylines Heritage Museum | 7×9 | U | Leisure Venues | road |  |  | zone commercial_high; attract 45
sporting_goods_store | Sporting Goods Store | 30×20 | U | Supply Chains | road |  |  | zone commercial_low; attract 60
sportsbar | Sportsbar | 6×5 | U | Supply Chains | road |  |  | zone commercial_low; attract 50
square_center | Square Center | 9×10 | U |  | road |  |  | zone commercial_high; attract 10; wellbeing +5 within 1000 m
steakhouse | SteakHouse | 3×2 | U | Leisure Venues | road |  |  | zone commercial_low; attract 20
streamline_diner | Streamline Diner | 3×2 | U |  | road |  |  | zone commercial_low; attract 5; wellbeing +3 within 500 m
sunset_brewery | Sunset Brewery | 7×7 | U | Leisure Venues | road |  |  | zone commercial_high; attract 40
the_capacitor_building | The Capacitor Building | 5×10 | U |  | road |  |  | zone commercial_high; attract 30; wellbeing +5 within 2000 m
the_emerald_building | The Emerald Building | 8×6 | U |  | road |  |  | zone commercial_high; attract 30; wellbeing +5 within 2000 m
the_forum_of_arts | The Forum of Arts | 9×10 | U | Leisure Venues | road |  |  | zone commercial_high; attract 35
the_great_tower_of_commerce | The Great Tower of Commerce | 25×15 | U | Skyscrapers | road |  |  | zone commercial_high; attract 250
the_lobster_tail | The Lobster Tail | 3×6 | U | Leisure Venues | road |  |  | zone commercial_low; attract 8
the_marvelous_marble | The Marvelous Marble  | 4×9 | U |  | road |  |  | zone commercial_high; attract 20; wellbeing +5 within 1500 m
villa_city | Villa City | 3×4 | U |  | road |  |  | zone commercial_low; attract 5; wellbeing +3 within 500 m
villa_mare | Villa Maré | 7×7 | U | Bridges & Ports | water |  |  | zone commercial_low_waterfront; attract 10; wellbeing +10 within 1000 m

- upgrades of `kansai_tower` (no separate placement): `high_school_pack10_chsignature02_ext01`
- upgrades of `the_great_tower_of_commerce` (no separate placement): `shopping_mall`

## SignaturesIndustrial

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
athleticwear_factory | Athleticwear Factory | 30×17 | U | Supply Chains | road |  |  | zone industrial_manufacturing
blast_furnace | Blast Furnace | 26×12 | U | Supply Chains | road |  |  | zone industrial_manufacturing
casting_fabricator | Casting Fabricator | 7×10 | U | Supply Chains | road |  |  | zone industrial_manufacturing
cereal_mill | Cereal Mill | 8×12 | U | Supply Chains | road |  |  | zone industrial_manufacturing
chemical_plant | Chemical Plant | 19×18 | U |  | road |  |  | zone industrial_manufacturing
concrete_batch_plant | Concrete Batch Plant | 10×18 | U | Supply Chains | road |  |  | zone industrial_manufacturing
dairy_house | Dairy House | 14×12 | U |  | road |  |  | zone industrial_manufacturing
energy_drink_bottling_plant | Energy Drink Bottling Plant | 12×10 | U | Supply Chains | road |  |  | zone industrial_manufacturing
fabrication_unit | Fabrication Unit | 20×10 | U | Supply Chains | road |  |  | zone industrial_manufacturing
fish_and_chippery_seafood_factory | Fish & Chippery Seafood Factory | 24×15 | U | Bridges & Ports | road |  |  | zone industrial_manufacturing
fuel_plant | Fuel Plant | 28×14 | U |  | road |  |  | zone industrial_manufacturing
gravity_separation_unit | Gravity Separation Unit | 8×14 | U | Supply Chains | road |  |  | zone industrial_manufacturing
ground_earth | Ground Earth | 18×10 | U |  | road |  |  | zone industrial_manufacturing
livestock_processing_facility | Livestock Processing Facility | 11×12 | U | Supply Chains | road |  |  | zone industrial_manufacturing
nanopolymer_synthesis_unit | Nanopolymer Synthesis Unit | 6×15 | U | Supply Chains | road |  |  | zone industrial_manufacturing
oil_refinery | Oil Refinery | 24×30 | U |  | road |  |  | zone industrial_manufacturing
paper_factory | Paper Factory | 36×28 | U |  | road |  |  | zone industrial_manufacturing
particleboard_factory | Particleboard Factory | 13×24 | U | Supply Chains | road |  |  | zone industrial_manufacturing
pharma | Pharma | 16×20 | U |  | road |  |  | zone industrial_manufacturing
rocket_fuel_refinery | Rocket Fuel Refinery | 15×13 | U | Supply Chains | road |  |  | zone industrial_manufacturing
seafarer_shipyards | Seafarer Shipyards | 35×26 | U | Bridges & Ports | water |  |  | zone industrial_manufacturing
steelworks | Steelworks | 20×56 | U | Supply Chains | road |  |  | zone industrial_manufacturing
switchon | Switchon  | 30×22 | U |  | road |  |  | zone industrial_manufacturing
vehicle_factory | Vehicle Factory | 36×36 | U |  | road |  |  | zone industrial_manufacturing

- upgrades of `cereal_mill` (no separate placement): `boxing_shipping_and_sugar`
- upgrades of `blast_furnace` (no separate placement): `foundry`
- upgrades of `livestock_processing_facility` (no separate placement): `meat_packing_logistics_center`
- upgrades of `steelworks` (no separate placement): `milling_and_rolling_unit`
- upgrades of `concrete_batch_plant` (no separate placement): `ready_mix_facilities`
- upgrades of `rocket_fuel_refinery` (no separate placement): `rocket_propellant_distillation`
- upgrades of `energy_drink_bottling_plant` (no separate placement): `shipping_and_receiving_department`
- upgrades of `athleticwear_factory` (no separate placement): `sport_shorts_assembly_line`
- upgrades of `particleboard_factory` (no separate placement): `wood_veneer_production`

## SignaturesOffice

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
arroyo_seco_building | Arroyo Seco Building | 33×19 | U | Skyscrapers | road |  |  | zone office_high; attract 75
aurum_spire | Aurum Spire | 13×13 | U | Skyscrapers | road |  |  | zone office_high; attract 75
base_j98_plaza | Base J98 Plaza | 13×10 | U | Office Evolution | road |  |  | zone high_density_office_evolution; attract 10
bottle_cap_office | Bottle Cap Office | 14×11 | U | Supply Chains | road |  |  | zone office_low; attract 60
brand_and_lifestyle_center | Brand and Lifestyle Center | 8×13 | U | Supply Chains | road |  |  | zone office_low; attract 70
brunswick_corner_building | Brunswick Corner Building | 11×8 | U | Office Evolution | road |  |  | zone high_density_office_evolution; attract 10
coder_park | Coder Park | 6×6 | U |  | road |  |  | zone office_low; attract 10; wellbeing +5 within 1000 m
energy_lobbying_office | Energy Lobbying Office | 3×5 | U | Supply Chains | road |  |  | zone office_high; attract 60
finanzturm | Finanzturm | 8×8 | U | Skyscrapers | road |  |  | zone office_high; attract 50
frankfort_court | Frankfort Court | 8×8 | U | Office Evolution | road |  |  | zone high_density_office_evolution; attract 10
incaserium | Incaserium | 9×8 | U |  | road |  |  | zone office_low; attract 15; wellbeing +5 within 1500 m
interior_design_studio | Interior Design Studio | 4×6 | U | Supply Chains | road |  |  | zone office_low; attract 50
launch_payload_control_center | Launch Payload Control Center | 14×18 | U | Supply Chains | road |  |  | zone office_low; attract 50
livestock_exchange | Livestock Exchange | 11×12 | U | Supply Chains | road |  |  | zone office_low; attract 40
long_wires_tower | Long Wires Tower | 14×12 | U | Skyscrapers | road |  |  | zone office_high; attract 70
multistory_multimedia | Multistory Multimedia | 9×8 | U |  | road |  |  | zone office_high; attract 10; wellbeing +5 within 1000 m
principiis | Principiis | 10×7 | U |  | road |  |  | zone office_low; attract 5; wellbeing +5 within 500 m; crime -2 within 500 m
seaworth_building | Seaworth Building | 9×12 | U | Skyscrapers | road |  |  | zone office_high; attract 70
steel_building | Steel Building | 5×9 | U | Supply Chains | road |  |  | zone office_high; attract 80
stripmine_office | Stripmine Office | 16×16 | U | Supply Chains | road |  |  | zone office_low; attract 40
stylus_tower | Stylus Tower | 12×14 | U |  | road |  |  | zone office_high; attract 30; wellbeing +5 within 2000 m
television_production_studio | Television Production Studio | 18×10 | U | Supply Chains | road |  |  | zone office_low; attract 50
the_coruna | The Coruña | 6×10 | U | Skyscrapers | road |  |  | zone office_high; attract 60
waterfall_array | Waterfall Array | 8×10 | U |  | road |  |  | zone office_high; attract 20; wellbeing +5 within 1500 m
auditorium | Auditorium | 12×8 |  | Skyscrapers | near_parent | the_coruna (≤250 m) | 15000 | jobs 20; students 1500
research_wing | Research Wing  | 10×10 | U | Skyscrapers | near_parent | the_coruna (≤200 m) | 30000 | jobs 50; students 1200

- upgrades of `seaworth_building` (no separate placement): `city_hall_pack10_ohsignature01_ext01`
- upgrades of `long_wires_tower` (no separate placement): `communications_array`, `emergency_shelter`, `substation`
- upgrades of `frankfort_court` (no separate placement): `frankfort_court_tower`
- upgrades of `arroyo_seco_building` (no separate placement): `police_headquarters_pack10_ohsignature05_ext01`
- upgrades of `the_coruna` (no separate placement): `university_conversion`

## SignaturesResidential

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
architects_mansion | Architect’s Mansion | 8×8 | U |  | water |  |  | zone residential_low_waterfront; wellbeing +4 within 1000 m
baltar_pines | Baltar Pines | 1×4 | U |  | road |  |  | zone residential_medium_row; wellbeing +3 within 750 m
bell_creek | Bell Creek | 20×18 | U | Skyscrapers | road |  |  | zone residential_medium; homes 750
century_castle | Century Castle | 9×7 | U |  | road |  |  | zone residential_high; wellbeing +10 within 2500 m
co10_condos | CO10 Condos | 4×4 | U |  | road |  |  | zone residential_medium_row; wellbeing +7 within 2000 m
colossal_tower | Colossal Tower | 9×6 | U |  | road |  |  | zone residential_high; wellbeing +12 within 3000 m
constellation_apartments | Constellation Apartments | 1×4 | U |  | road |  |  | zone residential_medium_row; wellbeing +5 within 1250 m
corundum_condos | Corundum Condos | 6×10 | U |  | road |  |  | zone residential_medium; wellbeing +4 within 1000 m
deuclidia_apartments | Deuclidia Apartments | 10×14 | U |  | road |  |  | zone residential_medium; wellbeing +10 within 2500 m
extreme_athletes_villa | Extreme Athlete’s Villa | 3×6 | U |  | water |  |  | zone residential_low_waterfront; wellbeing +2 within 500 m
film_actor_mansion | Film Actor Mansion | 5×10 | U |  | road |  |  | zone residential_low; wellbeing +4 within 1000 m
gatehouse_residences | Gatehouse Residences | 6×8 | U |  | road |  |  | zone residential_medium; wellbeing +10 within 2500 m
golfers_villa | Golfer’s Villa | 12×14 | U |  | water |  |  | zone residential_low_waterfront; wellbeing +4 within 1000 m
grandview_heights | Grandview Heights | 38×24 | U | Skyscrapers | road |  |  | zone residential_high; homes 5000; attract 200
halo_heights | Halo Heights | 8×10 | U |  | road |  |  | zone residential_high; wellbeing +10 within 2500 m
imperium_plaza | Imperium Plaza | 6×6 | U | Mediterranean Heritage | road |  |  | zone mediterranean_heritage_medium_density_housing
industry_moguls_mansion | Industry Mogul’s Mansion | 10×12 | U |  | water |  |  | zone residential_low_waterfront; wellbeing +6 within 1500 m
lighthouse_pointe | Lighthouse Pointe | 12×10 | U | Skyscrapers | road |  |  | zone residential_medium; homes 300; attract 75
mollari_palace | Mollari Palace | 1×4 | U |  | road |  |  | zone residential_medium_row; wellbeing +7 within 2000 m
old_factory_condos | Old Factory Condos | 6×6 | U |  | road |  |  | zone residential_medium; wellbeing +8 within 2000 m
painter_mansion | Painter Mansion | 5×5 | U |  | road |  |  | zone residential_low; wellbeing +6 within 1500 m
polaris_suites | Polaris Suites | 12×5 | U |  | road |  |  | zone residential_medium; wellbeing +4 within 1000 m
pop_musician_mansion | Pop Musician Mansion | 6×8 | U |  | road |  |  | zone residential_low; wellbeing +2 within 500 m
real_estate_agents_mansion | Real Estate Agent’s Mansion | 8×6 | U |  | water |  |  | zone residential_low_waterfront; wellbeing +2 within 500 m
rock_musician_mansion | Rock Musician Mansion | 5×8 | U |  | road |  |  | zone residential_low; wellbeing +2 within 500 m
royal_villa | Royal Villa | 6×14 | U |  | water |  |  | zone residential_low_waterfront; wellbeing +6 within 1500 m
rubique_apartments | Rubique Apartments | 6×8 | U |  | road |  |  | zone residential_medium; wellbeing +8 within 2000 m
sculptor_mansion | Sculptor Mansion | 4×6 | U |  | road |  |  | zone residential_low; wellbeing +6 within 1500 m
seven_hills_residence | Seven Hills Residence | 5×5 | U | Mediterranean Heritage | road |  |  | zone mediterranean_heritage_medium_density_housing
silver_dragon | Silver Dragon | 12×12 | U | Skyscrapers | road |  |  | zone residential_high; homes 2500; attract 100
the_grass_crown | The Grass Crown | 18×18 | U |  | road |  |  | zone residential_high; wellbeing +12 within 3000 m
theater_actor_mansion | Theater Actor Mansion | 6×4 | U |  | road |  |  | zone residential_low; wellbeing +4 within 1000 m
vertigo_square | Vertigo Square | 1×4 | U |  | road |  |  | zone residential_medium_row; wellbeing +3 within 750 m
vesuvius_palace | Vesuvius Palace | 4×4 | U | Mediterranean Heritage | road |  |  | zone mediterranean_heritage_medium_density_housing
villa_antiqua | Villa Antiqua | 6×4 | U | Mediterranean Heritage | road |  |  | zone mediterranean_heritage_medium_density_housing
vista_building | Vista Building | 1×6 | U |  | road |  |  | zone residential_medium_row; wellbeing +5 within 1250 m
watanabe_tower | Watanabe Tower | 5×6 | U |  | road |  |  | zone residential_high; wellbeing +6 within 1500 m
waveform_tower | Waveform Tower | 12×14 | U |  | road |  |  | zone residential_high; wellbeing +6 within 1500 m
city_college_and_library | City College and Library | 17×13 |  | Skyscrapers | near_parent | silver_dragon (≤200 m) | 60000 | jobs 40; students 5000
geotechnical_institute | Geotechnical Institute | 12×8 | U | Skyscrapers | near_parent | silver_dragon (≤200 m) | 75000 | jobs 40

- upgrades of `grandview_heights` (no separate placement): `disease_control_center_pack10_rhsignature02_ext02`, `downtown_hospital`
- upgrades of `bell_creek` (no separate placement): `police_station_pack10_rmsignature03_ext01`
- upgrades of `lighthouse_pointe` (no separate placement): `wellness_center`

## SignaturesResidentialMixed

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
cane_residences | Cane Residences | 5×6 | U |  | road |  |  | zone residential_mixed; homes 24; attract 15; wellbeing +10 within 2000 m
docklands_tower | Docklands Tower | 11×11 | U | Skyscrapers | road |  |  | zone residential_mixed; homes 450; attract 70
ember_suites | Ember Suites | 4×8 | U |  | road |  |  | zone residential_mixed; homes 46; attract 10; wellbeing +8 within 1250 m
emerald_towers | Emerald Towers | 14×8 | U | Skyscrapers | road |  |  | zone residential_mixed; homes 400; attract 70
epicurean_garden | Epicurean Garden | 5×5 | U |  | road |  |  | zone residential_mixed; homes 8; attract 5; wellbeing +4 within 750 m
figura_building | Figura Building | 5×10 | U |  | road |  |  | zone residential_mixed; homes 100; attract 10; wellbeing +8 within 1250 m
hurston_yards | Hurston Yards | 26×16 | U | Skyscrapers | road |  |  | zone residential_mixed; homes 2100; attract 120
ironpress_building | Ironpress Building | 4×4 | U |  | road |  |  | zone residential_mixed; homes 8; attract 5; wellbeing +4 within 750 m
ludo_square | Ludo Square | 4×8 | U |  | road |  |  | zone residential_mixed; homes 16; attract 15; wellbeing +10 within 2000 m
hurston_tower_c | Hurston Tower C | 10×10 | U | Skyscrapers | near_parent | hurston_yards (≤200 m) |  | 

- upgrades of `emerald_towers` (no separate placement): `elementary_school_pack10_msignature03_ext01`
- upgrades of `docklands_tower` (no separate placement): `fire_station_headquarters`
- upgrades of `hurston_yards` (no separate placement): `observation_deck`

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

## Water & Sewage

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
advanced_water_pumping_station | Advanced Water Pumping Station | 11×21 | U |  | water |  | 47500 | jobs 64; water 1000000
groundwater_pumping_station | Groundwater Pumping Station | 6×6 |  |  | resource:groundwater |  | 10000 | jobs 16; water 75000
multi_column_elevated_water_tower | Multi-column Elevated Water Tower | 1×1 |  |  | road |  | 5000 | water 10000
sewage_outlet | Sewage Outlet | 2×2 |  |  | water |  | 10000 | sewage 100000
small_water_tower | Small Water Tower | 2×2 |  |  | road |  | 7500 | water 15000
water_pumping_station | Water Pumping Station | 4×6 |  |  | water |  | 5000 | jobs 8; water 100000
water_tower | Water Tower | 4×4 |  |  | road |  | 15000 | water 30000
water_treatment_plant | Water Treatment Plant | 12×10 |  |  | water |  | 60000 | jobs 50; sewage 400000
sewage_outlet_extra_settling_tank | Sewage Outlet Extra Settling Tank | 2×3 |  |  | near_parent | sewage_outlet | 5000 | 
wastewater_treatment_plant_advanced_filtering_system | Wastewater Treatment Plant Advanced Filtering System | 12×10 |  |  | near_parent | water_treatment_plant | 10000 | 
wastewater_treatment_plant_extra_processing_unit | Wastewater Treatment Plant Extra Processing Unit | 12×10 |  |  | near_parent | water_treatment_plant (≤100 m) | 20000 | jobs 20; sewage 100000

- upgrades of `groundwater_pumping_station` (no separate placement): `groundwater_pumping_station_advanced_filtering_system`, `groundwater_pumping_station_extra_pump`
- upgrades of `sewage_outlet` (no separate placement): `sewage_outlet_chemical_purification`
- upgrades of `water_pumping_station` (no separate placement): `water_pumping_station_extra_pump`
- upgrades of `water_tower` (no separate placement): `water_tower_viewing_deck`
