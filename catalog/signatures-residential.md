# CS2 catalog: signatures residential

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


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

END OF FILE catalog/signatures-residential.md | 57 entries | check 38b68f
