# CS2 asset catalog (compact)

Generated from assets.json. One row per asset. Size = width (along road) × depth, in 8 m cells.
U = unique (place at most once; U? = believed unique, unverified). Placement: road = front edge must touch a road;
attached = extension, must touch its parent; water / track / port_area / resource = special sites.
In-building upgrades (no footprint) are listed per parent at the end of each section.

## Zones (lot = width×depth range in cells, zoning reaches at most 6 cells from a road)

id | name | lot sizes | milestone
---|---|---|---
residential_low | Low Density Housing | 2×2 to 4×6 | 0
residential_row | Medium Density Row Housing | 1×2 to 1×6 | 1
residential_medium | Medium Density Housing | 2×2 to 6×6 | 2
residential_high | High Density Housing | 2×2 to 6×6 | 8
residential_mixed | Mixed Housing | 2×2 to 6×6 | 5
residential_lowrent | Low Rent Housing | 2×2 to 6×6 | 4
residential_low_waterfront | Low Density Waterfront Housing | unknown | Beach Properties
residential_medium_mediterranean | Medium Density Mediterranean Housing | unknown | Beach Properties
commercial_low | Low Density Business | 2×2 to 5×6 | 0
commercial_high | High Density Business | 2×2 to 6×6 | 9
commercial_low_chinese | Low Density Chinese Business | unknown | region pack
office_low | Low Density Offices | 2×2 to 6×6 | 4
office_high | High Density Offices | 2×2 to 6×6 | 10
industrial_manufacturing | Industrial Manufacturing | 2×2 to 6×6 | 0

## Roads (widthCells are estimates, not verified)

id | name | lanes | km/h | width cells | zoning/access
---|---|---|---|---|---
alley | Alley | 2 | 30 | 1.0 | yes
one_way_alley | One-Way Alley | 1 | 30 | 1.0 | yes
pedestrian_street | Pedestrian Street | 2 | 20 | 2.0 | yes
small_pedestrian_street | Small Pedestrian Street | 1 | 20 | 1.0 | yes
gravel_road | Gravel Road | 2 | 30 | 2.0 | yes
one_lane_one_way_road | One-Lane One-Way Road | 1 | 40 | 1.5 | yes
two_lane_road | Two-Lane Road | 2 | 40 | 2.0 | yes
two_lane_one_way_road | Two-Lane One-Way Road | 2 | 40 | 2.0 | yes
three_lane_asymmetric_road | Three-Lane Asymmetric Road | 3 | 40 | 2.5 | yes
three_lane_one_way_road | Three-Lane One-Way Road | 3 | 40 | 2.5 | yes
two_lane_parking_road | Two-Lane Perpendicular/Angled Parking Road | 2 | 40 | 3.0 | yes
four_lane_road | Four-Lane Road | 4 | 50 | 3.0 | yes
four_lane_divided_road | Four-Lane Divided Road | 4 | 50 | 3.5 | yes
four_lane_one_way_road | Four-Lane One-Way Road | 4 | 50 | 3.0 | yes
five_lane_asymmetric_road | Five-Lane Asymmetric Road | 5 | 50 | 3.5 | yes
five_lane_one_way_road | Five-Lane One-Way Road | 5 | 50 | 3.5 | yes
six_lane_road | Six-Lane Road | 6 | 50 | 4.0 | yes
six_lane_divided_road | Six-Lane Divided Road | 6 | 60 | 4.5 | yes
six_lane_one_way_road | Six-Lane One-Way Road | 6 | 50 | 4.0 | yes
seven_lane_asymmetric_road | Seven-Lane Asymmetric Road | 7 | 50 | 4.5 | yes
eight_lane_divided_road | Eight-Lane Divided Road | 8 | 60 | 5.5 | yes
one_lane_one_way_highway | One-Lane One-Way Highway | 1 | 80 | 1.5 | no
two_lane_one_way_highway | Two-Lane One-Way Highway | 2 | 120 | 2.0 | no
three_lane_one_way_highway | Three-Lane One-Way Highway | 3 | 120 | 2.5 | no
four_lane_one_way_highway | Four-Lane One-Way Highway | 4 | 120 | 3.0 | no
five_lane_one_way_highway | Five-Lane One-Way Highway | 5 | 120 | 3.5 | no
two_lane_two_way_highway | Two-Lane Two-Way Highway | 2 | 100 | 2.0 | no
four_lane_two_way_highway | Four-Lane Two-Way Highway | 4 | 100 | 3.5 | no
train_track_double | Double Train Track |  |  | 2.0 | no
tram_track_double | Double Tram Track |  |  | 1.5 | no
subway_track_double | Double Subway Track |  |  | 2.0 | no

## Post

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
small_post_office | Small Post Office | 3×4 |  |  | road |  | jobs 6; range m 1000
post_office | Post Office | 10×8 |  |  | road |  | jobs 40; range m 2000
post_office_post_van_garage | Post Office Post Van Garage | 7×6 |  |  | attached | post_office | jobs 20
post_office_mail_storage_extension | Post Office Mail Storage Extension | 6×4 |  |  | attached | post_office | jobs 10
post_sorting_facility | Post Sorting Facility | 28×28 |  |  | road |  | jobs 80
post_sorting_facility_mail_storage_extension | Post Sorting Facility Mail Storage Extension | 17×11 |  |  | attached | post_sorting_facility | jobs 20

- upgrades of `?` (no footprint): `mail_storage_extension`
- upgrades of `post_sorting_facility` (no footprint): `post_sorting_facility_automated_sorting`, `post_sorting_facility_extra_loading_ramps`

## Telecom

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
radio_mast | Radio Mast | 4×3 |  |  | road |  | jobs 10; range 1 km; network 3000 GBit / s
server_farm | Server Farm | 24×18 |  |  | road |  | jobs 40; range 2 km; network 30000 GBit / s
telecom_tower | Telecom Tower | 7×7 |  |  | road |  | jobs 30; range 5 km; network 20000 GBit / s
satellite_uplink | Satellite Uplink | 7×4 | U? |  | road |  | jobs 30; range 0 m; network 0 GBit / s

- upgrades of `radio_mast` (no footprint): `radio_mast_bandwidth_increase`, `radio_mast_wireless_network_antenna`
- upgrades of `server_farm` (no footprint): `server_farm_fiber_optic_cable`, `server_farm_server_upgrade`

