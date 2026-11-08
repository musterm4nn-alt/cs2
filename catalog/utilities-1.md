# CS2 catalog: utilities (part 1 of 2)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


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

END OF FILE catalog/utilities-1.md | 47 entries | check 4dd466
