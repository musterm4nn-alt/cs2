# CS2 catalog: signatures business (part 2 of 3)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## SignaturesIndustrial (continued)

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
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

END OF FILE catalog/signatures-business-2.md | 56 entries | check 5c75dd