## Education

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
small_elementary_school | Small Elementary School | 9×6 |  |  | road |  | jobs 20; range m 1500; students 400
small_elementary_school_extension_wing | Small Elementary School Extension Wing | 3×9 |  |  | attached | small_elementary_school | jobs 5; students 100
small_elementary_school_gymnasium | Small Elementary School Gymnasium | 6×11 |  |  | attached | small_elementary_school | jobs 5; leisure +1 Outdoor Recreation; attract 1
elementary_school | Elementary School | 18×8 |  |  | road |  | jobs 50; range m 3500; students 1000
elementary_school_childrens_clinic | Elementary School Childrens Clinic | 6×8 |  |  | attached | elementary_school | jobs 15
elementary_school_playground | Elementary School Playground | 6×4 |  |  | attached | elementary_school | leisure +1 Outdoor Recreation; attract 1
city_elementary_school | City Elementary School | 6×8 |  |  | road |  | jobs 50; range m 3500; students 1500
small_high_school | Small High School | 12×8 |  |  | road |  | jobs 20; students 400
small_high_school_extension_wing | Small High School Extension Wing | 6×6 |  |  | attached | small_high_school | jobs 5; students 100
high_school | High School | 22×16 |  |  | road |  | jobs 80; students 800
high_school_sports_park | High School Sports Park | 13×24 |  |  | attached | high_school | jobs 5; leisure +10 Outdoor Recreation; attract 10
high_school_sports_field | High School Sports Field | 26×20 |  |  | attached | high_school | jobs 16; leisure +20 Outdoor Recreation; attract 25
city_high_school | City High School | 12×6 |  |  | road |  | jobs 40; students 800
college | College | 22×16 |  |  | road |  | jobs 100; students 10000
college_library | College Library | 10×8 |  |  | attached | college | jobs 24
university | University | 40×28 |  |  | road |  | jobs 170; students 15000
university_library | University Library | 12×12 |  |  | attached | university | jobs 50
university_park | University Park | 18×18 |  |  | attached | university | leisure +20 Outdoor Recreation; attract 10
technical_university | Technical University | 53×38 | U? |  | road |  | jobs 150; students 15000
medical_university | Medical University | 62×18 | U? |  | road |  | jobs 150; students 15000
medical_university_research_facilities | Medical University Research Facilities | 16×8 |  |  | attached | medical_university | jobs 70
medical_university_practice_clinic | Medical University Practice Clinic | 15×7 |  |  | attached | medical_university | jobs 40; patients 100

- upgrades of `elementary_school` (no footprint): `elementary_school_extension_wing`
- upgrades of `city_elementary_school` (no footprint): `city_elementary_school_extension_floors`, `city_elementary_school_courtyard_playground`
- upgrades of `high_school` (no footprint): `high_school_extension_wing`, `high_school_library`
- upgrades of `city_high_school` (no footprint): `city_high_school_extension_floors`, `city_high_school_rooftop_sports_park`
- upgrades of `college` (no footprint): `college_extension_wing`
- upgrades of `university` (no footprint): `university_extension_wing`
- upgrades of `technical_university` (no footprint): `technical_university_extension_wing`, `technical_university_workshop_upgrade`
- upgrades of `medical_university` (no footprint): `medical_university_extension_wing`

## Research

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
radio_telescope | Radio Telescope | 8×8 | U? |  | road |  | jobs 30
geological_research_center | Geological Research Center | 12×12 | U? |  | road |  | jobs 64
large_hadron_collider | Large Hadron Collider | 54×64 | U? |  | road |  | jobs 100

## Electricity

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
hydroelectric_power_plant | Hydroelectric Power Plant | 6×9 |  |  | water |  | jobs 18; power varies
small_transformer_station | Small Transformer Station | 3×4 |  |  | road |  | 
transformer_station | Transformer Station | 6×7 |  |  | road |  | 
windmill | Windmill | 3×3 |  |  | road |  | power 2 MW
small_wind_turbine | Small Wind Turbine | 8×8 |  |  | road |  | power 4 MW
wind_turbine | Wind Turbine | 15×15 |  |  | road |  | power 6 MW
small_coal_power_plant | Small Coal Power Plant | 14×16 |  |  | road |  | jobs 37; power 20 MW
gas_power_plant | Gas Power Plant | 27×38 |  |  | road |  | jobs 100; power 250 MW
gas_power_plant_fuel_storage_extension | Gas Power Plant Fuel Storage Extension | 9×9 |  |  | attached | gas_power_plant | jobs 10
emergency_battery_station | Emergency Battery Station | 22×10 |  |  | road |  | jobs 32; power 200 MW
emergency_battery_station_diesel_generator | Emergency Battery Station Diesel Generator | 5×4 |  |  | attached | emergency_battery_station | 
coal_power_plant | Coal Power Plant | 50×40 |  |  | road |  | jobs 140; power 300 MW
coal_power_plant_coal_storage_yard | Coal Power Plant Coal Storage Yard | 25×33 |  |  | attached | coal_power_plant | jobs 10
geothermal_power_plant | Geothermal Power Plant | 44×35 |  |  | resource:geothermal hotspot |  | jobs 70; power 150 MW
geothermal_power_plant_additional_transformer_station | Geothermal Power Plant Additional Transformer Station | 4×4 |  |  | attached | geothermal_power_plant | 
solar_power_plant | Solar Power Plant | 36×69 |  |  | road |  | jobs 32; power 200 MW (15 MW from batteries)
solar_power_plant_additional_transformer_station | Solar Power Plant Additional Transformer Station | 5×4 |  |  | attached | solar_power_plant | 
solar_power_plant_backup_battery | Solar Power Plant Backup Battery | 16×6 |  |  | attached | solar_power_plant | jobs 8; power 50 MW
nuclear_power_plant | Nuclear Power Plant | 72×41 | U? |  | road |  | jobs 300; power 750 MW

- upgrades of `wind_turbine` (no footprint): `wind_turbine_advanced_rotor_system`, `wind_turbine_battery_extension`, `wind_turbine_solar_assisted`
- upgrades of `gas_power_plant` (no footprint): `gas_power_plant_exhaust_filter`, `gas_power_plant_additional_turbine`, `gas_power_plant_advanced_furnace`
- upgrades of `emergency_battery_station` (no footprint): `emergency_battery_station_additional_battery_bank`
- upgrades of `coal_power_plant` (no footprint): `coal_power_plant_exhaust_filter`, `coal_power_plant_additional_turbine_building`, `coal_power_plant_advanced_furnace`
- upgrades of `geothermal_power_plant` (no footprint): `geothermal_power_plant_additional_turbine`, `geothermal_power_plant_binary_cycle_power_station`
- upgrades of `solar_power_plant` (no footprint): `solar_power_plant_advanced_tracking_system`

## Fire

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
fire_house | Fire House | 5×5 |  |  | road |  | jobs 12; range m 5000
city_fire_house | City Fire House | 3×4 |  |  | road |  | jobs 10; range m 5000
firewatch_tower | Firewatch Tower | 2×2 |  |  | road |  | 
fire_station | Fire Station | 14×18 |  |  | road |  | jobs 120; range m 10000
fire_station_disaster_response_unit | Fire Station Disaster Response Unit | 7×7 |  |  | attached | fire_station | jobs 40
firefighting_helicopter_depot | Firefighting Helicopter Depot | 11×16 |  |  | road |  | jobs 48

- upgrades of `fire_house` (no footprint): `fire_house_garage_extension`
- upgrades of `fire_station` (no footprint): `fire_station_garage_extension`, `fire_station_helipad`, `fire_station_training_facilities`

## Disaster Control

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
small_emergency_shelter | Small Emergency Shelter | 1×2 |  |  | road |  | range m 1500; shelter 1000
early_disaster_warning_system | Early Disaster Warning System | 10×7 | U? |  | road |  | jobs 40
large_emergency_shelter | Large Emergency Shelter | 5×7 |  |  | road |  | jobs 28; range m 3000; shelter 25000

- upgrades of `small_emergency_shelter` (no footprint): `small_emergency_shelter_advanced_air_recycling`, `small_emergency_shelter_extra_consumables`

## Garbage Management

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
landfill | Landfill | 17×15 |  |  | road |  | jobs 30; garbage 100 t/month
landfill_hazardous_waste_collection_point | Landfill Hazardous Waste Collection Point | 12×8 |  |  | attached | landfill | jobs 12; garbage 20 t/month
incineration_plant | Incineration Plant | 25×27 |  |  | road |  | jobs 60; power 40 MW; garbage 3000 t/month
incineration_plant_storage_extension | Incineration Plant Storage Extension | 8×6 |  |  | attached | incineration_plant | jobs 10; garbage 0 kg/month
recycling_center | Recycling Center | 22×18 |  |  | road |  | jobs 60; garbage 1500 t/month
recycling_center_hazardous_waste_collection_point | Recycling Center Hazardous Waste Collection Point | 8×10 |  |  | attached | recycling_center | jobs 20; garbage 250 t/month
recycling_center_storage_extension | Recycling Center Storage Extension | 16×7 |  |  | attached | recycling_center | jobs 10; garbage 0 kg/month
industrial_waste_processing_site | Industrial Waste Processing Site | 19×16 |  |  | road |  | jobs 250; garbage 50000 t/month (only industrial waste)

- upgrades of `landfill` (no footprint): `landfill_garbage_truck_depot`, `landfill_waste_recycling_unit`
- upgrades of `incineration_plant` (no footprint): `incineration_plant_extra_incinerator_furnace`, `incineration_plant_garbage_truck_depot`
- upgrades of `recycling_center` (no footprint): `recycling_center_garbage_truck_depot`

## Healthcare

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
small_medical_clinic | Small Medical Clinic | 5×5 |  |  | road |  | jobs 6; range m 2500; patients 25
medical_clinic | Medical Clinic | 11×6 |  |  | road |  | jobs 18; range m 5000; patients 100
medical_clinic_extension_wing | Medical Clinic Extension Wing | 6×3 |  |  | attached | medical_clinic | jobs 8; patients 25
hospital | Hospital | 23×10 |  |  | road |  | jobs 120; range m 7500; patients 500
disease_control_center | Disease Control Center | 25×20 | U? |  | road |  | jobs 100; patients 250
health_research_institute | Health Research Institute | 21×9 | U? |  | road |  | jobs 100

- upgrades of `medical_clinic` (no footprint): `medical_clinic_ambulance_depot`
- upgrades of `hospital` (no footprint): `hospital_helipad`, `hospital_specialized_treatment_ward`, `hospital_trauma_center`

## Deathcare

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
small_cemetery | Small Cemetery | 14×6 |  |  | road |  | leisure +2 Indoor Recreation
small_cemetery_additional_burial_lot | Small Cemetery Additional Burial Lot | 6×6 |  |  | attached | small_cemetery | 
small_columbarium | Small Columbarium | 3×3 |  |  | road |  | 
cemetery | Cemetery | 16×25 |  |  | road |  | jobs 18; leisure +3 Indoor Recreation
cemetery_temple | Cemetery Temple | 8×8 |  |  | attached | cemetery | jobs 6
cemetery_columbarium | Cemetery Columbarium | 8×8 |  |  | attached | cemetery | jobs 8
cemetery_mausoleum | Cemetery Mausoleum | 6×6 |  |  | attached | cemetery | jobs 3; attract 20
crematorium | Crematorium | 8×10 |  |  | road |  | jobs 20
crematorium_hearse_garage | Crematorium Hearse Garage | 4×6 |  |  | attached | crematorium | jobs 10

- upgrades of `crematorium` (no footprint): `crematorium_additional_incinerator`, `crematorium_refrigerator_expansion`

## Park maintenance

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
park_maintenance_depot | Park Maintenance Depot | 7×10 |  |  | road |  | jobs 30
park_maintenance_depot_extra_garage | Park Maintenance Depot Extra Garage | 6×5 |  |  | attached | park_maintenance_depot | jobs 10

- upgrades of `park_maintenance_depot` (no footprint): `park_maintenance_depot_supply_storage`

## Parks and tourist attractions

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
tiny_park | Tiny Park | 1×1 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
mini_park | Mini Park | 1×1 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
urban_parkette | Urban Parkette | 2×1 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
canopy_covered_parkette | Canopy-Covered Parkette | 2×1 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
small_playground | Small Playground | 2×2 |  |  | road |  | range m 2000; leisure +1 Outdoor Recreation; attract 1
square_pocket_park | Square Pocket Park | 2×2 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
urban_pocket_park | Urban Pocket Park | 2×2 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
tiny_city_park | Tiny City Park | 2×3 |  |  | road |  | range m 2250; leisure +1 Outdoor Recreation; attract 1
canopy_covered_pocket_park | Canopy-Covered Pocket Park | 4×1 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
wide_pocket_park | Wide Pocket Park | 6×1 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
modern_pocket_park | Modern Pocket Park | 1×4 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
canopy_covered_corridor_park | Canopy-Covered Corridor Park | 1×6 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
dog_park | Dog Park | 4×3 |  |  | road |  | range m 3500; leisure +2 Outdoor Recreation; attract 1
small_park | Small Park | 4×4 |  |  | road |  | range m 2500; leisure +1 Outdoor Recreation; attract 1
bicycle_park | Bicycle Park | 4×4 |  |  | road |  | leisure +1 Outdoor Recreation; attract 1
ring_park | Ring Park | 5×5 |  |  | road |  | range m 3200; leisure +2 Outdoor Recreation; attract 3
small_plaza | Small Plaza | 6×6 |  |  | road |  | range m 4000; leisure +2 Outdoor Recreation; attract 5
campfire_site | Campfire Site | 8×14 |  |  | road |  | range m 6000; leisure +3 Outdoor Recreation; attract 10
large_campfire_site | Large Campfire Site | 11×10 |  |  | road |  | leisure +3 Outdoor Recreation; attract 10
small_lighthouse | Small Lighthouse | 1×1 |  | Bridges and Ports | water |  | leisure +1 Outdoor Recreation; attract 1
lighthouse | Lighthouse | 1×1 |  | Bridges and Ports | water |  | leisure +2 Outdoor Recreation; attract 5
large_playground | Large Playground | 3×4 |  |  | road |  | range m 2500; leisure +5 Outdoor Recreation; attract 5
passage_park | Passage Park | 4×12 |  |  | road |  | range m 2000; leisure +2 Outdoor Recreation; attract 4
hedge_park | Hedge Park | 8×8 |  |  | road |  | range m 2400; leisure +3 Outdoor Recreation; attract 8
large_city_park | Large City Park | 10×8 |  |  | road |  | range m 3000; leisure +3 Outdoor Recreation; attract 10
multipurpose_park | Multipurpose Park | 8×16 |  |  | road |  | range m 3600; leisure +5 Outdoor Recreation; attract 13
large_plaza | Large Plaza | 12×16 |  |  | road |  | range m 4000; leisure +5 Outdoor Recreation; attract 15
terrace_plaza | Terrace Plaza | 6×8 |  |  | road |  | leisure +7 Outdoor Recreation; attract 20
winding_park | Winding Park | 12×12 |  |  | road |  | leisure +7 Outdoor Recreation; attract 20
business_plaza | Business Plaza | 8×10 |  |  | road |  | leisure +9 Outdoor Recreation; attract 25
bouncy_castle_park | Bouncy Castle Park | 7×10 |  | Bridges and Ports | road |  | leisure +5 Outdoor Recreation; attract 10
merry_mare_go_round_carousel_park | Merry Mare-Go-Round Carousel Park | 6×10 |  | Bridges and Ports | road |  | leisure +3 Outdoor Recreation; attract 10
jetset_jubilee_carousel_park | Jetset Jubilee Carousel Park | 6×10 |  | Bridges and Ports | road |  | leisure +5 Outdoor Recreation; attract 12
parkside_cafe | Parkside Cafe | 5×10 |  | Bridges and Ports | road |  | leisure +2 Indoor Recreation; attract 8
the_parkview_eatery | The Parkview Eatery | 6×10 |  | Bridges and Ports | road |  | leisure +4 Indoor Recreation; attract 10
the_pavillion_restaurant | The Pavillion Restaurant | 7×10 |  | Bridges and Ports | road |  | leisure +6 Indoor Recreation; attract 12
haunted_house_park | Haunted House Park | 7×10 |  | Bridges and Ports | road |  | leisure +10 Indoor Recreation; attract 15
old_ferris_ride_park | Old Ferris Ride Park | 6×10 |  | Bridges and Ports | road |  | leisure +5 Outdoor Recreation; attract 12
spin_vista_park | Spin Vista Park | 10×10 |  | Bridges and Ports | road |  | leisure +15 Outdoor Recreation; attract 20
large_lighthouse | Large Lighthouse | 1×1 |  | Bridges and Ports | water |  | leisure +3 Outdoor Recreation; attract 10
tennis_court | Tennis Court | 4×7 |  |  | road |  | range m 3500; leisure +5 Outdoor Recreation; attract 5
outdoor_gym | Outdoor Gym | 2×2 |  |  | road |  | range m 3500; leisure +5 Outdoor Recreation; attract 5
skate_park | Skate Park | 8×4 |  |  | road |  | range m 3500; leisure +5 Outdoor Recreation; attract 5
basketball_court | Basketball Court | 3×4 |  |  | road |  | range m 3500; leisure +5 Outdoor Recreation; attract 5
american_football_field | American Football Field | 20×12 |  |  | road |  | jobs 20; range m 4000; leisure +20 Outdoor Recreation; attract 25
soccer_field | Soccer Field | 12×15 |  |  | road |  | jobs 20; range m 4000; leisure +20 Outdoor Recreation; attract 25
community_pool | Community Pool | 7×7 |  |  | road |  | jobs 10; range m 3500; leisure +20 Summer Season Recreation; attract 15
observation_tower | Observation Tower | 19×14 | U? |  | road |  | jobs 40; range m 7500; leisure +75 Indoor Recreation; attract 40
bronze_statue | Bronze Statue | 9×9 | U? |  | road |  | jobs 20; range m 5000; leisure +25 Outdoor Recreation; attract 50
water_park | Water Park | 12×6 | U? |  | road |  | jobs 28; range m 5000; leisure +25 Summer Season Recreation; attract 75
medieval_castle | Medieval Castle | 26×24 | U? | Paradox account reward | road |  | jobs 30; range m 7500; leisure +20 Indoor Recreation; attract 85
old_lighthouse | Old Lighthouse | 2×2 |  | Bridges and Ports | water |  | leisure +25 Outdoor Recreation; attract 75
old_lighthouse_lighthouse_restaurant | Old Lighthouse Lighthouse Restaurant | 3×4 |  | Bridges and Ports | attached | old_lighthouse | leisure +10 Meals; attract 20
old_lighthouse_lighthouse_museum | Old Lighthouse Lighthouse Museum | 8×3 |  | Bridges and Ports | attached | old_lighthouse | leisure +10 Indoor Recreation; attract 20

## Landmarks

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
bell_tower_of_xi_an | Bell Tower of Xi'an | 16×16 | U | Landmark Buildings | road |  | jobs 40; range m 10000; leisure +100 Outdoor Recreation; attract 125
botanical_garden | Botanical Garden | 12×16 | U | Landmark Buildings | road |  | jobs 40; range m 10000; leisure +100 Outdoor Recreation; attract 125
ferris_wheel | Ferris Wheel | 20×16 | U | Landmark Buildings | road |  | jobs 18; range m 6000; leisure +75 Indoor Recreation; attract 110
fountain_plaza | Fountain Plaza | 14×14 | U | CS1 owner reward | road |  | jobs 12; range m 7500; leisure +50 Outdoor Recreation; attract 100
grand_hotel | Grand Hotel | 14×10 | U | Landmark Buildings | road |  | jobs 50; range m 10000; leisure +75 Indoor Recreation; attract 115
namdaemun | Namdaemun | 14×14 | U | Landmark Buildings | road |  | jobs 40; range m 10000; leisure +100 Outdoor Recreation; attract 125
national_diet_building | National Diet Building | 33×31 | U | Landmark Buildings | road |  | jobs 60; range m 10000; leisure +100 Outdoor Recreation; attract 125
national_gallery_of_art | National Gallery of Art | 42×18 | U | Landmark Buildings | road |  | jobs 50; range m 7500; leisure +100 Indoor Recreation; attract 120
notre_dame | Notre-Dame | 10×25 | U | Landmark Buildings | road |  | jobs 40; range m 7500; leisure +125 Outdoor Recreation; attract 175
nasinneula | Näsinneula | 18×15 | U | Landmark Buildings | road |  | jobs 46; range m 6000; leisure +75 Indoor Recreation; attract 115

## Police

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
small_police_station | Small Police Station | 5×5 |  |  | road |  | jobs 8; range m 5000
police_station | Police Station | 12×7 |  |  | road |  | jobs 18; range m 5000
city_police_station | City Police Station | 6×6 |  |  | road |  | jobs 20; range m 5000
police_headquarters | Police Headquarters | 18×20 | U? |  | road |  | jobs 120; range m 10000
police_headquarters_extra_jails | Police Headquarters Extra Jails | 6×8 |  |  | attached | police_headquarters | jobs 15
prison | Prison | 26×24 |  |  | road |  | jobs 80
prison_wing | Prison Wing | 14×14 |  |  | attached | prison | jobs 30
central_intelligence_bureau | Central Intelligence Bureau | 34×34 | U? |  | road |  | jobs 200

- upgrades of `police_station` (no footprint): `police_station_garage_extension`
- upgrades of `city_police_station` (no footprint): `city_police_station_helipad`
- upgrades of `police_headquarters` (no footprint): `police_headquarters_garage_extension`, `police_headquarters_helipad`
- upgrades of `prison` (no footprint): `prison_library_and_recreation_center`

## Administration

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
welfare_office | Welfare Office | 15×16 |  |  | road |  | jobs 50; range m 4000
city_hall | City Hall | 16×20 | U? |  | road |  | jobs 50
central_bank | Central Bank | 28×20 | U? |  | road |  | jobs 80

- upgrades of `city_hall` (no footprint): `city_hall_court`, `city_hall_planning_offices`

## Road

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
bus_depot | Bus Depot | 18×9 |  |  | road |  | jobs 40
bus_depot_extra_garage | Bus Depot Extra Garage | 7×7 |  |  | attached | bus_depot | jobs 10
small_bus_station | Small Bus Station | 4×6 |  |  | road |  | 
small_bus_station_station_services | Small Bus Station Station Services | 3×2 |  |  | attached | small_bus_station | jobs 2
city_bus_station | City Bus Station | 8×10 |  |  | road |  | 
bus_station | Bus Station | 13×13 |  |  | road |  | jobs 28
small_taxi_depot | Small Taxi Depot | 2×6 |  |  | road |  | 
taxi_depot | Taxi Depot | 9×7 |  |  | road |  | jobs 25
taxi_depot_taxi_garage | Taxi Depot Taxi Garage | 3×3 |  |  | attached | taxi_depot | jobs 10
small_storage_yard | Small Storage Yard | 3×14 |  | Bridges and Ports | road |  | 
medium_storage_yard | Medium Storage Yard | 9×14 |  | Bridges and Ports | road |  | 
large_storage_yard | Large Storage Yard | 9×23 |  | Bridges and Ports | road |  | 

- upgrades of `bus_depot` (no footprint): `bus_depot_electric_bus_maintenance`

## Train

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
railway_depot | Railway Depot | 34×15 |  |  | track |  | 
railway_depot_extra_tracks | Railway Depot Extra Tracks | 34×12 |  |  | attached | railway_depot | 
rail_yard | Rail Yard | 44×28 |  |  | track |  | jobs 30
small_train_station | Small Train Station | 25×4 |  |  | track |  | 
medium_train_station | Medium Train Station | 25×5 |  |  | track |  | jobs 2
cargo_train_terminal | Cargo Train Terminal | 38×17 |  |  | track |  | jobs 32
cargo_train_terminal_storage_warehouse | Cargo Train Terminal Storage Warehouse | 16×12 |  |  | attached | cargo_train_terminal | jobs 12
train_station | Train Station | 25×14 |  |  | track |  | jobs 20
terminus_station | Terminus Station | 15×30 |  |  | track |  | 
cargo_transfer_station | Cargo Transfer Station | 34×20 |  |  | track |  | 
cargo_transfer_station_storage_warehouse_with_extra_tracks | Cargo Transfer Station Storage Warehouse with Extra Tracks | 26×7 |  |  | attached | cargo_transfer_station | 

## Tram

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
tram_depot | Tram Depot | 19×17 |  |  | track |  | jobs 20
tram_junction_station | Tram Junction Station | 6×6 |  |  | track |  | 
tram_parallel_station | Tram Parallel Station | 6×6 |  |  | track |  | 
tram_loop_station | Tram Loop Station | 6×6 |  |  | track |  | 

## Subway

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
terminal_subway_yard | Terminal Subway Yard | 4×23 |  |  | track |  | 
terminal_subway_yard_maintenance_hall | Terminal Subway Yard Maintenance Hall | 4×23 |  |  | attached | terminal_subway_yard | 
terminal_subway_yard_extra_tracks | Terminal Subway Yard Extra Tracks | 4×23 |  |  | attached | terminal_subway_yard | 
terminal_subway_yard_extra_through_tracks | Terminal Subway Yard Extra Through Tracks | 23×4 |  |  | attached | terminal_subway_yard | 
subway_yard | Subway Yard | 44×20 |  |  | track |  | jobs 30
subway_yard_maintenance_hall | Subway Yard Maintenance Hall | 30×7 |  |  | attached | subway_yard | jobs 18
small_overground_subway_station | Small Overground Subway Station | 19×4 |  |  | track |  | 
overground_subway_station | Overground Subway Station | 21×6 |  |  | track |  | 
underground_subway_station | Underground Subway Station | 3×2 |  |  | track |  | 
small_elevated_subway_station | Small Elevated Subway Station | 19×1 |  |  | track |  | 
elevated_subway_station | Elevated Subway Station | 12×7 |  |  | track |  | jobs 10

## Water

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
harbor | Harbor | 38×11 |  |  | water |  | jobs 50
cargo_harbor | Cargo Harbor | 56×33 |  |  | water |  | jobs 75
cargo_harbor_warehouses | Cargo Harbor Warehouses | 19×13 |  |  | attached | cargo_harbor | jobs 12
small_port | Small Port | 4×4 |  | Bridges and Ports | water |  | 
small_auxiliary_port_gate | Small Auxiliary Port Gate | 2×2 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
medium_auxiliary_port_gate | Medium Auxiliary Port Gate | 3×3 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
passenger_terminal | Passenger Terminal | 6×11 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
employee_canteen | Employee Canteen | 6×3 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
port_security | Port Security | 4×4 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
emergency_response | Emergency Response | 4×3 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
container_crane | Container Crane | 4×4 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
container_crane_striped | Container Crane (Striped) | 4×4 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
intermodal_train_terminal | Intermodal Train Terminal | 42×6 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
small_cargo_container_yard | Small Cargo Container Yard | 14×4 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
medium_cargo_container_yard | Medium Cargo Container Yard | 21×4 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
large_cargo_container_yard | Large Cargo Container Yard | 42×4 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
small_cargo_warehouse | Small Cargo Warehouse | 14×10 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
medium_cargo_warehouse | Medium Cargo Warehouse | 21×10 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
large_cargo_warehouse | Large Cargo Warehouse | 42×10 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
small_tank_farm | Small Tank Farm | 2×2 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
medium_tank_farm | Medium Tank Farm | 6×8 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
large_tank_farm | Large Tank Farm | 10×6 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
small_bulk_storage_yard | Small Bulk Storage Yard | 5×8 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
medium_bulk_storage_yard | Medium Bulk Storage Yard | 8×26 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
large_bulk_storage_yard | Large Bulk Storage Yard | 17×48 |  | Bridges and Ports | port_area | small_port|medium_port|large_port | 
medium_port | Medium Port | 10×10 |  | Bridges and Ports | water |  | 
large_port | Large Port | 18×16 |  | Bridges and Ports | water |  | 

## Ferry

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
ferry_depot | Ferry Depot | 24×22 |  | Bridges and Ports | water |  | 
ferry_terminal | Ferry Terminal | 11×8 |  | Bridges and Ports | water |  | 

## Air

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
airport | Airport | 142×47 |  |  | road |  | jobs 80
international_airport | International Airport | 170×158 | U? |  | road |  | jobs 250
chirpx_space_center | ChirpX Space Center | 36×46 | U? |  | road |  | jobs 100; leisure +60 Indoor Recreation; attract 200

## Water & Sewage

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
water_pumping_station | Water Pumping Station | 4×6 |  |  | water |  | jobs 8; water 100000
multi_column_elevated_water_tower | Multi-column Elevated Water Tower | 1×1 |  |  | road |  | water 10000
small_water_tower | Small Water Tower | 2×2 |  |  | road |  | water 15000
water_tower | Water Tower | 4×4 |  |  | road |  | water 30000
groundwater_pumping_station | Groundwater Pumping Station | 6×6 |  |  | resource:groundwater |  | jobs 16; water 75000
advanced_water_pumping_station | Advanced Water Pumping Station | 11×21 |  |  | water |  | jobs 64; water 1000000
sewage_outlet | Sewage Outlet | 2×2 |  |  | water |  | sewage 100000
sewage_outlet_extra_settling_tank | Sewage Outlet Extra Settling Tank | 2×3 |  |  | attached | sewage_outlet | 
water_treatment_plant | Water Treatment Plant | 12×10 |  |  | road |  | jobs 50; sewage 400000
water_treatment_plant_advanced_filtering_system | Water Treatment Plant Advanced Filtering System | 12×10 |  |  | attached | water_treatment_plant | 
water_treatment_plant_extra_processing_unit | Water Treatment Plant Extra Processing Unit | 12×10 |  |  | attached | water_treatment_plant | jobs 20; sewage 100000

- upgrades of `water_pumping_station` (no footprint): `water_pumping_station_extra_pump`
- upgrades of `water_tower` (no footprint): `water_tower_viewing_deck`
- upgrades of `groundwater_pumping_station` (no footprint): `groundwater_pumping_station_advanced_filtering_system`, `groundwater_pumping_station_extra_pump`
- upgrades of `sewage_outlet` (no footprint): `sewage_outlet_chemical_purification`

## Parking

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
motorcycle_parking_lot | Motorcycle Parking Lot | 2×2 |  |  | road |  | 
tiny_parking_lot | Tiny Parking Lot | 3×2 |  |  | road |  | 
small_single_row_parking_lot | Small Single-Row Parking Lot | 6×2 |  |  | road |  | 
modest_parking_lot | Modest Parking Lot | 5×3 |  |  | road |  | 
canopy_covered_parking_lot | Canopy-Covered Parking Lot | 6×2 |  |  | road |  | 
small_solar_panel_covered_parking_lot | Small Solar Panel-Covered Parking Lot | 3×6 |  |  | road |  | 
small_parking_lot | Small Parking Lot | 5×5 |  |  | road |  | 
long_parking_lot | Long Parking Lot | 3×8 |  |  | road |  | 
medium_single_row_parking_lot | Medium Single-Row Parking Lot | 12×2 |  |  | road |  | 
medium_parking_lot | Medium Parking Lot | 7×5 |  |  | road |  | 
medium_solar_panel_covered_parking_lot | Medium Solar Panel-Covered Parking Lot | 7×6 |  |  | road |  | 
moderate_parking_lot | Moderate Parking Lot | 9×5 |  |  | road |  | 
wide_parking_lot | Wide Parking Lot | 16×3 |  |  | road |  | 
large_parking_lot | Large Parking Lot | 10×8 |  |  | road |  | 
very_large_parking_lot | Very Large Parking Lot | 18×10 |  |  | road |  | 
small_gravel_parking_lot | Small Gravel Parking Lot | 6×2 |  |  | road |  | 
medium_gravel_parking_lot | Medium Gravel Parking Lot | 3×6 |  |  | road |  | 
small_parking_building | Small Parking Building | 3×6 |  |  | road |  | 
multi_level_parking_building | Multi-Level Parking Building | 8×6 |  |  | road |  | 
overground_parking_building | Overground Parking Building | 12×14 |  |  | road |  | 
underground_parking_building | Underground Parking Building | 6×10 |  |  | road |  | 
automated_parking_building | Automated Parking Building | 13×9 |  |  | road |  | 
bicycle_parking_area | Bicycle Parking Area | 1×1 |  |  | road |  | 
small_bicycle_shelter | Small Bicycle Shelter | 1×1 |  |  | road |  | 
large_bicycle_shelter | Large Bicycle Shelter | 2×1 |  |  | road |  | 
small_bicycle_storage | Small Bicycle Storage | 1×1 |  |  | road |  | 
medium_bicycle_storage | Medium Bicycle Storage | 1×2 |  |  | road |  | 
large_bicycle_storage | Large Bicycle Storage | 1×3 |  |  | road |  | 
bicycle_parking_hall | Bicycle Parking Hall | 5×2 |  |  | road |  | 
large_bicycle_parking_hall | Large Bicycle Parking Hall | 5×5 |  |  | road |  | 
underground_bicycle_parking_hall | Underground Bicycle Parking Hall | 2×3 |  |  | road |  | 

## Signature residential

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
architects_mansion | Architect’s Mansion | 8×8 | U | Beach Properties | road |  | homes 1; +4 Well-Being within 1 km
baltar_pines | Baltar Pines | 1×4 | U |  | road |  | homes 8; +3 Well-Being within 750 m
bell_creek | Bell Creek | 20×18 | U | Skyscrapers | road |  | homes 750; +2 Well-Being within 2.5 km
co10_condos | CO10 Condos | 4×4 | U |  | road |  | homes 32; +7 Well-Being within 2 km
century_castle | Century Castle | 9×7 | U |  | road |  | homes 756; +10 Well-Being within 2.5 km
colossal_tower | Colossal Tower | 9×6 | U |  | road |  | homes 648; +12 Well-Being within 3 km
constellation_apartments | Constellation Apartments | 1×4 | U |  | road |  | homes 8; +5 Well-Being within 1.25 km
corundum_condos | Corundum Condos | 6×10 | U |  | road |  | homes 180; +4 Well-Being within 1 km
deuclidia_apartments | Deuclidia Apartments | 10×14 | U |  | road |  | homes 420; +10 Well-Being within 2.5 km
extreme_athletes_villa | Extreme Athlete’s Villa | 3×6 | U | Beach Properties | road |  | homes 1; +2 Well-Being within 500 m
film_actor_mansion | Film Actor Mansion | 5×10 | U |  | road |  | homes 1; +4 Well-Being within 1 km
gatehouse_residences | Gatehouse Residences | 6×8 | U |  | road |  | homes 144; +10 Well-Being within 2.5 km
golfers_villa | Golfer’s Villa | 12×14 | U | Beach Properties | road |  | homes 1; +4 Well-Being within 1 km
grandview_heights | Grandview Heights | 38×24 | U | Skyscrapers | road |  | homes 5000; +12 Well-Being within 3 km
halo_heights | Halo Heights | 8×10 | U |  | road |  | homes 960; +10 Well-Being within 2.5 km
industry_moguls_mansion | Industry Mogul’s Mansion | 10×12 | U | Beach Properties | road |  | homes 1; +6 Well-Being within 1.5 km
lighthouse_pointe | Lighthouse Pointe | 12×10 | U | Skyscrapers | road |  | homes 300; −2 Import Costs (city-wide), +2 Entertainment (city-wide), +5 Well-Being within 4 km
mollari_palace | Mollari Palace | 1×4 | U |  | road |  | homes 8; +7 Well-Being within 2 km
old_factory_condos | Old Factory Condos | 6×6 | U |  | road |  | homes 108; +8 Well-Being within 2 km
painter_mansion | Painter Mansion | 5×5 | U |  | road |  | homes 1; +6 Well-Being within 1.5 km
polaris_suites | Polaris Suites | 12×5 | U |  | road |  | homes 180; +4 Well-Being within 1 km
pop_musician_mansion | Pop Musician Mansion | 6×8 | U |  | road |  | homes 1; +2 Well-Being within 500 m
real_estate_agents_mansion | Real Estate Agent’s Mansion | 8×6 | U | Beach Properties | road |  | homes 1; +2 Well-Being within 500 m
rock_musician_mansion | Rock Musician Mansion | 5×8 | U |  | road |  | homes 1; +2 Well-Being within 500 m
royal_villa | Royal Villa | 6×14 | U | Beach Properties | road |  | homes 1; +6 Well-Being within 1.5 km
rubique_apartments | Rubique Apartments | 6×8 | U |  | road |  | homes 144; +8 Well-Being within 2 km
sculptor_mansion | Sculptor Mansion | 4×6 | U |  | road |  | homes 1; +6 Well-Being within 1.5 km
silver_dragon | Silver Dragon | 12×12 | U | Skyscrapers | road |  | homes 2500; +10% Attractiveness (city-wide), +10 Well-Being within 5 km, +150 Indoor recreation
the_grass_crown | The Grass Crown | 18×18 | U |  | road |  | homes 3888; +12 Well-Being within 3 km
theater_actor_mansion | Theater Actor Mansion | 6×4 | U |  | road |  | homes 1; +4 Well-Being within 1 km
vertigo_square | Vertigo Square | 1×4 | U |  | road |  | homes 8; +3 Well-Being within 750 m
vista_building | Vista Building | 1×6 | U |  | road |  | homes 12; +5 Well-Being within 1.25 km
watanabe_tower | Watanabe Tower | 5×6 | U |  | road |  | homes 360; +6 Well-Being within 1.5 km
waveform_tower | Waveform Tower | 12×14 | U |  | road |  | homes 2016; +6 Well-Being within 1.5 km

## Signature mixed

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
cane_residences | Cane Residences | 5×6 | U |  | road |  | homes 24; jobs 46; +1% Attractiveness (city-wide), +10 Well-Being within 2 km
docklands_tower | Docklands Tower | 11×11 | U | Skyscrapers | road |  | homes 450; jobs 706; +2% Industrial Efficiency (city-wide), +5 Well-Being within 3 km
ember_suites | Ember Suites | 4×8 | U |  | road |  | homes 46; jobs 45; +1% Attractiveness (city-wide), +8 Well-Being within 1.3 km
emerald_towers | Emerald Towers | 14×8 | U | Skyscrapers | road |  | homes 400; jobs 326; +2% Entertainment (city-wide), +6 Well-Being within 2 km, +75 Indoor Recreation
epicurean_garden | Epicurean Garden | 5×5 | U |  | road |  | homes 8; jobs 14; +1% Attractiveness (city-wide), +4 Well-Being within 750 m
figura_building | Figura Building | 5×10 | U |  | road |  | homes 100; jobs 18; +1% Attractiveness (city-wide), +8 Well-Being within 1.3 km
hurston_yards | Hurston Yards | 26×16 | U | Skyscrapers | road |  | homes 2100; jobs 606; +5% Entertainment (city-wide), +5% Attractiveness (city-wide), +150 Indoor Recreation
ironpress_building | Ironpress Building | 4×4 | U |  | road |  | homes 8; jobs 22; +1% Attractiveness (city-wide), +4 Well-Being within 750 m
ludo_square | Ludo Square | 4×8 | U |  | road |  | homes 16; jobs 18; +1% Attractiveness (city-wide), +10 Well-Being within 2 km

## Signature commercial

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
activity_plaza | Activity Plaza | 8×9 | U |  | road |  | jobs 383; Sells Recreation; −1% Import Costs, +1% Attractiveness (city-wide), +5 Well-Being within 1.5 km
antique_store | Antique Store | 3×4 | U | Supply Chains | road |  | jobs 28; Sells Furniture; −1% Import Costs, +1% Attractiveness (city-wide), +3 Well-Being within 0.5 km
auto_center | Auto Center | 12×10 | U |  | road |  | jobs 92; Sells Vehicles; −0.5% Import Costs, +0.5% Attractiveness (city-wide), +3 Well-Being within 1 km
bait_and_bistro | Bait & Bistro | 5×9 | U | Bridges and Ports | road |  | jobs 79; Provides Meals; +3% Attractiveness (city-wide), +10 Well-Being within 1 km
baker_and_confectionary | Baker and Confectionary | 4×10 | U | Supply Chains | road |  | jobs 93; Sells Convenience food; −1% Import Costs, +1% Attractiveness (city-wide), +3 Well-Being within 0.5 km
conference_center | Conference Center | 30×22 | U | Bridges and Ports | road |  | jobs 1155; Provides Recreation; +3% Attractiveness (city-wide), +10 Well-Being within 1 km
farmers_market | Farmers Market | 9×17 | U | Supply Chains | road |  | jobs 268; Sells Food; −1% Import Costs, +1% Attractiveness (city-wide), +3 Well-Being within 0.5 km
fashion_square | Fashion Square | 10×7 | U |  | road |  | jobs 441; Sells Textiles; −1% Import Costs, +1% Attractiveness (city-wide), +5 Well-Being within 1 km
food_station | Food Station | 6×10 | U |  | road |  | jobs 80; Sells Meals; −0.5% Import Costs, +0.5% Attractiveness (city-wide), +3 Well-Being within 1 km
kansai_tower | Kansai Tower | 16×13 | U | Skyscrapers | road |  | jobs 1941; Sells Food; +2% Attractiveness, +5% Demand for Electronics (city-wide), +125 Indoor recreation
maritime_museum | Maritime Museum | 9×18 | U | Bridges and Ports | road |  | jobs 284; Provides Recreation; +3% Attractiveness (city-wide), +10 Well-Being within 1 km
marketplace | Marketplace | 17×25 | U |  | road |  | jobs 670; Sells Food; −0.5% Import Costs, +0.5% Attractiveness (city-wide), +3 Well-Being within 1.5 km
muscle_car_garage | Muscle Car Garage | 13×10 | U | San Francisco Set | road |  | −0.5% Import Costs, +0.5% Attractiveness (city-wide), +3 Well-Being within 500 m
one_stop_station | One Stop Station | 12×10 | U |  | road |  | jobs 114; Sells Petrochemicals; −0.5% Import Costs, +0.5% Attractiveness (city-wide), +3 Well-Being within 1.5 km
sporting_goods_store | Sporting Goods Store | 30×20 | U | Supply Chains | road |  | jobs 350; Sells Textiles; −1% Import Costs, +1% Attractiveness (city-wide), +3 Well-Being within 0.5 km
sportsbar | Sportsbar | 6×5 | U | Supply Chains | road |  | jobs 70; Sells Beverages; −1% Import Costs, +1% Attractiveness (city-wide), +3 Well-Being within 0.5 km
square_center | Square Center | 9×10 | U |  | road |  | jobs 567; Sells Textiles; −1% Import Costs, +1% Attractiveness (city-wide), +5 Well-Being within 1 km
streamline_diner | Streamline Diner | 3×2 | U |  | road |  | jobs 8; Sells Meals; −0.5% Import Costs, +0.5% Attractiveness (city-wide), +3 Well-Being within 500 m
the_capacitor_building | The Capacitor Building | 5×10 | U |  | road |  | jobs 161; Sells Electronics; −1% Import Costs, +1% Attractiveness (city-wide), +5 Well-Being within 2 km
the_emerald_building | The Emerald Building | 8×6 | U |  | road |  | jobs 215; Sells Lodging; −1% Import Costs, +1% Attractiveness (city-wide), +5 Well-Being within 2 km
the_great_tower_of_commerce | The Great Tower of Commerce | 25×15 | U | Skyscrapers | road |  | jobs 2625; Sells Furniture; +8% Attractiveness, +2% Industrial Efficiency, +10% Demand for Software (city-wide)
the_marvelous_marble | The Marvelous Marble | 4×9 | U |  | road |  | jobs 161; Sells Lodging; −1% Import Costs, +1% Attractiveness (city-wide), +5 Well-Being within 1.5 km
villa_city | Villa City | 3×4 | U |  | road |  | jobs 15; Provides Entertainment; −0.5% Import Costs, +0.5% Attractiveness (city-wide), +3 Well-Being within 500 m
villa_mare | Villa Maré | 7×7 | U | Bridges and Ports | road |  | jobs 86; Provides Lodging; +3% Attractiveness (city-wide), +10 Well-Being within 1 km

## Signature office

id | name | size | U | DLC | placement | parent | stats
---|---|---|---|---|---|---|---
arroyo_seco_building | Arroyo Seco Building | 33×19 | U | Skyscrapers | road |  | jobs 439; +2% Office Efficiency (city-wide), +10 Well-Being within 4 km
aurum_spire | Aurum Spire | 12×13 | U | Skyscrapers | road |  | jobs 473; +2% Demand for Software, −12% Industrial Air/Ground Pollution (city-wide), +5 Well-Being within 2 km
base_j98_plaza | Base J98 Plaza | 13×10 | U | Office Evolution | road |  | jobs 394; +2% Office Efficiency, +5% University interest, +3% Software Production, +3% Park Entertainment (city-wide), +5 Well-Being within 1 km
bottle_cap_office | Bottle Cap Office | 14×11 | U | Supply Chains | road |  | jobs 81; +5% Industrial Efficiency, +5% Export Profits, +5% Entertainment (city-wide)
brand_and_lifestyle_center | Brand and Lifestyle Center | 8×13 | U | Supply Chains | road |  | jobs 110; +5% Industrial Efficiency, +5% Export Profits, +5% Entertainment (city-wide)
brunswick_corner_building | Brunswick Corner Building | 11×8 | U | Office Evolution | road |  | jobs 123; +2% Entertainment, +5% University interest, +2% Office Efficiency (city-wide), +5 Well-Being within 1 km
coder_park | Coder Park | 6×6 | U |  | road |  | jobs 12; +1% Office Efficiency, +5% University interest, +1% Graduation (city-wide), +5 Well-Being within 1 km
energy_lobbying_office | Energy Lobbying Office | 3×5 | U | Supply Chains | road |  | jobs 132; +5% Industrial Efficiency, +5% Export Profits, −5% Import Costs (city-wide)
finanzturm | Finanzturm | 8×8 | U | Skyscrapers | road |  | jobs 209; −25% Loan interest, +5% Export Profits, −5% Import costs (city-wide)
frankfort_court | Frankfort Court | 8×8 | U | Office Evolution | road |  | jobs 194; +5 Well-Being within 500 m; with Tower upgrade +5% Attractiveness, +5% Office Efficiency, +2% University interest (city-wide)
incaserium | Incaserium | 9×8 | U |  | road |  | jobs 25; +1% Office Efficiency, +5% University interest, +1% Graduation (city-wide), +5 Well-Being within 1.5 km
interior_design_studio | Interior Design Studio | 4×6 | U | Supply Chains | road |  | jobs 38; +5% Industrial Efficiency, +5% Export Profits, +5% Entertainment (city-wide)
launch_payload_control_center | Launch Payload Control Center | 14×18 | U | Supply Chains | road |  | jobs 177; +5% Industrial Efficiency, +5% Export Profits, −5% Import Costs (city-wide)
livestock_exchange | Livestock Exchange | 11×12 | U | Supply Chains | road |  | jobs 70; +5% Industrial Efficiency, +5% Export Profits, +5% Entertainment (city-wide)
long_wires_tower | Long Wires Tower | 14×12 | U | Skyscrapers | road |  | jobs 118; +20,000 Network Capacity (city-wide), −5 Crime rate within 5 km
multistory_multimedia | Multistory Multimedia | 9×8 | U |  | road |  | jobs 101; +2% Office Efficiency, +5% University interest, +1% Graduation (city-wide), +5 Well-Being within 1 km
principiis | Principiis | 10×7 | U |  | road |  | jobs 37; +1% Office Efficiency, +5% University interest, +1% Graduation (city-wide), +5 Well-Being and −2 Crime within 500 m
seaworth_building | Seaworth Building | 9×12 | U | Skyscrapers | road |  | jobs 202; +2% Office Efficiency (city-wide), +2 Well-Being within 1 km
steel_building | Steel Building | 5×9 | U | Supply Chains | road |  | jobs 315; +5% Industrial Efficiency, +5% Export Profits, −5% Import Costs (city-wide)
stripmine_office | Stripmine Office | 16×16 | U | Supply Chains | road |  | jobs 132; +5% Industrial Efficiency, +5% Export Profits, −5% Import Costs (city-wide)
stylus_tower | Stylus Tower | 12×14 | U |  | road |  | jobs 235; +2% Office Efficiency, +5% University interest, +1% Graduation (city-wide), +5 Well-Being within 2 km
television_production_studio | Television Production Studio | 18×10 | U | Supply Chains | road |  | jobs 70; +5% Industrial Efficiency, +5% Export Profits, +5% Entertainment (city-wide)
the_coruna | The Coruña | 6×10 | U | Skyscrapers | road |  | jobs 308; +5% Software Production, +5% Demand for Software (city-wide), +5 Well-Being within 2 km
waterfall_array | Waterfall Array | 8×10 | U |  | road |  | jobs 112; +2% Office Efficiency, +5% University interest, +1% Graduation (city-wide), +5 Well-Being within 1.5 km
